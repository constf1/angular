import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { TabListComponent } from './components/tab-list/tab-list.component';

import { CanvasAnimationDirective } from './directives/canvas-animation.directive';
import { FocusDirective } from './directives/focus.directive';
import { GestureDirective } from './directives/gesture.directive';

import { XrangePipe } from './pipes/xrange.pipe';

@NgModule({
  declarations: [
    CanvasAnimationDirective,
    FocusDirective,
    GestureDirective,
    TabGroupComponent,
    TabListComponent,
    XrangePipe,
  ],
  exports: [
    CanvasAnimationDirective,
    FocusDirective,
    GestureDirective,
    TabGroupComponent,
    TabListComponent,
    XrangePipe,
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
