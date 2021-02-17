import { bezier3, randomInteger } from './math-utils';

export type SfxAnimation = {
  animation: (time: number, context: CanvasRenderingContext2D) => void;
  mouse?: { x: number; y: number };
};

export abstract class SfxAbstractAnimation implements SfxAnimation {
  lastFrameTime = 0;

  mouse?: { x: number; y: number };

  animation = (time: number, ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;

    if (this.lastFrameTime) {
      const dt = Math.min(time - this.lastFrameTime, 50) / 1000;
      this.update(dt, width, height);
      this.draw(ctx, width, height);
    } else {
      this.clear(ctx, width, height);
    }

    this.lastFrameTime = time;
  }

  abstract clear(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  abstract draw(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  abstract update(dt: number, width: number, height: number): void;
}

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
    const speed = (Math.min(w, h) / 10) * (1 + 1.75 * Math.random());

    this.vy = -speed * Math.cos(angle) - 2 * 10;
    this.vx = speed * Math.sin(angle);
    if (Math.random() < 0.5) {
      this.vx = -this.vx;
    }

    this.x += this.vx;

    this.fx = 0;
    this.fy = 0;
  }

  update(dt: number, attractor?: { x: number; y: number }) {
    this.age += dt;
    if (this.age >= 0 && this.age < this.ttl) {
      const t = this.age / this.ttl;
      this.radius = Math.max(
        1,
        (1 - bezier3(0.14, 0.68, 0.76, 0.94, t)) * this.radius0
      );

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

export class SfxParticles extends SfxAbstractAnimation {
  particleCount = 200;
  particleChance = 0.98765;
  particles: SfxParticle[] = [];

  nextBurstDelta = 3;

  clear(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, width, height);
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // clear
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, width, height);

    // draw
    ctx.globalCompositeOperation = 'lighter';
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }

  spawnParticles(count: number, width: number, height: number) {
    // Respawn any old particles.
    for (const particle of this.particles) {
      if (particle.age > particle.ttl) {
        if (count > 0) {
          particle.spawn(width, height);
        }
        if (--count <= 0) {
          return;
        }
      }
    }

    // Add new particles.
    while (count-- > 0 && this.particles.length < this.particleCount) {
      this.particles.push(new SfxParticle(width, height));
    }
  }

  update(dt: number, width: number, height: number) {
    if (this.particles.length > this.particleCount) {
      this.particles.length = this.particleCount;
    }

    let freeCount = this.particleCount - this.particles.length;
    // Update particles.
    for (const particle of this.particles) {
      particle.update(dt, this.mouse);
      if (particle.age > particle.ttl) {
        freeCount++;
      }
    }

    // Spawn new particles.
    this.nextBurstDelta -= dt;
    if (freeCount > 0) {
      if (this.nextBurstDelta <= 0) {
        const maxCount = Math.min(
          50,
          Math.max(Math.floor(this.particleCount / 3), 1)
        );
        const count = Math.min(freeCount, maxCount);
        this.spawnParticles(
          randomInteger(1 + Math.floor(count / 2), 1 + count),
          width,
          height
        );

        this.nextBurstDelta = 3 + Math.random() * 5;
      } else if (freeCount > this.particleCount / 2) {
        if (Math.random() > this.particleChance) {
          this.spawnParticles(1, width, height);
        }
      }
    }
  }
}

export class SfxLine {
  x: number;
  y: number;
  x0: number;
  y0: number;
  angle: number;
  speed: number;

  constructor(width: number, height: number) {
    this.x = Math.random() < 0.5 ? 0 : width;
    this.y = height;

    this.angle = 2 * Math.PI * Math.random();

    this.x0 = this.x;
    this.y0 = this.y;
  }

  update(
    dt: number,
    speed: number,
    width: number,
    height: number,
    attractor?: { x: number; y: number }
  ) {
    this.x0 = this.x;
    this.y0 = this.y;

    if (attractor) {
      this.angle = Math.atan2(attractor.x - this.x, attractor.y - this.y);
    }
    this.angle += 0.11 * Math.PI * (Math.random() - 0.5); // 20 / 180 * Math.PI * (Math.random() - 0.5)

    const ds = 0.25 * speed * (Math.random() - 0.5);
    const d = dt * (speed + ds);
    this.x += d * Math.sin(this.angle);
    this.y += d * Math.cos(this.angle);

    // Check if the particle is out of the box.
    if (this.x < 0) {
      // 0 + 10 > angle > 180 - 10
      this.angle = Math.PI * (0.05 + 0.9 * Math.random()); // randomInteger(10, 170 + 1) * Math.PI / 180;
      this.x = 0;
    } else if (this.x > width) {
      this.angle = Math.PI * (1.05 + 0.9 * Math.random()); // (180 + randomInteger(10, 170 + 1)) * Math.PI / 180;
      this.x = width;
    } else if (this.y < 0) {
      this.angle = Math.PI * (-0.45 + 0.9 * Math.random()); // randomInteger(-80, 80 + 1) * Math.PI / 180;
      this.y = 0;
    } else if (this.y > height) {
      // Note: We'll stick to the bottom.
      this.angle = Math.PI * (-0.45 + 0.9 * Math.random()); // randomInteger(-82, 82 + 1) * Math.PI / 180;
      this.y = height;
    }
  }
}

export class SfxLines extends SfxAbstractAnimation {
  particleCount = 250;
  particles: SfxLine[] = [];
  hue = Math.floor(360 * Math.random());
  speed = 100;

  clear(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, width, height);
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, .035)';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = 5;
    ctx.shadowColor = `hsl(${this.hue},100%,62%)`;
    ctx.strokeStyle = `hsl(${this.hue},100%,50%)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const particle of this.particles) {
      ctx.moveTo(particle.x0, particle.y0);
      ctx.lineTo(particle.x, particle.y);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  update(dt: number, width: number, height: number): void {
    if (++this.hue >= 360) {
      this.hue = 0;
    }

    if (this.particles.length < this.particleCount) {
      this.particles.push(new SfxLine(width, height));
    } else if (this.particles.length > this.particleCount) {
      this.particles.length = this.particleCount;
    }

    // Update particles.
    for (const particle of this.particles) {
      particle.update(dt, this.speed, width, height, this.mouse);
    }
  }
}
