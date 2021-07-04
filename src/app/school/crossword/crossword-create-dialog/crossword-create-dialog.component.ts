// tslint:disable: variable-name
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Data } from '../crossword-data-tree/crossword-data-tree.component';
import { CrosswordGame } from '../crossword-game';
import { normalize, toWord } from '../crossword-model';
import { CrosswordMakerService } from '../services/crossword-maker.service';
import { CrosswordDifficultyNames, CrosswordSettingsService, maxState, minState } from '../services/crossword-settings.service';

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
  readonly difficultyNames = CrosswordDifficultyNames;

  readonly heightMin = minState.crosswordMaxHeight;
  readonly heightMax = maxState.crosswordMaxHeight;

  readonly widthMin = minState.crosswordMaxWidth;
  readonly widthMax = maxState.crosswordMaxWidth;

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

        const cols = grid.xMax - grid.xMin;
        const rows = grid.yMax - grid.yMin;

        const xWords = normalize(grid.xWords, -grid.xMin, -grid.yMin);
        const yWords = normalize(grid.yWords, -grid.xMin, -grid.yMin);

        const xClues = xWords.map((wx) => this.data[toWord(wx.letters)]);
        const yClues = yWords.map((wy) => this.data[toWord(wy.letters)]);

        const game = new CrosswordGame(cols, rows, xWords, yWords, xClues, yClues);
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
      const state = this.settings.state;
      this.closeOnSuccess = true;
      this.maker.makePuzzle(this.words, state.crosswordMaxWidth, state.crosswordMaxHeight);
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
