import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreecellPlaygroundComponent } from './freecell-playground.component';

describe('FreecellPlaygroundComponent', () => {
  let component: FreecellPlaygroundComponent;
  let fixture: ComponentFixture<FreecellPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
