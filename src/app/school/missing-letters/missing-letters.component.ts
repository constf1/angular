// tslint:disable: variable-name
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { randomItem } from 'src/app/common/array-utils';
import { randomInteger } from 'src/app/common/math-utils';
import { Answer, ChatBot } from './chat-bot';

interface GameData {
  [key: string]: string;
}

interface Frame {
  left: number;
  right?: number;
  top: number;
  bottom?: number;
  width: number;
}

interface Image {
  src: string;
  frames: Frame[];
}

const IMAGES: Image[] = [
  {
    src: 'kitten-jump.webp',
    frames: [
      { left: 870, top: 117, width: 58 },  // bulletin board
      { left: 966, top: 464, width: 52 },  // pot
      { left: 60, right: 68, top: 22, width: 72 },  // teacher
      { left: 900, top: 450, width: 60 },  // girl
      { left: 108, top: 230, width: 100 },  // teacher's pocket
      { left: 846, right: 954, top: 0, width: 68 },  // bulletin board top
      { left: 228, right: 742, top: 400, width: 80 },  // blackboard
      { left: 0, right: 862, top: 550, width: 160 },  // front
    ]
  },
  {
    src: 'doggy-jump.webp',
    frames: [
      { left: 870, top: 117, width: 58 },  // bulletin board
      { left: 966, top: 464, width: 52 },  // pot
      { left: 130, right: 136, top: 17, width: 80 },  // teacher's head
      { left: 900, top: 450, width: 60 },  // girl
      { left: 108, top: 230, width: 100 },  // teacher's pocket
      { left: 846, right: 954, top: 0, width: 68 },  // bulletin board top
      { left: 228, right: 742, top: 400, width: 80 },  // blackboard
      { left: 0, right: 862, top: 550, width: 160 },  // front
    ]
  },
  {
    src: 'rabbit-jump.webp',
    frames: [
      { left: 870, top: 114, width: 58 },  // bulletin board
      { left: 970, top: 460, width: 48 },  // pot
      { left: 138, right: 142, top: 10, width: 72 },  // teacher's head
      { left: 898, top: 435, width: 60 },  // girl
      { left: 108, top: 230, width: 84 },  // teacher's pocket
      { left: 846, right: 964, top: 0, width: 58 },  // bulletin board top
      { left: 228, right: 742, top: 382, width: 80 },  // blackboard
      { left: 0, right: 862, top: 510, width: 160 },  // front
    ]
  }
];

const ASSETS_URL = 'assets/school/missing-letters/';

@Component({
  selector: 'app-missing-letters',
  templateUrl: './missing-letters.component.html',
  styleUrls: ['./missing-letters.component.scss']
})
export class MissingLettersComponent implements OnInit {
  readonly images: ReadonlyArray<Readonly<Image>> = IMAGES;

  @ViewChild('imageRef') imageRef: ElementRef<HTMLImageElement>;
  imageStyles: { [key: string]: string } = {
    display: 'none'
  };

  quizes = [];
  answers: Answer[] = [];

  quizPrefix = '';
  quizSuffix = '';
  quizUserAnswer = '';
  quizRealAnswer = '';

  questions: string[] = [];
  isAnswered: boolean;

  chatBot = new ChatBot();

  gameData: GameData;

  audio = new Audio();
  audioPlaybackRate = 1;
  isAudioEnabled = true;
  isAudioPlaying = false;

  state: 'loading' | 'ready' | 'active' | 'done' = 'loading';

  fontSize = 24;
  readonly fontSizeMin = 12;
  readonly fontSizeMax = 40;

  constructor(private _http: HttpClient, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.audio.onended = () => this.isAudioPlaying = false;
    this.audio.onerror = () => this.isAudioPlaying = false;
    this.audio.onplay = () => this.isAudioPlaying = true;

    const params = this._route.snapshot.queryParams;
    const gameName = (params.game as string || '').replace(/[^a-z\-_\.0-9]+/gmi, '');
    if (gameName) {
      this._http.get<GameData>(ASSETS_URL + gameName + '.json').subscribe(data => {
        this.gameData = data;
        this.state = 'ready';
      });
    }
  }

  onStart() {
    // this.chatBot.onStart(this.answers);
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

      this.setAudio(word);
      return true;
    }
    this.state = 'done';
    this.chatBot.onEnd(this.answers);
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

  setAudio(word: string) {
    const uri = this.gameData[word];
    if (uri) {
      this.audio.src = ASSETS_URL + 'audio/' + uri + '.mp3';
      // First time play normally.
      this.audioPlaybackRate = 1;
      this.playAudio();
    }
  }

  playAudio() {
    if (this.isAudioEnabled && this.audio.src) {
      this.audio.load();
      this.audio.playbackRate = this.audioPlaybackRate;
      this.audio.play();
      // this.isAudioPlaying = true;
      // Apply playback slow down effect.
      this.audioPlaybackRate = Math.max(this.audioPlaybackRate * 0.95, 0.5);
    }
  }

  onAnswer(value: string, board: HTMLElement) {
    this.isAnswered = true;
    this.quizUserAnswer = value;

    const a = this.quizPrefix + this.quizUserAnswer + this.quizSuffix;
    const b = this.quizPrefix + this.quizRealAnswer + this.quizSuffix;

    const elem = this.imageRef?.nativeElement;
    if (elem) {
      elem.src = '';
    }

    setTimeout(() => {
      if (elem) {
        if (a === b) {
          const image = randomItem(this.images);

          elem.src = ASSETS_URL + image.src;

          const frame = randomItem(image.frames);
          const left = typeof frame.right === 'number' ? randomInteger(frame.left, frame.right) : frame.left;
          const top = typeof frame.bottom === 'number' ? randomInteger(frame.top, frame.bottom) : frame.top;

          this.imageStyles = {
            position: 'absolute',
            left: left + 'px',
            top: top + 'px',
            width: frame.width + 'px'
          };
        }
      }
    }, 10);

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
