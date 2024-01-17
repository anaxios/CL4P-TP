import llmFactory from "./llmAPI/llmFactory.js";
import {
  Client,
  REST,
  Partials,
  GatewayIntentBits,
  Routes,
  ActivityType,
  ChannelType,
  MessageType,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import Logger from "./utils/logger.js";
// import DatabaseFactory from "./db/DatabaseFactory.js";
import { serve } from '@hono/node-server';
import { Hono } from "hono";

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
const drizzleClient = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(drizzleClient);

import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { eq, ne, gt, gte } from "drizzle-orm";

const channels = sqliteTable('channels', {
  id: text('id').primaryKey(),
});


const logger = new Logger();
// const db = DatabaseFactory.createDatabase();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

/**
 * Logs in the Discord bot client using the provided token.
 * @returns {Promise<void>}
 */
client.login(process.env.DISCORD_BOT_TOKEN).catch((e) => console.log(e));

/**
 * Represents the slash commands for the Discord bot.
 * @type {Array<Object>}
 */
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

/**
 * Initializes the slash commands for the Discord bot.
 * @returns {Promise<void>}
 */
(async () => {
  try {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN
    );
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });
    // await rest.put(
    //   Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, '998837617141493760'),
    //   { body: commands }
    // );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

/**
 * Event handler for when the Discord bot client is ready.
 */
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log("Connected to Discord Gateway");
  console.log(new Date());
  client.user.setStatus("online");
  // await db.addBot(client.user.id, client.user.tag);
});

/**
 * Event handler for when an interaction (slash command) is created.
 * @param {Interaction} interaction - The interaction object representing the interaction.
 * @returns {Promise<void>}
 */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  // await db.addServer(interaction.guild.id, interaction.guild.name);

  //TODO: fix permissions this is lame
  if (
    !(await interaction.member.roles.cache.some(
      (role) => role.name === process.env.ADMIN_ROLE_NAME
    ))
  ) {
    await interaction.reply(
      "You do not have the required role to use this command."
    );
    return;
  }

  const { commandName } = interaction;

  if (commandName === "addchannel") {
    let channel = interaction.options.getChannel("channel");
    if (!channel) {
      await interaction.reply({
        content: "No channel found with that ID!",
        ephemeral: true,
      });
      return;
    }

    let res = await db.select().from(channels).where(eq(channels.id, channel.id));
    if (res[0] === channel.id) {
      await interaction.reply({
        content: "Channel with that ID already exists in database.",
        ephemeral: true,
      });
      return;
    }
    await db.insert(channels).values({ id: channel.id });
    

    await interaction.reply({
      content: "Added bot chat permission in",
      ephemeral: true,
    });

    return;
  }

  if (commandName === "removechannel") {
    let channel = interaction.options.getChannel("channel");
    if (!channel) {
      await interaction.reply({
        content: "No channel found with that ID!",
        ephemeral: true,
      });
      return;
    }

    let res = await db.select().from(channels).where(eq(channels.id, channel.id));
    if (res.length === 0) {
      await interaction.reply({
        content: "Channel with that ID does not exist in database.",
        ephemeral: true,
      });
      return;
    }
    //await db.removeChannel(channel.id);
    await db.delete(channels).where(eq(channels.id, channel.id));

    await interaction.reply({
      content: "Removed bot chat permission in",
      ephemeral: true,
    });

    return;
  }

  if (commandName === "dm") {
    await interaction.reply({ content: "DMing you now!", ephemeral: true });
    const dmChannel = await interaction.user.createDM();
    //TODO: fix the parameters are wrong
    await db.insert(channels).values({ id: dmChannel.id });

    await interaction.user.send("Hello!");
  }
});

const l = new llmFactory(db);
const llm = l.new();
llm.init();

/**
 * Event handler for when a message is created.
 * @param {Message} message - The message object representing the created message.
 * @returns {Promise<void>}
 */
client.on("messageCreate", async (message) => {
  //let messageHistory = await initGetMessageHistory(message, process.env.MESSAGE_HISTORY_LIMIT);

  if (message.author.bot) return;
  //if (!process.env.CHANNEL_WHITELIST_ID.includes(message.channelId)) return;
  let isAllowed = await db.select().from(channels).where(eq(channels.id, message.channel.id));
  logger.debug(`isAllowed: ${JSON.stringify(isAllowed)}`);
  if (isAllowed[0]?.id !== message.channel.id) {
    //logger.debug(`isAllowed: ${isAllowed[0]}`);
    logger.warn(`Bot is not allowed in channel ${message.channel.id}`);
    return;
  }
  if (message.content.startsWith(process.env.BOT_SHUTUP_PREFIX)) return;
  if (message.type == MessageType.SYSTEM_MESSAGE) return;
  if (message.type == MessageType.ThreadStarterMessage) return;
  // await db.addUser(message.author.id, message.author.username);

  // Check if the message has attachments
  if (message.attachments.size > 0) {
    message.attachments.forEach(async (attachment) => {
      let atreply = await llm.storeAttachment(attachment);
      message.reply(`${atreply}`);
    });
    message.reply(`Embedding started.`);
    return;
  }

  let formattedMessage = await formatMessage(message);

  try {
    message.channel.sendTyping();

    let res = await llm.sendMessage(formattedMessage, client);

    // db.insertMessage(
    //   message.author.id,
    //   client.user.id,
    //   message.channel.id,
    //   formattedMessage.content,
    //   res,
    //   "0",
    //   "0"
    // );
    logger.debug(`LLM MESSAGE RESPONSE: ${res}`);

    let iterator = messageIterator(res);
    for await (let chunk of iterator) {
      await message.reply(chunk);
    }
  } catch (e) {
    console.error(e);
  }
});

async function formatMessage(message) {
  let channel = message.channel; // The channel the command was executed
  return {
    author: message.author.id,
    authorName: message.author.username,
    content: message.content,
  };
}

/**
 * Retrieves the message history for a given channel.
 * @param {Message} message - The message object representing the current message.
 * @param {number} [limit=20] - The maximum number of messages to fetch.
 * @returns {Promise<Array<Object>>} The message history.
 */
async function initGetMessageHistory(message, limit = 100) {
  let channel = message.channel; // The channel the command was executed in
  if (limit < 2) {
    return await channel.messages
      .fetch({ limit: 1 })
      .then((message) => {
        return {
          author: message.author.id,
          content: message.content,
        };
      })
      .catch(console.error); // Fetch last 1 message
  }
  return await channel.messages
    .fetch({ limit: limit }) // Fetch last 100 messages
    .then((messages) =>
      messages
        .map((element) => {
          return {
            author: element.author.id,
            content: element.content,
          };
        })
        .filter((element) => !element.content.startsWith("%"))
        .reverse()
    )
    .catch(console.error);
}

/**
 * Generates an asynchronous iterator that yields chunks of an array.
 *
 * @param {Array} arr - The array to iterate over.
 * @param {number} [chunkSize=2000] - The size of each chunk.
 * @returns {AsyncGenerator<Array>} The asynchronous iterator.
 */
async function* messageIterator(arr, chunkSize = 2000) {
  let index = 0;

  while (index < arr.length) {
    yield arr.slice(index, index + chunkSize);
    index += chunkSize;
  }
}

const hono = new Hono();
hono.get('/status', (c) => {
  return c.text('OK');
});

serve({
  fetch: hono.fetch,
  port: 7860,
});