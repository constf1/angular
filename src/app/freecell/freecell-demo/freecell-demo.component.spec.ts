import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecellDemoComponent } from './freecell-demo.component';

describe('FreecellDemoComponent', () => {
  let component: FreecellDemoComponent;
  let fixture: ComponentFixture<FreecellDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
