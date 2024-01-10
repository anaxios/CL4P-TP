import dotenv from "dotenv";
import Logger from "../utils/logger.js";
import TokenBuffer from "../utils/TokenBuffer.js";
import axios from "axios";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export default class TogetherAPI{
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
    // await this.init();
    try {
      //await this.buffer.enqueue(formattedMessage);
      const context = await this.collection.query({
        nResults: 10, // n_results
        queryTexts: [content], // query_text
        embeddingFunction: this.emb_fn, // embedding_function
      });
      //this.logger.debug(`LLM API CONTEXT: ${context.documents.join(" ")}`);
      let llmMessage = await this.messageBuilder({
        message: content,
        context: context.documents.join(" "),
      });
      const response = await axios.post(process.env.API_ENDPOINT, llmMessage, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_KEY}`,
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

  /**
   * Builds the message object for the FreeTrialAPI.
   * @param {Array<Object>} messageHistory - The message history.
   * @returns {Promise<Object>} The message object.
   */
  async messageBuilder(messages) {
    const { message, context } = messages;
    return {
      model: `${process.env.MODEL_NAME}`,
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
          content: `${process.env.SYSTEM_MESSAGE}`,
        },
        {
          role: "assistant",
          content: `Context: ${context}`,
        },
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
