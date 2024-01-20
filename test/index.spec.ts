// import index from "../src/emojiAPI.ts";
// // import { assert } from "chai";

// const api = new emojiAPI();
// const withEmoji = /\p{Extended_Pictographic}/u;

// describe("emoji check method", async () => {
//   const message = { content: "What a great day today!" };
//   const result = await api.send(message);

//   it("should construct", () => {
//     assert.isNotNull(api);
//   });
//   it("should have emoji", async () => {
//     assert.isNotEmpty(result);
//   });
//   it("should return array", async () => {
//     assert.isArray(result);
//   });

//   //   it("should format a message correctly", async () => {
//   //     const message = await api.messageBuilder({
//   //       message: "Hello",
//   //       context: ["I'm 99 years old.", "my name is John"].join(" "),
//   //     });
//   //     assert.deepEqual(formatted, message);
//   //   });
//   //   it("should init or get chromadb collection", async function () {
//   //     this.timeout(10000); // Increase timeout to 10000ms

//   //     assert.isNotNull(api.collection);
//   //   });

//   //   it("should respond with an answer from the LLM API", async function () {
//   //     this.timeout(100000); // Increase timeout to 10000ms

//   //     //const api = new DefaultAPI();
//   //     const response = await api.sendMessage({ content: "Hello" });

//   //     console.log(`message response: ${response}`);
//   //     assert.isNotNull(response);
//   //     assert.isNotEmpty(response);
//   //   });
// });
