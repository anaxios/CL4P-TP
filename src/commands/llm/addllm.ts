import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  EmojiIdentifierResolvable,
  PermissionFlagsBits,
} from "discord.js";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { eq, ne, gt, gte } from "drizzle-orm";

export const data = new SlashCommandBuilder()
  .setName("addllm")
  .setDescription("Adds bot's permission to respond in channel.")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Channel to add permissions to")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction: CommandInteraction) {
  const { commandName } = interaction;

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

  // add code here

  //   if (commandName === "addchannel") {
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
  //   }
}
