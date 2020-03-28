// tslint:disable: variable-name

function requestArrayBuffer(url: string, onprogress?: (event: ProgressEvent) => void): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true); // Set the request method, url and asynchronous flag.
    request.responseType = 'arraybuffer';
    request.onload = () => resolve(request.response);
    if (onprogress) {
      request.onprogress = onprogress;
    }
    request.onerror = (event) => reject(event);
    request.send();
  });
}

function decodeAudioData(context: AudioContext, data: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise<AudioBuffer>((resolve, reject) => {
    context.decodeAudioData(data, (buf: AudioBuffer) => resolve(buf), (error) => reject(error));
  });
}

export function loadAudioFiles(context: AudioContext, urls: Readonly<string[]>): Promise<AudioBuffer[]> {
  return new Promise<AudioBuffer[]>((resolve, reject) => {
    let count = urls.length;
    const buffers: AudioBuffer[] = new Array(urls.length);
    console.log(`Loading ${urls.length} track(s). Please wait...`);

    if (count === 0) {
      resolve([]);
    }

    urls.forEach((url: string, index: number) => {
      requestArrayBuffer(url)
        .then(data => decodeAudioData(context, data))
        .then(buf => {
          buffers[index] = buf;
          if (--count === 0) {
            // We are done.
            resolve(buffers);
          }
        })
        .catch((error) => reject(error));
    });
  });
}

/**
 * AudioLoader for loading multiple audio files asynchronously.
 * The callback function is called when all files have been loaded and decoded.
 */
export class AudioLoader {
  private _count = 0;
  private readonly _buffers: AudioBuffer[];

  get count() {
    return this._count;
  }

  constructor(
    readonly context: AudioContext,
    readonly urls: Readonly<string[]>,
    readonly callback: (buffers: AudioBuffer[]) => void
  ) {
    this._buffers = new Array(urls.length);
  }

  load() {
    console.log(`Loading ${this.urls.length} track(s). Please wait...`);
    this.urls.forEach((url, index) => {
      const onsuccess: DecodeSuccessCallback = (decodedData: AudioBuffer) => {
        console.log(
          `Loaded and decoded track ${this._count + 1}/${this.urls.length}...`
        );
        if (decodedData) {
          this._buffers[index] = decodedData;
          if (++this._count === this.urls.length) {
            // We are done. Call the callback and pass in the decoded buffers.
            this.callback(this._buffers);
          }
        } else {
          console.error('Error decoding audio data:', url);
        }
      };

      const onerror: DecodeErrorCallback = (error: DOMException) => {
        console.error('AudioLoader decode error:', error.message);
      };

      console.log(`  file: '${url}' loading and decoding...`);
      const request = new XMLHttpRequest();
      request.open('GET', url, true); // Set the request method, url and asynchronous flag.
      request.responseType = 'arraybuffer';
      request.onload = (_event: ProgressEvent) => {
        this.context.decodeAudioData(request.response, onsuccess, onerror);
      };
      request.onprogress = (event: ProgressEvent) => {
        if (event.total !== 0) {
          const percent = (event.loaded * 100) / event.total;
          console.log(`Loaded ${percent}% of ${url}`);
        }
      };
      request.onerror = (event: ProgressEvent) => {
        console.error('Error loading ' + url);
      };
      request.send();
    });
  }
}
