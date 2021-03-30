import { Component, OnInit } from '@angular/core';
import { CrosswordSettingsService } from '../services/crossword-settings.service';

@Component({
  selector: 'app-crossword-sidenav',
  templateUrl: './crossword-sidenav.component.html',
  styleUrls: ['./crossword-sidenav.component.scss']
})
export class CrosswordSidenavComponent implements OnInit {

  get mode() {
    return this.settings.state.sidenavModeSide ? 'side' : 'over';
  }

  get closed() {
    return this.settings.state.sidenavClosed;
  }

  get opened() {
    return !this.settings.state.sidenavClosed;
  }

  constructor(public settings: CrosswordSettingsService) { }

  ngOnInit(): void {
  }

}
