// An expression is a finite combination of symbols that is well-formed according to rules that
// depend on the context.

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
      notation: '*'
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
