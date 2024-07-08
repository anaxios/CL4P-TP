"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
class emojiAPI {
  constructor() {
    this.logger = new logger_1.default();
    this.withEmoji = /\p{Extended_Pictographic}/u;
  }
  init() {
    return __awaiter(this, void 0, void 0, function* () {
      return;
    });
  }
  send(message) {
    return __awaiter(this, void 0, void 0, function* () {
      const { content } = message;
      try {
        const url = new URL("https://j3nkn5.cc/api/emoji");
        url.searchParams.set("query", content);
        url.searchParams.set("temp", "0.5");
        url.searchParams.set("model", "togethercomputer/llama-2-70b-chat");
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
        return this.testEmoji(yield response.text());
      } catch (error) {
        console.log(error);
      }
    });
  }
  testEmoji(message) {
    const result = Array.from(message).filter((emoji) =>
      this.withEmoji.test(emoji)
    );
    return result.slice(0, 20);
  }
}
exports.default = emojiAPI;
