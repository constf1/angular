import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellMainComponent } from './freecell-main.component';

describe('FreecellMainComponent', () => {
  let component: FreecellMainComponent;
  let fixture: ComponentFixture<FreecellMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
