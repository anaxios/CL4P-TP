import dotenv from "dotenv";
import Logger from "../utils/logger.js";
import CloudflareAPI from "./CloudflareAPI.js";
import DefaultAPI from "./DefaultAPI.js";
import TogetherAPI from "./TogetherAPI.js";
import j3nkn5API from "./j3nkn5API.js";

dotenv.config();

export default class llmFactory {
  constructor(db) {
    this.llm = process.env.LLM_SERVICE;
    this.logger = new Logger();
    this.db = db;
  }
  new() {
    this.logger.debug(`LLM API: ${this.llm}`);

    switch (this.llm) {
      case "cloudflare":
        return new CloudflareAPI(this.db);
        break;
      case "togetherai":
        return new TogetherAPI(this.db);
        break;
      case "j3nkn5":
        return new j3nkn5API(this.db);
        break;
      default:
        return new DefaultAPI(this.db);
    }
  }
}

//     async sendMessage(buffer, client) {
//         try {
//             let llmMessage = await this.messageBuilder(await buffer.read(), client);
//             const response = await fetch(process.env.APT_ENDPOINT,{
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': 'Bearer ' + process.env.API_KEY
//                 },
//                 body: JSON.stringify(llmMessage)
//             });
//             const data = await response.text();
//             new Logger().debug(`LLM API RESPONSE: ${data}`);
//             return data;

//         } catch (error) {
//             console.log(error);
//         }
//     }
//     async messageBuilder(messageHistory, client) {

//         return {
//             "model": `${process.env.MODEL_NAME}`,
//             // "functions": [{
//             //     "name": "get_current_weather",
//             //     "description": "Get the current weather in a given location",
//             //     "parameters": {
//             //         "type": "object",
//             //         "properties": {
//             //             "location": {
//             //                 "type": "string",
//             //                 "description": "The city and state, e.g. San Francisco, CA",
//             //             },
//             //             "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
//             //         },
//             //         "required": ["location"],
//             //     },
//             // },
//             // {
//             //     "name": "get_current_time",
//             //     "description": "Get the current time",
//             // }],
//             // "function_call": "auto",
//             "messages": [
//                 {
//                     "role": "system",
//                     "content": `${process.env.SYSTEM_MESSAGE}`
//                 },
//                 ...messageHistory.map(element => {
//                     if (element.author == client.user.id) {
//                         return {
//                             "role": "assistant",
//                             "content": element.content
//                         };
//                     } else if (element.author != client.user.id) {
//                         return {
//                             "role": "user",
//                             "content": `${element.authorName}: ${element.content}`
//                         };
//                         }
//                     })
//                 ]
//             }
//         }
// }
