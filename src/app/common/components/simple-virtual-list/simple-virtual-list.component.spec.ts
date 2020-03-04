import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleVirtualListComponent } from './simple-virtual-list.component';

describe('SimpleVirtualListComponent', () => {
  let component: SimpleVirtualListComponent;
  let fixture: ComponentFixture<SimpleVirtualListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleVirtualListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleVirtualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
