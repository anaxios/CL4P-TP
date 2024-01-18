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
const dotenv_1 = __importDefault(require("dotenv"));
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const TokenBuffer_js_1 = __importDefault(require("../utils/TokenBuffer.js"));
const axios_1 = __importDefault(require("axios"));
const chromadb_1 = require("chromadb");
const uuid_1 = require("uuid");
dotenv_1.default.config();
class DefaultAPI {
    constructor(db) {
        this.logger = new logger_js_1.default();
        this.buffer = new TokenBuffer_js_1.default(db, 8000);
        this.buffer.init();
        this.cc = new chromadb_1.ChromaClient({ path: "http://chromadb:8000" });
        this.collection = null;
        this.emb_fn = new chromadb_1.OpenAIEmbeddingFunction({
            openai_api_key: process.env.OPENAI_API_KEY,
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.collection = yield this.cc.getCollection({
                    name: "test",
                    embeddingFunction: this.emb_fn,
                });
            }
            catch (e) {
                this.collection = yield this.cc.createCollection({
                    name: "test",
                    embeddingFunction: this.emb_fn,
                });
            }
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = message;
            try {
                const context = yield this.collection.query({
                    nResults: 50,
                    queryTexts: [content],
                    embeddingFunction: this.emb_fn,
                });
                this.logger.debug(`LLM API CONTEXT: ${context.documents.join(" ")}`);
                let llmMessage = yield this.messageBuilder({
                    message: content,
                    context: context.documents.join(" "),
                });
                const response = yield axios_1.default.post(`https://proxy-server-l6vsfbzhba-uw.a.run.app/complete`, llmMessage, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = response.data;
                yield this.collection.add({
                    ids: [(0, uuid_1.v4)()],
                    documents: [content + " " + data],
                    embeddingFunction: this.emb_fn,
                });
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    messageBuilder(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, context } = messages;
            return {
                model: `gpt-4`,
                messages: [
                    {
                        role: "system",
                        content: `${process.env.SYSTEM_MESSAGE}`,
                    },
                    {
                        role: "assistant",
                        content: `Context: ${context}`,
                    },
                    {
                        role: "user",
                        content: `${message}`,
                    },
                ],
            };
        });
    }
}
exports.default = DefaultAPI;
