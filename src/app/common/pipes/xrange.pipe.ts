import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xrange'
})
export class XrangePipe implements PipeTransform {
  transform(count: number, start: number = 0): Iterable<number> {
    return {
      *[Symbol.iterator]() {
        const end = start + count;
        for (let i = start; i < end; i++) {
          yield i;
        }
      }
    };
  }
}
