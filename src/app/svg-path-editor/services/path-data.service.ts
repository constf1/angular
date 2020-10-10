// tslint:disable: variable-name

import { Injectable } from '@angular/core';

import { PathModel } from '../path-model';

@Injectable()
export class PathDataService {
  private _pathDataInput = '';
  private _pathModel = new PathModel();

  constructor() { }
}
