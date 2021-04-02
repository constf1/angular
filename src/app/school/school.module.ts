import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { CoreModule } from '../core/core.module';

import { SquaredPaperComponent } from './squared-paper/squared-paper.component';
import { MentalMathComponent } from './math/grade-3/mental-math/mental-math.component';
import { NumpadComponent } from './math/numpad/numpad.component';
import { MathInputGroupComponent } from './math/math-input-group/math-input-group.component';
import { SimpleAdditionComponent } from './math/simple-addition/simple-addition.component';
import { MathExpressionDialogComponent } from './math/math-expression-dialog/math-expression-dialog.component';
import { SimpleMultiplicationComponent } from './math/simple-multiplication/simple-multiplication.component';

import { CrosswordBoardComponent } from './crossword/crossword-board/crossword-board.component';
import { CrosswordComponent } from './crossword/crossword.component';
import { CrosswordGameComponent } from './crossword/crossword-game/crossword-game.component';
import { CrosswordMakerService } from './crossword/services/crossword-maker.service';
import { CrosswordSettingsService } from './crossword/services/crossword-settings.service';

import { LetterBoardComponent } from './english/letter-board/letter-board.component';
import { MissingLettersComponent } from './missing-letters/missing-letters.component';
import { SimpleDiffComponent } from './simple-diff/simple-diff.component';
import { WordSearchGameComponent, WordSearchGameSvgComponent } from './english/word-search-game/word-search-game.component';
import { CrosswordSidenavComponent } from './crossword/crossword-sidenav/crossword-sidenav.component';
import { CrosswordCreateDialogComponent } from './crossword/crossword-create-dialog/crossword-create-dialog.component';
import { CrosswordDataTreeComponent } from './crossword/crossword-data-tree/crossword-data-tree.component';

/**
 * Routes:
 */
const routes: Routes = [
  { path: 'mental-math', component: MentalMathComponent },
  { path: 'word-puzzle', component: WordSearchGameComponent },
  { path: 'missing-letters', component: MissingLettersComponent },
  { path: 'crossword', component: CrosswordSidenavComponent },
  { path: '', component: MentalMathComponent },
];

@NgModule({
  declarations: [
    SquaredPaperComponent,
    MentalMathComponent,
    NumpadComponent,
    MathInputGroupComponent,
    SimpleAdditionComponent,
    MathExpressionDialogComponent,
    SimpleMultiplicationComponent,
    WordSearchGameComponent,
    LetterBoardComponent,
    WordSearchGameSvgComponent,
    MissingLettersComponent,
    SimpleDiffComponent,
    CrosswordComponent,
    CrosswordBoardComponent,
    CrosswordGameComponent,
    CrosswordSidenavComponent,
    CrosswordCreateDialogComponent,
    CrosswordDataTreeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    CoreModule
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    CrosswordMakerService,
    CrosswordSettingsService,
  ]
})
export class SchoolModule { }
