// tslint:disable: variable-name
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Data } from '../crossword-data-tree/crossword-data-tree.component';
import { Grid, normalize } from '../crossword-model';
import { CrosswordMakerService } from '../services/crossword-maker.service';
import { CrosswordSettingsService, maxState, minState } from '../services/crossword-settings.service';

export type Game = Grid & {
  xClues: string[];
  yClues: string[];
};

@Component({
  selector: 'app-crossword-create-dialog',
  templateUrl: './crossword-create-dialog.component.html',
  styleUrls: ['./crossword-create-dialog.component.scss']
})
export class CrosswordCreateDialogComponent implements OnInit, OnDestroy {
  data: Data = {};
  words: string[] = [];
  closeOnSuccess = false;
  subscription: Subscription;

  readonly difficultyMin = minState.crosswordDifficulty;
  readonly difficultyMax = maxState.crosswordDifficulty;

  get gridSize() {
    const grid = this.maker.state.grid;
    return grid ? grid.xWords.length + grid.yWords.length : 0;
  }

  get progress() {
    const { words, isWorking } = this.maker.state;
    return (isWorking && words.length > 0) ? Math.floor(100 * this.gridSize / words.length) : 0;
  }

  get progressVisibility() {
    return this.maker.state.isWorking ? 'visible' : 'hidden';
  }

  constructor(
    public dialogRef: MatDialogRef<CrosswordCreateDialogComponent>,
    public maker: CrosswordMakerService,
    public settings: CrosswordSettingsService) { }

  ngOnInit(): void {
    this.subscription = this.maker.subscribe((state) => {
      if (this.closeOnSuccess && !state.isWorking && state.grid) {
        const grid = state.grid;
        const xWords = normalize(grid.xWords, -grid.xMin, -grid.yMin);
        const yWords = normalize(grid.yWords, -grid.xMin, -grid.yMin);

        const game: Game = {
          xWords,
          yWords,
          xMin: 0,
          xMax: grid.xMax - grid.xMin,
          yMin: 0,
          yMax: grid.yMax - grid.yMin,
          xClues: xWords.map((wx) => this.data[wx.letters.join('')]),
          yClues: yWords.map((wy) => this.data[wy.letters.join('')]),
        };

        this.dialogRef.close(game);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.maker.stop();
  }

  onCreate() {
    if (this.words.length > 0) {
      this.closeOnSuccess = true;
      this.maker.makePuzzle(this.words);
    }
  }

  onStop() {
    if (this.maker.state.isWorking) {
      this.maker.stop();
    }
  }

  onDataChange(data: Data) {
    this.closeOnSuccess = false;
    this.maker.stop();
    this.data = data;
    this.words = Object.keys(data);
  }
}
