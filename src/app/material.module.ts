import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,

    MatButtonModule,
    MatIconModule,
    MatSliderModule
  ],
  exports: [
    BrowserAnimationsModule,

    MatButtonModule,
    MatIconModule,
    MatSliderModule
  ]
})
export class MaterialModule { }
