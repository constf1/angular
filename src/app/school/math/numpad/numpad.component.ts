import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss']
})
export class NumpadComponent implements OnInit {
  @Input() buttonNames: string[] = [];
  @Output() selectionChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }
}
