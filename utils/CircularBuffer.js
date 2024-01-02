import { managerToFetchingStrategyOptions } from "discord.js";
import Keyv from "keyv";

/**
 * Represents a circular buffer. 8192
 * @class
 */
export default class CircularBuffer {
    constructor(keyv, capacity = 8192) {
      this.buffer = [];
      this.byteSize = 0;
      this.capacity = capacity;
      this.keyv = keyv;
    }

    async init() {
        let messageHistory = await this.keyv.get('messageHistory');
        let messageHistoryLength = await this.keyv.get('messageHistoryLength');
        if (messageHistory) {
            this.buffer = messageHistory;
            this.byteSize = messageHistoryLength;
        }
    }
  
    async enqueue(data) {
        const itemByteSize = await this.countBytes(data);
        // if (itemByteSize > this.capacity) {
        //     throw new Error('Item exceeds buffer capacity!');
        // }
        while (this.byteSize + itemByteSize > this.capacity) {
            let removedItem = await this.dequeue();
            this.byteSize -= await this.countBytes(removedItem);
        }
        this.byteSize += itemByteSize;
        this.buffer.push(data);
        let messageHistory = await this.read();
        await this.keyv.set('messageHistory', messageHistory);
        await this.keyv.set('messageHistoryLength', this.byteSize);
    }
      
    async dequeue() {
        console.log("DEQUEUE: happened");
        return this.buffer.shift();
    }

    async read() {
        return this.buffer;
    }

    async clear() {
        this.buffer = [];
        this.byteSize = 0;
    }

    async isEmpty() {
        return this.buffer.length == 0;
    }

    async countBytes(data) {
        if (data !== undefined && data !== null) {
            return Buffer.byteLength(Object.entries(data).flat().join(), 'utf8');
        } else {
            return 0;
        }
    }
}

