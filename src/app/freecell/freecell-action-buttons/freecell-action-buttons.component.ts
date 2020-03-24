// tslint:disable: variable-name
import { Component, OnInit, Input } from '@angular/core';

import { UnsubscribableComponent } from '../../common/unsubscribable-component';

import { FreecellGameService } from '../freecell-game.service';
import { FreecellAutoplayService } from '../freecell-autoplay.service';

@Component({
  selector: 'app-freecell-action-buttons',
  templateUrl: './freecell-action-buttons.component.html',
  styleUrls: ['./freecell-action-buttons.component.scss']
})
export class FreecellActionButtonsComponent extends UnsubscribableComponent implements OnInit {
  @Input() noLabel = false;

  canUndo = false;
  canRedo = false;
  canAuto = false;

  constructor(private _gameService: FreecellGameService, private _playService: FreecellAutoplayService) {
    super();
  }

  ngOnInit(): void {
    this._addSubscription(this._gameService.state.subscribe(state => {
      this.canUndo = state.mark > 0;
      this.canRedo = state.mark + state.mark < state.path.length;
      this.canAuto = false;
      if (state.game) {
        state.game.findMoves((source, destination) => {
          if (state.game.isBase(destination)) {
            this.canAuto = true;
            return true;
          }
          return false;
        });
      }
    }));
  }

  undo() {
    if (this.canUndo) {
      this._gameService.undo();
    }
  }

  redo() {
    if (this.canRedo) {
      this._gameService.redo();
    }
  }

  auto() {
    if (this.auto) {
      this._playService.play(() => {
        const game = this._gameService.value.game;
        if (game) {
          let giver = -1;
          let taker = -1;
          game.findMoves((g, t) => {
            if (game.isBase(t)) {
              giver = g;
              taker = t;
              return true; // stop the search
            }
            return false;
          });
          if (giver >= 0 && taker >= 0) {
            this._gameService.move(giver, taker);
            return true;
          }
        }
        return false;
      });
    }
  }

}
