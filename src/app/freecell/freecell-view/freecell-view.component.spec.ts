import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellViewComponent } from './freecell-view.component';

describe('FreecellViewComponent', () => {
  let component: FreecellViewComponent;
  let fixture: ComponentFixture<FreecellViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
