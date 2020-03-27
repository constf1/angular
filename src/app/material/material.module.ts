import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';


import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SandwichComponent } from './sandwich/sandwich.component';

@NgModule({
  declarations: [SandwichComponent],
  imports: [
    BrowserAnimationsModule,
    LayoutModule,

    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatToolbarModule
  ],
  exports: [
    BrowserAnimationsModule,
    LayoutModule,

    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatToolbarModule,

    SandwichComponent
  ]
})
export class MaterialModule { }
