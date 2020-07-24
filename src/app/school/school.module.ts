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

import { WordSearchGameComponent } from './english/word-search-game/word-search-game.component';
import { LetterBoardComponent } from './english/letter-board/letter-board.component';

/**
 * Routes:
 */
const routes: Routes = [
  { path: 'mental-math', component: MentalMathComponent },
  { path: 'word-puzzle', component: WordSearchGameComponent },
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
    LetterBoardComponent
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
})
export class SchoolModule { }
