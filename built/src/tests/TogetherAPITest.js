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
const TogetherAPI_js_1 = __importDefault(require("../llmAPI/TogetherAPI.js"));
const chai_1 = require("chai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const chromadb_1 = require("chromadb");
const formatted = {
    model: process.env.MODEL_NAME,
    max_tokens: 1024,
    temperature: 0.1,
    messages: [
        {
            role: "system",
            content: `${process.env.SYSTEM_MESSAGE}`,
        },
        {
            role: "assistant",
            content: `Context: I'm 99 years old. my name is John`,
        },
        {
            role: "user",
            content: `Hello`,
        },
    ],
};
const api = new TogetherAPI_js_1.default();
api.cc = new chromadb_1.ChromaClient({ path: "http://localhost:8000" });
await api.init();
describe("TogetherAPI", () => {
    it("should construct", () => {
        chai_1.assert.isNotNull(api);
    });
    it("should format a message correctly", () => __awaiter(void 0, void 0, void 0, function* () {
        const message = yield api.messageBuilder({
            message: "Hello",
            context: ["I'm 99 years old.", "my name is John"].join(" "),
        });
        chai_1.assert.deepEqual(formatted, message);
    }));
    it("should init or get chromadb collection", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(10000);
            chai_1.assert.isNotNull(api.collection);
        });
    });
    it("should respond with an answer from the LLM API", function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(100000);
            const response = yield api.sendMessage({ content: "Hello" });
            console.log(`message response: ${response}`);
            chai_1.assert.isNotNull(response);
            chai_1.assert.isNotEmpty(response);
        });
    });
});
