import { randomItem } from 'src/app/common/array-utils';

// Excellent
export const MESSAGES_A = [
  'Здорово!', 'Прекрасно!', 'Отлично!', 'Молодец!', 'Умница!',
  'Умничка!!!', 'Хвалю!', 'Браво!', 'Талант!', 'Превосходно!',
  'Так держать!', 'Замечательно!', 'Чудесно!', 'Знаток!', 'Толково!'
] as const;

// Good
export const MESSAGES_B = [
  'Хорошо.', 'Не плохо.', 'Могло быть лучше.', 'Неплохая попытка, но...', 'Думаю, могло быть лучше.'
] as const;

// Fair (Almost bad)
export const MESSAGES_C = [
  'Средне.', 'Что-то не очень.', 'Честно говоря, не очень.', 'Не ахти!', 'На троечку.', 'Не совсем то, что хотелось бы...', 'Ниже среднего.'
] as const;

// Bad
export const MESSAGES_D = [
  'Плохо.', 'Ну, это никуда не годится.', 'А вот это никуда не годится.', 'Нет, это никуда не годится.'
] as const;

// Very bad
export const MESSAGES_E = [
  'Очень плохо.', 'Ну очень плохо.', 'Плохо! Плохо! Плохо!', 'Хватит, это никуда не годится!', 'Курам на смех!', 'Скверно!'
] as const;

// Fail miserably
export const MESSAGES_F = [
  'Отвратительно.', 'Ужасно.', 'Ужас!', 'Безобразно!',
  'Ой как плохо!', 'Некрасиво.', 'Я в шоке!', 'Жуть!', 'Взгляни как плохо.'
] as const;

/**
 * Returns score message.
 * @param score in [0, 1]
 */
export function getScoreMessage(score: number): string {
  if (score === 1) {
    return randomItem(MESSAGES_A);
  } else if (score > 0.9) {
    return randomItem(MESSAGES_B);
  } else if (score > 0.8) {
    return randomItem(MESSAGES_C);
  } else if (score > 0.7) {
    return randomItem(MESSAGES_D);
  } else if (score > 0.6) {
    return randomItem(MESSAGES_E);
  } else {
    return randomItem(MESSAGES_F);
  }
}

export interface ChatBotItem {
  who: 'teacher' | 'student';
  message: string;
}

export interface Answer {
  userAnswer: string;
  realAnswer: string;
}

export function countErrors(answers: Answer[]) {
  let count = 0;
  for (const a of answers) {
    if (a.realAnswer !== a.userAnswer) {
      count++;
    }
  }
  return count;
}

export class ChatBot {
  items: ChatBotItem[] = [];
  selection = 0;

  get currentItem() {
    return this.items[this.selection];
  }

  next() {
    this.selection = Math.min(this.selection + 1, this.items.length);
  }

  prev() {
    this.selection = Math.max(this.selection - 1, 0);
  }

  addTeacher(message: string) {
    this.items.push({ who: 'teacher', message});
  }

  onStart(answers: Answer[]) {

  }

  onProgress(answers: Answer[]) {

  }

  onEnd(answers: Answer[]) {
    const errors = countErrors(answers);
    const count = answers.length;

    this.addTeacher(getScoreMessage((count - errors) / count));
    this.markErrors(answers);
  }

  markErrors(answers: Answer[]) {
    const messages = [
      'Запомни', 'Мы пишем', 'Правильно', 'Грамотно писать', 'Заучи',
      'Заруби себе на носу', 'Сохрани в памяти', 'Намотай себе на ус', 'Выучи', 'Держи в памяти',
      'Помни', 'Прими во внимание', 'Уясни', 'Правильно писать', 'Надо запомнить', 'По правилам',
      'Согласно правилам', 'Следует писать'
    ];
    for (const a of answers) {
      if (a.userAnswer !== a.realAnswer) {
        const prefix = randomItem(messages);
        this.addTeacher(`${prefix}: <mark>${a.realAnswer}</mark>!`);
      }
    }
  }
}
