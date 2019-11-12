import { isEqual, merge, result } from 'lodash-es'
import ObstacleMap from '../../geo/obstacle_map'
import SortedSet from './sorted_set'
import { mustTowPoints, validateBoxes } from '../../util'
import { isDirection, getDirection } from '../../geo/direction'
import {
  toPoint,
  getKey,
  normalizePoint,
  getGridOffsets,
  getDirectionAngle,
  getDirectionChange,
  align,
  estimateCost,
  manhattanDistance,
  getDirections,
  getPenalties,
  offsetPoint,
  paddingPoint,
  getGrid
} from '../../geo/util'

const defaultOption = {
  step: 10,
  maxAllowedDirectionChange: 90,
  precision: 1,
  maximumLoops: 2000,
  directions() {
    return getDirections(this.step, 4)
  }
}

export default function manhattan(from, to, boxes, option) {
  if (!mustTowPoints(from, to) || !isDirection(from.direction) || !validateBoxes(boxes)) {
    throw new TypeError('invalid parameter!')
  }

  option = merge({}, defaultOption, option)
  option.directions = result(option, 'directions')
  const { step, maxAllowedDirectionChange, precision, maximumLoops, directions } = option
  const cache = {
    previousRouteDirectionAngle: undefined
  }
  const sourceAnchor = toPoint(from)
  const targetAnchor = toPoint(to)
  const map = new ObstacleMap().build(boxes, step)
  const grid = getGrid(step, from, to)

  const start = paddingPoint(sourceAnchor, step, getDirection(from.direction))
  const end = paddingPoint(targetAnchor, step, getDirection(to.direction))
  const startPoints = [offsetPoint(start, grid, getDirection(from.direction), precision)]
  const endPoints = [offsetPoint(end, grid, getDirection(to.direction), precision)]

  const openSet = new SortedSet()
  const points = {}
  const parents = {}
  const costs = {}

  openSet.add(getKey(start), manhattanDistance(start, end))
  points[getKey(start)] = start
  costs[getKey(start)] = 0

  const endKey = getKey(endPoints[0])
  const isPathBeginning = (cache.previousRouteDirectionAngle === undefined)
 
  let direction, directionChange
  const penalties = getPenalties(step)
  getGridOffsets(directions, grid, step)
  const numDirections = directions.length

  let loopsRemaining = maximumLoops

  while (!openSet.isEmpty() && loopsRemaining > 0) {
    const currentKey = openSet.pop()
    const currentPoint = points[currentKey]
    const currentParent = parents[currentKey]
    const currentCost = costs[currentKey]
    const isRouteBeginning = (currentParent === undefined) 
    const isStart = currentPoint.equals(start)

    let previousDirectionAngle
    if (!isRouteBeginning) previousDirectionAngle = getDirectionAngle(currentParent, currentPoint, numDirections, grid, step)
    else if (!isPathBeginning) previousDirectionAngle = cache.previousRouteDirectionAngle
    else if (!isStart) previousDirectionAngle = getDirectionAngle(start, currentPoint, numDirections, grid, step)
    else previousDirectionAngle = null

    const samePoints = isEqual(startPoints, endPoints)
    const skipEndCheck = (isRouteBeginning && samePoints)
    if (!skipEndCheck && endKey === currentKey) {
      return reconstructRoute(parents, points, currentPoint, start, end, sourceAnchor, targetAnchor)
    }

    for (let i = 0; i < numDirections; i++) {
      direction = directions[i]

      const directionAngle = direction.angle
      directionChange = getDirectionChange(previousDirectionAngle, directionAngle)

      if (!(isPathBeginning && isStart) && directionChange > maxAllowedDirectionChange) continue

      const neighborPoint = align(currentPoint.clone().offset(direction.gridOffsetX, direction.gridOffsetY), grid, precision)
      const neighborKey = getKey(neighborPoint)

      if (openSet.isClose(neighborKey) || !map.isPointAccessible(neighborPoint)) continue

      const neighborCost = direction.cost
      const neighborPenalty = isStart ? 0 : penalties[directionChange] // no penalties for start point
      const costFromStart = currentCost + neighborCost + neighborPenalty

      if (!openSet.isOpen(neighborKey) || (costFromStart < costs[neighborKey])) {
        points[neighborKey] = neighborPoint
        parents[neighborKey] = currentPoint
        costs[neighborKey] = costFromStart
        openSet.add(neighborKey, costFromStart + estimateCost(neighborPoint, endPoints))
      }

      loopsRemaining--
    }
  }
}

function reconstructRoute(parents, points, tailPoint, from, to, source, target) {
  const route = []

  let prevDiff = normalizePoint(to.difference(tailPoint.x, tailPoint.y))

  let currentKey = getKey(tailPoint)
  let parent = parents[currentKey]

  let point
  while (parent) {
    point = points[currentKey]

    const diff = normalizePoint(point.difference(parent.x, parent.y))
    if (!diff.equals(prevDiff)) {
      route.unshift(point)
      prevDiff = diff
    }

    currentKey = getKey(parent)
    parent = parents[currentKey]
  }

  const leadPoint = points[currentKey]

  const fromDiff = normalizePoint(leadPoint.difference(from.x, from.y))
  if (!fromDiff.equals(prevDiff)) {
    route.unshift(leadPoint)
  }
  route.unshift(source)
  route.push(target)
  return route
}
