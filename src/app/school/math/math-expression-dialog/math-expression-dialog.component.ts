import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { InputItem } from '../math-input-group/math-input-group.component';
import {
  getAdditionWithZeroRule,
  getAdditionRule,
  getSubtractionWithZeroRule,
  getSubtractionRule,
  getMultiplicationRule,
  getDivisionRule
} from '../simple-math-rules';
import { asString } from '../math-models';

@Component({
  selector: 'app-math-expression-dialog',
  templateUrl: './math-expression-dialog.component.html',
  styleUrls: ['./math-expression-dialog.component.scss']
})
export class MathExpressionDialogComponent implements OnInit {
  title = '';
  content = '';
  contentType: 'addition' | 'multiplication' | null = null;
  firstTermValue = 0;
  secondTermValue = 0;
  hiddenTerm = -1;

  constructor(@Inject(MAT_DIALOG_DATA) public item: InputItem) { }

  ngOnInit(): void {
    const term = this.item.inputIndex;
    const expr = this.item.expression;

    this.title = asString(expr, term);

    if (expr.name === 'addition') {
      this.firstTermValue = expr.first.value;
      this.secondTermValue = expr.second.value;
      this.content = getAdditionRule(expr, term);
      this.contentType = 'addition';

      const zeroRule = getAdditionWithZeroRule(expr, term);
      if (zeroRule) {
        this.content = zeroRule;
        this.hiddenTerm = -1;
      } else if (term === 'first') {
        this.hiddenTerm = 0;
      } else if (term === 'second') {
        this.hiddenTerm = 1;
      } else {
        this.hiddenTerm = 2;
      }
    } else if (expr.name === 'subtraction') {
      this.firstTermValue = expr.result.value;
      this.secondTermValue = expr.second.value;
      this.contentType = 'addition';
      this.content = getSubtractionRule(expr, term);

      const zeroRule = getSubtractionWithZeroRule(expr, term);
      if (zeroRule) {
        this.content = zeroRule;
        this.hiddenTerm = -1;
      } else if (term === 'first') {
        this.hiddenTerm = 2;
      } else if (term === 'second') {
        this.hiddenTerm = 1;
      } else {
        this.hiddenTerm = 0;
      }
    } else if (expr.name === 'multiplication') {
      this.firstTermValue = expr.first.value;
      this.secondTermValue = expr.second.value;
      this.contentType = 'multiplication';
      this.content = getMultiplicationRule(expr, term);
      if (term === 'first') {
        this.hiddenTerm = 0;
      } else if (term === 'second') {
        this.hiddenTerm = 1;
      } else {
        this.hiddenTerm = 2;
      }
    } else if (expr.name === 'division') {
      this.firstTermValue = expr.result.value;
      this.secondTermValue = expr.second.value;
      this.contentType = 'multiplication';
      this.content = getDivisionRule(expr, term);
      if (term === 'first') {
        this.hiddenTerm = 2;
      } else if (term === 'second') {
        this.hiddenTerm = 1;
      } else {
        this.hiddenTerm = 0;
      }
    }
  }
}
