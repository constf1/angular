// tslint:disable: variable-name

import { Injectable } from '@angular/core';

import { randomInteger, randomNumber } from '../../common/math-utils';
import { loadAudioFiles } from '../../common/audio-loader';
import { UnsubscribableComponent } from 'src/app/common/unsubscribable-component';
import { FreecellSettingsService } from './freecell-settings.service';

const RESOURCE_DIR = './assets/freecell/sounds/';
const RESOURCE_EXT = '.mp3';
enum Resources {
  card,
  deal,
  shuffle,
  aplause_001,
  aplause_002,
  aplause_003,
  aplause_004,
  aplause_005,
  aplause_006,
  aplause_007,
  length
}

// The value can range between -1 (full left pan) and 1 (full right pan).
function randomPan() {
  return randomInteger(-100, 100 + 1) / 100;
}

type PlaySound = () => void;

@Injectable({
  providedIn: 'root'
})
export class FreecellSoundService extends UnsubscribableComponent {
  private _context: AudioContext;
  private _buffers: Promise<AudioBuffer[]>;
  private _destination: AudioNode;
  private _enabled = false;
  private _nextState: Promise<any> = Promise.resolve();

  get isEnabled() {
    return this._enabled;
  }

  playCard: PlaySound;
  playDeal: PlaySound;
  playShuffle: PlaySound;
  playVictory: PlaySound;

  constructor(settings: FreecellSettingsService) {
    super();
    this.disable();

    this._addSubscription(settings.stateChange.subscribe(state => {
      this._nextState = this._nextState.then(() => {
        if (!this._enabled && state.enableSound) {
          // enabling can make some time. wait for it.
          return this.enable();
        }
        if (this._enabled && !state.enableSound) {
          // disabling is fast.
          this.disable();
        }
        return Promise.resolve(this._enabled);
      });
    }));
  }

  disable() {
    this._enabled = false;
    this.playCard =
    this.playDeal =
    this.playShuffle =
    this.playVictory = () => {
      // console.log('Audio is not ready!');
    };
  }

  enable(): Promise<boolean> {
    if (this._enabled) {
      return Promise.resolve(true);
    }

    if (!this._destination) {
      this._init();
    }

    return this._getBuffers().then(buffers => {
      this.playDeal = () => {
        this._makeSource(buffers[Resources.deal], 1).start();
      };

      this.playShuffle = () => {
        this._makeSource(buffers[Resources.shuffle], 1.5).start();
      };

      let playCardCount = 0;
      this.playCard = () => {
        if (playCardCount++ === 0) {
          setTimeout(() => {
            const source = (playCardCount === 1)
              ? this._makeSource(buffers[Resources.card], 0.8)
              : this._makeSource(buffers[Resources.shuffle], 1.0);
            source.start();
            playCardCount = 0;
          });
        }
      };

      this.playVictory = () => {
        const minValue = Resources.aplause_001;
        const maxValue = Resources.aplause_007;
        const time = this._context.currentTime;
        for (let i = 0, count = randomInteger(1, 4); i < count; i++) {
          const source = this._makeSource(
            buffers[randomInteger(minValue, maxValue + 1)],
            randomNumber(0.75, 1.75),
            randomPan()
          );
          source.playbackRate.value = randomNumber(0.85, 1.75);
          source.start(time + Math.random() * 3);
        }
      };

    }).then(() => this._enabled = true);
  }

  private _makeSource(
    buffer: AudioBuffer,
    gain: number = 1,
    stereoPan: number = 0
  ): AudioBufferSourceNode {
    // Build graph: source -> gain? -> panner? -> destination
    const source: AudioBufferSourceNode = this._context.createBufferSource();
    source.buffer = buffer;

    let node: AudioNode = source;
    if (gain !== 1) {
      const volume: GainNode = this._context.createGain();
      volume.gain.value = gain;
      node.connect(volume);
      node = volume;
    }

    if (stereoPan !== 0) {
      const panner: StereoPannerNode = this._context.createStereoPanner();
      panner.pan.value = stereoPan;
      node.connect(panner);
      node = panner;
    }

    node.connect(this._destination);
    return source;
  }

  private _init() {
    this._context = new AudioContext();
    // Create static nodes. These nodes can be used multiple times.
    // Source -> DynamicsCompressorNode -> AudioDestination
    const compressor: DynamicsCompressorNode = this._context.createDynamicsCompressor();
    compressor.connect(this._context.destination);
    this._destination = compressor;
  }

  private _getBuffers() {
    if (!this._buffers) {
      this._buffers = this._loadAll();
    }
    return this._buffers;
  }

  private _loadAll() {
    const resources: string[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < Resources.length; i++) {
      resources.push(RESOURCE_DIR + Resources[i] + RESOURCE_EXT);
    }
    return loadAudioFiles(this._context, resources);
  }
}
