import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  SimpleChanges,
} from '@angular/core';

import { MathExpression } from '../math-models';

export interface InputItem {
  expression: MathExpression;
  hasNote?: boolean;
  inputName: string;
  inputValue: string;
  inputIndex: 'first' | 'second' | 'result';
  inputLength: number;
  isChecked?: boolean;
  isReadonly?: boolean;
  isValid?: boolean;
}

const BUTTON_BACK = '←'; // left arrow (&larr;)
const BUTTON_NEXT = 'OK';

@Component({
  selector: 'app-math-input-group',
  templateUrl: './math-input-group.component.html',
  styleUrls: ['./math-input-group.component.scss']
})
export class MathInputGroupComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() active = true;
  @Input() items: InputItem[];
  @Output() itemChange = new EventEmitter<number>();
  @Output() noteRequest = new EventEmitter<number>();

  @ViewChildren('itemInputs') inputList: QueryList<ElementRef<HTMLInputElement>>;

  readonly buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', BUTTON_BACK, BUTTON_NEXT];

  showKeyboard = false;
  keyboardTransform = '';
  inputIndex = -1;

  get toggleKeyboardIcon() {
    return this.showKeyboard ? 'keyboard_hide' : 'keyboard';
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.nextItemRequestFocus(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes.items;
    if (change) {
      this.keyboardTransform = '';
      this.inputIndex = -1;
      if (!change.firstChange) {
        // Give angular a chance to rebuild the form.
        setTimeout(() => {
          this.nextItemRequestFocus(0);
        }, 100);
      }
    }
  }

  ngOnInit(): void {
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

  onInputFocus(event: FocusEvent, frame: HTMLElement, index: number) {
    this.inputIndex = index;
    const input = event.target as HTMLElement;
    if (frame && input) {
      const rc0 = frame.getBoundingClientRect();
      const rc1 = input.getBoundingClientRect();

      this.keyboardTransform = `translate(${rc1.left - rc0.left}px, ${rc1.bottom - rc0.top}px)`;
    }
  }

  onInputNext(n: number) {
    const value = this.buttons[n];
    if (!isNaN(+value)) {
      if (this.inputIndex >= 0 && this.inputIndex < this.items.length) {
        const item = this.items[this.inputIndex];
        if (!item.isReadonly || item.inputValue.length < item.inputLength) {
          item.inputValue = item.inputValue + value;
          this.itemChange.emit(this.inputIndex);
        }
      }
    } else if (value === BUTTON_BACK) {
      this.onInputBack();
    } else if (value === BUTTON_NEXT) {
      this.showKeyboard = this.onInputEnter(this.inputIndex);
    }
  }

  onInputBack() {
    if (this.inputIndex >= 0 && this.inputIndex < this.items.length) {
      const item = this.items[this.inputIndex];
      const length = item.inputValue.length;
      if (!item.isReadonly && length > 0) {
        item.inputValue = item.inputValue.substring(0, length - 1);
        this.itemChange.emit(this.inputIndex);
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
