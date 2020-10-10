import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';

import { EditorSettingsService } from './services/editor-settings.service';
import { PathDataService } from './services/path-data.service';
import { EditorComponent } from './editor/editor.component';
import { PathGroupComponent } from './path-group/path-group.component';

/**
 * Routes:
 */
const routes: Routes = [
  { path: '', component: EditorComponent },
];

@NgModule({
  declarations: [EditorComponent, PathGroupComponent],
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
    EditorSettingsService, PathDataService
  ]
})
export class SvgPathEditorModule { }
