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
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const DefaultAPI_js_1 = __importDefault(require("./DefaultAPI.js"));
dotenv_1.default.config();
class CloudflareAPI extends DefaultAPI_js_1.default {
    constructor(keyv) {
        super(keyv);
    }
    sendMessage(formattedMessage, client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.buffer.enqueue(formattedMessage);
                let llmMessage = yield this.messageBuilder(yield this.buffer.read(), client);
                const response = yield (0, node_fetch_1.default)(process.env.APT_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(llmMessage)
                });
                const data = yield response.text();
                new logger_js_1.default().debug(`LLM API RESPONSE: ${data.replace(/\\n/g, '<br>')}`);
                return data;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = CloudflareAPI;
