"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const logger_js_1 = __importDefault(require("../utils/logger.js"));
const CloudflareAPI_js_1 = __importDefault(require("./CloudflareAPI.js"));
const DefaultAPI_js_1 = __importDefault(require("./DefaultAPI.js"));
const TogetherAPI_js_1 = __importDefault(require("./TogetherAPI.js"));
const j3nkn5API_js_1 = __importDefault(require("./j3nkn5API.js"));
dotenv_1.default.config();
class llmFactory {
    constructor(db) {
        this.llm = process.env.LLM_SERVICE;
        this.logger = new logger_js_1.default();
        this.db = db;
    }
    new() {
        this.logger.debug(`LLM API: ${this.llm}`);
        switch (this.llm) {
            case "cloudflare":
                return new CloudflareAPI_js_1.default(this.db);
                break;
            case "togetherai":
                return new TogetherAPI_js_1.default(this.db);
                break;
            case "j3nkn5":
                return new j3nkn5API_js_1.default(this.db);
                break;
            default:
                return new DefaultAPI_js_1.default(this.db);
        }
    }
}
exports.default = llmFactory;
