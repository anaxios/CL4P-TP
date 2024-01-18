"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDatabase = exports.Database = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
class Database {
    constructor(databaseImpl) {
        this.databaseImpl = databaseImpl;
    }
    query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.query(sql, params);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.disconnect();
        });
    }
    addServer(ServerID, ServerName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.addServer(ServerID, ServerName);
        });
    }
    removeServer(ServerID, ServerName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.removeServer(ServerID, ServerName);
        });
    }
    addChannel(ChannelID, ChannelName, ServerID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.addChannel(ChannelID, ChannelName, ServerID);
        });
    }
    removeChannel(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.removeChannel(channelID);
        });
    }
    queryChannel(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.queryChannel(channelID);
        });
    }
    insertMessage(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.insertMessage(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID);
        });
    }
    getMessages(UserID, BotID, ChannelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.getMessages(UserID, BotID, ChannelID);
        });
    }
    addUser(userID, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.addUser(userID, userName);
        });
    }
    addBot(botID, botName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.addBot(botID, botName);
        });
    }
    botInteractionAllow(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.botInteractionAllow(channelID);
        });
    }
    botInteractionDeny(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseImpl.botInteractionDeny(channelID);
        });
    }
}
exports.Database = Database;
class PostgresDatabase {
    constructor() {
        this.db = new Pool({
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        });
    }
    query(sql, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.query(sql, params);
                return result.rows;
            }
            catch (err) {
                console.error('Error executing query', err.stack);
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.end();
        });
    }
    addServer(ServerID, ServerName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'INSERT INTO Servers(ServerID, ServerName) VALUES($1, $2) ON CONFLICT (ServerID) DO UPDATE SET ServerName = $2',
                values: [ServerID, ServerName],
            });
        });
    }
    removeServer(ServerID, ServerName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'DELETE FROM Servers WHERE ServerID = $1',
                values: [ServerID],
            });
        });
    }
    addChannel(ChannelID, ChannelName, ServerID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'INSERT INTO Channels(ChannelID, ChannelName, ServerID) VALUES($1, $2, $3) ON CONFLICT (ChannelID) DO UPDATE SET ChannelName = $2',
                values: [ChannelID, ChannelName, ServerID],
            });
        });
    }
    removeChannel(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'DELETE FROM Channels WHERE ChannelID = $1',
                values: [channelID],
            });
        });
    }
    queryChannel(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'SELECT * FROM Channels WHERE ChannelID = $1',
                values: [channelID],
            });
        });
    }
    insertMessage(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'INSERT INTO ChatLogs(UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID) VALUES($1, $2, $3, $4, $5, $6, $7)',
                values: [UserID, BotID, ChannelID, MessageFromUser, MessageFromBot, UserMessageVectorID, BotMessageVectorID],
            });
        });
    }
    getMessages(UserID, BotID, ChannelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'SELECT * FROM ChatLogs WHERE (UserID, BotID, ChannelID) = $1, $2, $3',
                values: [UserID, BotID, ChannelID],
            });
        });
    }
    addUser(userID, UserName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'INSERT INTO Users(UserID, UserName) VALUES($1, $2) ON CONFLICT (UserID) DO UPDATE SET UserName = $2',
                values: [userID, UserName],
            });
        });
    }
    addBot(botID, botName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'INSERT INTO Bots(BotID, BotName) VALUES($1, $2) ON CONFLICT (BotID) DO UPDATE SET BotName = $2',
                values: [botID, botName],
            });
        });
    }
    botInteractionAllow(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'UPDATE Channels SET IsAllowed = TRUE WHERE ChannelID = $1',
                values: [channelID],
            });
        });
    }
    botInteractionDeny(channelID) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query({
                text: 'UPDATE Channels SET IsAllowed = FALSE WHERE ChannelID = $1',
                values: [channelID],
            });
        });
    }
}
exports.PostgresDatabase = PostgresDatabase;
