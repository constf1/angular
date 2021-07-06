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
      if (index === 0) {
        // Initialization.
        shuffle(words);
        const letters = toLetters(words[index]);
        input = [{
          xWords: [{ letters, x: 0, y: 0 }],
          yWords: [],
          xMin: 0,
          xMax: letters.length,
          yMin: 0,
          yMax: 1
        }];
        skipCount = 0;
        index = 1;
      } else {
        // Next iteration.
        const letters = toLetters(words[index]);
        let output: Grid[] = [];
        for (const node of input) {
          getNext(node, letters, output);
        }
        output = output.filter((gr) => (gr.xMax - gr.xMin <= maxWidth && gr.yMax - gr.yMin <= maxHeight));

        if (output.length < 1) {
          skipCount += 1;

          const w = words[index];
          words.splice(index, 1);
          words.push(w);
        } else {
          skipCount = 0;
          index += 1;
          input = sifter(words, index, output);
        }
      }

      // Comprehend results.
      const done = input.length < 1 || index + skipCount >= words.length;
      if (done) {
        index = 0;
        count--;
      }

      const isWorking = (!done || (count > 0 && skipCount > 0));

      const response: CrosswordWorkerOutput = { requestId, isWorking, grid: input.length > 0 ? randomItem(input) : null };
      postMessage(response);

      return isWorking;
    });
  } else {
    // Cancel any pending operations.
    player.stop();
  }
});
