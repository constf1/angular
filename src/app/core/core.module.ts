import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XrangePipe } from './pipes/xrange.pipe';

import { FocusDirective } from './directives/focus.directive';
import { GestureDirective } from './directives/gesture.directive';

import { TabGroupComponent } from './components/tab-group/tab-group.component';

@NgModule({
  declarations: [
    FocusDirective,
    GestureDirective,
    TabGroupComponent,
    XrangePipe,
  ],
  exports: [
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
