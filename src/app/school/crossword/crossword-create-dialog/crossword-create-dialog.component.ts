// tslint:disable: variable-name
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Data } from '../crossword-data-tree/crossword-data-tree.component';
import { CrosswordMakerService } from '../services/crossword-maker.service';

@Component({
  selector: 'app-crossword-create-dialog',
  templateUrl: './crossword-create-dialog.component.html',
  styleUrls: ['./crossword-create-dialog.component.scss']
})
export class CrosswordCreateDialogComponent implements OnInit, OnDestroy {
  data: Data = {};
  words: string[] = [];

  get progress() {
    const { items, words, isWorking } = this.maker.state;
    return (isWorking && words.length > 0) ? Math.floor(100 * items.length / words.length) : 0;
  }

  get progressVisibility() {
    return this.maker.state.isWorking ? 'visible' : 'hidden';
  }

  constructor(public dialogRef: MatDialogRef<CrosswordCreateDialogComponent>, public maker: CrosswordMakerService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.maker.stop();
  }

  onCreate() {
    if (this.words.length > 0) {
      this.maker.makePuzzle(this.words);
    }
  }

  onStop() {
    if (this.maker.state.isWorking) {
      this.maker.stop();
      this.closeDialog();
    }
  }

  onDataChange(data: Data) {
    this.maker.stop();
    this.data = data;
    this.words = Object.keys(data);
  }

  closeDialog() {
    this.dialogRef.close('DATA!');
  }
}
