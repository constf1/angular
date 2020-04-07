// tslint:disable: variable-name

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// m = (x * 3 + y) * 3 + z
function fromBase3(x: number, y: number, z: number) {
  return (x * 3 + y) * 3 + z;
}

// Numbers such that their representation in base 3 has the same number of 0's, 1's and 2's.
// 012, 021, 102, 120, 201, 210
const ORDERS = [5, 7, 11, 15, 19, 21];

function getOrder(order: number, index: number): number {
  // const x = Math.floor(orderSum / Math.pow(3, 2)) % 3;
  // const y = Math.floor(orderSum / Math.pow(3, 1)) % 3;
  // const z = Math.floor(orderSum / Math.pow(3, 0)) % 3;
  return Math.floor(ORDERS[order] / Math.pow(3, 2 - index)) % 3;
}

@Component({
  selector: 'app-sandwich',
  templateUrl: './sandwich.component.html',
  styleUrls: ['./sandwich.component.scss']
})
export class SandwichComponent implements OnInit {
  readonly order = [0, 1, 2];
  private _sandwichOrder = 0; // n ∈ [0, 5]

  get sandwichOrder() {
    return this._sandwichOrder;
  }

  @Input() set sandwichOrder(value: number) {
    if (this._sandwichOrder !== value && value >= 0 && value < ORDERS.length) {
      this._sandwichOrder = value;
      this.order[0] = getOrder(value, 0);
      this.order[1] = getOrder(value, 1);
      this.order[2] = getOrder(value, 2);
    }
  }

  @Output() sandwichOrderChange = new EventEmitter<number>();

  @Input() hideHeader = false;
  @Input() hideFooter = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeOrder(index: number) {
    const order = [...this.order];
    const oldOrder = order[index];
    if (oldOrder > order[1]) {
      // swap oldOrder and (oldOrder - 1)
      for (let i = order.length; i-- > 0;) {
        if (order[i] === oldOrder) {
          order[i] = oldOrder - 1;
        } else if (order[i] === oldOrder - 1) {
          order[i] = oldOrder;
        }
      }
    } else if (oldOrder < order[1]) {
      // swap oldOrder and (oldOrder + 1)
      for (let i = order.length; i-- > 0;) {
        if (order[i] === oldOrder) {
          order[i] = oldOrder + 1;
        } else if (order[i] === oldOrder + 1) {
          order[i] = oldOrder;
        }
      }
    }

    const n = fromBase3(order[0], order[1], order[2]);
    this.sandwichOrderChange.emit(ORDERS.indexOf(n));
  }
}
