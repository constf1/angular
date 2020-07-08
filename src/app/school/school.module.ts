import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

export const MODULE_NAME = 'school-demo';
export const MODULE_VERSION = '0.0.3';

/**
 * Routes:
 */
const routes: Routes = [
  { path: 'mental-math', component: MentalMathComponent },
  { path: 'simple-math', component: SimpleAdditionComponent },
  { path: '', component: MentalMathComponent },
];

@NgModule({
  declarations: [
    SquaredPaperComponent,
    MentalMathComponent,
    NumpadComponent,
    MathInputGroupComponent,
    SimpleAdditionComponent,
    MathExpressionDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MaterialModule,
    CoreModule
  ],
  exports: [
    RouterModule,
  ],
})
export class SchoolModule { }
