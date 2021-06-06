/// <reference lib="webworker" />

import { randomItem, shuffle } from 'src/app/common/array-utils';
import { Autoplay } from 'src/app/common/autoplay';
import { createDefaultSifter, getNext, Grid, toLetters } from './crossword-model';
import { CrosswordWorkerInput, CrosswordWorkerOutput } from './crossword-worker-model';

const sifter = createDefaultSifter(500, 2500);
const player = new Autoplay(1);

addEventListener('message', (event: MessageEvent<CrosswordWorkerInput>) => {
  const data = event.data;
  const { requestId, words, tryCount, maxHeight, maxWidth } = data;
  if (requestId && words?.length > 0) {
    let count = Math.max(tryCount, 1);  // Will do at least one try.
    let skipCount = 0;
    let index = 0;
    let input: Grid[];
    player.play(() => {
      let output: Grid[];
      if (index === 0) {
        shuffle(words);
        const letters = toLetters(words[index]);
        output = [{
          xWords: [{ letters, x: 0, y: 0 }],
          yWords: [],
          xMin: 0,
          xMax: letters.length,
          yMin: 0,
          yMax: 1
        }];
        skipCount = 0;
      } else {
        const letters = toLetters(words[index]);
        output = [];
        for (const node of input) {
          getNext(node, letters, output);
        }
        output = output.filter((gr) => (gr.xMax - gr.xMin <= maxWidth && gr.yMax - gr.yMin <= maxHeight));
      }

      if (output.length === 0) {
        skipCount += 1;

        const w = words[index];
        words.splice(index, 1);
        words.push(w);
      } else {
        skipCount = 0;
        index += 1;
        input = sifter(words, index, output);
      }

      let grid: Grid | null = null;
      if (input.length > 0) {
        grid = randomItem(input);
      } else {
        index = 0;
        count--;
      }

      const isWorking = (index + skipCount < words.length && count > 0);

      const response: CrosswordWorkerOutput = { requestId, isWorking, grid };
      postMessage(response);

      return isWorking;
    });
  } else {
    // Cancel any pending operations.
    player.stop();
  }
});
