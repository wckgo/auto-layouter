import { getDirections, euclideanDistance } from '../../geo/util'
import manhattan from '../manhattan'
import { merge } from 'lodash-es'

const defaultOption = {
  directions () {
    return getDirections(this.step, 8)
  },
  heuristic: euclideanDistance
}

export default function euclidean (from, to, boxes, option) {
  return manhattan(from, to, boxes, merge({}, defaultOption, option))
}
