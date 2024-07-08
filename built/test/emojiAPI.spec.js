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
const emojiAPI_ts_1 = __importDefault(require("../src/emojiAPI.ts"));
const chai_1 = require("chai");
const api = new emojiAPI_ts_1.default();
const withEmoji = /\p{Extended_Pictographic}/u;
describe("emoji check method", () => __awaiter(void 0, void 0, void 0, function* () {
    const message = { content: "What a great day today!" };
    const result = yield api.send(message);
    it("should construct", () => {
        chai_1.assert.isNotNull(api);
    });
    it("should have emoji", () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.assert.isNotEmpty(result);
    }));
    it("should return array", () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.assert.isArray(result);
    }));
    it("should return max of 20 emoji", () => __awaiter(void 0, void 0, void 0, function* () {
        const lengthMessage = {
            content: "What a great 😁🌞🌴🍹🏖️🌊🎉🎈🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁🎂🎈🎉🎊🎁��day today!",
        };
        chai_1.assert.ok(api.testEmoji(lengthMessage).length <= 20);
    }));
}));
