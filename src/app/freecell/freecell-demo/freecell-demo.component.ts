import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PROJECT_NAME, VERSION } from 'src/environments/constants';

@Component({
  selector: 'app-freecell-demo',
  templateUrl: './freecell-demo.component.html',
  styleUrls: ['./freecell-demo.component.scss']
})
export class FreecellDemoComponent implements OnInit {
  readonly info = `${PROJECT_NAME} ver.${VERSION}`;

  constructor(router: Router, route: ActivatedRoute) {
    const params = route.snapshot.queryParams;
    if (params.deal === undefined || isNaN(parseInt(params.deal, 10))) {
      router.navigate(['.'], { relativeTo: route, queryParams: { deal: Date.now() % 0x80000000 }});
    }
  }

  ngOnInit(): void {
  }
}
