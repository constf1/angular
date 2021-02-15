import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XrangePipe } from './pipes/xrange.pipe';

import { FocusDirective } from './directives/focus.directive';
import { GestureDirective } from './directives/gesture.directive';

import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { CanvasAnimationDirective } from './directives/canvas-animation.directive';

@NgModule({
  declarations: [
    CanvasAnimationDirective,
    FocusDirective,
    GestureDirective,
    TabGroupComponent,
    XrangePipe,
  ],
  exports: [
    CanvasAnimationDirective,
    FocusDirective,
    GestureDirective,
    TabGroupComponent,
    XrangePipe,
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
