import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecellHistoryComponent } from './freecell-history.component';

describe('FreecellHistoryComponent', () => {
  let component: FreecellHistoryComponent;
  let fixture: ComponentFixture<FreecellHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
