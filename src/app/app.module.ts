import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { RatioKeeperComponent } from './common/components/ratio-keeper/ratio-keeper.component';

import { FreecellMainComponent } from './freecell/freecell-main/freecell-main.component';
import { FreecellDeckComponent } from './freecell/freecell-deck/freecell-deck.component';

@NgModule({
  declarations: [
    AppComponent,
    FreecellMainComponent,
    FreecellDeckComponent,
    RatioKeeperComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
