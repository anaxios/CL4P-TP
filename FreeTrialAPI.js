//import express from 'express';
import axios from 'axios';
//import bodyParser from 'body-parser';
import CircularBuffer from './utils/CircularBuffer.js';
import dotenv from 'dotenv';

dotenv.config();

export default class FreeTrialAPI {
    async sendMessage(buffer, client) {
        try {
            let llmMessage = await this.messageBuilder(await buffer.read(), client);
            const response = await axios.post('https://proxy-server-l6vsfbzhba-uw.a.run.app/complete', 
                llmMessage,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
            if (response) {
                return response;
            } else {
                console.log('Response is undefined');
                return response.data;
            }
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
            "model": "gpt-4",
            "messages": [
                {
                    "role": "system",
                    "content": process.env.SYSTEM_MESSAGE
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

