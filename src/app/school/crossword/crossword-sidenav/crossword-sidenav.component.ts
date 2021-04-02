import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrosswordCreateDialogComponent } from '../crossword-create-dialog/crossword-create-dialog.component';
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

  constructor(public settings: CrosswordSettingsService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openCreateDialog() {
    this.dialog.open(CrosswordCreateDialogComponent);
  }

}
