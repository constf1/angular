import { Component, EventEmitter, Output } from '@angular/core';
import { EditorSettingsService, FE_COLOR_MATRICES, maxState, minState } from '../services/editor-settings.service';
import { BackgroundImageService } from '../services/background-image.service';

@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.scss']
})
export class MenuViewComponent {
  @Output() requestSmallestViewBox = new EventEmitter<boolean>();

  tabSelection = 0;

  zooms: { label: string; value: number}[]  = [
    {label: '1:4', value: 25 },
    {label: '1:2', value: 50 },
    {label: '1:1', value: 100 },
    {label: '2:1', value: 200 },
    {label: '4:1', value: 400 },
  ];

  controlPointMinSize = minState.controlPointSize;
  controlPointMaxSize = maxState.controlPointSize;

  get zoom() {
    return this.settings.state.zoom;
  }

  set zoom(value: number) {
    this.settings.set({ zoom: value });
  }

  imageColorMatrixNames = Object.keys(FE_COLOR_MATRICES);

  constructor(public settings: EditorSettingsService, public background: BackgroundImageService) { }
}
