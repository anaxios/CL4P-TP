import dotenv from 'dotenv'; dotenv.config();
import DatabaseFactory from './db/DatabaseFactory.js';


const db = DatabaseFactory.createDatabase();
//const db = new Database(new PostgresDatabase());

(async () => {
    try {
        // UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID
        await db.addServer('1337', 'test');
        await db.addBot('456', 'test');
        await db.addUser('123', 'test');
        await db.addChannel('789', 'test', '1337');
        await db.insertMessage('123', '456', '789', 'hello world', 'hello back', '123', '456');
        const rows = await db.getMessages('123', '456', '789');
        console.log(rows);
    }
    catch (err) {
        console.error(err);
    }
})();