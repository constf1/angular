// tslint:disable: variable-name

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface PathSamples {
  [key: string]: string;
}

const ASSETS_URL = 'assets/svg-path-editor/';

@Component({
  selector: 'app-sample-dialog',
  templateUrl: './sample-dialog.component.html',
  styleUrls: ['./sample-dialog.component.scss']
})
export class SampleDialogComponent implements OnInit {
  samples: PathSamples;
  names: string[];
  selection: string;
  errorMessage: string;

  get selectedPath() {
    if (this.samples && this.selection) {
      return this.samples[this.selection];
    }
    return '';
  }

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    this._http.get<PathSamples>(ASSETS_URL + 'samples.json').subscribe(data => {
      this.names = Object.keys(data);
      this.samples = data;
    }, (error) => {
      this.errorMessage = 'HTTP load failed!';
      console.error('HTTP load error:', error);
    });
  }

  onItemClick(name: string) {
    if (this.selection === name) {
      this.selection = '';
    } else {
      this.selection = name;
    }
  }
}
