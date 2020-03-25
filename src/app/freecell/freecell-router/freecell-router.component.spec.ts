import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellRouterComponent } from './freecell-router.component';

describe('FreecellRouterComponent', () => {
  let component: FreecellRouterComponent;
  let fixture: ComponentFixture<FreecellRouterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
