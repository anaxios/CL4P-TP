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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const j3nkn5API_js_1 = __importDefault(require("./src/llmAPI/j3nkn5API.js"));
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logger_js_1 = __importDefault(require("./src/utils/logger.js"));
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const libsql_1 = require("drizzle-orm/libsql");
const client_1 = require("@libsql/client");
const drizzleClient = (0, client_1.createClient)({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = (0, libsql_1.drizzle)(drizzleClient);
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
const channels = (0, sqlite_core_1.sqliteTable)('channels', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
});
const logger = new logger_js_1.default();
const client = new discord_js_1.Client({
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
client.login(process.env.DISCORD_BOT_TOKEN).catch((e) => console.log(e));
const commands = [
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);
        console.log("Started refreshing application (/) commands.");
        yield rest.put(discord_js_1.Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
            body: commands,
        });
        console.log("Successfully reloaded application (/) commands.");
    }
    catch (error) {
        console.error(error);
    }
}))();
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Logged in as ${client.user.tag}`);
    console.log("Connected to Discord Gateway");
    console.log(new Date());
    client.user.setStatus("online");
}));
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    if (!(yield interaction.member.roles.cache.some((role) => role.name === process.env.ADMIN_ROLE_NAME))) {
        yield interaction.reply("You do not have the required role to use this command.");
        return;
    }
    const { commandName } = interaction;
    if (commandName === "addchannel") {
        let channel = interaction.options.getChannel("channel");
        if (!channel) {
            yield interaction.reply({
                content: "No channel found with that ID!",
                ephemeral: true,
            });
            return;
        }
        let res = yield db.select().from(channels).where((0, drizzle_orm_1.eq)(channels.id, channel.id));
        if (res[0] === channel.id) {
            yield interaction.reply({
                content: "Channel with that ID already exists in database.",
                ephemeral: true,
            });
            return;
        }
        yield db.insert(channels).values({ id: channel.id });
        yield interaction.reply({
            content: "Added bot chat permission in",
            ephemeral: true,
        });
        return;
    }
    if (commandName === "removechannel") {
        let channel = interaction.options.getChannel("channel");
        if (!channel) {
            yield interaction.reply({
                content: "No channel found with that ID!",
                ephemeral: true,
            });
            return;
        }
        let res = yield db.select().from(channels).where((0, drizzle_orm_1.eq)(channels.id, channel.id));
        if (res.length === 0) {
            yield interaction.reply({
                content: "Channel with that ID does not exist in database.",
                ephemeral: true,
            });
            return;
        }
        yield db.delete(channels).where((0, drizzle_orm_1.eq)(channels.id, channel.id));
        yield interaction.reply({
            content: "Removed bot chat permission in",
            ephemeral: true,
        });
        return;
    }
    if (commandName === "dm") {
        yield interaction.reply({ content: "DMing you now!", ephemeral: true });
        const dmChannel = yield interaction.user.createDM();
        yield db.insert(channels).values({ id: dmChannel.id });
        yield interaction.user.send("Hello!");
    }
}));
const llm = new j3nkn5API_js_1.default(db);
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d;
    if (message.author.bot)
        return;
    let isAllowed = yield db.select().from(channels).where((0, drizzle_orm_1.eq)(channels.id, message.channel.id));
    logger.debug(`isAllowed: ${JSON.stringify(isAllowed)}`);
    if (((_d = isAllowed[0]) === null || _d === void 0 ? void 0 : _d.id) !== message.channel.id) {
        logger.warn(`Bot is not allowed in channel ${message.channel.id}`);
        return;
    }
    if (message.content.startsWith(process.env.BOT_SHUTUP_PREFIX))
        return;
    if (message.type == discord_js_1.MessageType.SYSTEM_MESSAGE)
        return;
    if (message.type == discord_js_1.MessageType.ThreadStarterMessage)
        return;
    if (message.attachments.size > 0) {
        message.attachments.forEach((attachment) => __awaiter(void 0, void 0, void 0, function* () {
            let atreply = yield llm.storeAttachment(attachment);
            message.reply(`${atreply}`);
        }));
        message.reply(`Embedding started.`);
        return;
    }
    let formattedMessage = yield formatMessage(message);
    try {
        message.channel.sendTyping();
        let res = yield llm.sendMessage(formattedMessage, client);
        logger.debug(`LLM MESSAGE RESPONSE: ${res}`);
        let iterator = messageIterator(res);
        try {
            for (var _e = true, iterator_1 = __asyncValues(iterator), iterator_1_1; iterator_1_1 = yield iterator_1.next(), _a = iterator_1_1.done, !_a; _e = true) {
                _c = iterator_1_1.value;
                _e = false;
                let chunk = _c;
                yield message.reply(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = iterator_1.return)) yield _b.call(iterator_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (e) {
        console.error(e);
    }
}));
function formatMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        let channel = message.channel;
        return {
            author: message.author.id,
            authorName: message.author.username,
            content: message.content,
        };
    });
}
function initGetMessageHistory(message, limit = 100) {
    return __awaiter(this, void 0, void 0, function* () {
        let channel = message.channel;
        if (limit < 2) {
            return yield channel.messages
                .fetch({ limit: 1 })
                .then((message) => {
                return {
                    author: message.author.id,
                    content: message.content,
                };
            })
                .catch(console.error);
        }
        return yield channel.messages
            .fetch({ limit: limit })
            .then((messages) => messages
            .map((element) => {
            return {
                author: element.author.id,
                content: element.content,
            };
        })
            .filter((element) => !element.content.startsWith("%"))
            .reverse())
            .catch(console.error);
    });
}
function messageIterator(arr, chunkSize = 2000) {
    return __asyncGenerator(this, arguments, function* messageIterator_1() {
        let index = 0;
        while (index < arr.length) {
            yield yield __await(arr.slice(index, index + chunkSize));
            index += chunkSize;
        }
    });
}
const hono = new hono_1.Hono();
hono.get('/status', (c) => {
    return c.text('OK');
});
(0, node_server_1.serve)({
    fetch: hono.fetch,
    port: 7860,
});
