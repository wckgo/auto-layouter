export function isCoordinate(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y)
}

export function mustTowPoints(a, b) {
  return isCoordinate(a) && isCoordinate(b)
}

export function isBox(box) {
  return box && Number.isFinite(box.x) && Number.isFinite(box.y) && Number.isFinite(box.width) && Number.isFinite(box.height)
}

export function validateBoxes(boxes) {
  return Array.isArray(boxes) && boxes.every(isBox)
}
