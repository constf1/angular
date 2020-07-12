// tslint:disable: variable-name
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { randomItem } from 'src/app/common/array-utils';
import { Autoplay } from 'src/app/common/autoplay';
import { commonPrefix } from 'src/app/common/string-utils';
import { getDate } from 'src/app/common/date-utils';

import {
  createRandomAddition,
  createRandomDivision,
  createRandomMultiplication,
  createRandomSubtraction,
  MathExpression,
  MathExpressionTerm,
  asString
} from '../../math-models';
import { InputItem } from '../../math-input-group/math-input-group.component';
import { MathExpressionDialogComponent } from '../../math-expression-dialog/math-expression-dialog.component';

function getScoreMessage(score: number): string {
  if (score === 1) {
    const messages = [
      '',
      'Здорово!', 'Прекрасно!', 'Отлично!', 'Молодец!', 'Умница!',
      'Умничка!!!', 'Хвалю!', 'Браво!', 'Талант!', 'Превосходно!',
      'Так держать!', 'Замечательно!', 'Чудесно!'
    ];
    const message = randomItem(messages);
    return '5+ ' + message;
  } else if (score >= 0.98) {
    return '5+';
  } else if (score > 0.9) {
    return '5';
  } else if (score > 0.8) {
    return '5-';
  } else if (score > 0.7) {
    return '4';
  } else if (score > 0.6) {
    return '4-';
  } else if (score > 0.5) {
    return '3';
  } else if (score > 0.4) {
    return '3-';
  } else if (score > 0.3) {
    return '2';
  } else if (score >= 0.2) {
    return '2-';
  } else {
    const messages = [
      '', '', '', '',
      'Плохо.', 'Отвратительно.', 'Ужасно.', 'Ужас!', 'Безобразно!',
      'Ой как плохо!', 'Некрасиво.', 'Я в шоке!', 'Жуть!', 'Взгляни как нехорошо.'
    ];
    const message = randomItem(messages);
    return '1 ' + message;
  }
}

/**
 * Removes all non-numeric characters from the string
 * @param str string
 */
function digitsOnly(str: string): string {
  const pattern = /[^0-9]/g;
  return str.replace(pattern, '');
}

const INPUTS = ['first', 'second', 'result'] as const;
const KEY = '[School.Math.Grade-3.Mental-math]';

type FormStatus = 'active' | 'validation' | 'done';

@Component({
  selector: 'app-mental-math',
  templateUrl: './mental-math.component.html',
  styleUrls: ['./mental-math.component.scss']
})
export class MentalMathComponent implements OnInit, OnDestroy {
  // 'Вычисли, переставляя, где удобно, слагаемые или заменяя соседние слагаемые их суммой.'
  primeMessage = 'Найди значение каждого выражения.';
  extraMessage = 'Работа над ошибками:'; // correction of mistakes

  primeStatus: FormStatus;
  extraStatus: FormStatus;

  primeItems: InputItem[];
  extraItems: InputItem[];

  @ViewChild('menuButton', { read: ElementRef }) menuButtonRef: ElementRef<HTMLButtonElement>;

  canPrimeSubmit = false;
  scoreMessage = '';
  score = 0;

  autoplay = new Autoplay();

  todayVictories = 0;
  victoryAnimation = false;
  victoryClass: string;

  expressionTypes = ['a', 's', 'm', 'd']; // Addittion, Subtraction, Multiplication, Division

  constructor(
    route: ActivatedRoute,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private _dialog: MatDialog) {
    iconRegistry.addSvgIcon('icon_sun', sanitizer.bypassSecurityTrustResourceUrl('assets/school/sun.svg'));

    const mode: string = route?.snapshot.queryParams.mode;
    if (mode) {
      const regex = /([asmdASMD][0-9]*)/g;
      const expressionTypes = mode.match(regex);
      if (expressionTypes?.length > 0) {
        this.expressionTypes = expressionTypes;
      }
    }
  }

  init(): void {
    this.autoplay.stop();
    this.canPrimeSubmit = false;
    this.score = 0;
    this.scoreMessage = '';

    this.primeStatus = 'active';
    this.primeItems = [];
    this.extraStatus = undefined;
    this.extraItems = undefined;

    const MIN_VALUE = 10;
    const MAX_VALUE = 100;

    for (let i = 0; i < 100 && this.primeItems.length < 10; i++) {
      const type = randomItem(this.expressionTypes);
      let n = +type.substring(1);
      if (!n) {
        n = MAX_VALUE;
      } else {
        n = Math.max(Math.min(n, MAX_VALUE), MIN_VALUE);
      }

      switch (type[0]) {
        case 'a': this._addPrimeItem(createRandomAddition(n)); break;
        case 's': this._addPrimeItem(createRandomSubtraction(n)); break;
        case 'm': this._addPrimeItem(createRandomMultiplication(10, n)); break;
        case 'd': this._addPrimeItem(createRandomDivision(10, n)); break;

        case 'A': this._addPrimeItem(createRandomAddition(n), 'result'); break;
        case 'S': this._addPrimeItem(createRandomSubtraction(n), 'result'); break;
        case 'M': this._addPrimeItem(createRandomMultiplication(10, n), 'result'); break;
        case 'D': this._addPrimeItem(createRandomDivision(10, n), 'result'); break;
      }
    }
  }

  private _addPrimeItem(expression: MathExpression, hiddenTerm?: MathExpressionTerm) {
    const str = asString(expression);
    if (!this.primeItems.find(item => asString(item.expression) === str)) {
      const inputName = 'mathExpression' + this.primeItems.length;
      const inputValue = '';
      const inputIndex = hiddenTerm || randomItem(INPUTS);
      const inputLength = expression[inputIndex].value.toString().length;
      this.primeItems.push({ inputName, inputValue, inputIndex, inputLength, expression });
    }
  }

  ngOnInit(): void {
    this.init();

    const storage = localStorage.getItem(KEY);
    if (storage) {
      const data = JSON.parse(storage);
      if (data) {
        const today = getDate('YYYY-MM-DD');
        const todayVictories = data[today];
        if (typeof todayVictories === 'number' && todayVictories > this.todayVictories) {
          this.todayVictories = todayVictories;
          this.victoryClass = 'step' + Math.min(5, this.todayVictories);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.autoplay.stop();
  }

  onRefresh() {
    this.init();
  }

  getPrimeSubmitStatus() {
    if (this.primeStatus !== 'active') {
      return false;
    }

    for (const item of this.primeItems) {
      if (!item.inputValue || isNaN(+item.inputValue)) {
        return false;
      }
    }
    return true;
  }

  get primeSubmitLabel() {
    switch (this.primeStatus) {
      case 'active': return this.canPrimeSubmit ? 'Проверим?' : '?';
      case 'validation': return 'Проверяем...';
      case 'done': return 'Оценка: ';
    }
  }

  get extraSubmitLabel() {
    switch (this.extraStatus) {
      case 'active': return '?';
      case 'validation': return 'Проверяю...';
      case 'done': return '!';
    }
  }

  get refreshButtonLabel() {
    return this.score >= 1 ? 'Ещё раз?' : 'Переиграть!';
  }

  getScore() {
    let count = 0;
    for (const item of this.primeItems) {
      if (item.isValid) {
        count++;
      }
    }

    return count / this.primeItems.length;
  }

  onPrimeChecked() {
    this.primeStatus = 'done';
    this.victoryAnimation = false;
    this.scoreMessage = '';
    this.score = this.getScore();
  }

  onPrimeEnded() {
    // activate extra
    const extra = this.primeItems
      .filter((value) => !value.isValid)
      .map((value) => ({ ...value, isChecked: false, inputValue: '', inputName: value.inputName + 'Extra', hasNote: true }));
    if (extra.length > 0) {
      this.extraItems = extra;
      this.extraStatus = 'active';
    } else {
      this.todayVictories++;
      this.victoryClass = 'step' + Math.min(5, this.todayVictories);
      this.victoryAnimation = true;

      try {
        const today = getDate('YYYY-MM-DD');
        localStorage.setItem(KEY, JSON.stringify({[today]: this.todayVictories }));
      } catch (error) {
        console.warn('localStorage error:', error);
      }
    }
  }

  onExtraSubmit(form: NgForm) {
    // console.log('Submitting correction:', form.value);

    this.extraStatus = 'validation';
    const items = this.extraItems;
    let index = 0;
    this.autoplay.timeout = 200;
    this.autoplay.play(() => {
      while (index < items.length) {
        const item = items[index++];
        // skip over checked or empty items
        if (!item.isChecked && item.inputValue) {
          if (item.expression[item.inputIndex].value === +item.inputValue) {
            item.isValid = item.isChecked = item.isReadonly = true;
            item.hasNote = false;
          } else {
            item.inputValue = '';
          }
          break;
        }
      }
      if (index >= items.length) {
        if (!items.find(item => !item.isChecked)) {
          this.extraStatus = 'done';
          this.requestMenuButtonFocus();
        } else {
          this.extraStatus = 'active';
        }
        return false;
      }
      return true;
    });
  }

  onPrimeSubmit(form: NgForm) {
    // console.log('Submitting:', form.value);
    if (!this.getPrimeSubmitStatus()) {
      console.warn('Cannot submit:', form.value);
      return;
    }

    this.primeStatus = 'validation';

    const items = this.primeItems;
    let index = 0;

    this.autoplay.timeout = 250;
    this.autoplay.play(() => {
      if (index < items.length) {
        const item = items[index++];
        item.isChecked = true;
        item.isValid = (item.expression[item.inputIndex].value === +item.inputValue);
      }
      if (index >= items.length) {
        this.onPrimeChecked();
        const message = getScoreMessage(this.score);

        this.autoplay.timeout = 100;
        this.autoplay.play(() => {
          const pref = commonPrefix(this.scoreMessage, message);
          if (pref.length < message.length) {
            this.scoreMessage = message.substring(0, pref.length + 1);
          } else {
            this.scoreMessage = message;
          }

          if (this.scoreMessage === message) {
            this.onPrimeEnded();
            return false;
          }
          return true;
        });
        return false;
      }
      return true;
    });
  }

  onPrimeItemChange(index: number) {
    const item = this.primeItems[index];
    if (item) {
      const inputValue = digitsOnly(item.inputValue).substring(0, item.inputLength);
      if (inputValue !== item.inputValue) {
        this.canPrimeSubmit = false;
        setTimeout(() => {
          item.inputValue = inputValue;
          this.canPrimeSubmit = this.getPrimeSubmitStatus();
        }, 100);
      } else {
        this.canPrimeSubmit = this.getPrimeSubmitStatus();
      }
    }
  }

  onExtraItemChange(index: number) {
    const item = this.extraItems[index];
    if (item) {
      const inputValue = digitsOnly(item.inputValue).substring(0, item.inputLength);
      if (inputValue !== item.inputValue) {
        setTimeout(() => {
          item.inputValue = inputValue;
        }, 100);
      }
    }
  }

  requestMenuButtonFocus() {
    setTimeout(() => {
      const elem = this.menuButtonRef?.nativeElement;
      if (elem) {
        elem.focus();
      }
    });
  }

  requestNoteFor(index: number) {
    const item = this.extraItems[index];
    if (item) {
      this._dialog.open(MathExpressionDialogComponent, { data: { ...item } });
    }
  }
}
