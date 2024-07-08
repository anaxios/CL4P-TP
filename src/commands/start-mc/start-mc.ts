import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmojiIdentifierResolvable } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("Starts the Minecraft Server if stopped.");

export async function execute(interaction: CommandInteraction) {
  // async sendMessage(message) {
  //   const { content } = message;

  //   try {
  //     // const url = new URL(process.env.API_ENDPOINT);
  //     // url.searchParams.set("query", content);
  //     // url.searchParams.set("model", "true");
  //     // url.searchParams.set("vectors", "true");
  //     // console.log(url.toString());
  //     // const request = new Request(url, {
  //     //   method: "GET",
  //     //   headers: {
  //     //     "Content-Type": "application/text",
  //     //     Authorization: `Bearer ${process.env.API_KEY}`,
  //     //   },
  //     // });

  //     // //const response = await fetch(request);

  //     // if (!response.ok) {
  //     //   return new Error(`HTTP error! status: ${response.status}`);
  //     // }

  //     return "fart" //await response.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  await interaction.reply({
    content: "ping!",
    ephemeral: false,
  });
  return; //await response.json();

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
}
