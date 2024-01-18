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
const crypto_js_1 = __importDefault(require("crypto-js"));
dotenv_1.default.config();
class TogetherAPI {
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
                    name: "test2",
                    embeddingFunction: this.emb_fn,
                });
            }
            catch (e) {
                this.collection = yield this.cc.createCollection({
                    name: "test2",
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
                    nResults: 20,
                    queryTexts: [content],
                    embeddingFunction: this.emb_fn,
                });
                this.logger.debug(`LLM API CONTEXT: ${context.documents.join(" ")}`);
                let llmMessage = yield this.messageBuilder({
                    message: content,
                    context: context.documents.join(" "),
                });
                const response = yield axios_1.default.post(process.env.API_ENDPOINT, llmMessage, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.API_KEY}`,
                    },
                });
                const data = response.data;
                return data.choices[0].message.content;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    storeAttachment(attachment) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`store attachments: ${attachment.name}`);
            if (attachment.name.endsWith(".txt")) {
                const response = yield axios_1.default.get(attachment.url, {
                    responseType: "text",
                });
                const data = response.data.split(/\n\s*\n/);
                data.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    yield this.addWithRetry(element);
                }));
                return "Embedding finished.";
            }
        });
    }
    addWithRetry(element, retries = 30, delay = 200000) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hash = crypto_js_1.default.SHA256(element).toString(crypto_js_1.default.enc.Hex);
                yield this.collection.add({
                    ids: [hash],
                    documents: [element],
                    embeddingFunction: this.emb_fn,
                });
            }
            catch (error) {
                if (retries <= 0) {
                    throw new Error("No more retries left");
                }
                yield new Promise((resolve) => setTimeout(resolve, delay));
                return this.addWithRetry(element, retries - 1, delay);
            }
        });
    }
    messageBuilder(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, context } = messages;
            return {
                model: `${process.env.MODEL_NAME}`,
                max_tokens: 1024,
                temperature: 0.1,
                messages: [
                    {
                        role: "system",
                        content: `${process.env.SYSTEM_MESSAGE} Context: ${context}`,
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
exports.default = TogetherAPI;
