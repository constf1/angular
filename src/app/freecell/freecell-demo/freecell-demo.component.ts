import { Component, OnInit } from '@angular/core';
import { PROJECT_NAME, VERSION } from 'src/environments/constants';



@Component({
  selector: 'app-freecell-demo',
  templateUrl: './freecell-demo.component.html',
  styleUrls: ['./freecell-demo.component.scss']
})
export class FreecellDemoComponent implements OnInit {
  readonly info = `${PROJECT_NAME} ver.${VERSION}`;

  constructor() { }

  ngOnInit(): void {
  }

}
