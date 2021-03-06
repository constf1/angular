import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecellDealMenuComponent } from './freecell-deal-menu.component';

describe('FreecellDealMenuComponent', () => {
  let component: FreecellDealMenuComponent;
  let fixture: ComponentFixture<FreecellDealMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellDealMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellDealMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
