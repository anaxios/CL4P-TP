import { managerToFetchingStrategyOptions } from "discord.js";
import Keyv from "keyv";
import assert from "node:assert";
import Logger from "./logger.js";
import { Tiktoken } from "tiktoken/lite";
import cl100k_base from "tiktoken/encoders/cl100k_base.json" assert { type: 'json' };


export default class CircularBuffer {
    constructor(keyv, capacity = 4096) {
      this.buffer = [];
      this.currentBufferSize = 0;
      this.capacity = capacity;
      this.keyv = keyv;
      this.encoding;
      this.totalTokens = 0;
      this.logger = new Logger();
    }

    async init() {
        let messageHistory = await this.keyv.get('messageHistory');
        let messageHistoryLength = await this.keyv.get('messageHistoryLength');
        if (messageHistory) {
            this.buffer = messageHistory;
            this.currentBufferSize = messageHistoryLength;
            this.logger.debug(`buffer length on load: ${this.currentBufferSize}`);
        }
    }
  
    async enqueue(data) {
        const itemByteSize = await this.countBytes(data);
        // if (itemByteSize > this.capacity) {
        //     throw new Error('Item exceeds buffer capacity!');
        // }
        while (this.currentBufferSize + itemByteSize > this.capacity) {
            let removedItem = await this.dequeue();
            this.currentBufferSize -= await this.countBytes(removedItem);
        }
        this.currentBufferSize += itemByteSize;
        this.logger.debug(`current buffer size: ${this.currentBufferSize}`);
        this.buffer.push(data);
        let messageHistory = await this.read();
        await this.keyv.set('messageHistory', messageHistory);
        await this.keyv.set('messageHistoryLength', this.currentBufferSize);
    }
      
    async dequeue() {
        let removedItem = this.buffer.shift();
        this.logger.debug("dequeue: " + removedItem);
        return removedItem;
    }

    async read() {
        return this.buffer;
    }

    async clear() {
        this.buffer = [];
        this.currentBufferSize = 0;
    }

    async isEmpty() {
        return this.buffer.length == 0;
    }

    async countBytes(data) {
        if (data !== undefined && data !== null) {
            const enc = new Tiktoken(
                cl100k_base.bpe_ranks,
                cl100k_base.special_tokens,
                cl100k_base.pat_str
              );

            let result = enc.encode(Object.entries(data).flat().join()).length;
            enc.free();
            this.totalTokens += result;
            this.logger.debug(`TOKENS USED SINCE LAUNCH: ${this.totalTokens}`);
            return result;
        } else {
            return 0;
        }
    }
}

