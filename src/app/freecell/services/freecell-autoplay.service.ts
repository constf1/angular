import { Injectable } from '@angular/core';
import { Autoplay } from '../../common/autoplay';

@Injectable()
export class FreecellAutoplayService extends Autoplay {
  constructor() {
    super(200);
  }
}
