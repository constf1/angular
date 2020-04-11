import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellActionButtonsComponent } from './freecell-action-buttons.component';

describe('FreecellActionButtonsComponent', () => {
  let component: FreecellActionButtonsComponent;
  let fixture: ComponentFixture<FreecellActionButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellActionButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
