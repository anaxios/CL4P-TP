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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import llmFactory from "./src/llmAPI/llmFactory.js";
var j3nkn5API_js_1 = require("./src/llmAPI/j3nkn5API.js");
var discord_js_1 = require("discord.js");
// import dotenv from "dotenv";
// dotenv.config();
var logger_js_1 = require("./src/utils/logger.js");
// import DatabaseFactory from "./db/DatabaseFactory.js";
//import { serve } from '@hono/node-server';
var hono_1 = require("hono");
var libsql_1 = require("drizzle-orm/libsql");
var client_1 = require("@libsql/client");
var drizzleClient = (0, client_1.createClient)({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});
var db = (0, libsql_1.drizzle)(drizzleClient);
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
var drizzle_orm_1 = require("drizzle-orm");
var emojiAPI_1 = require("./src/emojiAPI");
var channels = (0, sqlite_core_1.sqliteTable)("channels", {
    id: (0, sqlite_core_1.text)("id").primaryKey(),
});
var logger = new logger_js_1.default();
// const db = DatabaseFactory.createDatabase();
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.DirectMessageTyping,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
    partials: [discord_js_1.Partials.Channel],
});
/**
 * Logs in the Discord bot client using the provided token.
 * @returns {Promise<void>}
 */
client.login(process.env.DISCORD_BOT_TOKEN).catch(function (e) { return console.log(e); });
/**
 * Represents the slash commands for the Discord bot.
 * @type {Array<Object>}
 */
var commands = [
    {
        name: "addserver",
        description: "Give Bot server access. Must be server ID",
        dm_permission: false,
        options: [
            {
                name: "server",
                description: "The server to add. Must be channel ID",
                type: 6,
                required: true,
            },
        ],
    },
    {
        name: "addchannel",
        description: "Give Bot channel access. Must be channel ID",
        dm_permission: false,
        options: [
            {
                name: "channel",
                description: "The channel to add. Must be channel ID",
                type: 7,
                required: true,
            },
        ],
    },
    {
        name: "removechannel",
        description: "Give Bot channel access",
        dm_permission: false,
        options: [
            {
                name: "channel",
                description: "The channel to add",
                type: 7,
                required: true,
            },
        ],
    },
    {
        name: "dm",
        description: "Bot will start a DM with you",
        dm_permission: false,
    },
];
/**
 * Initializes the slash commands for the Discord bot.
 * @returns {Promise<void>}
 */
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var rest, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
                console.log("Started refreshing application (/) commands.");
                return [4 /*yield*/, rest.put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
                        body: commands,
                    })];
            case 1:
                _a.sent();
                // await rest.put(
                //   Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, '998837617141493760'),
                //   { body: commands }
                // );
                console.log("Successfully reloaded application (/) commands.");
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
/**
 * Event handler for when the Discord bot client is ready.
 */
client.once("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        console.log("Logged in as ".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag));
        console.log("Connected to Discord Gateway");
        console.log(new Date());
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setStatus("online");
        return [2 /*return*/];
    });
}); });
/**
 * Event handler for when an interaction (slash command) is created.
 * @param {Interaction} interaction - The interaction object representing the interaction.
 * @returns {Promise<void>}
 */
client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var commandName, channel, res, channel, res, dmChannel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isCommand())
                    return [2 /*return*/];
                return [4 /*yield*/, interaction.member.roles.cache.some(function (role) { return role.name === process.env.ADMIN_ROLE_NAME; })];
            case 1:
                if (!!(_a.sent())) return [3 /*break*/, 3];
                return [4 /*yield*/, interaction.reply("You do not have the required role to use this command.")];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3:
                commandName = interaction.commandName;
                if (!(commandName === "addchannel")) return [3 /*break*/, 11];
                channel = interaction.options.getChannel("channel");
                if (!!channel) return [3 /*break*/, 5];
                return [4 /*yield*/, interaction.reply({
                        content: "No channel found with that ID!",
                        ephemeral: true,
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/];
            case 5: return [4 /*yield*/, db
                    .select()
                    .from(channels)
                    .where((0, drizzle_orm_1.eq)(channels.id, channel.id))];
            case 6:
                res = _a.sent();
                if (!(res[0] === channel.id)) return [3 /*break*/, 8];
                return [4 /*yield*/, interaction.reply({
                        content: "Channel with that ID already exists in database.",
                        ephemeral: true,
                    })];
            case 7:
                _a.sent();
                return [2 /*return*/];
            case 8: return [4 /*yield*/, db.insert(channels).values({ id: channel.id })];
            case 9:
                _a.sent();
                return [4 /*yield*/, interaction.reply({
                        content: "Added bot chat permission in",
                        ephemeral: true,
                    })];
            case 10:
                _a.sent();
                return [2 /*return*/];
            case 11:
                if (!(commandName === "removechannel")) return [3 /*break*/, 19];
                channel = interaction.options.getChannel("channel");
                if (!!channel) return [3 /*break*/, 13];
                return [4 /*yield*/, interaction.reply({
                        content: "No channel found with that ID!",
                        ephemeral: true,
                    })];
            case 12:
                _a.sent();
                return [2 /*return*/];
            case 13: return [4 /*yield*/, db
                    .select()
                    .from(channels)
                    .where((0, drizzle_orm_1.eq)(channels.id, channel.id))];
            case 14:
                res = _a.sent();
                if (!(res.length === 0)) return [3 /*break*/, 16];
                return [4 /*yield*/, interaction.reply({
                        content: "Channel with that ID does not exist in database.",
                        ephemeral: true,
                    })];
            case 15:
                _a.sent();
                return [2 /*return*/];
            case 16: 
            //await db.removeChannel(channel.id);
            return [4 /*yield*/, db.delete(channels).where((0, drizzle_orm_1.eq)(channels.id, channel.id))];
            case 17:
                //await db.removeChannel(channel.id);
                _a.sent();
                return [4 /*yield*/, interaction.reply({
                        content: "Removed bot chat permission in",
                        ephemeral: true,
                    })];
            case 18:
                _a.sent();
                return [2 /*return*/];
            case 19:
                if (!(commandName === "dm")) return [3 /*break*/, 24];
                return [4 /*yield*/, interaction.reply({ content: "DMing you now!", ephemeral: true })];
            case 20:
                _a.sent();
                return [4 /*yield*/, interaction.user.createDM()];
            case 21:
                dmChannel = _a.sent();
                //TODO: fix the parameters are wrong
                return [4 /*yield*/, db.insert(channels).values({ id: dmChannel.id })];
            case 22:
                //TODO: fix the parameters are wrong
                _a.sent();
                return [4 /*yield*/, interaction.user.send("Hello!")];
            case 23:
                _a.sent();
                _a.label = 24;
            case 24: return [2 /*return*/];
        }
    });
}); });
var llm = new j3nkn5API_js_1.default(db);
/**
 * Event handler for when a message is created.
 * @param {Message} message - The message object representing the created message.
 * @returns {Promise<void>}
 */
client.on("messageCreate", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var isAllowed, formattedMessage, res, vectors, _i, _a, chunk, emoji, iterator, _b, iterator_1, iterator_1_1, chunk, embed, e_1_1, e_2;
    var _c, e_1, _d, _e;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                //let messageHistory = await initGetMessageHistory(message, process.env.MESSAGE_HISTORY_LIMIT);
                if (message.author.bot)
                    return [2 /*return*/];
                return [4 /*yield*/, db
                        .select()
                        .from(channels)
                        .where((0, drizzle_orm_1.eq)(channels.id, message.channel.id))];
            case 1:
                isAllowed = _g.sent();
                logger.debug("isAllowed: ".concat(JSON.stringify(isAllowed)));
                if (((_f = isAllowed[0]) === null || _f === void 0 ? void 0 : _f.id) !== message.channel.id) {
                    //logger.debug(`isAllowed: ${isAllowed[0]}`);
                    logger.warn("Bot is not allowed in channel ".concat(message.channel.id));
                    return [2 /*return*/];
                }
                if (message.content.startsWith(process.env.BOT_SHUTUP_PREFIX))
                    return [2 /*return*/];
                if (message.type == discord_js_1.MessageType.SYSTEM_MESSAGE)
                    return [2 /*return*/];
                if (message.type == discord_js_1.MessageType.ThreadStarterMessage)
                    return [2 /*return*/];
                // await db.addUser(message.author.id, message.author.username);
                // Check if the message has attachments
                if (message.attachments.size > 0) {
                    message.attachments.forEach(function (attachment) { return __awaiter(void 0, void 0, void 0, function () {
                        var atreply;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, llm.storeAttachment(attachment)];
                                case 1:
                                    atreply = _a.sent();
                                    message.reply("".concat(atreply));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    message.reply("Embedding started.");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, formatMessage(message)];
            case 2:
                formattedMessage = _g.sent();
                _g.label = 3;
            case 3:
                _g.trys.push([3, 19, , 20]);
                message.channel.sendTyping();
                return [4 /*yield*/, llm.sendMessage(formattedMessage, client)];
            case 4:
                res = _g.sent();
                vectors = [];
                for (_i = 0, _a = res === null || res === void 0 ? void 0 : res.vector; _i < _a.length; _i++) {
                    chunk = _a[_i];
                    vectors.push("SOURCE: ".concat(chunk.metadata.filename, "\nTEXT: ").concat(chunk.pageContent));
                }
                logger.debug("LLM MESSAGE RESPONSE: ".concat(res));
                return [4 /*yield*/, emojiAPI_1.default.send(message)];
            case 5:
                emoji = _g.sent();
                emoji.forEach(function (element) {
                    message.react(element);
                });
                iterator = messageIterator("ANSWER: ".concat(res === null || res === void 0 ? void 0 : res.query, "\n\n") + vectors.join("\n\n"), 4096);
                _g.label = 6;
            case 6:
                _g.trys.push([6, 12, 13, 18]);
                _b = true, iterator_1 = __asyncValues(iterator);
                _g.label = 7;
            case 7: return [4 /*yield*/, iterator_1.next()];
            case 8:
                if (!(iterator_1_1 = _g.sent(), _c = iterator_1_1.done, !_c)) return [3 /*break*/, 11];
                _e = iterator_1_1.value;
                _b = false;
                chunk = _e;
                embed = new discord_js_1.EmbedBuilder()
                    //.setTitle('ANSWER')
                    .setDescription(chunk);
                return [4 /*yield*/, message.channel.send({ embeds: [embed] })];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10:
                _b = true;
                return [3 /*break*/, 7];
            case 11: return [3 /*break*/, 18];
            case 12:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 18];
            case 13:
                _g.trys.push([13, , 16, 17]);
                if (!(!_b && !_c && (_d = iterator_1.return))) return [3 /*break*/, 15];
                return [4 /*yield*/, _d.call(iterator_1)];
            case 14:
                _g.sent();
                _g.label = 15;
            case 15: return [3 /*break*/, 17];
            case 16:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 17: return [7 /*endfinally*/];
            case 18: return [3 /*break*/, 20];
            case 19:
                e_2 = _g.sent();
                console.error(e_2);
                return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); });
function formatMessage(message) {
    return __awaiter(this, void 0, void 0, function () {
        var channel;
        return __generator(this, function (_a) {
            channel = message.channel;
            return [2 /*return*/, {
                    author: message.author.id,
                    authorName: message.author.username,
                    content: message.content,
                }];
        });
    });
}
/**
 * Retrieves the message history for a given channel.
 * @param {Message} message - The message object representing the current message.
 * @param {number} [limit=20] - The maximum number of messages to fetch.
 * @returns {Promise<Array<Object>>} The message history.
 */
function initGetMessageHistory(message, limit) {
    if (limit === void 0) { limit = 100; }
    return __awaiter(this, void 0, void 0, function () {
        var channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channel = message.channel;
                    if (!(limit < 2)) return [3 /*break*/, 2];
                    return [4 /*yield*/, channel.messages
                            .fetch({ limit: 1 })
                            .then(function (message) {
                            return {
                                author: message.author.id,
                                content: message.content,
                            };
                        })
                            .catch(console.error)];
                case 1: return [2 /*return*/, _a.sent()]; // Fetch last 1 message
                case 2: return [4 /*yield*/, channel.messages
                        .fetch({ limit: limit }) // Fetch last 100 messages
                        .then(function (messages) {
                        return messages
                            .map(function (element) {
                            return {
                                author: element.author.id,
                                content: element.content,
                            };
                        })
                            .filter(function (element) { return !element.content.startsWith("%"); })
                            .reverse();
                    })
                        .catch(console.error)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * Generates an asynchronous iterator that yields chunks of an array.
 *
 * @param {Array} arr - The array to iterate over.
 * @param {number} [chunkSize=2000] - The size of each chunk.
 * @returns {AsyncGenerator<Array>} The asynchronous iterator.
 */
function messageIterator(arr, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 2000; }
    return __asyncGenerator(this, arguments, function messageIterator_1() {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < arr.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, __await(arr.slice(index, index + chunkSize))];
                case 2: return [4 /*yield*/, _a.sent()];
                case 3:
                    _a.sent();
                    index += chunkSize;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var hono = new hono_1.Hono();
hono.get("/status", function (c) {
    return c.text("OK");
});
exports.default = {
    fetch: hono.fetch,
    port: 7860,
};
