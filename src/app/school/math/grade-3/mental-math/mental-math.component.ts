import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { randomInteger } from 'src/app/common/math-utils';
import { Autoplay } from 'src/app/common/autoplay';
import { commonPrefix } from 'src/app/common/string-utils';
import { getDate } from 'src/app/common/date-utils';

import { createAddition, createSubtraction } from '../../math-models';
import { InputItem } from '../../math-input-group/math-input-group.component';

function getScoreMessage(score: number): string {
  if (score === 1) {
    const messages = [
      '',
      'Здорово!', 'Прекрасно!', 'Отлично!', 'Молодец!', 'Умница!',
      'Умничка!!!', 'Хвалю!', 'Браво!', 'Талант!', 'Превосходно!',
      'Так держать!', 'Замечательно!', 'Чудесно!'
    ];
    const message = messages[randomInteger(0, messages.length)];
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
  } else if (score > 0.2) {
    return '2-';
  } else {
    const messages = [
      '', '', '', '',
      'плохо.', 'отвратительно.', 'ужасно.'
    ];
    const message = messages[randomInteger(0, messages.length)];
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
export class MentalMathComponent implements OnInit {
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

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('icon_sun', sanitizer.bypassSecurityTrustResourceUrl('assets/school/sun.svg'));
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

    const inputValue = '';
    while (this.primeItems.length < 10) {
      const type = randomInteger(0, 2);
      const inputIndex = INPUTS[randomInteger(0, INPUTS.length)];
      const inputName = 'mathExpression' + this.primeItems.length;
      if (type === 0) {
        // Create Addition.
        const sum = randomInteger(0, 101);
        const a = randomInteger(0, sum + 1);
        const expression = createAddition(a, sum - a);
        const inputLength = expression[inputIndex].value.toString().length;
        this.primeItems.push({ inputName, inputValue, inputIndex, inputLength, expression });
      } else if (type === 1) {
        // Create Subtraction.
        const a = randomInteger(0, 101);
        const b = randomInteger(0, a + 1);
        const expression = createSubtraction(a, b);
        const inputLength = expression[inputIndex].value.toString().length;
        this.primeItems.push({ inputName, inputValue, inputIndex, inputLength, expression });
      }
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
        }
      }
    }
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

  setScore() {
    let count = 0;
    for (const item of this.primeItems) {
      if (item.isValid) {
        count++;
      }
    }

    this.score = count / this.primeItems.length;
    if (this.score >= 1) {
      this.todayVictories++;

      try {
        const today = getDate('YYYY-MM-DD');
        localStorage.setItem(KEY, JSON.stringify({[today]: this.todayVictories }));
      } catch (error) {
        console.warn('localStorage error:', error);
      }
    }
  }

  onPrimeChecked() {
    this.primeStatus = 'done';
    this.victoryAnimation = false;
    this.scoreMessage = '';
    this.setScore();
  }

  onPrimeEnded() {
    // activate extra
    const extra = this.primeItems
      .filter((value) => !value.isValid)
      .map((value) => ({ ...value, isChecked: false, inputValue: '', inputName: value.inputName + 'Extra' }));
    if (extra.length > 0) {
      this.extraItems = extra;
      this.extraStatus = 'active';
    } else {
      this.victoryAnimation = true;
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
}
