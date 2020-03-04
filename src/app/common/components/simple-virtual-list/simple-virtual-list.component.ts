import { Component, OnInit, Directive, TemplateRef, ContentChild, Input } from '@angular/core';

@Directive({
  selector: '[appSimpleVirtualListItem]'
})
export class SimpleVirtualListItemDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'app-simple-virtual-list',
  templateUrl: './simple-virtual-list.component.html',
  styleUrls: ['./simple-virtual-list.component.scss']
})
export class SimpleVirtualListComponent implements OnInit {
  // The virtually scrolling list items.
  @Input() items: string[] = [];
  @Input() itemTitles: string[]; // Optional.
  @Input() itemNames: string[]; // Optional.

  @ContentChild(SimpleVirtualListItemDirective, { static: false }) itemTemplate: SimpleVirtualListItemDirective;

  constructor() { }

  ngOnInit() {
  }

}
