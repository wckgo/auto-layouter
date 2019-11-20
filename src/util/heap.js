function defaultComparator(a, b) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

const getLeftChildIndex = index => index * 2 + 1

const getRightChildIndex = index => index * 2 + 2

const getParentIndex = index => (index - 1) >> 1

function moveDown(index) {
  const nodes = this.nodes;
  const count = nodes.length;
  const node = nodes[index];
  while (index < (count >> 1)) {
    const leftChildIndex = getLeftChildIndex(index);
    const rightChildIndex = getRightChildIndex(index);
    const smallerChildIndex = rightChildIndex < count &&
      this.comparator(nodes[rightChildIndex], nodes[leftChildIndex]) < 0 ?
      rightChildIndex :
      leftChildIndex
    if (this.comparator(nodes[smallerChildIndex], node) > 0) {
      break;
    }
    nodes[index] = nodes[smallerChildIndex];
    index = smallerChildIndex;
  }
  nodes[index] = node;
}

function moveUp(index) {
  const nodes = this.nodes
  const node = nodes[index]
  while (index > 0) {
    const parentIndex = getParentIndex(index)
    if (this.comparator(nodes[parentIndex], node) > 0) {
      nodes[index] = nodes[parentIndex]
      index = parentIndex
    } else {
      break
    }
  }
  nodes[index] = node
}

export default class Heap {
  constructor(comparator) {
    this.nodes = []
    this.comparator = comparator || defaultComparator
  }

  insert(node) {
    const index = this.nodes.map(item => item.key).indexOf(node.key)
    if(index > -1) {
      this.nodes.splice(index, 1)
    }
    this.nodes.push(node)
    moveUp.call(this, this.nodes.length - 1)
  }

  poll() {
    const nodes = this.nodes
    const count = nodes.length
    const rootNode = nodes[0]
    if (count <= 0) {
      return undefined
    } else if (count == 1) {
      this.nodes = []
    } else {
      nodes[0] = nodes.pop()
      moveDown.call(this, 0)
    }
    return rootNode
  }

  peek() {
    const nodes = this.nodes
    if (nodes.length == 0) {
      return undefined
    }
    return nodes[0]
  }

  isEmpty() {
    return this.nodes.length === 0
  }

  clear() {
    this.nodes = []
  }

  size() {
    return this.nodes.length
  }

  containsKey(key) {
    return this.nodes.find(item => item.key === key) !== undefined
  }
}
