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
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { randomInteger } from 'src/app/common/math-utils';

import { SfxParticle } from './sfx-particle';

// function clear(front: CanvasRenderingContext2D, back: CanvasRenderingContext2D, width: number, height: number) {
//   // save our visible canvas, then clear it and draw back the saved image.
//   back.clearRect(0, 0, width, height);
//   back.drawImage(front.canvas, 0, 0);

//   front.clearRect(0, 0, width, height);
//   front.drawImage(back.canvas, 0, 0);
// }

@Component({
  selector: 'app-sfx-particles',
  templateUrl: './sfx-particles.component.html',
  styleUrls: ['./sfx-particles.component.scss']
})
export class SfxParticlesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() width = 320;
  @Input() height = 240;
  @Input() particleCount = 200;
  @Input() particleChance = 0.98765;

  @ViewChild('canvasRef') canvasRef: ElementRef<HTMLCanvasElement>;

  contextMain: CanvasRenderingContext2D;
  // contextBack: CanvasRenderingContext2D;

  requestId = 0;

  particles: SfxParticle[] = [];
  time = 0;
  nextBurstDelta = 3;

  gravity?: { x: number, y: number };

  frameCallback: FrameRequestCallback = (time: number) => {
    NgZone.assertNotInAngularZone();

    this.onUpdate(time);
    this.onPaint();
    this.requestAnimationFrame();
  }

  requestAnimationFrame() {
    this.requestId = requestAnimationFrame(this.frameCallback);
  }

  constructor(private _zone: NgZone) { }

  ngAfterViewInit(): void {
    const canvasMain = this.canvasRef?.nativeElement;
    if (canvasMain) {
      // const canvasBack = canvasMain.cloneNode() as HTMLCanvasElement;

      this.contextMain = canvasMain.getContext('2d');
      // this.contextBack = canvasBack.getContext('2d');

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
        this.time = 0;
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

  ngOnChanges(changes: SimpleChanges): void {
    this.onResize();

    if (this.particles.length > this.particleCount) {
      this.particles.length = this.particleCount;
    }
  }

  ngOnInit(): void {
  }

  onResize() {
    if (this.contextMain) {
      const canvasMain = this.contextMain.canvas;
      // const canvasBack = this.contextBack.canvas;

      if (canvasMain.width !== this.width || canvasMain.height !== this.height) {
        // canvasMain.width = canvasBack.width = this.width;
        // canvasMain.height = canvasBack.height = this.height;
        canvasMain.width = this.width;
        canvasMain.height = this.height;

        this.contextMain.fillStyle = '#222222';
        this.contextMain.fillRect(0, 0, this.width, this.height);
      }
    }
  }

  onPaint() {
    if (this.contextMain) {
      // this.contextBack.globalAlpha = 0.895;
      // clear(this.contextMain, this.contextBack, this.width, this.height);

      this.contextMain.globalCompositeOperation = 'source-over';
      this.contextMain.fillStyle = 'rgba(0, 0, 0, 0.08)';
      this.contextMain.fillRect(0, 0, this.width, this.height);

      this.contextMain.globalCompositeOperation = 'lighter';
      this.drawParticles(this.contextMain);
    }
  }

  onUpdate(time: number) {
    let freeCount = this.particleCount - this.particles.length;

    if (this.time) {
      const dt = (time - this.time) / 1000;

      // Update particles.
      for (const particle of this.particles) {
        particle.update(dt, this.gravity);
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

    this.time = time;
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

  onMouseMove(event: MouseEvent) {
    this.gravity = { x: event.offsetX, y: event.offsetY };
  }

  onMouseOut(event: MouseEvent) {
    this.gravity = undefined;
  }
}
