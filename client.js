import llmFactory from "./llmAPI/llmFactory.js";
import {
    Client, REST, Partials,
    GatewayIntentBits, Routes,
    ActivityType, ChannelType, 
    MessageType
  }
    from 'discord.js';
import dotenv from 'dotenv';
import Keyv from 'keyv';
import Logger from "./utils/logger.js";

dotenv.config();
/**
 * Represents the Keyv instance for connecting to the SQLite database.
 * @type {Keyv}
 */
const keyv = new Keyv('sqlite:///app/db/database.sqlite');


/**
 * Represents the Discord bot client.
 * @type {Client}
 */
const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel]
});

/**
 * Logs in the Discord bot client using the provided token.
 * @returns {Promise<void>}
 */
client.login(process.env.DISCORD_BOT_TOKEN).catch(e => console.log(e));

/**
 * Represents the slash commands for the Discord bot.
 * @type {Array<Object>}
 */
const commands = [
  {
    name: 'addchannel',
    description: 'Give Bot channel access. Must be channel ID',
    dm_permission: false,
    options: [
      {
        name: "channel",
        description: "The channel to add. Must be channel ID",
        type: 7,
        required: true
      }
    ]
  },
  {
    name: 'removechannel',
    description: 'Give Bot channel access',
    dm_permission: false,
    options: [
      {
        name: "channel",
        description: "The channel to add",
        type: 7,
        required: true
      }
    ]
  },
  {
    name: 'dm',
    description: 'Bot will start a DM with you',
    dm_permission: false,
  }
];

/**
 * Initializes the slash commands for the Discord bot.
 * @returns {Promise<void>}
 */
(async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );
    // await rest.put(
    //   Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, '998837617141493760'),
    //   { body: commands }
    // );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

/**
 * Event handler for when the Discord bot client is ready.
 */
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Connected to Discord Gateway');
  console.log(new Date())
  client.user.setStatus('online');
});

/**
 * Event handler for when an interaction (slash command) is created.
 * @param {Interaction} interaction - The interaction object representing the interaction.
 * @returns {Promise<void>}
 */
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (! await interaction.member.roles.cache.some(role => role.name === process.env.ADMIN_ROLE_NAME)) {
    await interaction.reply('You do not have the required role to use this command.');
    return
  }

  const { commandName } = interaction;

  if (commandName === 'addchannel') {
    let channel = interaction.options.getChannel('channel');
    if (!channel) {
      await interaction.reply({ content: 'No channel found with that ID!', ephemeral: true });
      return;
    }

    // Here is where you would add your logic for giving the bot chat permission in the channel
    if(await keyv.get(channel.id)) {
      await interaction.reply({ content: 'Channel with that ID already exists in database.', ephemeral: true });
      return;
    }
    await keyv.set(channel.id, client.user.id);

    await interaction.reply({ content: 'Added bot chat permission in', ephemeral: true });

    return

  } 
  
  if (commandName === 'removechannel') {
    let channel = interaction.options.getChannel('channel');
    if (!channel) {
      await interaction.reply({ content: 'No channel found with that ID!', ephemeral: true });
      return;
    }

    // Here is where you would add your logic for removing the bot chat permission in the channel
    if(!await keyv.get(channel.id)) {
      await interaction.reply({ content: 'Channel with that ID does not exist in database.', ephemeral: true });
      return;
    }
    await keyv.delete(channel.id);

    await interaction.reply({ content: 'Removed bot chat permission in', ephemeral: true });

    return
  }

  if (commandName === 'dm') {
    await interaction.reply({ content: 'DMing you now!', ephemeral: true });
    const dmChannel = await interaction.user.createDM();
    await keyv.set(dmChannel.id, client.user.id);
    await interaction.user.send('Hello!');
  }
});


const l = new llmFactory(keyv);
const llm = l.new();


/**
 * Event handler for when a message is created.
 * @param {Message} message - The message object representing the created message.
 * @returns {Promise<void>}
 */
client.on("messageCreate", async message => {

  //let messageHistory = await initGetMessageHistory(message, process.env.MESSAGE_HISTORY_LIMIT);

  if (message.author.bot) return;
  //if (!process.env.CHANNEL_WHITELIST_ID.includes(message.channelId)) return;
  if (!await keyv.get(message.channel.id)) return;
  if (message.content.startsWith(process.env.BOT_SHUTUP_PREFIX)) return;
  if (message.type == MessageType.SYSTEM_MESSAGE) return;

  let formattedMessage = await formatMessage(message);
  
  //if (process.env.DIRECT_MESSAGES !== "true" || message.channel.type != ChannelType.DM) {
    try {
      message.channel.sendTyping();
      // if (result.response.choices[0].finish_reason == "function_call") {
      //   await message.reply("I don't know what to say to that.");
      //   return;
      // }
      var res = await llm.sendMessage(formattedMessage, client);
      // if ('result' in res) {
      //   new Logger().debug(`LLM MESSAGE RESPONSE: ${res.result.response}`);

      //   let iterator = messageIterator(res.result.response);
      //   for await (let chunk of iterator) {
      //     await message.reply(chunk);
      //   }
      //   return;
      // }

      new Logger().debug(`LLM MESSAGE RESPONSE: ${res}`);
      let iterator = messageIterator(res);
      for await (let chunk of iterator) {
        await message.reply(chunk);
      }

    } catch (e) {
      console.error(e)
    }
  }
//}
);

async function formatMessage(message) {
  let channel = message.channel; // The channel the command was executed
  return {
    "author": message.author.id,
    "authorName": message.author.username,
    "content": message.content
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
    return await channel.messages.fetch({ limit: 1 })
      .then(message => { 
        return {
            "author": message.author.id, 
            "content": message.content
        };
      }).catch(console.error); // Fetch last 1 message
  }
  return await channel.messages.fetch({ limit: limit }) // Fetch last 100 messages
    .then(messages => messages
      .map(element => {
        return {
          "author": element.author.id, 
          "content": element.content
        };
      })
      .filter(element => !element.content.startsWith('%'))
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

