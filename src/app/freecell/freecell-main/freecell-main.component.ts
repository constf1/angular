// tslint:disable: variable-name
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { UnsubscribableComponent } from '../../common/unsubscribable-component';

// import { FreecellGameView } from '../freecell-game';
import { FreecellLayout } from '../freecell-layout';
// import { FreecellDbService } from '../freecell-db.service';
import { LineChangeEvent } from '../freecell-deck/freecell-deck.component';
import { FreecellGameService } from '../services/freecell-game.service';
import { FreecellAutoplayService } from '../services/freecell-autoplay.service';
import { FreecellSettingsService } from '../services/freecell-settings.service';

@Component({
  selector: 'app-freecell-main',
  templateUrl: './freecell-main.component.html',
  styleUrls: ['./freecell-main.component.scss']
})
export class FreecellMainComponent extends UnsubscribableComponent implements OnInit, OnDestroy {
  // @Input() aspectRatio = 0.56; // iphone 6/7/8
  layout: FreecellLayout;

  constructor(
    public settings: FreecellSettingsService,
    // private _dbService: FreecellDbService,
    private _gameService: FreecellGameService,
    private _playService: FreecellAutoplayService) {
    super();
  }

  ngOnInit() {
    // Set standard freecell basis.
    this._gameService.set({ base: 4, cell: 4, pile: 8 });

    this._addSubscription(this._gameService.stateChange.subscribe(state => {
      if (state.game) {
        if (!this.layout) {
          this.layout = new FreecellLayout(state.game);
        }
      } else {
        this.layout = null;
      }
    }));
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onLineChange(event: LineChangeEvent) {
    // console.log('Line Change Event:', event);
    this._playService.stop();
    const game = this._gameService.state.game;
    if (!game) {
      return;
    }

    let path = '';
    if (event.destination === undefined) {
      path = game.solveFor(event.tableau, event.source);
    } else {
      path = game.getBestPath(event.tableau, event.destination);
    }
    if (path) {
      // console.log(path);
      this._gameService.move(path.charCodeAt(0), path.charCodeAt(1));
      // this.onMoveCard(path.charCodeAt(0), path.charCodeAt(1),
      //   path.length > 2 || event.destination !== undefined);
      path = path.substring(2);

      if (path) {
        this._playService.play(() => {
          this._gameService.move(path.charCodeAt(0), path.charCodeAt(1));
          path = path.substring(2);
          return path.length > 0;
        });
      }
    }
  }
}
