import TogetherAPI from "../llmAPI/TogetherAPI.js";
import { assert } from "chai";
import dotenv from "dotenv";
dotenv.config();
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

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

const api = new TogetherAPI();
api.cc = new ChromaClient({ path: "http://localhost:8000" });
await api.init();

describe("TogetherAPI", () => {
  it("should construct", () => {
    assert.isNotNull(api);
  });

  it("should format a message correctly", async () => {
    const message = await api.messageBuilder({
      message: "Hello",
      context: ["I'm 99 years old.", "my name is John"].join(" "), 
    });
    assert.deepEqual(formatted, message); 
  });
  it("should init or get chromadb collection", async function () {
    this.timeout(10000); // Increase timeout to 10000ms

    assert.isNotNull(api.collection);
  });

  it("should respond with an answer from the LLM API", async function () {
    this.timeout(100000); // Increase timeout to 10000ms

    //const api = new DefaultAPI();
    const response = await api.sendMessage({ content: "Hello" });

    console.log(`message response: ${response}`);
    assert.isNotNull(response);
    assert.isNotEmpty(response);
  });
});
