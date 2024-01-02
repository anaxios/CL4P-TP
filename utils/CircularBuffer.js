/**
 * Represents a circular buffer.
 * @class
 */
export default class CircularBuffer {
    constructor(capacity) {
      this.buffer = [];
      this.byteSize = 0;
      this.capacity = capacity;
    }
  
    async write(data) {
      data.forEach(item => {
        const itemByteSize = Buffer.byteLength(item, 'utf8');
        while (this.byteSize + itemByteSize > this.capacity) {
          const removedItem = this.buffer.shift();
          this.byteSize -= Buffer.byteLength(removedItem, 'utf8');
        }
        this.buffer.push(item);
        this.byteSize += itemByteSize;
      });
    }
  
    *iterator(chunkSize = capacity) {
      let index = 0;
  
      while (index < this.buffer.length) {
        yield this.buffer.slice(index, index + chunkSize);
        index += chunkSize;
      }
    }
  }

  const buffer = new CircularBuffer(32768);

