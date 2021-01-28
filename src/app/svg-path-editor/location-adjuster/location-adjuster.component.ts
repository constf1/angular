import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Direction } from 'src/app/common/math2d';

@Component({
  selector: 'app-location-adjuster',
  templateUrl: './location-adjuster.component.html',
  styleUrls: ['./location-adjuster.component.scss']
})
export class LocationAdjusterComponent implements OnInit {
  @Input() disabled = false;
  @Output() locationChange = new EventEmitter<Direction>();

  locationIcons = [
    ['north_west', 'north', 'north_east'],
    ['west', 'trip_origin', 'east'],
    ['south_west', 'south', 'south_east']
  ];

  constructor() { }

  ngOnInit(): void {
  }

  requestLocation(row: number, col: number) {
    this.locationChange.emit(row * 3 + col);
  }

}
