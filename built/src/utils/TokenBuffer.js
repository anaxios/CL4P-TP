"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_assert_1 = __importDefault(require("node:assert"));
const logger_js_1 = __importDefault(require("./logger.js"));
const lite_1 = require("tiktoken/lite");
const cl100k_base_json_1 = __importDefault(require("tiktoken/encoders/cl100k_base.json"));
class TokenBuffer {
    constructor(db, capacity = 4096) {
        this.buffer = [];
        this.currentBufferSize = 0;
        this.capacity = capacity;
        this.db = db;
        this.encoding;
        this.totalTokens = 0;
        this.logger = new logger_js_1.default();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    enqueue(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemByteSize = yield this.countBytes(data);
            while (this.currentBufferSize + itemByteSize > this.capacity) {
                let removedItem = yield this.dequeue();
                this.currentBufferSize -= yield this.countBytes(removedItem);
            }
            this.currentBufferSize += itemByteSize;
            this.logger.debug(`current buffer size: ${this.currentBufferSize}`);
            this.buffer.push(data);
        });
    }
    dequeue() {
        return __awaiter(this, void 0, void 0, function* () {
            let removedItem = this.buffer.shift();
            this.logger.debug("dequeue: " + removedItem);
            return removedItem;
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.buffer;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.buffer = [];
            this.currentBufferSize = 0;
        });
    }
    isEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.buffer.length == 0;
        });
    }
    countBytes(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data !== undefined && data !== null) {
                const enc = new lite_1.Tiktoken(cl100k_base_json_1.default.bpe_ranks, cl100k_base_json_1.default.special_tokens, cl100k_base_json_1.default.pat_str);
                let result = enc.encode(Object.entries(data).flat().join()).length;
                enc.free();
                this.totalTokens += result;
                this.logger.debug(`TOKENS USED SINCE LAUNCH: ${this.totalTokens}`);
                return result;
            }
            else {
                return 0;
            }
        });
    }
}
exports.default = TokenBuffer;
