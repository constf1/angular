// tslint:disable: variable-name
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface GameData {
  [key: string]: string;
}

interface Answer {
  userAnswer: string;
  realAnswer: string;
}

const ASSETS_URL = 'assets/school/missing-letters/';

@Component({
  selector: 'app-missing-letters',
  templateUrl: './missing-letters.component.html',
  styleUrls: ['./missing-letters.component.scss']
})
export class MissingLettersComponent implements OnInit {
  quizes = [];
  answers: Answer[] = [];

  quizPrefix = '';
  quizSuffix = '';
  quizUserAnswer = '';
  quizRealAnswer = '';

  questions: string[] = [];
  isAnswered: boolean;

  gameData: GameData;
  audio = new Audio();

  state: 'loading' | 'ready' | 'active' | 'done' = 'loading';

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    const gameName = 'ru-grade-1';
    const baseUrl = ASSETS_URL + gameName + '/';
    this._http.get<GameData>(baseUrl + 'data.json').subscribe(data => {
      this.gameData = data;
      this.state = 'ready';
    });
  }

  onStart() {
    this.answers = [];
    this.quizes = Object.keys(this.gameData);
    this.state = 'active';
    this.nextQuiz();
  }

  onRestart() {
    this.onStart();
  }

  nextQuiz() {
    const qs = this.quizes;
    if (qs.length > 0) {
      const i = Math.floor(Math.random() * qs.length);
      const word = qs[i];

      this.setQuiz(word);
      qs.splice(i, 1);

      this.playAudio(word);
      return true;
    }
    this.state = 'done';
    return false;
  }

  setQuiz(word: string) {
    const regexp = /\([^)]+\)|./g;
    const letters: { value: string, questions?: string[]}[] = [];
    let count = 0;

    while (true) {
      const match = regexp.exec(word);
      if (match) {
        const s = match[0] as string;
        if (s.length > 1) {
          const arr = s.substring(1, s.length - 1).split('|');
          letters.push({ value: arr[0], questions: arr });
          count++;
        } else if (s.length === 1) {
          letters.push({ value: s });
        }
      } else {
        break;
      }
    }
    // Enable only one random letter. Otherwise it is very difficult to guess the word.
    if (count > 1) {
      const i = Math.floor(Math.random() * count);
      for (const l of letters) {
        if (l.questions && --count !== i) {
          l.questions = null;
        }
      }
    }

    let buf = '';
    for (const l of letters) {
      if (l.questions) {
        this.quizPrefix = buf;
        buf = '';

        this.quizRealAnswer = l.questions[0];
        this.questions = l.questions;
        // shuffle(this.questions);
        this.questions.sort();
      } else {
        buf += l.value;
      }
    }
    this.quizSuffix = buf;
    this.isAnswered = false;
    this.quizUserAnswer = '_';
  }

  playAudio(word: string) {
    const uri = this.gameData[word];
    if (uri) {
      this.audio.src = ASSETS_URL + 'audio/' + uri + '.mp3';
      this.audio.load();
      this.audio.play();
    }
  }

  onAnswer(value: string, board: HTMLElement) {
    this.isAnswered = true;
    this.quizUserAnswer = value;

    const s = this.quizes.length > 0 ? ',' : '.';
    const a = this.quizPrefix + this.quizUserAnswer + this.quizSuffix + s;
    const b = this.quizPrefix + this.quizRealAnswer + this.quizSuffix + s;
    setTimeout(() => {
      this.answers.push({ userAnswer: a, realAnswer: b });
      this.nextQuiz();

      setTimeout(() => {
        // const child = board.lastElementChild;
        // if (child) {
        //   child.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
        // }
        board.scrollTop = board.scrollHeight;
      }, 100);
    }, 1000);
  }

  trackByIndex(index: number) {
    return index;
  }
}
