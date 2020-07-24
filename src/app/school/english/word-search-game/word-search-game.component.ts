// tslint:disable: variable-name
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { randomItem } from 'src/app/common/array-utils';
import { randomChar } from 'src/app/common/string-utils';

import { SelectionList } from '../letter-board/letter-board.component';

const ASSETS_URL = 'assets/school/english/word-search-game/';

interface GameData {
  blank?: string;
  liner?: string;
  letters: string;
  mission: string;
  puzzles: string[];
  answers: { [key: string]: string | string[] };
}

interface GameItem {
  index: number;
  value: string;
}

interface GameQuestion extends GameItem {
  answer: string;
  isAnswered?: boolean;
}

interface GameAnswer extends GameItem {
  transform: string;
  select: () => void;
  isLast?: boolean;
}

function transformToTop(index: number) {
  // return `translate(-2.5em, ${-1 - index}00%)`;
  return `translateY(${-1 - index}50%)`;
}

function transformToAnswer(qIndex: number, aIndex: number) {
  return `translateY(${qIndex - aIndex}00%)`;
}

function createLetterLines(puzzle: string, separator?: string): string[] {
  if (separator) {
    // rectangle puzzle
    return puzzle.split(separator);
  } else {
    // it should be a square puzzle
    const W = Math.floor(Math.sqrt(puzzle.length));
    const lines: string[] = Array(W);
    for (let i = 0; i < W; i++) {
      lines[i] = puzzle.substring(i * W, (i + 1) * W);
    }
    return lines;
  }
}

function createLetterBoard(puzzle: string, remapper: (letter: string) => string, separator?: string): string[][] {
  return createLetterLines(puzzle, separator)
    .map(line => line.split('').map(remapper));
}

@Component({
  selector: 'app-word-search-game',
  templateUrl: './word-search-game.component.html',
  styleUrls: ['./word-search-game.component.scss'],
  // providers: [ WordSearchGameService ]
})
export class WordSearchGameComponent implements OnInit {
  name: string;
  mission: string;
  letters: string[][];

  questions: GameQuestion[];
  answers: GameAnswer[];

  get isDone(): boolean {
    return this.questions && this.answers && this.answers.length > this.questions.length;
  }

  constructor(private _route: ActivatedRoute, private _http: HttpClient) {
  }

  ngOnInit(): void {
    const params = this._route.snapshot.queryParams;
    const game = params.game;
    if (game) {
      this._http.get<GameData>(`${ASSETS_URL}${game}/data.json`).subscribe(data => {
        this.mission = data.mission;

        const index = +params.index;
        const puzzle = (index > 0 && index <= data.puzzles.length) ? data.puzzles[index - 1] : randomItem(data.puzzles);
        const space = data.blank || ' ';

        this.letters = createLetterBoard(
          puzzle,
          letter => letter === space ? randomChar(data.letters) : letter,
          data.liner);

        this.questions = Object.keys(data.answers).map((a, i) => {
          const qs = data.answers[a];
          const v = typeof qs === 'string' ? qs : qs[0];
          return { index: i, value: v, answer: a };
        });

        this.answers = [];
        this._nextAnswer();

        this.name = game;
      });
    }
  }

  private _nextAnswer() {
    const index = this.answers.length;
    this.answers.push({ index, value: '', transform: transformToTop(index), select: () => {} });
  }

  onSelectionChange(list: SelectionList) {
    const a = this.answers[this.answers.length - 1];
    a.value = list.active.letters;

    const q = this.questions.find(it => !it.isAnswered && it.answer === a.value);
    if (q) {
      q.isAnswered = true;
      a.isLast = (q.index + 1 === this.questions.length);
      a.transform = transformToAnswer(q.index, a.index);
      a.select = () => {
        list.select(a.index);
        this.onSelectionChange(list);
      };

      list.next();
      this._nextAnswer();
    }
  }

  getAudioSource(quiz: string, extension: string): string {
    return `${ASSETS_URL}${this.name}/audio/${extension}/${quiz}.${extension}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  playQuizAudio(elem: HTMLAudioElement) {
    if (elem) {
      // if (elem.playbackRate < 1) {
      //   elem.playbackRate = 1;
      // } else {
      //   elem.playbackRate = 0.5;
      // }
      elem.load();
      elem.play();
    }
  }
}
