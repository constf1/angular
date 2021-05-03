import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreecellSettingsDialogComponent } from './freecell-settings-dialog.component';

describe('FreecellSettingsDialogComponent', () => {
  let component: FreecellSettingsDialogComponent;
  let fixture: ComponentFixture<FreecellSettingsDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreecellSettingsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreecellSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
