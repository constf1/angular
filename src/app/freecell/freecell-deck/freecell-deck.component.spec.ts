import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellDeckComponent } from './freecell-deck.component';

describe('FreecellDeckComponent', () => {
  let component: FreecellDeckComponent;
  let fixture: ComponentFixture<FreecellDeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
