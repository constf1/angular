import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecellSidenavComponent } from './freecell-sidenav.component';

describe('FreecellSidenavComponent', () => {
  let component: FreecellSidenavComponent;
  let fixture: ComponentFixture<FreecellSidenavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
