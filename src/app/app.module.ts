import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlaygroundComponent } from './playground/playground.component';
import { KeyedElementDirective } from './common/keyed-element.directive';

@NgModule({
  declarations: [
    AppComponent,
    PlaygroundComponent,
    KeyedElementDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
