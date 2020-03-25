import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';

import { XrangePipe } from './common/pipes/xrange.pipe';
import { RatioKeeperComponent } from './common/components/ratio-keeper/ratio-keeper.component';

import {
  SimpleVirtualListComponent,
  SimpleVirtualListItemDirective
} from './common/components/simple-virtual-list/simple-virtual-list.component';

import { FreecellMainComponent } from './freecell/freecell-main/freecell-main.component';
import { FreecellDeckComponent } from './freecell/freecell-deck/freecell-deck.component';
import { FreecellRouterComponent } from './freecell/freecell-router/freecell-router.component';
import { FreecellActionButtonsComponent } from './freecell/freecell-action-buttons/freecell-action-buttons.component';
import { FreecellView4x3Component } from './freecell/freecell-view4x3/freecell-view4x3.component';
import { FreecellDealMenuComponent } from './freecell/freecell-deal-menu/freecell-deal-menu.component';
import { FreecellHistoryComponent } from './freecell/freecell-history/freecell-history.component';
import { FreecellSidenavComponent } from './freecell/freecell-sidenav/freecell-sidenav.component';

// import { FreecellActionListComponent } from './freecell/freecell-action-list/freecell-action-list.component';
// import { FreecellGridComponent } from './freecell/freecell-grid/freecell-grid.component';

/**
 * Routes:
 */
const appRoutes: Routes = [
  { path: 'freecell-view-4x3', component: FreecellView4x3Component },
  { path: 'freecell-sidenav', component: FreecellSidenavComponent },
  // { path: 'freecell-grid', component: FreecellGridComponent },
  { path: 'freecell-dom', component: FreecellMainComponent },
  { path: '', redirectTo: '/freecell-sidenav', pathMatch: 'full' },
  // { path: '', redirectTo: '/freecell-dom', pathMatch: 'full' },
  { path: '**', component: FreecellMainComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    // FreecellActionListComponent,
    FreecellMainComponent,
    FreecellDeckComponent,
    RatioKeeperComponent,
    FreecellHistoryComponent,
    XrangePipe,
    SimpleVirtualListComponent,
    SimpleVirtualListItemDirective,
    FreecellRouterComponent,
    FreecellSidenavComponent,
    FreecellActionButtonsComponent,
    // FreecellGridComponent,
    FreecellView4x3Component,
    FreecellDealMenuComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {
      // enableTracing: true, // <-- debugging purposes only
    }),
    BrowserModule,
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
