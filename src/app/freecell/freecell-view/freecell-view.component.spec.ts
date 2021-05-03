import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecellViewComponent } from './freecell-view.component';

describe('FreecellViewComponent', () => {
  let component: FreecellViewComponent;
  let fixture: ComponentFixture<FreecellViewComponent>;

  beforeEach(waitForAsync(() => {
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
