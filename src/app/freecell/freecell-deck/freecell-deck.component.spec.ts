import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecellDeckComponent } from './freecell-deck.component';

describe('FreecellDeckComponent', () => {
  let component: FreecellDeckComponent;
  let fixture: ComponentFixture<FreecellDeckComponent>;

  beforeEach(waitForAsync(() => {
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
