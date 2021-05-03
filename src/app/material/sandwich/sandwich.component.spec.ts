import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SandwichComponent } from './sandwich.component';

describe('SandwichComponent', () => {
  let component: SandwichComponent;
  let fixture: ComponentFixture<SandwichComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SandwichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandwichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
