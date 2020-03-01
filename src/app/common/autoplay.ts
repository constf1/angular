export class Autoplay {
  private timerID;

  get ended() {
    return this.timerID === undefined;
  }

  constructor(public timeout?: number) {}

  stop() {
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = undefined;
    }
  }

  play(callback: () => boolean) {
    this.stop();
    this.timerID = setTimeout(() => {
      this.timerID = undefined;
      if (callback()) {
        this.play(callback);
      }
    }, this.timeout);
  }
}
