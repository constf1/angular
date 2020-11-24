import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { formatDecimal } from 'src/app/common/math-utils';
import * as Path from '../svg-path/svg-path-item';

export type ItemParamChange = {
  name: Path.DrawNumberParam;
  value: number;
} | {
  name: Path.DrawBooleanParam | 'outputAsRelative';
  value: boolean;
};

@Component({
  selector: 'app-path-item',
  templateUrl: './path-item.component.html',
  styleUrls: ['./path-item.component.scss']
})
export class PathItemComponent implements OnInit {
  @Input() item: Path.PathItem;
  @Input() maximumFractionDigits?: number;
  @Output() inputChange = new EventEmitter<ItemParamChange>();

  get path() {
    return Path.asFormattedString(this.item, this.maximumFractionDigits);
  }

  get info() {
    return `${Path.COMMAND_FULL_NAMES[this.item.name]}`;
  }

  get dx() {
    return this.item.outputAsRelative ? Path.getX(this.item.prev) : 0;
  }

  get dy() {
    return this.item.outputAsRelative ? Path.getY(this.item.prev) : 0;
  }

  get x() {
    return Path.getX(this.item) - this.dx;
  }

  get y() {
    return Path.getY(this.item) - this.dy;
  }

  get x1() {
    if (Path.hasControlPoint1(this.item)) {
      return this.item.x1 - this.dx;
    } else if (Path.isSmoothCurveTo(this.item) || Path.isSmoothQCurveTo(this.item)) {
      return Path.getReflectedX1(this.item) - this.dx;
    }
    return 0;
  }

  get y1() {
    if (Path.hasControlPoint1(this.item)) {
      return this.item.y1 - this.dy;
    } else if (Path.isSmoothCurveTo(this.item) || Path.isSmoothQCurveTo(this.item)) {
      return Path.getReflectedY1(this.item) - this.dy;
    }
    return 0;
  }

  get x2() {
    return Path.hasControlPoint2(this.item) ? (this.item.x2 - this.dx) : 0;
  }

  get y2() {
    return Path.hasControlPoint2(this.item) ? (this.item.y2 - this.dy) : 0;
  }

  get rx() {
    return Path.isEllipticalArc(this.item) ? this.item.rx : 0;
  }

  get ry() {
    return Path.isEllipticalArc(this.item) ? this.item.ry : 0;
  }

  get angle() {
    return Path.isEllipticalArc(this.item) ? this.item.angle : 0;
  }

  get largeArcFlag() {
    return Path.isEllipticalArc(this.item) ? this.item.largeArcFlag : false;
  }

  get sweepFlag() {
    return Path.isEllipticalArc(this.item) ? this.item.sweepFlag : false;
  }

  get hasX() {
    return !(Path.isClosePath(this.item) || Path.isVLineTo(this.item));
  }

  get hasY() {
    return !(Path.isClosePath(this.item) || Path.isHLineTo(this.item));
  }

  get isBezierCurve() {
    return Path.isBezierCurve(this.item);
  }

  get hasControlPoint1() {
    return Path.hasControlPoint1(this.item);
  }

  get hasControlPoint2() {
    return Path.hasControlPoint2(this.item);
  }

  get isEllipticalArc() {
    return Path.isEllipticalArc(this.item);
  }

  get isRelative() {
    return this.item.outputAsRelative;
  }

  constructor() { }

  ngOnInit(): void {
  }

  setRelative(value: boolean) {
    if (this.item.outputAsRelative !== value) {
      this.item.outputAsRelative = value;
      this.inputChange.emit({ name: 'outputAsRelative', value });
    }
  }

  setX(value: number) {
    if (!(Path.isClosePath(this.item) || Path.isVLineTo(this.item))) {
      value += this.dx;
      if (this.item.x !== value) {
        this.item.x = value;
        this.inputChange.emit({ name: 'x', value });
      }
    }
  }

  setY(value: number) {
    if (!(Path.isClosePath(this.item) || Path.isHLineTo(this.item))) {
      value += this.dy;
      if (this.item.y !== value) {
        this.item.y = value;
        this.inputChange.emit({ name: 'y', value });
      }
    }
  }

  setX1(value: number) {
    if (Path.hasControlPoint1(this.item)) {
      value += this.dx;
      if (this.item.x1 !== value) {
        this.item.x1 = value;
        this.inputChange.emit({ name: 'x1', value });
      }
    }
  }

  setY1(value: number) {
    if (Path.hasControlPoint1(this.item)) {
      value += this.dy;
      if (this.item.y1 !== value) {
        this.item.y1 = value;
        this.inputChange.emit({ name: 'y1', value });
      }
    }
  }

  setX2(value: number) {
    if (Path.hasControlPoint2(this.item)) {
      value += this.dx;
      if (this.item.x2 !== value) {
        this.item.x2 = value;
        this.inputChange.emit({ name: 'x2', value });
      }
    }
  }

  setY2(value: number) {
    if (Path.hasControlPoint2(this.item)) {
      value += this.dy;
      if (this.item.y2 !== value) {
        this.item.y2 = value;
        this.inputChange.emit({ name: 'y2', value });
      }
    }
  }

  setRx(value: number) {
    if (Path.isEllipticalArc(this.item)) {
      if (this.item.rx !== value && value > 0) {
        this.item.rx = value;
        this.inputChange.emit({ name: 'rx', value });
      }
    }
  }

  setRy(value: number) {
    if (Path.isEllipticalArc(this.item)) {
      if (this.item.ry !== value && value > 0) {
        this.item.ry = value;
        this.inputChange.emit({ name: 'ry', value });
      }
    }
  }

  setAngle(value: number) {
    if (Path.isEllipticalArc(this.item)) {
      if (this.item.angle !== value) {
        this.item.angle = value;
        this.inputChange.emit({ name: 'angle', value });
      }
    }
  }

  setLargeArcFlag(value: boolean) {
    if (Path.isEllipticalArc(this.item)) {
      if (this.item.largeArcFlag !== value) {
        this.item.largeArcFlag = value;
        this.inputChange.emit({ name: 'largeArcFlag', value });
      }
    }
  }

  setSweepFlag(value: boolean) {
    if (Path.isEllipticalArc(this.item)) {
      if (this.item.sweepFlag !== value) {
        this.item.sweepFlag = value;
        this.inputChange.emit({ name: 'sweepFlag', value });
      }
    }
  }

  format(value: number) {
    return formatDecimal(value, this.maximumFractionDigits);
  }

  getFormatted(name: Path.DrawNumberParam) {
    const value = this[name];
    return this.format(value);
  }
}
