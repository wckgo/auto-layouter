import { getDirections } from '../../geo/util'
import manhattan from '../manhattan'
import { merge } from 'lodash-es'

const defaultOption = {
  directions () {
    return getDirections(this.step, 8)
  }
}

export default function metro (from, to, boxes, option) {
  return manhattan(from, to, boxes, merge({}, defaultOption, option))
}
