import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestureDirective } from './directives/gesture.directive';

import { XrangePipe } from './pipes/xrange.pipe';

@NgModule({
  declarations: [GestureDirective, XrangePipe],
  exports: [GestureDirective, XrangePipe],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
