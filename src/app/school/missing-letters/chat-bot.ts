/* eslint-disable @typescript-eslint/naming-convention */
import { randomItem } from 'src/app/common/array-utils';

const MESSAGES = {
  // Excellent
  A: [
      'Браво!',
      'Вот и на моей улице праздник!',
      'Высший класс!.. Здорово!',
      'Выше всяких похвал!',
      'Диво дивное!',
      'Замечательно!',
      'Здорово!',
      'Копеечка в копеечку!',
      'Молодец!',
      'Не в бровь, а в глаз!',
      'Не жизнь, а малина!',
      'Нежданно-негаданно...',
      'Нет слов!',
      'Ни в сказке сказать, ни пером описать...',
      'Отлично!',
      'Очень хорошо!',
      'Превосходно!',
      'Прекрасно!',
      'Свершилось! Не верю глазам своим!',
      'Сделано на совесть!',
      'Сильно!',
      'Так держать!',
      'Талант!',
      'Тала́нтище!',
      'Толково!',
      'Умница!',
      'Умничка!!!',
      'Хвалю!',
      'Чудеса да и только!',
      'Чудесно!',
      'Чудо!',
      'Это просто чудо!',
  ],
  // Good
  B: [
    'Думаю, могло быть лучше.',
    'Могло быть лучше.',
    'Неплохая попытка, но...',
    'Неплохо.',
    'Хорошо, но...',
  ],

  // Fair (Almost bad)
  C: [
    'На троечку.',
    'Не ахти!',
    'Не до смеху.',
    'Не совсем то, что хотелось бы...',
    'Ниже среднего.',
    'Оставляет желать лучшего.',
    'С горем пополам...',
    'Серединка на половинку.',
    'Средне.',
    'Честно говоря, не очень.',
    'Что-то не очень.',
  ],

  // Bad
  D: [
    'А вот это никуда не годится.',
    'Курам на смех!',
    'Нет, это никуда не годится.',
    'Ну, это никуда не годится.',
    'Обидно.',
    'Плохо.',
    'Так дело не пойдёт!',
  ],

  // Very bad
  E: [
    'Глаза бы мои не глядели!',
    'Курам на смех!',
    'Ниже всякой критики!',
    'Ну очень плохо.',
    'Очень плохо.',
    'Плохо! Плохо! Плохо!',
    'Скверно!',
    'Хватит, это никуда не годится!',
    'Этого ещё не хватало.',
  ],

  // Fail miserably
  F: [
    'Беда, да и только!',
    'Безобразно!',
    'Взгляни как плохо.',
    'Дальше ехать некуда!',
    'Дело дрянь!',
    'Жуть!',
    'Некрасиво.',
    'Носим воду решетом!',
    'Ой как плохо!',
    'Отвратительно.',
    'Совсем плохо, ничего не выходит.',
    'Ужас!',
    'Ужасно.',
    'Я в шоке!',
  ],

  COMPLIMENTS: [
    'Великолепно!',
    'Выше всяких похвал!',
    'Грандиозно!',
    'Еще лучше, чем прежде!',
    'Здорово!',
    'Именно этого мы давно ждали!',
    'Как в сказке!',
    'Классно!',
    'Красота!',
    'Мои поздравления!',
    'Научи меня делать так же!',
    'Незабываемо!',
    'Неподражаемо!',
    'Несравненно!',
    'Отлично!',
    'Очень приятно общаться с таким умным ребёнком.',
    'Поздравляю!',
    'Поразительно!',
    'Потрясающе!',
    'Прекрасно!',
    'Прекрасное начало!',
    'Работать с тобой просто радость!',
    'С каждым днем у тебя получается всё лучше!',
    'Так держать!',
    'Талантливо!',
    'Твой мозг поработал на славу.',
    'Ты на верном пути!',
    'Ты просто чудо!',
    'У тебя получилось!',
    'Удивительно!',
    'Ух!!!',
    'Фантастика!',
    'Это замечательно!',
    'Это как раз то, что нужно!',
    'Это трогает меня до глубины души!',
    'Я верю в тебя.',
    'Я горжусь тем, что тебе это удалось!',
    'Я знала, что ты можешь сделать это.',
    'Я тобой горжусь!',
  ],

  NO_MISTAKES: [
    'Без ошибок!',
    'В этот раз без ошибок!',
    'Всё правильно, ошибок нет!',
    'Ни одной ошибки!',
    'Ошибок нет!',
  ],

  NO_MISTAKES_REPLY: [
    'Ах!',
    'Вот это да!',
    'Здорово.',
    'Класс!',
    'Комар носа не подточит!',
    'Мне даже не верится.',
    'Наконец-то!',
    'Не может быть!',
    'Ура!',
    'Ух ты!',
    'Чудесно!',
    '\\😍/',
  ],

  // Just one mistake.
  ONE_MISTAKE: [
    'Всего лишь одна ошибка.',
    'Всего одна ошибочка!',
    'Есть маленькая ошибочка...',
    'Надо исправить одну ошибку.',
    'Но есть ошибка.',
    'Ну, с кем не бывает... Одна ошибка.',
    'Одна ошибка.',
    'Ошибка.',
    'Просто маленькая ошибка, и всё.',
    'Только одна ошибка!',
    'У нас вышла ошибочка!',
  ],
  ONE_MISTAKE_REPLAY: [
    'Одна ошибка?',
    'Всего одна!',
    'Только одна!',
    'Я исправлю!',
    'Я... я её исправлю!',
  ],

  MISTAKES_REPLAY: [
    'Я всё исправлю.',
    'Я исправлю!',
    'Я... я всё исправлю!',
  ],

  // 2, 3 or 4 mistakes.
  COUNTABLE_MISTAKES: [
    '$ ошибки.',
    'У тебя $ ошибки.',
    'Целых $ ошибки.',
  ],

  // 5 and more mistakes.
  UNCOUNTABLE_MISTAKES: [
    'Много ошибок!',
    'Очень много ошибок!',
    'Ошибки, ошибки, кругом одни ошибки.',
  ],

  MISTAKE_EMPHASIS: [
    'Грамотно писать:',
    'Давай вместе повторим:',
    'Запомни и пиши правильно:',
    'Запомни:',
    'Мы пишем:',
    'Надо запомнить:',
    'Пишем грамотно:',
    'Повторяй за мной:',
    'Правильно писать:',
    'Следует писать:',
    // 'Согласно правилам:',
    // 'По правилам:',
    // 'Выучи',
    // 'Держи в памяти',
    // 'Заруби себе на носу',
    // 'Заучи',
    // 'Намотай себе на ус',
    // 'Помни',
    // 'Правильно',
    // 'Прими во внимание',
    // 'Сохрани в памяти',
    // 'Уясни',
  ],

  REMEMBER_EMPHASIS: [
    'Ещё раз повтори и хорошенько запомни.',
    'Запомни эти слова.',
    'Запомни это хорошенько.',
    'Запомни, пожалуйста, и больше не путай.',
    'Запомни, пожалуйста, и не забывай больше никогда!',
    'Запомни, пожалуйста.',
    'Пожалуйста, запомни и не делай таких ошибок!',
    'Пожалуйста, запомни!',
    'Старайся на совесть! Вода камень точит.',
    'Старайся! Без труда не выловишь и рыбку из пруда.',
    'Ты только всё, пожалуйста, запомни.',
  ],
};

/**
 * Returns score message.
 *
 * @param score in [0, 1]
 */
export function getScoreMessage(score: number): string {
  if (score === 1) {
    return randomItem(MESSAGES.A);
  } else if (score > 0.9) {
    return randomItem(MESSAGES.B);
  } else if (score > 0.8) {
    return randomItem(MESSAGES.C);
  } else if (score > 0.7) {
    return randomItem(MESSAGES.D);
  } else if (score > 0.6) {
    return randomItem(MESSAGES.E);
  } else {
    return randomItem(MESSAGES.F);
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

  addStudent(message: string) {
    this.items.push({ who: 'student', message});
  }

  onStart(answers: Answer[]) {

  }

  onProgress(answers: Answer[]) {

  }

  onEnd(answers: Answer[]) {
    const errorCount = countErrors(answers);
    const answerCount = answers.length;

    this.addTeacher(getScoreMessage((answerCount - errorCount) / answerCount));

    if (errorCount === 0) {
      this.addTeacher(randomItem(MESSAGES.NO_MISTAKES));
      this.addTeacher(randomItem(MESSAGES.COMPLIMENTS));
      this.addStudent(randomItem(MESSAGES.NO_MISTAKES_REPLY));
    } else if (errorCount === 1) {
      this.addTeacher(randomItem(MESSAGES.ONE_MISTAKE));
      this.addStudent(randomItem(MESSAGES.ONE_MISTAKE_REPLAY));
    } else if (errorCount >= 2 && errorCount <= 4) {
      this.addTeacher(randomItem(MESSAGES.COUNTABLE_MISTAKES).replace('$', '' + errorCount));
      this.addStudent(randomItem(MESSAGES.MISTAKES_REPLAY));
    } else {
      this.addTeacher(randomItem(MESSAGES.UNCOUNTABLE_MISTAKES));
      this.addStudent(randomItem(MESSAGES.MISTAKES_REPLAY));
    }

    if (errorCount > 0) {
      this.markErrors(answers);
    }
  }

  markErrors(answers: Answer[]) {
    this.addTeacher(randomItem(MESSAGES.MISTAKE_EMPHASIS));
    for (const a of answers) {
      if (a.userAnswer !== a.realAnswer) {
        this.addTeacher(`<mark>${a.realAnswer}</mark>`);
        this.addStudent(`<strong>${a.realAnswer}</strong>`);
      }
    }
    this.addTeacher(randomItem(MESSAGES.REMEMBER_EMPHASIS));
  }
}
