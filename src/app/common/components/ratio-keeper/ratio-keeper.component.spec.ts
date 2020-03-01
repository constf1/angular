import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatioKeeperComponent } from './ratio-keeper.component';

describe('RatioKeeperComponent', () => {
  let component: RatioKeeperComponent;
  let fixture: ComponentFixture<RatioKeeperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatioKeeperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatioKeeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
