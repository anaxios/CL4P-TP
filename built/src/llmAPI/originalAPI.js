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
dotenv_1.default.config();
class DefaultAPI {
    constructor(db) {
        this.logger = new logger_js_1.default();
        this.buffer = new TokenBuffer_js_1.default(db, 8000);
        this.buffer.init();
    }
    sendMessage(formattedMessage, client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.buffer.enqueue(formattedMessage);
                let llmMessage = yield this.messageBuilder(yield this.buffer.read(), client);
                const response = yield axios_1.default.post(`https://proxy-server-l6vsfbzhba-uw.a.run.app/complete`, llmMessage, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = response.data;
                new logger_js_1.default().debug(`LLM API RESPONSE: ${data}`);
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    messageBuilder(messageHistory, client) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                "model": `gpt-4`,
                "messages": [
                    {
                        "role": "system",
                        "content": `${process.env.SYSTEM_MESSAGE}`
                    },
                    ...messageHistory.map(element => {
                        if (element.author == client.user.id) {
                            return {
                                "role": "assistant",
                                "content": element.content
                            };
                        }
                        else if (element.author != client.user.id) {
                            return {
                                "role": "user",
                                "content": `${element.authorName}: ${element.content}`
                            };
                        }
                    })
                ]
            };
        });
    }
}
exports.default = DefaultAPI;
