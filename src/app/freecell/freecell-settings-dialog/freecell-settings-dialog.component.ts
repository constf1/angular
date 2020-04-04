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

  readonly assistLevelMin = Math.ceil(minState.assistLevel / D);
  readonly assistLevelMax = Math.floor(maxState.assistLevel / D);
  readonly assistLevelStep = S;

  get aspectRatio() {
    return Math.round(this.settings.state.aspectRatio * D);
  }

  set aspectRatio(value) {
    this.settings.set({ aspectRatio: +value / D });
  }

  get assistLevel() {
    return Math.round(this.settings.state.assistLevel / D);
  }

  set assistLevel(value) {
    this.settings.set({ assistLevel: +value * D });
  }

  aspectRatioLabel = (value: number) => {
    return (value / D).toFixed(3);
  }

  assistLevelLabel = (value: number) => {
    const delta = (this.assistLevelMax - this.assistLevelMin) / 3;
    if (value < this.assistLevelMin + delta) {
      return 'low';
    }
    if (value > this.assistLevelMax - delta) {
      return 'high';
    }
    return 'norm';
  }

  assistLevelColor() {
    const label = this.assistLevelLabel(this.assistLevel);
    switch (label) {
      case 'low': return 'primary';
      case 'high': return 'warn';
      default: return 'accent';
    }
  }

  constructor(public settings: FreecellSettingsService) { }

  ngOnInit(): void {
  }
}
