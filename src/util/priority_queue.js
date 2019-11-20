import Heap from './heap';

export default class PriorityQueue extends Heap {

  enqueue(node) {
    this.insert(node)
  }

  dequeue() {
    return this.poll()
  }
}
