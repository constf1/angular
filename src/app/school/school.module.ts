import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { CoreModule } from '../core/core.module';

import { SquaredPaperComponent } from './squared-paper/squared-paper.component';
import { MentalMathComponent } from './math/grade-3/mental-math/mental-math.component';

/**
 * Routes:
 */
const routes: Routes = [
  { path: 'mental-math', component: MentalMathComponent },
  { path: '', component: MentalMathComponent },
];

@NgModule({
  declarations: [SquaredPaperComponent, MentalMathComponent],
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
