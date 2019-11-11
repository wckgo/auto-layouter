/**
 * 方向枚举，用向量矩阵表示方向.
 * 
 * @readonly
 * @enum {Number[]}
 */
export const DIRECTION = {
  UP: [0, -1],
  RIGHT: [1, 0],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  MID: [0, 0]
}

/**
 * 方向字符枚举.
 * 
 * @readonly
 * @enum {String[]}
 */
export const DIRECTION_ENUM = Object.keys(DIRECTION).reduce((accumulator, currentValue) => {
  accumulator[currentValue] = currentValue.toLowerCase()
  return accumulator
}, {})

/**
 * 通过方向字符获得方位矩阵。
 *
 * @export
 * @param {String} directionKey 方向字符
 * @returns {Number[]}
 */
export function getDirection(directionKey) {
  return DIRECTION[directionKey.toUpperCase()]
}

/**
 * 判断给点的方向字符是否是一个支持的方位.
 *
 * @export
 * @param {String} directionKey 方向字符
 * @returns {Boolean}
 */
export function isDirection(directionKey) {
  return typeof directionKey === 'string' && DIRECTION_ENUM.hasOwnProperty(directionKey.toUpperCase())
}
