// 向量相加 或者 向量与坐标相加
export function add (vectorA, vectorB) {
  return {
    x: vectorA.x + vectorB.x,
    y: vectorA.y + vectorB.y
  }
}

// 向量乘以常量系数
export function multiply (vector, k) {
  return {
    x: vector.x * k,
    y: vector.y * k
  }
}

// 两点之间的向量，a点指向b点
export function vectorFromPoints (pointA, pointB) {
  return {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y
  }
}

// 判断向量是否平行
export function isParallel (vectorA, vectorB) {
  return vectorA.x * vectorB.y - vectorA.y * vectorB.x === 0
}

// 向量点积
export function dot (vectorA, vectorB) {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y
}
// 向量叉乘
export function cross (vectorA, vectorB) {
  return vectorA.x * vectorB.y - vectorA.y * vectorB.x
}

// 向量夹角
export function angleFrom (vector) {
  return Math.acos(vector.x / Math.sqrt(vector.x * vector.x + vector.y * vector.y))
}

// 获取向量的单位向量
export function getUnitVector (vector) {
  const m = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  return {
    x: vector.x / m,
    y: vector.y / m
  }
}

// 判断向量 x,y 坐标相等
export function equals (vectorA, vectorB) {
  return vectorA.x === vectorB.x && vectorA.y === vectorB.y
}

export function translateMatrix(matrix) {
  return {
    x: matrix[0],
    y: matrix[1]
  }
}
