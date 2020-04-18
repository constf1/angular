import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';

import { PROJECT_NAME, VERSION } from 'src/environments/constants';
import { UnsubscribableComponent } from '../../common/unsubscribable-component';
import { FreecellSettingsService } from '../services/freecell-settings.service';

const DARK_THEME = 'app-dark-theme';

@Component({
  selector: 'app-freecell-demo',
  templateUrl: './freecell-demo.component.html',
  styleUrls: ['./freecell-demo.component.scss']
})
export class FreecellDemoComponent extends UnsubscribableComponent implements OnInit {
  readonly info = `${PROJECT_NAME} ver.${VERSION}`;

  constructor(public settings: FreecellSettingsService, router: Router, route: ActivatedRoute, overlayContainer: OverlayContainer) {
    super();

    // Change themes for overlay-based components (e.g. menu, select, dialog, etc.)
    settings.subscribe(state => {
      const src = settings.previousState?.enableDarkMode;
      const dst = state.enableDarkMode;
      if (src !== dst) {
        if (dst) {
          overlayContainer.getContainerElement().classList.add(DARK_THEME);
        } else {
          overlayContainer.getContainerElement().classList.remove(DARK_THEME);
        }
      }
    });

    // Navigate to a random game.
    const params = route.snapshot.queryParams;
    if (params.deal === undefined || isNaN(parseInt(params.deal, 10))) {
      router.navigate(['.'], { relativeTo: route, queryParams: { deal: Date.now() % 0x80000000 }});
    }
  }

  ngOnInit(): void {
  }
}
