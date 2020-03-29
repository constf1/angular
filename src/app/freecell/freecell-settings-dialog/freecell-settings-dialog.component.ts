import { Component, OnInit } from '@angular/core';
import { FreecellSettingsService, minState, maxState } from '../services/freecell-settings.service';

const D = 1000; // denominator
const S = 5; // step

@Component({
  selector: 'app-freecell-settings-dialog',
  templateUrl: './freecell-settings-dialog.component.html',
  styleUrls: ['./freecell-settings-dialog.component.scss']
})
export class FreecellSettingsDialogComponent implements OnInit {
  readonly aspectRatioMin = minState.aspectRatio * D;
  readonly aspectRatioMax = maxState.aspectRatio * D;
  readonly aspectRatioStep = S;

  get aspectRatio() {
    return Math.round(this.settings.state.aspectRatio * D);
  }

  set aspectRatio(value) {
    this.settings.set({ aspectRatio: +value / D });
  }

  constructor(public settings: FreecellSettingsService) { }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    return (value / D).toFixed(3);
  }
}
