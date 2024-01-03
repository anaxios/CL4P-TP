import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Logger from "../utils/logger.js";
import TokenBuffer from '../utils/TokenBuffer.js';
import axios from 'axios';

dotenv.config();

export default class DefaultAPI {
    constructor(keyv) {
        this.logger = new Logger();
        this.buffer = new TokenBuffer(keyv, 8000);
        this.buffer.init();
    }
    async sendMessage(formattedMessage, client) {
        try {
            await this.buffer.enqueue(formattedMessage);
            let llmMessage = await this.messageBuilder(await this.buffer.read(), client);
            const response = await axios.post(`https://proxy-server-l6vsfbzhba-uw.a.run.app/complete`, llmMessage, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = response.data;
            new Logger().debug(`LLM API RESPONSE: ${data}`);
            return data;
    
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Builds the message object for the FreeTrialAPI.
     * @param {Array<Object>} messageHistory - The message history.
     * @returns {Promise<Object>} The message object.
     */
    async messageBuilder(messageHistory, client) {

        return {
            "model": `gpt-4`,
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
            "messages": [
                {
                    "role": "system",
                    "content": `${process.env.SYSTEM_MESSAGE}`
                },
                ...messageHistory.map(element => {
                    if (element.author == client.user.id) {
                        return {
                            "role": "assistant",
                            "content": element.content
                        };
                    } else if (element.author != client.user.id) {
                        return {
                            "role": "user",
                            "content": `${element.authorName}: ${element.content}`
                        };
                    }
                })
            ]
        }
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

