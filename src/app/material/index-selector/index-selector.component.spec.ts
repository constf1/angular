import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSelectorComponent } from './index-selector.component';

describe('IndexSelectorComponent', () => {
  let component: IndexSelectorComponent;
  let fixture: ComponentFixture<IndexSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
