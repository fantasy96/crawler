class Queue {
  queue = []
  constructor(initQueue = []) {
    this.queue = initQueue
  }

  getQueueItem() {
    return this.queue
  }

  isEmpty() {
    return this.queue.length === 0
  }

  getLength() {
    return this.queue.length
  }

  enQueue(item) {
    this.queue.push(item)
  }

  enQueues(items) {
    this.queue = [...this.queue, ...items]
  }

  deQueue(numberItem) {
    if (!numberItem) return this.queue.shift()
    if (Number.isInteger(numberItem)) {
      if (numberItem < this.queue.length) {
        const items = this.queue.slice(0, numberItem)
        this.queue = this.queue.slice(numberItem)
        return items
      }

      const items = this.queue
      this.queue = []
      return items
    }

    return undefined
  }

  peek() {
    return queue.length > 0 ? queue[offset] : undefined
  }
}

module.exports = Queue
