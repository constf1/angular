/// <reference lib="webworker" />

import { randomItem, shuffle } from 'src/app/common/array-utils';
import { Autoplay } from 'src/app/common/autoplay';
import { createDefaultSifter, getNext, Grid } from './crossword-model';
import { CrosswordWorkerInput, CrosswordWorkerOutput } from './crossword-worker-model';

const sifter = createDefaultSifter(500, 2500);
const player = new Autoplay(1);

addEventListener('message', (event: MessageEvent<CrosswordWorkerInput>) => {
  const data = event.data;
  const { requestId, words, tryCount } = data;
  if (requestId && words?.length > 0) {
    let count = Math.max(tryCount, 1);  // Will do at least one try.
    let index = 0;
    let input: Grid[];
    player.play(() => {
      let output: Grid[];
      if (index === 0) {
        shuffle(words);
        const letters = words[0].split('');
        output = [{
          xWords: [{ letters, x: 0, y: 0 }],
          yWords: [],
          xMin: 0,
          xMax: letters.length,
          yMin: 0,
          yMax: 1
        }];
      } else {
        output = [];
        for (const node of input) {
          getNext(node, words[index].split(''), output);
        }
      }

      index++;
      input = sifter(words, index, output);

      let grid: Grid | null = null;
      if (input.length > 0) {
        grid = randomItem(input);
      } else {
        index = 0;
        count--;
      }

      const isWorking = (index < words.length && count > 0);

      const response: CrosswordWorkerOutput = { requestId, isWorking, grid };
      postMessage(response);

      return isWorking;
    });
  } else {
    // Cancel any pending operations.
    player.stop();
  }
});
