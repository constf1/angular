import { Component, Input, OnInit } from '@angular/core';
import { formatDecimal } from 'src/app/common/math-utils';
import { asFormattedString, PathItem } from '../svg-path-model';
import {
  COMMAND_FULL_NAMES,
  hasControlPoint1,
  hasControlPoint2,
  isBezierCurve,
  isClosePath,
  isEllipticalArc,
  isHLineTo,
  isSmoothCurveTo,
  isSmoothQCurveTo,
  isVLineTo } from '../svg-path/svg-path-commands';
import { getReflectedX1, getReflectedY1, getX, getY } from '../svg-path/svg-path-node';

@Component({
  selector: 'app-path-item',
  templateUrl: './path-item.component.html',
  styleUrls: ['./path-item.component.scss']
})
export class PathItemComponent implements OnInit {
  @Input() item: PathItem;
  @Input() maximumFractionDigits?: number;

  get path() {
    return asFormattedString(this.item, this.item.outputAsRelative, this.maximumFractionDigits);
  }

  get info() {
    return `${COMMAND_FULL_NAMES[this.item.name]}`;
  }

  get dx() {
    return this.item.outputAsRelative ? getX(this.item.prev) : 0;
  }

  get dy() {
    return this.item.outputAsRelative ? getY(this.item.prev) : 0;
  }

  get x() {
    return getX(this.item) - this.dx;
  }

  get y() {
    return getY(this.item) - this.dy;
  }

  get x1() {
    if (hasControlPoint1(this.item)) {
      return this.item.x1 - this.dx;
    } else if (isSmoothCurveTo(this.item) || isSmoothQCurveTo(this.item)) {
      return getReflectedX1(this.item) - this.dx;
    }
    return 0;
  }

  get y1() {
    if (hasControlPoint1(this.item)) {
      return this.item.y1 - this.dy;
    } else if (isSmoothCurveTo(this.item) || isSmoothQCurveTo(this.item)) {
      return getReflectedY1(this.item) - this.dy;
    }
    return 0;
  }

  get x2() {
    return hasControlPoint2(this.item) ? (this.item.x2 - this.dx) : 0;
  }

  get y2() {
    return hasControlPoint2(this.item) ? (this.item.y2 - this.dy) : 0;
  }

  get rx() {
    return isEllipticalArc(this.item) ? this.item.rx : 0;
  }

  get ry() {
    return isEllipticalArc(this.item) ? this.item.ry : 0;
  }

  get angle() {
    return isEllipticalArc(this.item) ? this.item.angle : 0;
  }

  get largeArcFlag() {
    return isEllipticalArc(this.item) ? this.item.largeArcFlag : false;
  }

  get sweepFlag() {
    return isEllipticalArc(this.item) ? this.item.sweepFlag : false;
  }

  get hasX() {
    return !(isClosePath(this.item) || isVLineTo(this.item));
  }

  get hasY() {
    return !(isClosePath(this.item) || isHLineTo(this.item));
  }

  get isBezierCurve() {
    return isBezierCurve(this.item);
  }

  get hasControlPoint1() {
    return hasControlPoint1(this.item);
  }

  get hasControlPoint2() {
    return hasControlPoint2(this.item);
  }

  get isEllipticalArc() {
    return isEllipticalArc(this.item);
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
    }
  }

  setX(value: number) {
    if (!(isClosePath(this.item) || isVLineTo(this.item))) {
      this.item.x = value + this.dx;
    }
  }

  setY(value: number) {
    if (!(isClosePath(this.item) || isHLineTo(this.item))) {
      this.item.y = value + this.dy;
    }
  }

  setX1(value: number) {
    if (hasControlPoint1(this.item)) {
      this.item.x1 = value + this.dx;
    }
  }

  setY1(value: number) {
    if (hasControlPoint1(this.item)) {
      this.item.y1 = value + this.dy;
    }
  }

  setX2(value: number) {
    if (hasControlPoint2(this.item)) {
      this.item.x2 = value + this.dx;
    }
  }

  setY2(value: number) {
    if (hasControlPoint2(this.item)) {
      this.item.y2 = value + this.dy;
    }
  }

  setRx(value: number) {
    if (isEllipticalArc(this.item)) {
      this.item.rx = value;
    }
  }

  setRy(value: number) {
    if (isEllipticalArc(this.item)) {
      this.item.ry = value;
    }
  }

  setAngle(value: number) {
    if (isEllipticalArc(this.item)) {
      this.item.angle = value;
    }
  }

  setLargeArcFlag(value: boolean) {
    if (isEllipticalArc(this.item)) {
      this.item.largeArcFlag = value;
    }
  }

  setSweepFlag(value: boolean) {
    if (isEllipticalArc(this.item)) {
      this.item.sweepFlag = value;
    }
  }

  format(value: number) {
    return formatDecimal(value, this.maximumFractionDigits);
  }

  getFormatted(name: 'x' | 'y' | 'x1' | 'y1' | 'x2' | 'y2' | 'rx' | 'ry' | 'angle') {
    const value = this[name];
    return this.format(value);
  }
}
