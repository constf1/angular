import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

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

/**
 * Routes:
 */
const appRoutes: Routes = [
  { path: 'freecell-dom/:id', component: FreecellMainComponent },
  { path: '', redirectTo: '/freecell-dom', pathMatch: 'full' },
  { path: '**', component: FreecellMainComponent }
];

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
    RouterModule.forRoot(appRoutes, {
      // enableTracing: true, // <-- debugging purposes only
    }),
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
