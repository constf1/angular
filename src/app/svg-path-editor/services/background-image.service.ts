/* eslint-disable no-underscore-dangle */

import { Injectable } from '@angular/core';

const KEY = '[svg-path-editor.background-image]';
const SAVE_LIMIT = 0xffff;

@Injectable()
export class BackgroundImageService {
  private _imageData = '';

  // Image as dataURL
  get imageData() {
    return this._imageData;
  }

  constructor() {
    this._imageData = this.loadSavedImage();
  }

  loadImage(event: Event) {
    const target = event.target as EventTarget & { files: FileList };
    if (target && target.files[0]) {
      const file: File = target.files[0];
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (ev: ProgressEvent) => {
          if (typeof reader.result === 'string') {
            this._imageData = reader.result;
            if (this._imageData.length < SAVE_LIMIT) {
              this.saveImage();
            } else {
              this.clearSavedImage();
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  clearImage() {
    this._imageData = '';
    this.clearSavedImage();
  }

  clearSavedImage() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }

  saveImage() {
    try {
      localStorage.setItem(KEY, this._imageData);
    } catch (e) {
      console.warn('localStorage error:', e);
    }
  }

  loadSavedImage() {
    try {
      const data = localStorage?.getItem(KEY);
      if (typeof data === 'string') {
        return data;
      }
    } catch (e) {
      console.warn('localStorage error:', e);
    }
    return '';
  }
}
