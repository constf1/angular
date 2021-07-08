import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrosswordStats } from '../crossword-stats';

@Component({
  selector: 'app-crossword-stats-dialog',
  templateUrl: './crossword-stats-dialog.component.html',
  styleUrls: ['./crossword-stats-dialog.component.scss']
})
export class CrosswordStatsDialogComponent implements OnInit, AfterViewInit {
  difficulty: string;

  percentDifficulty: number;
  percentLetters: number;
  percentWords: number;
  percentTotal: number;

  isFlawless = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CrosswordStats) {
    this.difficulty = 'none';
    this.percentDifficulty = 0;
    this.percentLetters = 0;
    this.percentWords = 0;
    this.percentTotal = 0;

    const { letterTotal, letterStatic, letterSolved, wordTotal, wordSolved } = data;

    if (letterTotal > 0) {
      const density = (letterTotal - letterStatic) / letterTotal;

      if (density < 0.2) {
        // Beginner, Amateur, Newbie
        this.difficulty = 'Novice';
      } else if (density < 0.4) {
        // Apprentice, Junior
        this.difficulty = 'Rookie';
      } else if (density < 0.6) {
        // Skilled,
        this.difficulty = 'Competent';
      } else if (density < 0.8) {
        // Advanced, Professional
        this.difficulty = 'Proficient';
      } else if (density < 1) {
        // Platinum, Elite
        this.difficulty = 'Expert';
      } else if (density === 1) {
        // Pro, Phenomenal, Legend
        this.difficulty = 'Master';
      }

      this.percentDifficulty = Math.round(density * 100);
      this.percentLetters = Math.round(letterSolved * 100 / (letterTotal - letterStatic));
      this.percentWords = Math.round(wordSolved * 100 / wordTotal);

      this.isFlawless = letterSolved === letterTotal;
    }
  }

  ngAfterViewInit(): void {
    const { letterTotal, letterSolved } = this.data;
    if (letterSolved > 0 && letterTotal > 0) {
      setTimeout(() => {
        this.percentTotal = letterSolved * 100 / letterTotal;
      }, 1000);
    }
  }

  ngOnInit(): void {
  }

}
