import { MathExpression, MathExpressionTerm } from './math-models';

export function getAdditionRule(expr: MathExpression, hiddenTerm?: MathExpressionTerm): string {
  if (hiddenTerm === 'first') {
    return 'Чтобы найти первое слагаемое (?), надо из суммы вычесть второе слагаемое.';
  } else if (hiddenTerm === 'second') {
    return 'Чтобы найти второе слагаемое (?), надо из суммы вычесть первое слагаемое.';
  } else if (hiddenTerm === 'result') {
    return 'Чтобы найти сумму (?), надо сложить первое и второе слагаемые.';
  }
  return `Чтобы найти сумму (${expr.result.value}), надо сложить первое (${expr.first.value}) и второе (${expr.second.value}) слагаемые.`;
}

export function getAdditionWithZeroRule(expr: MathExpression, hiddenTerm?: MathExpressionTerm): string | null {
  const { first, second, result } = expr;

  const isFirstZero = second.value === result.value;
  const isSecondZero = first.value === result.value;
  const isResultZero = isFirstZero && isSecondZero;

  // 0 + 0 = 0
  if (isResultZero) {
    return 'Сколько ноль не прибавляй, всё равно ничего не изменится!';
  }

  // ? + x = x or x + ? = x
  if ((isFirstZero && hiddenTerm === 'first') || (isSecondZero && hiddenTerm === 'second')) {
    return `Какое число нужно прибавить к числу ${result.value} чтобы оно не изменилось?`;
  }
  // 0 + x = ? or 0 + ? = x
  if (isFirstZero && hiddenTerm !== 'first') {
    return 'Если к нулю прибавить число, то получится то же самое число.';
  }
  // x + 0 = ? or ? + 0 = x
  if (isSecondZero && hiddenTerm !== 'second') {
    return 'Если к любому числу прибавить 0 то это всё равно, что ничего к нему не прибавить!';
  }

  return null;
}

export function getSubtractionRule(expr: MathExpression, hiddenTerm?: MathExpressionTerm): string {
  if (hiddenTerm === 'first') {
    return 'Чтобы найти уменьшаемое (?), надо сложить разность и вычитаемое.';
  } else if (hiddenTerm === 'second') {
    return 'Чтобы найти вычитаемое (?), надо из уменьшаемого вычесть разность.';
  } else if (hiddenTerm === 'result') {
    return 'Чтобы найти разность (?), надо из уменьшаемого вычесть вычитаемое.';
  }
  return `Чтобы найти разность (${expr.result.value}), `
    + `надо из уменьшаемого (${expr.first.value}) вычесть вычитаемое (${expr.second.value}).`;
}

export function getSubtractionWithZeroRule(expr: MathExpression, hiddenTerm?: MathExpressionTerm): string | null {
  const { first, second, result } = expr;
  const isResultZero = first.value === second.value;
  const isFirstZero = first.value === 0;
  const isSecondZero = second.value === 0;

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
    if (hiddenTerm === 'second') {
      return `Какое число нужно отнять от числа ${result.value} чтобы оно не изменилось?`;
    } else {
      return 'При вычитании нуля из любого числа всегда получается это самое число!';
    }
  }

  return null;
}

export function getMultiplicationRule(expr: MathExpression, hiddenTerm?: MathExpressionTerm): string {
  if (hiddenTerm === 'first') {
    return 'Чтобы найти первый множитель (?), ' +
      `надо произведение (${expr.result.value}) разделить на второй множитель (${expr.second.value}).`;
  } else if (hiddenTerm === 'second') {
    return 'Чтобы найти второй множитель (?), ' +
      `надо произведение (${expr.result.value}) разделить на первый множитель (${expr.first.value}).`;
  } else if (hiddenTerm === 'result') {
    return 'Чтобы найти произведение чисел (?), ' +
      `надо первый множитель (${expr.first.value}) умножить на второй множитель (${expr.second.value}).`;
  }
  return 'Чтобы найти произведение чисел, надо первый множитель умножить на второй множитель.';
}

export function getDivisionRule(expr: MathExpression, hiddenTerm?: MathExpressionTerm): string {
  if (hiddenTerm === 'first') {
    return 'Чтобы найти делимое (?), ' +
      `надо частное (${expr.result.value}) умножить на делитель (${expr.second.value}).`;
  } else if (hiddenTerm === 'second') {
    return 'Чтобы найти делитель (?), ' +
      `надо делимое (${expr.first.value}) разделить на частное (${expr.result.value}).`;
  } else if (hiddenTerm === 'result') {
    return 'Чтобы найти частное (?), ' +
      `надо делимое (${expr.first.value}) разделить на делитель (${expr.second.value}).`;
  }
  return 'Чтобы найти частное, надо делимое разделить на делитель.';
}
