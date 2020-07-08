import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { CoreModule } from '../core/core.module';

import { FreecellActionService } from './services/freecell-action.service';
import { FreecellAutoplayService } from './services/freecell-autoplay.service';
import { FreecellBasisService } from './services/freecell-basis.service';
import { FreecellDbService } from './services/freecell-db.service';
import { FreecellGameService } from './services/freecell-game.service';
import { FreecellSettingsService } from './services/freecell-settings.service';
import { FreecellSoundService } from './services/freecell-sound.service';

import { FreecellMainComponent } from './freecell-main/freecell-main.component';
import { FreecellDeckComponent } from './freecell-deck/freecell-deck.component';
import { FreecellRouterComponent } from './freecell-router/freecell-router.component';
import { FreecellSidenavComponent } from './freecell-sidenav/freecell-sidenav.component';
import { FreecellActionButtonsComponent } from './freecell-action-buttons/freecell-action-buttons.component';
import { FreecellSandwichComponent } from './freecell-sandwich/freecell-sandwich.component';
import { FreecellDealMenuComponent } from './freecell-deal-menu/freecell-deal-menu.component';
import { FreecellViewComponent } from './freecell-view/freecell-view.component';
import { FreecellSettingsDialogComponent } from './freecell-settings-dialog/freecell-settings-dialog.component';
import { FreecellHistoryComponent } from './freecell-history/freecell-history.component';
import { FreecellDemoComponent } from './freecell-demo/freecell-demo.component';
import { FreecellPlaygroundComponent } from './freecell-playground/freecell-playground.component';

export const MODULE_NAME = 'freecell-demo';
export const MODULE_VERSION = '0.2.2';

/**
 * Routes:
 */
const routes: Routes = [
  { path: '', component: FreecellDemoComponent },
];

@NgModule({
  declarations: [
    FreecellMainComponent,
    FreecellDeckComponent,
    FreecellRouterComponent,
    FreecellSidenavComponent,
    FreecellActionButtonsComponent,
    FreecellSandwichComponent,
    FreecellDealMenuComponent,
    FreecellViewComponent,
    FreecellSettingsDialogComponent,
    FreecellHistoryComponent,
    FreecellDemoComponent,
    FreecellPlaygroundComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    MaterialModule,
    CoreModule
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    FreecellActionService,
    FreecellAutoplayService,
    FreecellBasisService,
    FreecellDbService,
    FreecellSoundService,
    FreecellGameService,
    FreecellSettingsService,
  ]
})
export class FreecellModule { }
