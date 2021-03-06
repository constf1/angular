import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';

import { BackgroundImageService } from './services/background-image.service';
import { EditorSettingsService } from './services/editor-settings.service';
import { PathDataService } from './services/path-data.service';
import { SvgFileService } from './services/svg-file.service';

import { EditorComponent } from './editor/editor.component';
import { MenuTransformComponent } from './menu-transform/menu-transform.component';
import { MenuViewComponent } from './menu-view/menu-view.component';
import { PathGroupComponent } from './path-group/path-group.component';
import { PathItemComponent } from './path-item/path-item.component';
import { SampleDialogComponent } from './sample-dialog/sample-dialog.component';
import { SvgOpenDialogComponent } from './svg-open-dialog/svg-open-dialog.component';
import { SvgViewComponent } from './svg-view/svg-view.component';
import { LocationAdjusterComponent } from './location-adjuster/location-adjuster.component';

/**
 * Routes:
 */
const routes: Routes = [
  { path: '', component: EditorComponent },
];

@NgModule({
  declarations: [
    EditorComponent,
    MenuTransformComponent,
    MenuViewComponent,
    PathGroupComponent,
    PathItemComponent,
    SampleDialogComponent,
    SvgOpenDialogComponent,
    SvgViewComponent,
    LocationAdjusterComponent,
  ],
  entryComponents: [SampleDialogComponent],
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
    BackgroundImageService,
    EditorSettingsService,
    PathDataService,
    SvgFileService
  ]
})
export class SvgPathEditorModule { }
