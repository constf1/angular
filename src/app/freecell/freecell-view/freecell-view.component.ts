import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FreecellSettingsService } from '../services/freecell-settings.service';
import { FreecellSettingsDialogComponent } from '../freecell-settings-dialog/freecell-settings-dialog.component';

@Component({
  selector: 'app-freecell-view',
  templateUrl: './freecell-view.component.html',
  styleUrls: ['./freecell-view.component.scss']
})
export class FreecellViewComponent implements OnInit {

  constructor(public settings: FreecellSettingsService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openSettingsDialog() {
    // const dialogRef =
    this.dialog.open(FreecellSettingsDialogComponent);
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

}
