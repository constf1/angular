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
