/* eslint-disable no-underscore-dangle */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { randomItem } from 'src/app/common/array-utils';
import { randomInteger } from 'src/app/common/math-utils';
import { SfxAnimation, SfxFireballs, SfxLines, SfxParticles } from 'src/app/common/sfx-animation';

import { Answer, ChatBot, countErrors } from './chat-bot';
import { ASSETS_URL, IMAGES, WIN_AUDIOS } from './missing-letters-assets';

interface GameData {
  [key: string]: string;
}

@Component({
  selector: 'app-missing-letters',
  templateUrl: './missing-letters.component.html',
  styleUrls: ['./missing-letters.component.scss']
})
export class MissingLettersComponent implements OnInit {
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

  sfx?: SfxAnimation;

  get isVictory() {
    return this.state === 'done' && countErrors(this.answers) === 0;
  }

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
    this.sfx = undefined;
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

      this.setAudio(this.gameData[word]);
      return true;
    }
    this.state = 'done';
    this.chatBot.onEnd(this.answers);

    if (countErrors(this.answers) === 0) {
      const chance = Math.random();
      if (chance < 0.3) {
        this.sfx = new SfxParticles();
      } else if (chance < 0.7) {
        const sfx = new SfxLines();
        sfx.speed = randomInteger(100, 600);
        sfx.particleCount = randomInteger(25, 350);
        this.sfx = sfx;
      } else {
        const sfx = new SfxFireballs();
        sfx.particleCount = randomInteger(3, 10);
        this.sfx = sfx;
      }
    }

    return false;
  }

  setQuiz(word: string) {
    const regexp = /\([^)]+\)|./g;
    const letters: { value: string; questions?: string[]}[] = [];
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

  setAudio(uri: string) {
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

  onAudioClick() {
    if (this.state === 'done') {
      if (countErrors(this.answers) === 0) {
        this.setAudio(randomItem(WIN_AUDIOS));
      }
    } else {
      this.playAudio();
    }
  }

  onAnswer(value: string, board: HTMLElement) {
    this.clearImage();
    this.isAnswered = true;
    this.quizUserAnswer = value;

    const a = this.quizPrefix + this.quizUserAnswer + this.quizSuffix;
    const b = this.quizPrefix + this.quizRealAnswer + this.quizSuffix;

    setTimeout(() => {
      const elem = this.imageRef?.nativeElement;
      if (elem) {
        const images = (a === b) ? (this.quizes.length === 0 && countErrors(this.answers) === 0) ?
          IMAGES.dances : IMAGES.jumps : IMAGES.looks;

        const image = randomItem(images);

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

  clearImage() {
    const elem = this.imageRef?.nativeElement;
    if (elem) {
      elem.src = '';
    }
    this.imageStyles = { display: 'none' };
  }

  explodeImage() {
    const elem = this.imageRef?.nativeElement;
    if (elem) {
      const image = randomItem(IMAGES.booms);
      const src = ASSETS_URL + image.src;
      elem.src = src;
    }
  }

  onMouseMove(event: MouseEvent, board: HTMLElement) {
    if (this.sfx) {
      const rect = board.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.sfx.mouse = { x, y };
    }
  }

  onMouseOut() {
    if (this.sfx) {
      this.sfx.mouse = undefined;
    }
  }
}
