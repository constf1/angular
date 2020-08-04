// tslint:disable: variable-name
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { randomItem } from 'src/app/common/array-utils';
import { randomChar } from 'src/app/common/string-utils';

import { Selection } from '../letter-board/letter-board.component';

export const ASSETS_URL = 'assets/school/english/word-search-game/';
export const SVG_QUERY = 'word-search-game-svg';

function toSize(viewBox: string) {
  let width = 1024;
  let height = 768;

  if (viewBox) {
    const numbers = viewBox.split(/[\s,]+/gm).map(n => +n);
    const w = numbers[2] - numbers[0];
    const h = numbers[3] - numbers[1];
    if (w > 0) {
      width = w;
    }
    if (h > 0) {
      height = h;
    }
  }
  return { width, height };
}

@Component({
  selector: 'app-word-search-game-svg',
  template: `<div #main [style.width.px]="width" [style.height.px]="height" style="position: relative;"><ng-content></ng-content></div>`,
})
export class WordSearchGameSvgComponent implements AfterViewInit {
  @ViewChild('main', { read: ElementRef }) mainRef: ElementRef<HTMLElement>;
  @Input() game: SVGElement;
  @Output() itemChange = new EventEmitter<string>();

  width = 0;
  height = 0;

  constructor(private _r2: Renderer2) { }

  ngAfterViewInit(): void {
    const game = this.game;
    if (game) {
      const main = this.mainRef.nativeElement;
      if (main) {

        setTimeout(() => {
          const size = toSize(game.getAttribute('viewBox'));
          this.width = size.width;
          this.height = size.height;

          game.querySelectorAll<SVGPathElement>(`g.${SVG_QUERY}-questions > path`).forEach(elem => {
            const tag = elem.id.substring(elem.tagName.length);
            elem.onclick = () => this.itemChange.emit(tag);
          });

          this._r2.appendChild(main, game);
        });
      }
    }
  }
}

interface GameData {
  blank?: string;
  liner?: string;
  letters: string;
  mission: string;
  puzzles: string[];
  answers: { [key: string]: string | string[] };
  hasSvg?: boolean;
}

interface GameItem {
  index: number;
  value: string;
}

interface GameQuestion extends GameItem {
  answerIndex: number;
  answerValue: string;
  audio: HTMLAudioElement;
}

interface GameAnswer extends GameItem, Selection {
  transform: string;
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

interface GameItemLayout {
  translate?: string;
  width?: string;
  height?: string;
}

interface GameLayout {
  board: GameItemLayout;
  prompt: GameItemLayout;
  answers: {
    [key: string]: GameItemLayout;
  };
}

function queryItemLayout(svg: SVGElement, selector: string): GameItemLayout {
  const layout: GameItemLayout = {};
  const elem = svg.querySelector<SVGElement>(selector);
  if (elem) {
    const x = elem.getAttribute('x');
    const y = elem.getAttribute('y');
    const w = elem.getAttribute('width');
    const h = elem.getAttribute('height');

    layout.translate = `translate(${x || '0'}px, ${y || '0'}px)`;
    layout.width = w ? w + 'px' : 'inherit';
    layout.height = h ? h + 'px' : 'inherit';
  }
  return layout;
}

function queryAnswerLayouts(svg: SVGElement, selector: string, questions: GameQuestion[]) {
  const layouts = {};
  for (const q of questions) {
    layouts[q.answerValue] = queryItemLayout(svg, selector + q.value);
  }
  return layouts;
}

function queryGameLayout(svg: SVGElement, questions: GameQuestion[]): GameLayout {
  const layout: GameLayout = {
    board: queryItemLayout(svg, `rect.${SVG_QUERY}-board`),
    prompt: queryItemLayout(svg, `rect.${SVG_QUERY}-prompt`),
    answers: queryAnswerLayouts(svg, `rect#${SVG_QUERY}-answer`, questions)
  };
  return layout;
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

  hasSvg?: boolean;
  gameSvg?: SVGElement;
  gameSVGLayout?: GameLayout;

  get isDone(): boolean {
    return this.questions && this.answers && this.answers.length > this.questions.length;
  }

  get activeAnswerIndex(): number {
    return this.answers ? this.answers.length - 1 : -1;
  }

  constructor(
    private _route: ActivatedRoute,
    private _http: HttpClient,
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    const params = this._route.snapshot.queryParams;
    const game = params.game;
    if (game) {
      const baseUrl = ASSETS_URL + game + '/';
      this._http.get<GameData>(baseUrl + 'data.json').subscribe(data => {
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
          const audio = new Audio();
          audio.src = baseUrl + 'audio/mp3/' + v + '.mp3';

          return {
            index: i,
            value: v,
            answerValue: a,
            answerIndex: -1,
            audio
          };
        });

        this.answers = [];
        this._nextAnswer();
        this.name = game;

        if (data.hasSvg) {
          this.hasSvg = true;
          const url = this._sanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'data.svg');
          this._iconRegistry.getSvgIconFromUrl(url)
            .subscribe(gameSvg => {
              this.gameSvg = gameSvg;
              this.gameSVGLayout = queryGameLayout(gameSvg, this.questions);
            });
        }
      });
    }
  }

  private _nextAnswer() {
    const index = this.answers.length;
    this.answers.push({ index, value: '', transform: transformToTop(index) });
  }

  onAnswerClick(answer: GameAnswer) {
    const active  = this.answers[this.activeAnswerIndex];
    if (answer === active) {
      // Clear
      active.segment = undefined;
      active.path = undefined;
      active.value = '';
    } else {
      // Copy
      active.segment = answer.segment;
      active.path = answer.path;
      active.value = answer.value;
    }
  }

  onQuestionClick(tag: string) {
    const q = this.questions.find(it => it.value === tag);
    if (q) {
      q.audio.load();
      q.audio.play();

      const index = q.answerIndex >= 0 ? q.answerIndex : this.activeAnswerIndex;
      if (index >= 0) {
        this.onAnswerClick(this.answers[index]);
      }
    }
  }

  onSelectionChange(answer: GameAnswer) {
    if (answer.segment) {
      const { x1, y1, x2, y2 } = answer.segment;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const count = Math.max(Math.abs(dx), Math.abs(dy));

      answer.value = this.letters[y1][x1];
      for (let i = 1; i <= count; i++) {
        answer.value += this.letters[y1 + dy * i / count][x1 + dx * i / count];
      }

      const question = this.questions.find(item => item.answerIndex < 0 && item.answerValue === answer.value);
      if (question) {
        question.answerIndex = answer.index;
        answer.isLast = (question.index + 1 === this.questions.length);
        answer.transform = transformToAnswer(question.index, answer.index);
        this._nextAnswer();
      }
    } else {
      answer.value = '';
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  getSvgAnswerLayout(answer: GameAnswer) {
    return answer.index === this.activeAnswerIndex
      ? this.gameSVGLayout.prompt
      : this.gameSVGLayout.answers[answer.value];
  }
}
