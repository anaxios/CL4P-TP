import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  EmojiIdentifierResolvable,
  PermissionFlagsBits,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("delemoji")
  .setDescription("Removes bot's permissions to react with contextual emojis.")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Channel to remove permissions from")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction: CommandInteraction) {
  const { commandName } = interaction;

  if (commandName === "delemoji") {
    let channel = interaction.options.getChannel("channel");
    if (!channel) {
      await interaction.reply({
        content: "No channel found with that ID!",
        ephemeral: true,
      });
      return;
    }
    let res = await db.select().from(emojis).where(eq(emojis.id, channel.id));
    if (res.length === 0) {
      await interaction.reply({
        content: "Channel with that ID does not exist in database.",
        ephemeral: true,
      });
      return;
    }
    //await db.removeChannel(channel.id);
    await db.delete(emojis).where(eq(emojis.id, channel.id));
    await interaction.reply({
      content: "Removed bot emoji permission",
      ephemeral: true,
    });
    return;
  }
}

// const commands = [
//   {
//     name: "addemoji",
//     description: "Give Bot emoji access.",
//     dm_permission: false,
//     options: [
//       {
//         name: "channel",
//         description: "The channel to add.",
//         type: 7,
//         required: true,
//       },
//     ],
//   },
//   {
//     name: "removeemoji",
//     description: "Give Bot emoji access",
//     dm_permission: false,
//     options: [
//       {
//         name: "channel",
//         description: "The channel to add.",
//         type: 7,
//         required: true,
//       },
//     ],
//   },
//   {
//     name: "addchannel",
//     description: "Give Bot emoji access.",
//     dm_permission: false,
//     options: [
//       {
//         name: "channel",
//         description: "The channel to add.",
//         type: 7,
//         required: true,
//       },
//     ],
//   },
//   {
//     name: "removechannel",
//     description: "Give Bot channel access",
//     dm_permission: false,
//     options: [
//       {
//         name: "channel",
//         description: "The channel to add",
//         type: 7,
//         required: true,
//       },
//     ],
//   },
//   {
//     name: "dm",
//     description: "Bot will start a DM with you",
//     dm_permission: false,
//   },
// ];
