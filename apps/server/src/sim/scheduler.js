class TickScheduler {
  constructor({ tickDurationMs = 1000, onTick }) {
    this.tickDurationMs = tickDurationMs;
    this.onTick = onTick;
    this.timer = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.timer = setInterval(() => {
      this.onTick();
    }, this.tickDurationMs);
  }

  stop() {
    if (!this.running) return;
    clearInterval(this.timer);
    this.timer = null;
    this.running = false;
  }

  setTickDuration(ms) {
    this.tickDurationMs = ms;
    if (this.running) {
      this.stop();
      this.start();
    }
  }
}

module.exports = {
  TickScheduler,
};
