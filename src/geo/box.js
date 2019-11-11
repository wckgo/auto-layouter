import Point from './point'

export default class Box {
  constructor (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  origin () {
    return new Point(this.x, this.y)
  }

  corner () {
    return new Point(this.x + this.width, this.y + this.height)
  }

  moveAndExpand (r) {
    this.x += r.x || 0
    this.y += r.y || 0
    this.width += r.width || 0
    this.height += r.height || 0
    return this
  }

  /**
   * 判断点是否在矩阵内
   *
   * @param {Point} p 坐标点
   * @returns {Boolean}
   * @memberof Box
   */
  containsPoint (p) {
    return p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height
  }
}
