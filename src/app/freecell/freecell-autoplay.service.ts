import { Injectable } from '@angular/core';
import { Autoplay } from '../common/autoplay';

@Injectable({
  providedIn: 'root'
})
export class FreecellAutoplayService extends Autoplay {
  constructor() {
    super(200);
  }
}
