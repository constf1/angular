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

function createDestination(context: AudioContext): AudioNode {
  // Create static nodes. These nodes can be used multiple times.
  // Source -> DynamicsCompressorNode -> AudioDestination
  const compressor: DynamicsCompressorNode = context.createDynamicsCompressor();
  compressor.connect(context.destination);
  return compressor;
}

function createSource(
  context: AudioContext,
  destination: AudioNode,
  buffer: AudioBuffer,
  gain: number = 1,
  stereoPan: number = 0
): AudioBufferSourceNode {
  // Build graph: source -> gain? -> panner? -> destination
  const source: AudioBufferSourceNode = context.createBufferSource();
  source.buffer = buffer;

  let node: AudioNode = source;
  if (gain !== 1) {
    const volume: GainNode = context.createGain();
    volume.gain.value = gain;
    node.connect(volume);
    node = volume;
  }

  if (stereoPan !== 0) {
    const panner: StereoPannerNode = context.createStereoPanner();
    panner.pan.value = stereoPan;
    node.connect(panner);
    node = panner;
  }

  node.connect(destination);
  return source;
}

// function dummy() {
//   // console.log('Audio is not ready!');
// }
// type PlaySound = typeof dummy;

export const FreecellSoundNames = [ 'deal', 'card', 'shuffle', 'victory'] as const;
export type FreecellSoundType = typeof FreecellSoundNames[number];
export type FreecellSounds = { [key in FreecellSoundType]: () => void };

// function createDummySounds(): FreecellSounds {
//   const sounds = {} as FreecellSounds;
//   FreecellSoundNames.forEach(name => sounds[name] = dummy);
//   return sounds;
// }

function createSounds(
  context: AudioContext,
  buffers: AudioBuffer[]): FreecellSounds {
  const destination = createDestination(context);
  const sounds = {} as FreecellSounds;

  sounds.deal = () => {
    createSource(context, destination, buffers[Resources.deal], 1).start();
  };

  sounds.shuffle = () => {
    createSource(context, destination, buffers[Resources.shuffle], 1.5).start();
  };

  let playCardCount = 0;
  sounds.card = () => {
    if (playCardCount++ === 0) {
      setTimeout(() => {
        const source = (playCardCount === 1)
          ? createSource(context, destination, buffers[Resources.card], 0.8)
          : createSource(context, destination, buffers[Resources.shuffle], 1.0);
        source.start();
        playCardCount = 0;
      });
    }
  };

  sounds.victory = () => {
    const minValue = Resources.aplause_001;
    const maxValue = Resources.aplause_007;
    const time = context.currentTime;
    for (let i = 0, count = randomInteger(1, 4); i < count; i++) {
      const source = createSource(
        context,
        destination,
        buffers[randomInteger(minValue, maxValue + 1)],
        randomNumber(0.75, 1.75),
        randomPan()
      );
      source.playbackRate.value = randomNumber(0.85, 1.75);
      source.start(time + Math.random() * 3);
    }
  };

  return sounds;
}

@Injectable()
export class FreecellSoundService extends UnsubscribableComponent {
  private _context: AudioContext;

  private _buffers: Promise<AudioBuffer[]>;

  private _enabled = false;
  private _activated = false; // AudioContext is not activated by default to comply with the Chrome autoplay policy.
  private _sounds = null;

  private _nextState: Promise<any> = Promise.resolve();

  get enabled() {
    return this._enabled;
  }

  get activated() {
    return this._activated;
  }

  constructor(settings: FreecellSettingsService) {
    super();

    this._addSubscription(settings.subscribe(state => {
      if (state.enableSound) {
        this.enable();
      } else {
        this.disable();
      }
    }));
  }

  private async _next(state: () => Promise<any>) {
    try {
      await this._nextState;
    } finally {
      this._nextState = state();
    }
  }

  activate() {
    this._activated = true;
  }

  disable() {
    this._next(async () => this._enabled = false);
  }

  enable() {
    this._next(async () => {
      if (!this._sounds) {
        if (!this._context) {
          this._context = new AudioContext();
        }
        const buffers = await this._getBuffers();
        this._sounds = createSounds(this._context, buffers);
      }
      this._enabled = true;
    });
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

  async play(soundName: FreecellSoundType) {
    await this._nextState;
    if (this._enabled && this._activated) {
      if (this._sounds) {
        const play = this._sounds[soundName];
        if (typeof play === 'function') {
          // The browser may suspend the AudioContext to require user interaction to play audio.
          // If you are allowed to play, it should immediately switch to running. Otherwise it will be suspended.
          if (this._context.state === 'suspended') {
            await this._context.resume();
          }
          play();
        }
      }
    }
  }
}
