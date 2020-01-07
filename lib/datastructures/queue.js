class Queue {
    constructor (input) {
        if (!Array.isArray(input)) {
            throw new Error ('Input is not an array');
        }

        this.array = input;

        return this;
    }

    array = [];

    push (obj) {
        this.array.push(obj)
    }

    pop(obj) {
        return this.array.shift(obj)
    }

    firstElement () {
        return this.array[0];
    }

    lastElement () {
        return this.array[this.array.length - 1];
    }
}

module.exports = Queue;