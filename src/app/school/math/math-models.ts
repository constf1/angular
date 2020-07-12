// An expression is a finite combination of symbols that is well-formed according to rules that
// depend on the context.

import { randomInteger } from 'src/app/common/math-utils';

/**
 * Mathematical symbols can designate numbers (constants), variables, operations, functions,
 * brackets, punctuation, and grouping to help determine order of operations, and other aspects of
 * logical syntax.
 */
export interface MathSymbol {
  name: string;
}

/**
 * Numerical values: numbers, constants, variables.
 */
export interface MathNoun extends MathSymbol {
  value: number;
}

export interface MathVerb extends MathSymbol {
  name: 'plus' | 'minus' | 'multiply' | 'divide';
  notation: string; // symbolic representation of a mathematical operation
}

/**
 * An expression is a sentence with a minimum of two numbers and at least one math operation.
 * This math operation can be addition, subtraction, multiplication, and division.
 *  The structure of an expression is:
 *  Expression = (Number, Math Operator, Number)
 */
export interface MathExpression extends MathSymbol {
  operator: MathVerb;
  first: MathNoun;
  second: MathNoun;
  result: MathNoun;
}

/**
 * addition/summation: (augend) + (addend) = (total)
 * or (summand) + (summand) = (sum)
 * @param first augend
 * @param second addend
 */
export function createAddition(first: number, second: number): MathExpression {
  return ({
    name: 'addition',
    operator: {
      name: 'plus',
      notation: '+'
    },
    first: {
      name: 'augend',
      value: first
    },
    second: {
      name: 'addend',
      value: second
    },
    result: {
      name: 'sum',
      value: first + second
    }
  });
}

export function createRandomAddition(maxValue: number): MathExpression {
  const a = randomInteger(0, maxValue + 1);
  const b = randomInteger(0, maxValue + 1);
  return a + b > maxValue
    ? (a > b ? createAddition(a - b, b) : createAddition(a, b - a))
    : createAddition(a, b);
}

/**
 * subtraction: (minuend) − (subtrahend) = (difference)
 * @param first minuend
 * @param second subtrahend
 */
export function createSubtraction(first: number, second: number): MathExpression {
  return ({
    name: 'subtraction',
    operator: {
      name: 'minus',
      notation: '-'
    },
    first: {
      name: 'minuend',
      value: first
    },
    second: {
      name: 'subtrahend',
      value: second
    },
    result: {
      name: 'difference',
      value: first - second
    }
  });
}

export function createRandomSubtraction(maxValue: number): MathExpression {
  const a = randomInteger(0, maxValue + 1);
  const b = randomInteger(0, maxValue + 1);
  return a > b ? createSubtraction(a, b) : createSubtraction(b, a);
}

/**
 * division: (dividend) / (divisor) = (quotient)
 * Or sometimes = (quotient) with (remainder) remaining
 * @param first dividend
 * @param second divisor
 */
export function createDivision(first: number, second: number): MathExpression {
  return ({
    name: 'division',
    operator: {
      name: 'divide',
      notation: ':'
    },
    first: {
      name: 'dividend',
      value: first
    },
    second: {
      name: 'divisor',
      value: second
    },
    result: {
      name: 'quotient',
      value: first / second
    }
  });
}

export function createRandomDivision(maxValue: number, maxQuotient: number): MathExpression {
  const b = randomInteger(1, maxValue + 1);
  const a = randomInteger(1, Math.min(maxValue, Math.floor(maxQuotient / b)) + 1);
  return createDivision(a * b, Math.random() < 0.5 ? a : b);
}


/**
 * multiplication: (multiplier) * (multiplicand) = (product)
 * @param first multiplier
 * @param second multiplicand
 */
export function createMultiplication(first: number, second: number): MathExpression {
  return ({
    name: 'multiplication',
    operator: {
      name: 'multiply',
      notation: '·' // using middle dot instead of '*'
    },
    first: {
      name: 'multiplier',
      value: first
    },
    second: {
      name: 'multiplicand',
      value: second
    },
    result: {
      name: 'product',
      value: first * second
    }
  });
}

export function createRandomMultiplication(maxValue: number, maxProduct: number): MathExpression {
  const b = randomInteger(1, maxValue + 1);
  const a = randomInteger(1, Math.min(maxValue, Math.floor(maxProduct / b)) + 1);
  return Math.random() < 0.5 ? createMultiplication(a, b) : createMultiplication(b, a);
}

export type MathExpressionTerm = 'first' | 'second' | 'result';

export function asString(expr: MathExpression, hiddenTerm?: MathExpressionTerm): string {
  if (hiddenTerm === 'first') {
    return `? ${expr.operator.notation} ${expr.second.value} = ${expr.result.value}`;
  } else if (hiddenTerm === 'second') {
    return `${expr.first.value} ${expr.operator.notation} ? = ${expr.result.value}`;
  } else if (hiddenTerm === 'result') {
    return `${expr.first.value} ${expr.operator.notation} ${expr.second.value} = ?`;
  }
  return `${expr.first.value} ${expr.operator.notation} ${expr.second.value} = ${expr.result.value}`;
}
