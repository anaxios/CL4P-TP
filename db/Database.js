import pg from 'pg';
const { Pool } = pg;

export class Database {
    constructor(databaseImpl) {
        this.databaseImpl = databaseImpl;
    }

    async query(sql, params) {
        return this.databaseImpl.query(sql, params);
    }

    async disconnect() {
        return this.databaseImpl.disconnect();
    }

    async addServer(ServerID, ServerName) {
        return this.databaseImpl.addServer(ServerID, ServerName);
    }

    async removeServer(ServerID, ServerName) {
        return this.databaseImpl.removeServer(ServerID, ServerName);
    }

    async addChannel(ChannelID, ChannelName, ServerID) {
        return this.databaseImpl.addChannel(ChannelID, ChannelName, ServerID);
    }

    async removeChannel(channelID) {
        return this.databaseImpl.removeChannel(channelID);
    }

    async queryChannel(channelID) {
        return this.databaseImpl.queryChannel(channelID);
    }

    async insertMessage(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID) {
        return this.databaseImpl.insertMessage(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID);
    }

    async getMessages(UserID, BotID, ChannelID) {
        return this.databaseImpl.getMessages(UserID, BotID, ChannelID);
    }

    async addUser(userID, userName) {
        return this.databaseImpl.addUser(userID, userName);
    }
    
    async addBot(botID, botName) {
        return this.databaseImpl.addBot(botID, botName);
    }
    
    async botInteractionAllow(channelID) {
        return this.databaseImpl.botInteractionAllow(channelID);
    }

    async botInteractionDeny(channelID) {
        return this.databaseImpl.botInteractionDeny(channelID);
    }
}


export class PostgresDatabase {
    constructor() {
        this.db = new Pool({
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        });
    }

    async query(sql, params) {
        try {
            const result = await this.db.query(sql, params);
            return result.rows;
        } catch (err) {
            console.error('Error executing query', err.stack);
        }
    }

    async disconnect() {
        await this.db.end();
    }

    async addServer(ServerID, ServerName) {
        return this.query({
            text: 'INSERT INTO Servers(ServerID, ServerName) VALUES($1, $2) ON CONFLICT (ServerID) DO UPDATE SET ServerName = $2',
            values: [ ServerID, ServerName ],
          })
    }

    async removeServer(ServerID, ServerName) {
        return this.query({
            text: 'DELETE FROM Servers WHERE ServerID = $1',
            values: [ ServerID ],
          });
    }

    async addChannel(ChannelID, ChannelName, ServerID) {
        return this.query({
            text: 'INSERT INTO Channels(ChannelID, ChannelName, ServerID) VALUES($1, $2, $3) ON CONFLICT (ChannelID) DO UPDATE SET ChannelName = $2',
            values: [ ChannelID, ChannelName, ServerID ],
          })
    }

    async removeChannel(channelID) {
        return this.query({
            text: 'DELETE FROM Channels WHERE ChannelID = $1',
            values: [ channelID ],
          });
    }

    async queryChannel(channelID) {
        return this.query({
            text: 'SELECT * FROM Channels WHERE ChannelID = $1',
            values: [ channelID ],
          });
    }

    async insertMessage(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID) {
        return this.query({
            text: 'INSERT INTO ChatLogs(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID) VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [ UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID ],
          })
    }

    async getMessages(UserID, BotID, ChannelID) {
        return this.query({
            text: 'SELECT * FROM ChatLogs WHERE (UserID, BotID, ChannelID) = $1, $2, $3',
            values: [ UserID, BotID, ChannelID ],
          });
    }

    async addUser(userID, UserName) {
        return this.query({
            text: 'INSERT INTO Users(UserID, UserName) VALUES($1, $2) ON CONFLICT (UserID) DO UPDATE SET UserName = $2',
            values: [ userID, UserName ],
          });
    }

    async addBot(botID, botName) {
        return this.query({
            text: 'INSERT INTO Bots(BotID, BotName) VALUES($1, $2) ON CONFLICT (BotID) DO UPDATE SET BotName = $2',
            values: [ botID, botName ],
          });
    }

    async botInteractionAllow(channelID) {
        return this.query({
            text: 'UPDATE Channels SET IsAllowed = TRUE WHERE ChannelID = $1',
            values: [ channelID ],
          });
    }

    async botInteractionDeny(channelID) {
        return this.query({
            text: 'UPDATE Channels SET IsAllowed = FALSE WHERE ChannelID = $1',
            values: [ channelID ],
          });
    }

}