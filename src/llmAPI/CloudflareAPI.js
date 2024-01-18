import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Logger from "../utils/logger.js";
import DefaultAPI from "./DefaultAPI.js";

dotenv.config();

export default class CloudflareAPI extends DefaultAPI {
    constructor(keyv) {
        super(keyv);
    }
    async sendMessage(formattedMessage, client) {
        try {
            await this.buffer.enqueue(formattedMessage);
            let llmMessage = await this.messageBuilder(await this.buffer.read(), client);
            const response = await fetch(process.env.APT_ENDPOINT,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(llmMessage)
            });
            const data = await response.text();
            new Logger().debug(`LLM API RESPONSE: ${data.replace(/\\n/g, '<br>')}`);
            return data;

        } catch (error) {
            console.log(error);
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

