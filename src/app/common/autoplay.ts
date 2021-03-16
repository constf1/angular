export class Autoplay {
  private timerID: ReturnType<typeof setTimeout>;

  get ended() {
    return this.timerID === undefined;
  }

  constructor(public timeout?: number) { }

  stop() {
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = undefined;
    }
  }

  play(callback: () => (boolean | void)) {
    this.stop();
    this.timerID = setTimeout(() => {
      this.timerID = undefined;
      if (callback()) {
        this.play(callback);
      }
    }, this.timeout);
  }
}
