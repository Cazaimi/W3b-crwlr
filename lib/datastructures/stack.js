class Stack {
  constructor (input) {
    if (!Array.isArray(input)) {
      throw new Error('Input is not an array');
    }

    this.array = input;

    return this;
  }

  push (obj) {
    this.array.push(obj);
  }

  pop (obj) {
    return this.array.pop(obj);
  }

  top () {
    return this.array[this.array.length - 1];
  }

  length () {
    return this.array.length;
  }
}

module.exports = Stack;
