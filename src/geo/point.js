export default class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  /**
   * 将坐标点偏移到坐标系的网格线上
   *
   * @param {Number} gx X轴的刻度
   * @param {Number} gy Y轴的刻度
   * @returns {this}
   * @memberof Point
   */
  snapToGrid (gx, gy) {
    this.x = snapToGrid(this.x, gx)
    this.y = snapToGrid(this.y, gy || gx)
    return this
  }

  clone () {
    return new Point(this.x, this.y)
  }

  toString () {
    return this.x + '@' + this.y
  }

  equals (p) {
    return !!p && this.x === p.x && this.y === p.y
  }

  difference (dx, dy) {
    return new Point(this.x - (dx || 0), this.y - (dy || 0))
  }

  /**
   * 计算过该点和点P的直线于X轴正方向的夹角度数
   *
   * @param {Point} p 点P
   * @returns 夹角度数
   * @memberof Point
   */
  theta (p) {
    const y = -(p.y - this.y)
    const x = p.x - this.x
    let rad = Math.atan2(y, x)
    // 修正在第三和第四象限的情况
    if (rad < 0) {
      rad = 2 * Math.PI + rad
    }
    return 180 * rad / Math.PI
  }

  offset (dx, dy) {
    this.x += dx || 0
    this.y += dy || 0
    return this
  }
}

function snapToGrid (value, gridSize) {
  return gridSize * Math.round(value / gridSize)
}
