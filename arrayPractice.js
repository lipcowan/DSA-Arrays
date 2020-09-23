const Memory = require('./memory');

const memory = new Memory();

class Array {
    constructor() {
        this.length = 0;
        this._capacity = 0;
        this.ptr = memory.allocate(this.length);
    }

    push(value) {
        if (this.length >= this._capacity) {
            this._resize((this.length + 1) * Array.SIZE_RATIO);
        }
        memory.set(this.ptr + this.length, value);
        this.length ++;
    }

    _resize(size) {
        const oldPtr = this.ptr;
        this.ptr = memory.allocate(size);
        if (this.ptr === null) {
            throw new Error('Out of memory');
        }
        memory.copy(this.ptr, oldPtr, this.length);
        memory.free(oldPtr);
        this._capacity = size;
    }

    get(index) {
        if (index < 0 || index >= this.length) {
            throw new Error('Index error');
        }
        return memory.get(this.ptr + index);
    }

    pop() {
        if (this.length == 0) {
            throw new Error('Index error');
        }
        const value = memory.get(this.ptr + this.length - 1);
        this.length --;
        return value;
    }

    insert(index, value) {
        if (index < 0 || index >= this.length) {
            throw new Error('Index error');
        }

        if (this.length >= this._capacity) {
            this._resize((this.length + 1) * Array.SIZE_RATIO);
        }

        memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
        memory.set(this.ptr + index, value);
        this.length ++;
    }

    remove(index) {
        if (index < 0 || index >= this.length) {
            throw new Error('Index error');
        }
        memory.copy(this.ptr + index, this.ptr + index + 1, this.length - index - 1 );
        this.length --;
    }
}
Array.SIZE_RATIO = 3;

function main() {
    Array.SIZE_RATIO = 3;

    let arr = new Array();

    arr.push(3); // length=1, capacity=3, ptr=0
    arr.push(5); // length=2, capacity=3, ptr=0
    arr.push(15); // length=3, capacity=3, ptr=0 -- doesn't resize even though length = capacity?!
    arr.push(19); // length=4, capacity=12, ptr=3
    arr.push(45); // length=5, capacity=12, ptr=3
    arr.push(10); // length=6, capacity=12, ptr=3
    
    arr.pop(); // length=5, capacity=12, ptr=3
    arr.pop(); // length=4, capacity=12, ptr=3
    arr.pop(); // length=3, capacity=12, ptr=3 -- doesn't resize, just redefines length

    console.log(arr.get(0)); // 3

    arr.remove(0); // copies 5 and 13 to new spots
    console.log(arr);
    arr.remove(0); // copies 5 to new spot
    console.log(arr);
    arr.pop(); // pop to reduce length to 0
    
    arr._resize(1); // length=1, capacity=1, ptr=15

    arr.push("tauhida"); // length=1, capacity=1, ptr=15 -- won't work properly since the array is only taking numbers at the moment
    console.log(arr.get(0)); // NaN
    console.log(arr); // length=1, capacity=1, ptr=15 
}

main();