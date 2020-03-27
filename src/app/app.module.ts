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
import { FreecellSandwichComponent } from './freecell/freecell-sandwich/freecell-sandwich.component';
import { FreecellDealMenuComponent } from './freecell/freecell-deal-menu/freecell-deal-menu.component';
import { FreecellHistoryComponent } from './freecell/freecell-history/freecell-history.component';
import { FreecellSidenavComponent } from './freecell/freecell-sidenav/freecell-sidenav.component';
import { FreecellViewComponent } from './freecell/freecell-view/freecell-view.component';
import { FreecellSettingsDialogComponent } from './freecell/freecell-settings-dialog/freecell-settings-dialog.component';

/**
 * Routes:
 */
const appRoutes: Routes = [
  { path: 'freecell-sandwich', component: FreecellSandwichComponent },
  { path: 'freecell-sidenav', component: FreecellSidenavComponent },
  { path: 'freecell-main', component: FreecellMainComponent },
  { path: 'freecell-view', component: FreecellViewComponent },

  { path: '', redirectTo: '/freecell-view', pathMatch: 'full' },
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
    SimpleVirtualListItemDirective,
    FreecellRouterComponent,
    FreecellSidenavComponent,
    FreecellActionButtonsComponent,
    FreecellSandwichComponent,
    FreecellDealMenuComponent,
    FreecellViewComponent,
    FreecellSettingsDialogComponent
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
