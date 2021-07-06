import { Component, Input, OnInit } from '@angular/core';

// Your Statistics
// Solve Rate (% solved)
// Solved words
export type Item = {
  word: string;
  clue: string;
};

@Component({
  selector: 'app-crossword-upshot',
  templateUrl: './crossword-upshot.component.html',
  styleUrls: ['./crossword-upshot.component.scss']
})
export class CrosswordUpshotComponent implements OnInit {
  @Input() labels = ['Items', 'Clues'];
  @Input() items: Item[] = [
    { word: 'abject', clue: 'extremely unhappy, poor, unsuccessful' },
    { word: 'abrogation', clue: 'the repeal or abolition of a law, right, or agreement' },
    { word: 'ado', clue: 'a state of agitation or fuss, especially about something unimportant' },
    { word: 'aerial', clue: 'radio wave transmitter or receiver; operating in the air' },
    { word: 'affront', clue: 'a deliberate insult' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  trackByWord(index: number, item: Item): string {
    return item.word;
  }
}
