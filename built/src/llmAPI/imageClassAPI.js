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
const logger_js_1 = __importDefault(require("../utils/logger.js"));
class j3nkn5API {
    constructor(db) {
        this.logger = new logger_js_1.default();
        this.buffer = null;
        this.cc = null;
        this.collection = null;
        this.emb_fn = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    sendMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = message;
            try {
                const url = new URL(process.env.API_ENDPOINT);
                url.searchParams.set("query", content);
                url.searchParams.set("llm", "true");
                url.searchParams.set("vectors", "true");
                console.log(url.toString());
                const request = new Request(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/text",
                        Authorization: `Bearer ${process.env.API_KEY}`,
                    },
                });
                const response = yield fetch(request);
                if (!response.ok) {
                    return new Error(`HTTP error! status: ${response.status}`);
                }
                return yield response.json();
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
                return "Not implimented.";
            }
        });
    }
    addWithRetry(element, retries = 30, delay = 200000) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hash = CryptoJS.SHA256(element).toString(CryptoJS.enc.Hex);
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
exports.default = j3nkn5API;
