//import express from 'express';
import axios from 'axios';
//import bodyParser from 'body-parser';

export default class FreeTrialAPI {

    async sendMessage(message) {
        try {
            const response = await axios.post('https://proxy-server-l6vsfbzhba-uw.a.run.app/complete', 
                message,
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
            return response;
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

