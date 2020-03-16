import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sandwich',
  templateUrl: './sandwich.component.html',
  styleUrls: ['./sandwich.component.scss']
})
export class SandwichComponent implements OnInit {
  readonly order = [0, 1, 2];
  constructor() { }

  ngOnInit(): void {
  }

  changeOrder(index: number) {
    const oldOrder = this.order[index];
    if (oldOrder > this.order[1]) {
      // swap oldOrder and (oldOrder - 1)
      for (let i = this.order.length; i-- > 0;) {
        if (this.order[i] === oldOrder) {
          this.order[i] = oldOrder - 1;
        } else if (this.order[i] === oldOrder - 1) {
          this.order[i] = oldOrder;
        }
      }
    } else if (oldOrder < this.order[1]) {
      // swap oldOrder and (oldOrder + 1)
      for (let i = this.order.length; i-- > 0;) {
        if (this.order[i] === oldOrder) {
          this.order[i] = oldOrder + 1;
        } else if (this.order[i] === oldOrder + 1) {
          this.order[i] = oldOrder;
        }
      }
    }
  }

}
