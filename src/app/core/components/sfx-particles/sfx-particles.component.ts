// tslint:disable: variable-name
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { randomInteger } from 'src/app/common/math-utils';

import { SfxParticle } from './sfx-particle';

@Component({
  selector: 'app-sfx-particles',
  template: '<canvas #canvasRef></canvas>'
})
export class SfxParticlesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() width = 320;
  @Input() height = 240;
  @Input() particleCount = 200;
  @Input() particleChance = 0.98765;
  @Input() attractor?: { x: number, y: number };

  @ViewChild('canvasRef') canvasRef: ElementRef<HTMLCanvasElement>;

  context2D: CanvasRenderingContext2D;

  requestId = 0;

  particles: SfxParticle[] = [];
  lastFrameTime = 0;
  nextBurstDelta = 3;

  frameCallback: FrameRequestCallback = (time: number) => {
    // NgZone.assertNotInAngularZone();

    this.onUpdate(time);
    this.onPaint();
    this.requestAnimationFrame();
  }

  requestAnimationFrame() {
    this.requestId = requestAnimationFrame(this.frameCallback);
  }

  constructor(private _zone: NgZone) { }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      this.context2D = canvas.getContext('2d');

      this.onResize();
      this.startAnimation();
    }
  }

  ngOnDestroy(): void {
    this.stopAnimation();
  }

  startAnimation() {
    this._zone.runOutsideAngular(() => {
      if (!this.requestId) {
        this.lastFrameTime = 0;
        this.requestAnimationFrame();
      }
    });
  }

  stopAnimation() {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = 0;
    }
  }

  ngOnChanges(): void {
    this.onResize();

    if (this.particles.length > this.particleCount) {
      this.particles.length = this.particleCount;
    }
  }

  ngOnInit(): void {
  }

  onResize() {
    const ctx = this.context2D;
    if (ctx) {
      const canvas = ctx.canvas;

      if (canvas.width !== this.width || canvas.height !== this.height) {
        canvas.width = this.width;
        canvas.height = this.height;

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, this.width, this.height);
      }
    }
  }

  onPaint() {
    const ctx = this.context2D;
    if (ctx) {
      // clear
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, this.width, this.height);

      // draw
      ctx.globalCompositeOperation = 'lighter';
      this.drawParticles(ctx);
    }
  }

  onUpdate(time: number) {
    if (this.lastFrameTime) {
      const dt = (time - this.lastFrameTime) / 1000;
      this.updateParticles(dt);
    }
    this.lastFrameTime = time;
  }

  updateParticles(dt: number) {
    let freeCount = this.particleCount - this.particles.length;
    // Update particles.
    for (const particle of this.particles) {
      particle.update(dt, this.attractor);
      if (particle.age > particle.ttl) {
        freeCount++;
      }
    }

    // Spawn new particles.
    this.nextBurstDelta -= dt;
    if (freeCount > 0) {
      if (this.nextBurstDelta <= 0) {
        const maxCount = Math.min(50, Math.max(Math.floor(this.particleCount / 3), 1));
        const count = Math.min(freeCount, maxCount);
        this.spawnParticles(randomInteger(1 + Math.floor(count / 2), 1 + count));

        this.nextBurstDelta = 3 + Math.random() * 5;
      } else if (freeCount > this.particleCount / 2) {
        if (Math.random() > this.particleChance) {
          this.spawnParticles(1);
        }
      }
    }
  }

  spawnParticles(count: number) {
    const { width, height } = this;

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

  drawParticles(ctx: CanvasRenderingContext2D) {
    for (const particle of this.particles) {
      particle.draw(ctx);
    }
  }
}
