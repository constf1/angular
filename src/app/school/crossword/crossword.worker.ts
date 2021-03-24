/// <reference lib="webworker" />

import { randomItem, shuffle } from 'src/app/common/array-utils';
import { Autoplay } from 'src/app/common/autoplay';
import { createSifter, CWItem, CWNode, getNext, toCWArray } from './crossword-model';
import { CrosswordWorkerInput, CrosswordWorkerOutput } from './crossword-worker-model';

const sifter = createSifter(500, 2500);
const player = new Autoplay(1);

addEventListener('message', (event: MessageEvent<CrosswordWorkerInput>) => {
  const data = event.data;
  const { requestId, words, tryCount } = data;
  if (requestId && words?.length > 0) {
    let count = Math.max(tryCount, 1);  // Will do at least one try.
    let index = 0;
    let input: CWNode[];
    player.play(() => {
      let output: CWNode[];
      if (index === 0) {
        shuffle(words);
        output = [{ x: 0, y: 0, letters: words[0].split('') }];
      } else {
        output = [];
        for (const node of input) {
          getNext(node, words[index].split(''), output);
        }
      }

      index++;
      input = sifter(words, index, output);

      let items: CWItem[] | null = null;
      if (input.length > 0) {
        items = toCWArray(randomItem(input));
      } else {
        index = 0;
        count--;
      }

      const isWorking = (index < words.length && count > 0);

      const response: CrosswordWorkerOutput = { requestId, isWorking, items };
      postMessage(response);

      return isWorking;
    });
  } else {
    // Cancel any pending operations.
    player.stop();
  }
});
