import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { InputItem } from '../math-input-group/math-input-group.component';

@Component({
  selector: 'app-math-expression-dialog',
  templateUrl: './math-expression-dialog.component.html',
  styleUrls: ['./math-expression-dialog.component.scss']
})
export class MathExpressionDialogComponent implements OnInit {
  title = '';
  content = '';
  augend = 0;
  addend = 0;
  hiddenTerm = -1;

  constructor(@Inject(MAT_DIALOG_DATA) public item: InputItem) { }

  ngOnInit(): void {
    const name = this.item.expression.name;
    if (name === 'addition') {
      this._initAddition();
      const zeroRule = this._getAdditionWithZeroRule();
      if (zeroRule) {
        this.content = zeroRule;
        this.hiddenTerm = -1;
      }
    } else if (name === 'subtraction') {
      this._initSubtraction();
      const zeroRule = this._getSubtractionWithZeroRule();
      if (zeroRule) {
        this.content = zeroRule;
        this.hiddenTerm = -1;
      }
    }
  }

  private _getAdditionWithZeroRule(): string | null {
    const { first, second, result } = this.item.expression;
    const isFirstZero = second.value === result.value;
    const isSecondZero = first.value === result.value;
    const isResultZero = isFirstZero && isSecondZero;

    // 0 + 0 = 0
    if (isResultZero) {
      return 'Сколько ноль не прибавляй, всё равно ничего не изменится!';
    }

    const inputIndex = this.item.inputIndex;
    // ? + x = x or x + ? = x
    if ((isFirstZero && inputIndex === 'first') || (isSecondZero && inputIndex === 'second')) {
      return `Какое число нужно прибавить к числу ${result.value} чтобы оно не изменилось?`;
    }
    // 0 + x = ? or 0 + ? = x
    if (isFirstZero && inputIndex !== 'first') {
      return 'Если к нулю прибавить число, то получится то же самое число.';
    }
    // x + 0 = ? or ? + 0 = x
    if (isSecondZero && inputIndex !== 'second') {
      return 'Если к любому числу прибавить 0 то это всё равно, что ничего к нему не прибавить!';
    }
    return null;
  }

  private _getSubtractionWithZeroRule(): string | null {
    const { first, second, result } = this.item.expression;
    const isResultZero = first.value === second.value;
    const isFirstZero = first.value === 0;
    const isSecondZero = second.value === 0;
    const inputIndex = this.item.inputIndex;

    // x - x = 0
    if (isResultZero) {
      if (isFirstZero) {
        return 'Сколько ноль не отнимай, всё равно ничего не изменится!';
      } else {
        return 'Разность двух одинаковых чисел всегда равна нулю.';
      }
    }

    if (isSecondZero) {
      // x - ? = x
      if (inputIndex === 'second') {
        return `Какое число нужно отнять от числа ${result.value} чтобы оно не изменилось?`;
      } else {
        return 'При вычитании нуля из любого числа всегда получается это самое число!';
      }
    }

    return null;
  }

  private _initSubtraction() {
    const item = this.item;
    const expr = item.expression;
    this.augend = expr.result.value;
    this.addend = expr.second.value;
    if (item.inputIndex === 'first') {
      this.hiddenTerm = 2;
      this.title = `? - ${expr.second.value} = ${expr.result.value}`;
      this.content = 'Чтобы найти уменьшаемое (?), надо сложить разность и вычитаемое.';
    } else if (item.inputIndex === 'second') {
      this.hiddenTerm = 1;
      this.title = `${expr.first.value} - ? = ${expr.result.value}`;
      this.content = 'Чтобы найти вычитаемое (?), надо из уменьшаемого вычесть разность.';
    } else {
      this.hiddenTerm = 0;
      this.title = `${expr.first.value} - ${expr.second.value} = ?`;
      this.content = 'Чтобы найти разность (?), надо из уменьшаемого вычесть вычитаемое.';
    }
  }

  private _initAddition() {
    const { first, second, result } = this.item.expression;
    this.augend = first.value;
    this.addend = second.value;

    const inputIndex = this.item.inputIndex;
    if (inputIndex === 'first') {
      this.title = `? + ${second.value} = ${result.value}`;
      this.hiddenTerm = 0;
      this.content = 'Чтобы найти первое слагаемое (?), надо из суммы вычесть второе слагаемое.';
    } else if (inputIndex === 'second') {
      this.title = `${first.value} + ? = ${result.value}`;
      this.hiddenTerm = 1;
      this.content = 'Чтобы найти второе слагаемое (?), надо из суммы вычесть первое слагаемое.';
    } else {
      this.title = `${first.value} + ${second.value} = ?`;
      this.hiddenTerm = 2;
      this.content = 'Чтобы найти сумму (?), надо сложить первое и второе слагаемые.';
    }
  }
}
