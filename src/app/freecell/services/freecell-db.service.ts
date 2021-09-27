/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { Injectable } from '@angular/core';
import { getDate } from '../../common/date-utils';

const DB_NAME = 'freecell-db';
const DB_VERSION = 1;

type StoreName = 'game';
const GAME_STORE_NAME: StoreName = 'game';

export interface FreecellGame {
  deal: number;
  path: string;
  date?: string; // Date in 'YYYY-MM-DD HH:mm:ss' format
}

function toPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error.message);
  });
}

@Injectable()
export class FreecellDbService {
  openError: string;

  get isOpen(): boolean {
    return !!this._db;
  }

  private _openPromise: Promise<void>; // Note: .then() may be called many times on the same promise.

  // Our connection to the database.
  private _db: IDBDatabase;

  constructor() {
    this._openPromise = new Promise<void>((resolve, reject) => {
      const request: IDBOpenDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = event => {
        this.onOpenError(request);
        reject(request.error.message);
      };
      request.onupgradeneeded = event => this.onUpgradeNeeded(request);
      request.onsuccess = event => {
        this.onOpenSuccess(request);
        resolve();
      };
    });
  }

  onOpenSuccess(request: IDBOpenDBRequest) {
    this._db = request.result;
    console.log('DB open success:', request.result.name);
  }

  onOpenError(request: IDBOpenDBRequest) {
    this.openError = 'DB open error: ' + request.error.message;
    console.error('DB Error:', request.error);
  }

  // Handles the event whereby a new version of the database needs to be created.
  // Either one has not been created before, or a new version number has been submitted
  // via the window.indexedDB.open.
  onUpgradeNeeded(request: IDBOpenDBRequest) {
    this._db = request.result;

    // Create an objectStore for this database.
    // Records within an object store are sorted according to their keys.
    // This sorting enables fast insertion, look-up, and ordered retrieval.
    const store = this._db.createObjectStore(GAME_STORE_NAME, { keyPath: 'deal', autoIncrement: false });

    // define what data items the objectStore will contain
    store.createIndex('date', 'date', { unique: false });
    // store.createIndex('name', 'name', { unique: false });
  }

  getGame(deal: IDBValidKey): Promise<FreecellGame> {
    return this._getStore(GAME_STORE_NAME, 'readonly').then(store => toPromise(store.get(deal)));
  }

  setGame(game: FreecellGame): Promise<IDBValidKey> {
    if (!game.date) {
      game.date = getDate();
    }
    return this._getStore(GAME_STORE_NAME, 'readwrite').then(store => toPromise(store.put(game)));
  }

  private _createTransaction(
    storeNames: string | string[],
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBTransaction> {
    return this._openPromise.then(() => this._db.transaction(storeNames, mode));
  }

  private _getStore(
    name: StoreName,
    mode: IDBTransactionMode = 'readonly'
  ): Promise<IDBObjectStore> {
    return this._createTransaction([name], mode).then(transaction => transaction.objectStore(name));
  }
}
