import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestureDirective } from './directives/gesture.directive';

import { XrangePipe } from './pipes/xrange.pipe';
import { FocusDirective } from './directives/focus.directive';

@NgModule({
  declarations: [
    FocusDirective,
    GestureDirective,
    XrangePipe,
  ],
  exports: [
    FocusDirective,
    GestureDirective,
    XrangePipe,
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
