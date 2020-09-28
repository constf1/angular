import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';

import { EditorComponent } from './editor/editor.component';

/**
 * Routes:
 */
const routes: Routes = [
  { path: '', component: EditorComponent },
];

@NgModule({
  declarations: [EditorComponent],
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
  ]
})
export class SvgPathEditorModule { }
