import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmojiIdentifierResolvable } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("link")
  .setDescription("Get the current link of the minecraft server.");

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply({ ephemeral: false });

    const endpoint = "https://api.my-mc.link/my-link";

    const url = new URL(endpoint);

    console.log(url.toString());

    const request = new Request(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-my-mc-auth": process.env.MY_MC_API,
      },
    });

    const response = await fetch(request);

    if (!response.ok) {
      return new Error(`HTTP error! status: ${response.status}`);
    }

    //console.log(await response.json());

    const message = await response.json();
    await interaction.editReply({
      content: `**LINK:** ${message.hostname}:${message.port}`,
      ephemeral: false,
    });
  } catch (error) {
    console.log(error);
  }

  return; //await response.json();
}

//   emoji.forEach((element: EmojiIdentifierResolvable) => {
// const text = interaction.options.getString("text") ?? "fart";
// const memeMessage: string[] = filterAlphabet(
//   text,
//   uppercaseRegex,
//   mapToBlueEmoji,
//   mapToRoundEmoji
// );
// // const roundMessage: string[] = filterAlphabet(
// //   blueMessage,
// //   blueEmojiRegex,
// //   mapToRoundEmoji,
// //   mapToRoundHollowEmoji
// // );
// console.log(memeMessage);
// if (!text) {
//   return;
// }

// await interaction.deferReply({
//   ephemeral: true,
// });

// if (memeMessage?.length !== 0 && interaction?.channel?.lastMessage) {
//   const lastMessage = interaction?.channel?.lastMessage;
//   // await interaction.deferReply({ ephemeral: true });

//   for (const element of memeMessage) {
//     await lastMessage?.react(element);
//     // console.log((!!response && "response") || "null response");
//   }
// }

// await interaction.reply({
//   content: "done!",
//   ephemeral: true,
// });
