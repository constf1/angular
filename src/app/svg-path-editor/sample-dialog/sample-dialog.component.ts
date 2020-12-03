// tslint:disable: variable-name

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface PathSamples {
  [key: string]: string;
}

interface Samples {
  [key: string]: PathSamples;
}

const ASSETS_URL = 'assets/svg-path-editor/';

@Component({
  selector: 'app-sample-dialog',
  templateUrl: './sample-dialog.component.html',
  styleUrls: ['./sample-dialog.component.scss']
})
export class SampleDialogComponent implements OnInit {
  samples: Samples;
  tabNames: string[];
  tabSelection = -1;
  tabItems: string[];
  selection = -1;
  errorMessage: string;

  get selectedPath() {
    if (this.samples && this.selection >= 0) {
      return this.getPathAt(this.selection);
    }
    return '';
  }

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    this._http.get<Samples>(ASSETS_URL + 'samples.json').subscribe(data => {
      this.tabNames = Object.keys(data);
      this.samples = data;
      this.onTabSelectionChange(0);
    }, (error) => {
      this.errorMessage = 'HTTP load failed!';
      console.error('HTTP load error:', error);
    });
  }

  onItemClick(index: number) {
    if (this.selection === index) {
      this.selection = -1;
    } else {
      this.selection = index;
    }
  }

  onTabSelectionChange(value: number) {
    if (this.tabSelection !== value) {
      this.tabSelection = value;
      this.tabItems = Object.keys(this.samples[this.tabNames[value]]);
      this.selection = -1;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  getPathAt(index: number): string {
    const tabKey = this.tabNames[this.tabSelection];
    const tab = this.samples[tabKey];
    if (tab) {
      return tab[this.tabItems[index]];
    }
    return '';
  }
}
