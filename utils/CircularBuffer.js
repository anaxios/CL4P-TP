import { managerToFetchingStrategyOptions } from "discord.js";
import Keyv from "keyv";
import assert from "node:assert";
import Logger from "./logger.js";
import { Tiktoken } from "tiktoken/lite";
import cl100k_base from "tiktoken/encoders/cl100k_base.json" assert { type: 'json' };



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
      this.encoding;
      this.totalTokens = 0;
    }

    async init() {
        let messageHistory = await this.keyv.get('messageHistory');
        //let messageHistoryLength = await this.keyv.get('messageHistoryLength');
        if (messageHistory) {
            this.buffer = messageHistory;
            this.byteSize = messageHistory.length;
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
        Logger.debug(`current buffer size: ${this.byteSize}`);
        this.buffer.push(data);
        let messageHistory = await this.read();
        await this.keyv.set('messageHistory', messageHistory);
        await this.keyv.set('messageHistoryLength', this.byteSize);
    }
      
    async dequeue() {
        let removedItem = this.buffer.shift();
        Logger.debug("dequeue: " + removedItem);
        return removedItem;
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
            const enc = new Tiktoken(
                cl100k_base.bpe_ranks,
                cl100k_base.special_tokens,
                cl100k_base.pat_str
              );

            let result = enc.encode(Object.entries(data).flat().join()).length;
            enc.free();
            this.totalTokens += result;
            Logger.debug(`TOKENS USED SINCE LAUNCH: ${this.totalTokens}`);
            return result;
        } else {
            return 0;
        }
    }
}

