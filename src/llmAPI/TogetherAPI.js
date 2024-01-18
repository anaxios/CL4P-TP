import dotenv from "dotenv";
import Logger from "../utils/logger.js";
import TokenBuffer from "../utils/TokenBuffer.js";
import axios from "axios";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

dotenv.config();

export default class TogetherAPI {
  constructor(db) {
    this.logger = new Logger();
    this.buffer = new TokenBuffer(db, 8000);
    this.buffer.init();
    this.cc = new ChromaClient({ path: "http://chromadb:8000" });
    this.collection = null;
    this.emb_fn = new OpenAIEmbeddingFunction({
      openai_api_key: process.env.OPENAI_API_KEY,
    });
  }

  async init() {
    try {
      this.collection = await this.cc.getCollection({
        name: "test2",
        embeddingFunction: this.emb_fn, // embedding_function
      });
    } catch (e) {
      // if (this.collection === null) {
      this.collection = await this.cc.createCollection({
        name: "test2",
        embeddingFunction: this.emb_fn,
      });
      // }
    }
  }

  async sendMessage(message) {
    const { content } = message;

    try {
      //await this.buffer.enqueue(formattedMessage);
      const context = await this.collection.query({
        nResults: 20, // n_results
        queryTexts: [content], // query_text
        embeddingFunction: this.emb_fn, // embedding_function
      });
      this.logger.debug(`LLM API CONTEXT: ${context.documents.join(" ")}`);
      let llmMessage = await this.messageBuilder({
        message: content,
        context: context.documents.join(" "),
      });
      const response = await axios.post(process.env.API_ENDPOINT, llmMessage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      });
      const data = response.data;
      // await this.collection.add({
      //   ids: [uuidv4()],
      //   documents: [content + " " + data.choices[0].message.content],
      //   embeddingFunction: this.emb_fn, // embedding_function
      // });
      //this.logger.debug(`LLM API RESPONSE: ${data}`);
      return data.choices[0].message.content;
    } catch (error) {
      console.log(error);
    }
  }

  async storeAttachment(attachment) {
    console.log(`store attachments: ${attachment.name}`);
    if (attachment.name.endsWith(".txt")) {
      const response = await axios.get(attachment.url, {
        responseType: "text",
      });

      const data = response.data.split(/\n\s*\n/);

      data.forEach(async (element) => {
        await this.addWithRetry(element);
      });
      return "Embedding finished.";
    }
  }

  async addWithRetry(element, retries = 30, delay = 200000) {
    try {
      let hash = CryptoJS.SHA256(element).toString(CryptoJS.enc.Hex);

      await this.collection.add({
        ids: [hash],
        documents: [element],
        embeddingFunction: this.emb_fn, // embedding_function
      });
    } catch (error) {
      if (retries <= 0) {
        throw new Error("No more retries left");
      }
      // Wait for 'delay' milliseconds before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.addWithRetry(element, retries - 1, delay);
    }
  }

  /**
   * Builds the message object for the FreeTrialAPI.
   * @param {Array<Object>} messageHistory - The message history.
   * @returns {Promise<Object>} The message object.
   */
  async messageBuilder(messages) {
    const { message, context } = messages;
    return {
      model: `${process.env.MODEL_NAME}`,
      max_tokens: 1024,
      temperature: 0.1,
      // "functions": [{
      //     "name": "get_current_weather",
      //     "description": "Get the current weather in a given location",
      //     "parameters": {
      //         "type": "object",
      //         "properties": {
      //             "location": {
      //                 "type": "string",
      //                 "description": "The city and state, e.g. San Francisco, CA",
      //             },
      //             "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
      //         },
      //         "required": ["location"],
      //     },
      // },
      // {
      //     "name": "get_current_time",
      //     "description": "Get the current time",
      // }],
      // "function_call": "auto",
      messages: [
        {
          role: "system",
          content: `${process.env.SYSTEM_MESSAGE} Context: ${context}`,
        },
        // {
        //   role: "assistant",
        //   content: `Context: ${context}`,
        // },
        {
          role: "user",
          content: `${message}`,
        },
      ],
    };
  }
}
// const testMessage = {
//     "model": "gpt-4",
//     "messages": [
//       {
//         "role": "system",
//         "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."
//       },
//       {
//         "role": "user",
//         "content": "Compose a line about recursion in programming."
//       }
//     ]
//   };

// const app = express();
// app.use(bodyParser.json());
// const thing = new FreeTrialAPI();

// // app.post('/v1/chat/completion', async (req, res) => {
// //     //var data = req.body;
// //     var dj =  await thing.sendMessage(testMessage);
// //     console.log(dj);
// //     res.json(dj);

// // });

// app.post('/v1/chat/completions', async (req, res) => {
//     console.log(req.body);
//     try {
//         var dj = await thing.sendMessage(req.body);
//         console.log(dj.data);
//         res.json(dj.data);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send(err);
//     }
// });

// app.listen(3000, () => console.log('Server running on port 3000'));
