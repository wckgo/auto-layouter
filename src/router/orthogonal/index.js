import {
  add,
  multiply,
  vectorFromPoints,
  isParallel,
  dot,
  mustTowPoints,
  translateMatrix
} from '../../util'

import {
  isDirection,
  getDirection,
  DIRECTION_ENUM
} from '../../geo/direction'

// 两个元素的数组中的另一个
function anotherOne(comp, a) {
  return comp.find(v => v !== a)
}

function findOrthogonalDirection(directions, d) {
  let startDirection
  const startParallelDirection = directions.find(direction => isParallel(direction, d))
  if (dot(startParallelDirection, d) > 0) {
    startDirection = startParallelDirection
  } else {
    startDirection = anotherOne(directions, startParallelDirection)
  }
  return startDirection
}

export default function orthogonal(from, to, {
  extensionCord = 10
}) {
  if (!mustTowPoints(from, to) || !isDirection(from.direction)) {
    throw new TypeError('invalid parameter!')
  }
  const turnRatio = 0.5
  let fromDirection = translateMatrix(getDirection(from.direction))
  let toDirection = to.direction
  // 获得入方向和出方向 ——参数中已获得; 当exitDirection 未定义时
  if (!toDirection || toDirection === DIRECTION_ENUM.MID) {
    const entryToExit = vectorFromPoints(to, from)
    if (Math.abs(entryToExit.x) > Math.abs(entryToExit.y)) {
      toDirection = entryToExit.x > 0 ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.LEFT
    } else {
      toDirection = entryToExit.y > 0 ? DIRECTION_ENUM.DOWN : DIRECTION_ENUM.UP
    }
  }
  toDirection = translateMatrix(getDirection(toDirection))

  // 获得直接 path 的水平和竖直方向
  const start = add(from, multiply(fromDirection, extensionCord))
  const end = add(to, multiply(toDirection, extensionCord))

  // 出口方向需要取反
  toDirection = multiply(toDirection, -1)

  const horizenDirection = {
    x: end.x - start.x,
    y: 0
  }
  const verticalDirection = {
    x: 0,
    y:  end.y - start.y
  }

  // 计算path 的起始方向： 两方向与入方向平行的一项，如果是同向则取之，反之则取非平行的一项
  const comp = [horizenDirection, verticalDirection]
  const startDirection = findOrthogonalDirection(comp, fromDirection)
  const endDirection = findOrthogonalDirection(comp, toDirection)

  // 如果path的起末为同方向，则分为两段，否则为1段
  const splitNum = dot(startDirection, endDirection) > 0 ? 2 : 1
  const pathMiddle = anotherOne(comp, endDirection)

  // 计算path中的转折点 返回数据中加入了单位向量
  const points = []
  points.push(from, start)
  if (splitNum === 1) {
    const point1 = add(start, startDirection)
    const point2 = add(point1, endDirection)
    points.push(point1, point2)
  } else {
    const point1 = add(start, multiply(startDirection, turnRatio))
    const point2 = add(point1, pathMiddle)
    const point3 = add(point2, multiply(endDirection, 1 - turnRatio))
    points.push(point1, point2, point3)
  }
  points.push(to)
  return points
}
