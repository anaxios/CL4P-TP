// import dotenv from "dotenv";
// dotenv.config();
import Logger from "../utils/logger.js";
// import TokenBuffer from "../utils/TokenBuffer.js";
// import axios from "axios";
// import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
// import { v4 as uuidv4 } from "uuid";
// import CryptoJS from "crypto-js";


export default class j3nkn5API {
  constructor(db) {
    this.logger = new Logger();
    this.buffer = null;
    this.cc = null;
    this.collection = null;
    this.emb_fn = null;
  }

  async init() {
    return;
  }

  async sendMessage(message) {
    const { content } = message;

    try {
      const url = new URL(process.env.API_ENDPOINT); 
      url.searchParams.set("q", content);
      const request = new Request(url, {
		    method: 'GET',
        headers: {
          "Content-Type": "application/text",
          "Authorization": `Bearer ${process.env.API_KEY}`,
      }});

      const response = await fetch(request);
      return await response.text();
    } catch (error) {
      console.log(error);
    }
  }

  async storeAttachment(attachment) {
    console.log(`store attachments: ${attachment.name}`);
    if (attachment.name.endsWith(".txt")) {
      return "Not implimented.";
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
