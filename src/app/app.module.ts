import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { XrangePipe } from './common/pipes/xrange.pipe';

import { RatioKeeperComponent } from './common/components/ratio-keeper/ratio-keeper.component';
import {
  SimpleVirtualListComponent,
  SimpleVirtualListItemDirective
} from './common/components/simple-virtual-list/simple-virtual-list.component';

import { FreecellMainComponent } from './freecell/freecell-main/freecell-main.component';
import { FreecellDeckComponent } from './freecell/freecell-deck/freecell-deck.component';
import { FreecellHistoryComponent } from './freecell/freecell-history/freecell-history.component';

@NgModule({
  declarations: [
    AppComponent,
    FreecellMainComponent,
    FreecellDeckComponent,
    RatioKeeperComponent,
    FreecellHistoryComponent,
    XrangePipe,
    SimpleVirtualListComponent,
    SimpleVirtualListItemDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
