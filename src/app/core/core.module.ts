import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XrangePipe } from './pipes/xrange.pipe';

import { FocusDirective } from './directives/focus.directive';
import { GestureDirective } from './directives/gesture.directive';

import { SfxParticlesComponent } from './components/sfx-particles/sfx-particles.component';
import { TabGroupComponent } from './components/tab-group/tab-group.component';

@NgModule({
  declarations: [
    FocusDirective,
    GestureDirective,
    SfxParticlesComponent,
    TabGroupComponent,
    XrangePipe,
  ],
  exports: [
    FocusDirective,
    GestureDirective,
    SfxParticlesComponent,
    TabGroupComponent,
    XrangePipe,
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
