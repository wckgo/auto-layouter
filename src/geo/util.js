import Box from './box'
import Point from './point'

export function toPaddingBox (padding) {
  return {
    width: 2 * padding,
    height: 2 * padding,
    x: -padding,
    y: -padding
  }
}

export function toBox (box) {
  const { x, y, width, height } = box
  return new Box(x, y, width, height)
}

export function toPoint ({ x, y }) {
  return new Point(x, y)
}

export function getKey (point) {
  return point.toString()
}

/**
 * 评估估算节点集合中最小曼哈顿距离
 *
 * @export
 * @param {Point} from 起点
 * @param {Point[]} endPoints 被估算节点集合
 * @returns 曼哈顿距离最小的点
 */
export function estimateCost (from, endPoints) {
  let min = Infinity
  for (let i = 0, len = endPoints.length; i < len; i++) {
    const cost = manhattanDistance(from, endPoints[i])
    if (cost < min) min = cost
  }
  return min
}

/**
 * 计算两点之间的曼哈顿距离
 *
 * @export
 * @param {Point} a
 * @param {Point} b
 * @returns
 */
export function manhattanDistance (a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

/**
 * 把点P进行归一化处理
 *
 * @export
 * @param {*} point
 * @returns
 */
export function normalizePoint (point) {
  return new Point(
    point.x === 0 ? 0 : Math.abs(point.x) / point.x,
    point.y === 0 ? 0 : Math.abs(point.y) / point.y
  )
}

/**
 * 计算方向在网格上的偏移量
 *
 * @export
 * @param {*} directions
 * @param {*} grid
 * @param {*} step
 */
export function getGridOffsets (directions, grid, step) {
  directions.forEach(direction => {
    direction.gridOffsetX = (direction.offsetX / step) * grid.x
    direction.gridOffsetY = (direction.offsetY / step) * grid.y
  })
}

/**
 * 确定终点相对于起点的方位
 *
 * @export
 * @param {*} start
 * @param {*} end
 * @param {*} numDirections
 * @param {*} grid
 * @param {*} opt
 * @returns
 */
export function getDirectionAngle (start, end, numDirections, grid, step) {
  const quadrant = 360 / numDirections
  const angleTheta = start.theta(fixAngleEnd(start, end, grid, step))
  const normalizedAngle = normalizeAngle(angleTheta + (quadrant / 2))
  return quadrant * Math.floor(normalizedAngle / quadrant)
}

/**
 * 根据网格大小修正终点坐标
 *
 * @export
 * @param {*} start
 * @param {*} end
 * @param {*} grid
 * @param {*} step
 * @returns
 */
export function fixAngleEnd (start, end, grid, step) {
  const diffX = end.x - start.x
  const diffY = end.y - start.y

  const gridStepsX = diffX / grid.x
  const gridStepsY = diffY / grid.y

  const distanceX = gridStepsX * step
  const distanceY = gridStepsY * step

  return new Point(start.x + distanceX, start.y + distanceY)
}

export function normalizeAngle (angle) {
  return (angle % 360) + (angle < 0 ? 360 : 0)
}

/**
 * 获得两个方向的转变向量
 *
 * @export
 * @param {*} angle1
 * @param {*} angle2
 * @returns
 */
export function getDirectionChange (angle1, angle2) {
  const directionChange = Math.abs(angle1 - angle2)
  return (directionChange > 180) ? (360 - directionChange) : directionChange
}

export function align (point, grid, precision) {
  return roundPoint(snapToGrid(point.clone(), grid), precision)
}

function _snapToGrid (value, gridSize) {
  return gridSize * Math.round(value / gridSize)
}

/**
 * 计算一个点，使得点P正好落到网格上
 *
 * @export
 * @param {Point} point
 * @param {Object} grid
 * @returns
 */
export function snapToGrid (point, grid) {
  const source = grid.source
  const snappedX = _snapToGrid(point.x - source.x, grid.x) + source.x
  const snappedY = _snapToGrid(point.y - source.y, grid.y) + source.y
  return new Point(snappedX, snappedY)
}

export function roundPoint (point, precision) {
  const f = Math.pow(10, precision || 0)
  point.x = Math.round(point.x * f) / f
  point.y = Math.round(point.y * f) / f
  return point
}

function diagonalCost (step) {
  return Math.ceil(Math.sqrt(step * step << 1))
}

export function getDirections (step, orientation) {
  const d = diagonalCost(step)
  const directions = [
    { offsetX: step, offsetY: 0, cost: step },
    { offsetX: step, offsetY: step, cost: d },
    { offsetX: 0, offsetY: step, cost: step },
    { offsetX: -step, offsetY: step, cost: d },
    { offsetX: -step, offsetY: 0, cost: step },
    { offsetX: -step, offsetY: -step, cost: d },
    { offsetX: 0, offsetY: -step, cost: step },
    { offsetX: step, offsetY: -step, cost: d }
  ]

  directions.forEach(direction => {
    var point1 = new Point(0, 0)
    var point2 = new Point(direction.offsetX, direction.offsetY)
    direction.angle = normalizeAngle(point1.theta(point2))
  })
  return orientation === 4 ? [directions[0], directions[2], directions[4], directions[6]] : directions
}

export function getPenalties (step) {
  return {
    0: 0,
    45: step / 2,
    90: step / 2
  }
}

export function offsetPoint (point, grid, direction, precision) {
  return align(new Point(point.x + grid.x * direction[0], point.y + grid.y * direction[1]), grid, precision)
}

export function paddingPoint (point, padding, direction) {
  return new Point(point.x + padding * direction[0], point.y + padding * direction[1])
}

/**
 * 根据起点和终点的距离，结合步进长度，计算网格大小
 *
 * @export
 * @param {Number} step
 * @param {Point} source
 * @param {Point} target
 * @returns
 */
export function getGrid (step, source, target) {
  return {
    source: Object.assign({}, source),
    x: getGridDimension(target.x - source.x, step),
    y: getGridDimension(target.y - source.y, step)
  }
}

/**
 * 计算网格大小
 *
 * @export
 * @param {Number} diff
 * @param {Number} step
 * @returns
 */
export function getGridDimension (diff, step) {
  if (!diff) return step
  const absDiff = Math.abs(diff)
  const numSteps = Math.round(absDiff / step)
  if (!numSteps) return absDiff
  const roundedDiff = numSteps * step
  const remainder = absDiff - roundedDiff
  const stepCorrection = remainder / numSteps
  return step + stepCorrection
}
