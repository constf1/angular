import { Component, OnInit, Input, ViewEncapsulation, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { MathExpression, createAddition, createSubtraction } from '../../math-models';
import { randomInteger } from 'src/app/common/math-utils';
import { Autoplay } from 'src/app/common/autoplay';
import { commonPrefix } from 'src/app/common/string-utils';

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
  } else if (score >= 0.99) {
    return '5+';
  } else if (score >= 0.9) {
    return '5';
  } else if (score >= 0.8) {
    return '5-';
  } else if (score >= 0.7) {
    return '4';
  } else if (score >= 0.6) {
    return '4-';
  } else if (score >= 0.5) {
    return '3';
  } else if (score >= 0.4) {
    return '3-';
  } else if (score >= 0.3) {
    return '2';
  } else if (score >= 0.2) {
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

const INPUTS = ['first', 'second', 'result'] as const;

interface Item {
  inputName: string;
  inputValue: string;
  inputIndex: 'first' | 'second' | 'result';
  inputLength: number;
  isValid?: boolean;
  isChecked?: boolean;
  expression: MathExpression;
}

@Component({
  selector: 'app-mental-math',
  templateUrl: './mental-math.component.html',
  styleUrls: ['./mental-math.component.scss']
})
export class MentalMathComponent implements OnInit, AfterViewInit {
  @Input() topic = 'Найди значение каждого выражения.';
    // 'Вычисли, переставляя, где удобно, слагаемые или заменяя соседние слагаемые их суммой.';

  @Input() items: Item[] = [];
  @ViewChildren('itemInputs') inputList: QueryList<ElementRef<HTMLInputElement>>;

  status: 'active' | 'validation' | 'done' = 'active';
  scoreMessage = '';
  score = 0;

  autoplay = new Autoplay();

  showKeyboard = false;
  keyboardTransform = '';
  inputIndex = -1;

  get toggleKeyboardIcon() {
    return this.showKeyboard ? 'keyboard_hide' : 'keyboard';
  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('icon_sun', sanitizer.bypassSecurityTrustResourceUrl('assets/school/sun.svg'));
  }

  init(): void {
    this.autoplay.stop();
    this.status = 'active';
    this.score = 0;
    this.scoreMessage = '';
    this.items = [];

    const inputValue = '';
    while (this.items.length < 10) {
      const type = randomInteger(0, 2);
      const inputIndex = INPUTS[randomInteger(0, INPUTS.length)];
      const inputName = 'mathExpression' + this.items.length;
      if (type === 0) {
        // Create Addition.
        const sum = randomInteger(0, 101);
        const a = randomInteger(0, sum + 1);
        const expression = createAddition(a, sum - a);
        const inputLength = expression[inputIndex].value.toString().length;
        this.items.push({ inputName, inputValue, inputIndex, inputLength, expression });
      } else if (type === 1) {
        // Create Subtraction.
        const a = randomInteger(0, 101);
        const b = randomInteger(0, a + 1);
        const expression = createSubtraction(a, b);
        const inputLength = expression[inputIndex].value.toString().length;
        this.items.push({ inputName, inputValue, inputIndex, inputLength, expression });
      }
    }
  }

  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(): void {
    this.nextItemRequestFocus(0);
  }

  onRefresh() {
    this.init();
    // Give angular a chance to rebuild the form.
    setTimeout(() => {
      this.nextItemRequestFocus(0);
    }, 100);
  }

  canSubmit() {
    if (this.status !== 'active') {
      return false;
    }

    for (const item of this.items) {
      if (!item.inputValue) {
        return false;
      }
    }
    return true;
  }

  get submitButtonLabel() {
    switch (this.status) {
      case 'active': return this.canSubmit() ? 'Проверим?' : '?';
      case 'validation': return 'Проверяем...';
      case 'done': return 'Оценка: ';
    }
  }

  get refreshButtonLabel() {
    return this.score >= 1 ? 'Ещё раз?' : 'Переиграть!';
  }

  setScore() {
    let count = 0;
    for (const item of this.items) {
      if (item.isValid) {
        count++;
      }
    }

    this.score = count / this.items.length;
    return getScoreMessage(this.score);
  }

  onSubmit(form: NgForm) {
    // console.log('Submitting:', form.value);
    if (!this.canSubmit()) {
      console.warn('Cannot submit form:', form.value);
      return;
    }

    this.status = 'validation';

    const items = this.items;
    let index = 0;

    this.autoplay.timeout = 250;
    this.autoplay.play(() => {
      if (index < items.length) {
        const item = items[index];
        item.isChecked = true;
        item.isValid = (item.expression[item.inputIndex].value === +item.inputValue);
      }
      const next = ++index < this.items.length;
      if (!next) {
        this.status = 'done';
        const message = this.setScore();
        this.scoreMessage = '';

        this.autoplay.timeout = 100;
        this.autoplay.play(() => {
          const pref = commonPrefix(this.scoreMessage, message);
          if (pref.length < message.length) {
            this.scoreMessage = message.substring(0, pref.length + 1);
          } else {
            this.scoreMessage = message;
          }
          return this.scoreMessage !== message;
        });
      }
      return next;
    });
  }

  onInputEnter(index: number) {
    if (index >= 0 && index < this.items.length) {
      const value = this.items[index].inputValue;
      if (value && !isNaN(+value)) {
        return this.nextItemRequestFocus(index + 1);
      }
    }
    return true;
  }

  onInputFocus(event: FocusEvent, host: HTMLElement, index: number) {
    this.inputIndex = index;
    const target = event.target as HTMLElement;
    if (host && target) {
      const rc0 = host.getBoundingClientRect();
      const rc1 = target.getBoundingClientRect();

      this.keyboardTransform = `translate(${rc1.left - rc0.left}px, ${rc1.bottom - rc0.top}px)`;
    }
  }

  onInputChange(index: number, value: string) {
    const item = this.items[index];
    if (item) {
      const pattern = /[^0-9]/g;
      const inputValue = value.replace(pattern, '').substring(0, item.inputLength);
      if (inputValue !== item.inputValue) {
        setTimeout(() => {
          item.inputValue = inputValue;
        }, 100);
      }
    }
  }

  onInputNext(n: number) {
    if (this.inputIndex >= 0 && this.inputIndex < this.items.length) {
      const item = this.items[this.inputIndex];
      if (item.inputValue.length < item.inputLength) {
        item.inputValue = item.inputValue + n;
      }
    }
  }

  onInputBack() {
    if (this.inputIndex >= 0 && this.inputIndex < this.items.length) {
      const item = this.items[this.inputIndex];
      const length = item.inputValue.length;
      if (length > 0) {
        item.inputValue = item.inputValue.substring(0, length - 1);
      }
    }
  }

  nextItemRequestFocus(index: number): boolean {
    const inputs = this.inputList.toArray();
    const length = inputs.length;
    for (let i = 0; i < length; i++) {
      const elem = inputs[(index + i) % length].nativeElement;
      if (elem) {
        if (!elem.value) {
          setTimeout(() => {
            elem.focus();
          });
          return true;
        }
      }
    }
    return false;
  }
}
