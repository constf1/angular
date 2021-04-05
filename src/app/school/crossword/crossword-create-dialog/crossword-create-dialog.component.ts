// tslint:disable: variable-name
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Data } from '../crossword-data-tree/crossword-data-tree.component';
import { CrosswordMakerService } from '../services/crossword-maker.service';
import { CrosswordSettingsService, maxState, minState } from '../services/crossword-settings.service';

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

  get progress() {
    const { items, words, isWorking } = this.maker.state;
    return (isWorking && words.length > 0) ? Math.floor(100 * items.length / words.length) : 0;
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
      if (this.closeOnSuccess && !state.isWorking && state.items.length > 0) {
        const game = state.items.map((item) => ({ ...item, clue: this.data[item.letters.join('')]}));
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
