// import llmFactory from "./llmAPI/llmFactory.js";
import j3nkn5API from "./llmAPI/j3nkn5API.js";
import {
  Client,
  REST,
  Partials,
  GatewayIntentBits,
  Routes,
  Collection,
  Events,
  MessageType,
  EmbedBuilder,
} from "discord.js";
// import dotenv from "dotenv";
// dotenv.config();
import Logger from "./utils/logger.js";
// import DatabaseFactory from "./db/DatabaseFactory.js";
//import { serve } from '@hono/node-server';
import { Hono } from "hono";

import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { eq, ne, gt, gte } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import emojiAPI from "./emojiAPI";

const drizzleClient = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const db = drizzle(drizzleClient);

const channels = sqliteTable("channels", {
  id: text("id").primaryKey(),
});

const emojis = sqliteTable("emojis", {
  id: text("id").primaryKey(),
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

// add commands to client to access in other files
client.commands = new Collection();

// Read all command files from the commands directory
const foldersPath = path.join("./src/commands");
const commandFolders = fs.readdirSync(foldersPath);

const loadCommands = async () => {
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      console.log(`Loading command at ${filePath}`);
      try {
        const command = await import(path.resolve(filePath));
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
          console.log(`Loaded command ${command.data}`);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
};

/**
 * Logs in the Discord bot client using the provided token.
 * @returns {Promise<void>}
 */
client.login(process.env.DISCORD_BOT_TOKEN).catch((e) => console.log(e));

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

/**
 * Initializes the slash commands for the Discord bot.
 * @returns {Promise<void>}
 */
(async () => {
  try {
    await loadCommands();
    console.log(
      `Started refreshing ${client.commands.size} application (/) commands.`
    );
    let data;
    if (process.env.MODE === "development") {
      data = await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          "998837617141493760"
        ),
        { body: client.commands.map((command) => command.data.toJSON()) }
      );
    } else {
      data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        {
          body: client.commands.map((command) => command.data.toJSON()),
        }
      );
    }
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

/**
 * Represents the slash commands for the Discord bot.
 * @type {Array<Object>}
 */

/**
 * Event handler for when the Discord bot client is ready.
 */
client.once("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  console.log("Connected to Discord Gateway");
  console.log(new Date());
  client.user?.setStatus("online");
  // await db.addBot(client.user.id, client.user.tag);
});

/**
 * Event handler for when an interaction (slash command) is created.
 * @param {Interaction} interaction - The interaction object representing the interaction.
 * @returns {Promise<void>}
 */

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) return;
//   // await db.addServer(interaction.guild.id, interaction.guild.name);

//   //TODO: fix permissions this is lame
//   if (
//     !(await interaction.member.roles.cache.some(
//       (role) => role.name === process.env.ADMIN_ROLE_NAME
//     ))
//   ) {
//     await interaction.reply(
//       "You do not have the required role to use this command."
//     );
//     return;
//   }

//   if (commandName === "dm") {
//     await interaction.reply({ content: "DMing you now!", ephemeral: true });
//     const dmChannel = await interaction.user.createDM();
//     //TODO: fix the parameters are wrong
//     await db.insert(channels).values({ id: dmChannel.id });

//     await interaction.user.send("Hello!");
//   }
// });

// const llm = new j3nkn5API(db);

// client.on("messageCreate", async (message) => {
//   if (message.author.bot) return;
//   //if (!process.env.CHANNEL_WHITELIST_ID.includes(message.channelId)) return;

//   // ########################################################################
//   let emojiIsAllowed = await db
//     .select()
//     .from(emojis)
//     .where(eq(emojis.id, message.channel.id));

//   if (emojiIsAllowed[0]?.id !== message.channel.id) {
//     logger.debug(`emoji is not allowed: ${JSON.stringify(emojiIsAllowed)}`);
//     return;
//   }
//   const emojiGetter: EmojiAPI = new emojiAPI();
//   const emoji = await emojiGetter.send(message);
//   if (emoji?.length !== 0) {
//     emoji.forEach((element: EmojiIdentifierResolvable) => {
//       message.react(element);
//     });
//   }
//   // ########################################################################
// });

// client.on("messageCreate", async (message) => {
//   if (message.author.bot) return;

//   let isAllowed = await db
//     .select()
//     .from(channels)
//     .where(eq(channels.id, message.channel.id));
//   logger.debug(`isAllowed: ${JSON.stringify(isAllowed)}`);
//   if (isAllowed[0]?.id !== message.channel.id) {
//     //logger.debug(`isAllowed: ${isAllowed[0]}`);
//     logger.warn(`Bot is not allowed in channel ${message.channel.id}`);
//     return;
//   }
//   if (message.content.startsWith(process.env.BOT_SHUTUP_PREFIX)) return;
//   if (message.type == MessageType.SYSTEM_MESSAGE) return;
//   if (message.type == MessageType.ThreadStarterMessage) return;
//   // await db.addUser(message.author.id, message.author.username);

//   // Check if the message has attachments
//   if (message.attachments.size > 0) {
//     message.attachments.forEach(async (attachment) => {
//       let atreply = await llm.storeAttachment(attachment);
//       message.reply(`${atreply}`);
//     });
//     message.reply(`Embedding started.`);
//     return;
//   }

//   let formattedMessage = await formatMessage(message);

//   try {
//     message.channel.sendTyping();

//     let res = await llm.sendMessage(formattedMessage, client);

//     let vectors = [];
//     for (let chunk of res?.vector) {
//       vectors.push(
//         `SOURCE: ${chunk.metadata.filename}\nTEXT: ${chunk.pageContent}`
//       );
//     }

//     logger.debug(`LLM MESSAGE RESPONSE: ${res}`);

//     let iterator = messageIterator(
//       `ANSWER: ${res?.query}\n\n` + vectors.join("\n\n"),
//       4096
//     );
//     for await (let chunk of iterator) {
//       const embed = new EmbedBuilder()
//         //.setTitle('ANSWER')
//         .setDescription(chunk);
//       await message.channel.send({ embeds: [embed] });
//       //.addFields();
//       //   await message.reply(chunk);
//     }
//   } catch (e) {
//     console.error(e);
//   }
// });

// async function formatMessage(message) {
//   let channel = message.channel; // The channel the command was executed
//   return {
//     author: message.author.id,
//     authorName: message.author.username,
//     content: message.content,
//   };
// }

// /**
//  * Retrieves the message history for a given channel.
//  * @param {Message} message - The message object representing the current message.
//  * @param {number} [limit=20] - The maximum number of messages to fetch.
//  * @returns {Promise<Array<Object>>} The message history.
//  */
// async function initGetMessageHistory(message, limit = 100) {
//   let channel = message.channel; // The channel the command was executed in
//   if (limit < 2) {
//     return await channel.messages
//       .fetch({ limit: 1 })
//       .then((message) => {
//         return {
//           author: message.author.id,
//           content: message.content,
//         };
//       })
//       .catch(console.error); // Fetch last 1 message
//   }
//   return await channel.messages
//     .fetch({ limit: limit }) // Fetch last 100 messages
//     .then((messages) =>
//       messages
//         .map((element) => {
//           return {
//             author: element.author.id,
//             content: element.content,
//           };
//         })
//         .filter((element) => !element.content.startsWith("%"))
//         .reverse()
//     )
//     .catch(console.error);
// }

// /**
//  * Generates an asynchronous iterator that yields chunks of an array.
//  *
//  * @param {Array} arr - The array to iterate over.
//  * @param {number} [chunkSize=2000] - The size of each chunk.
//  * @returns {AsyncGenerator<Array>} The asynchronous iterator.
//  */
// async function* messageIterator(arr, chunkSize = 2000) {
//   let index = 0;

//   while (index < arr.length) {
//     yield arr.slice(index, index + chunkSize);
//     index += chunkSize;
//   }
// }

// const hono = new Hono();
// hono.get("/status", (c) => {
//   return c.text("OK");
// });

// export default {
//   fetch: hono.fetch,
//   port: 7860,
// };
