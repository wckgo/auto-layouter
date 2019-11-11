import { sortedIndexBy } from 'lodash-es'

export default class SortedSet {
  constructor () {
    this.items = []
    this.hash = {}
    this.values = {}
    this.OPEN = 1
    this.CLOSE = 2
  }

  add (item, value) {
    if (this.hash[item]) {
      // item removal
      this.items.splice(this.items.indexOf(item), 1)
    } else {
      this.hash[item] = this.OPEN
    }
    this.values[item] = value
    const index = sortedIndexBy(this.items, item, i => this.values[i])
    this.items.splice(index, 0, item)
  }

  remove (item) {
    this.hash[item] = this.CLOSE
  }

  isOpen (item) {
    return this.hash[item] === this.OPEN
  }

  isClose (item) {
    return this.hash[item] === this.CLOSE
  }

  isEmpty () {
    return this.items.length === 0
  }

  pop () {
    const item = this.items.shift()
    this.remove(item)
    return item
  }
}
