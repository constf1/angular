import { bezier3, randomInteger } from 'src/app/common/math-utils';

export class SfxParticle {
  static nextHue = 200;

  age: number;
  ttl: number;
  hue: number;
  radius0: number;
  radius: number;

  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number;
  fy: number;

  constructor(w: number, h: number) {
    this.spawn(w, h);
  }

  spawn(w: number, h: number) {
    this.hue = SfxParticle.nextHue;
    SfxParticle.nextHue = (SfxParticle.nextHue + 1) % 360;

    this.radius = this.radius0 = randomInteger(6, 20);

    this.age = -3 * bezier3(0.8, 0, 0.2, 1, Math.random());
    this.ttl = 4 + Math.random() * 6;

    this.x = w / 2;
    this.y = h;

    const angle = Math.atan2(w / 2, h) * Math.random();
    const speed = Math.min(w, h) / 10 * (1 + 1.75 * Math.random());

    this.vy = -speed * Math.cos(angle) - 2 * 10;
    this.vx = speed * Math.sin(angle);
    if (Math.random() < 0.5) {
      this.vx = -this.vx;
    }

    this.x += this.vx;

    this.fx = 0;
    this.fy = 0;
  }

  update(dt: number, attractor?: { x: number, y: number }) {
    this.age += dt;
    if (this.age >= 0 && this.age < this.ttl) {
      const t = this.age / this.ttl;
      this.radius = Math.max(1, (1 - bezier3(.14, 0.68, 0.76, 0.94, t)) * this.radius0);

      this.x += this.vx * dt;
      this.y += this.vy * dt;

      this.vx += this.fx * dt;
      this.vy += this.fy * dt;

      this.fx = 0;
      this.fy = 0;

      if (attractor) {
        const coef = 0.5;

        let fx = coef * (attractor.x - this.x);
        let fy = coef * (attractor.y - this.y);

        const dot = fx * this.vx + fy * this.vy;
        if (dot < 0) {
          fx *= Math.abs(fx);
          fy *= Math.abs(fy);
        }

        this.fx += fx;
        this.fy += fy;
      } else {
        // add gravity
        this.fy += 10;
      }

      // add drag
      const drag = -0.0025;
      this.fx += drag * this.vx * Math.abs(this.vx);
      this.fy += drag * this.vy * Math.abs(this.vy);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.age >= 0 && this.age < this.ttl) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 40%, 1)`;
      ctx.fill();
      ctx.closePath();
    }
  }
}
