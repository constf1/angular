/* eslint-disable no-underscore-dangle */

import { Injectable, OnDestroy } from '@angular/core';

type SvgFile = {
  // IE GCs blobs once they're out of reference, even if they
  // have an object url, so we have to keep it in reference.
  blob: Blob;
  url: string;
};

const GC_INTERVAL_MS = 1000 * 60 * 10;
const POPUP_WINDOW_NAME = 'svg-file-window';
const POPUP_WINDOW_TITLE = 'SVG File';
const POPUP_WINDOW_FEATURES = 'toolbar=yes,scrollbars=yes,resizable=yes';

@Injectable()
export class SvgFileService implements OnDestroy {
  private _popupRef?: Window;
  private _items: SvgFile[] = [];
  private _timerID: ReturnType<typeof setInterval>;

  constructor() {
    this._timerID = setInterval(() => {
      if (this._popupRef?.closed) {
        this.clear();
      }
    }, GC_INTERVAL_MS);
  }

  next(viewBox: string, pathData: string) {
    // The xmlns attribute is required on the outermost svg element of SVG documents.
    const source =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">
  <title>${POPUP_WINDOW_TITLE} - ${new Date().toUTCString()}</title>
  <path d="${pathData}" />
</svg>`;

    const blob = new Blob([source], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);

    let ref = this._popupRef;
    if (ref && !ref.closed) {
      ref.location.assign(url);
      ref.focus();
    } else {
      this.clear();

      ref = this._popupRef = window.open(url, POPUP_WINDOW_NAME, POPUP_WINDOW_FEATURES);
    }

    this._items.push({ blob, url });
  }

  clear() {
    for (const item of this._items) {
      URL.revokeObjectURL(item.url);
    }
    this._items.length = 0;
    this._popupRef = undefined;
  }

  close() {
    clearInterval(this._timerID);
    this._timerID = undefined;
    this.clear();
  }

  ngOnDestroy(): void {
    this.close();
  }
}
