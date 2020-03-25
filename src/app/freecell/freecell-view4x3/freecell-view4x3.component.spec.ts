import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellView4x3Component } from './freecell-view4x3.component';

describe('FreecellView4X3Component', () => {
  let component: FreecellView4x3Component;
  let fixture: ComponentFixture<FreecellView4x3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellView4x3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellView4x3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
