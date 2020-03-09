import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,

    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatToolbarModule
  ],
  exports: [
    BrowserAnimationsModule,

    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatSliderModule,
    MatToolbarModule
  ]
})
export class MaterialModule { }
