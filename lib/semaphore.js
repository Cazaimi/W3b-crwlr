const EventEmitter = require('events');

class Semaphore {
  constructor (value, maxValue) {
    this.value = value;
    this.maxValue = maxValue;
    this.eventEmitter = new EventEmitter();
  }

  increment () {
    if (this.value < this.maxValue) {
      this.value++;

      this.eventEmitter.emit('increment');

      return this.value;
    }

    return new Error('Error incrementing');
  }

  decrement () {
    if (this.value > 0) {
      this.value--;

      this.eventEmitter.emit('decrement');

      return this.value;
    }

    return new Error('Error decrementing');
  }
}

module.exports = Semaphore;
