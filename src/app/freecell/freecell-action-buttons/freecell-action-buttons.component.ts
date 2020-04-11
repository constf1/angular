import { Component, OnInit, Input } from '@angular/core';
import { FreecellActionService } from '../services/freecell-action.service';

@Component({
  selector: 'app-freecell-action-buttons',
  templateUrl: './freecell-action-buttons.component.html',
  styleUrls: ['./freecell-action-buttons.component.scss']
})
export class FreecellActionButtonsComponent implements OnInit {
  @Input() noLabel = false;

  constructor(public actionService: FreecellActionService) {
  }

  ngOnInit(): void {
  }
}
