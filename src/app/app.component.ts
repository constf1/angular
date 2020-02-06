import { Component } from '@angular/core';
import { createFreecellBasis } from './freecell-basis';
import { createFreecellLayout } from './freecell-layout';
import { randomIneger } from './common/math-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'freecell-demo';
  layout = createFreecellLayout(createFreecellBasis(8, 4, 4));
  deal: number;

  onDeal() {
    this.deal = randomIneger(0, 0x80000000);
  }
}
