import { toPaddingBox, toBox } from './util'

/**
 * 障碍物字典.
 * 用来判断坐标点是否在障碍物内.
 *
 * @export
 * @class ObstacleMap
 */
export default class ObstacleMap {
  constructor() {
    this.map = {}
    this.mapGridSize = 100
  }

  build (boxes, padding) {
    boxes.reduce((map, box) => {
      const bbox = toBox(box).moveAndExpand(toPaddingBox(padding))
      const origin = bbox.origin().snapToGrid(this.mapGridSize)
      const corner = bbox.corner().snapToGrid(this.mapGridSize)
      for (let x = origin.x; x <= corner.x; x += this.mapGridSize) {
        for (let y = origin.y; y <= corner.y; y += this.mapGridSize) {
          const gridKey = x + '@' + y
          map[gridKey] = map[gridKey] || []
          map[gridKey].push(bbox)
        }
      }
      return map
    }, this.map)
    return this
  }

  isPointAccessible (point) {
    const mapKey = point.clone().snapToGrid(this.mapGridSize).toString()
    return !this.map[mapKey] || this.map[mapKey].every(obstacle => !obstacle.containsPoint(point))
  }
}
