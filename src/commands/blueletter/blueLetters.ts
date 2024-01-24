import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmojiIdentifierResolvable } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("b")
  .setDescription(
    "reacts to the last message in channel with the text provided with blue emoji letters."
  )
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("text to react to with blue letters")
      .setRequired(true)
      .setMaxLength(20)
  );

enum AlphabetEmoji {
  A = "🇦",
  B = "🇧",
  C = "🇨",
  D = "🇩",
  E = "🇪",
  F = "🇫",
  G = "🇬",
  H = "🇭",
  I = "🇮",
  J = "🇯",
  K = "🇰",
  L = "🇱",
  M = "🇲",
  N = "🇳",
  O = "🇴",
  P = "🇵",
  Q = "🇶",
  R = "🇷",
  S = "🇸",
  T = "🇹",
  U = "🇺",
  V = "🇻",
  W = "🇼",
  X = "🇽",
  Y = "🇾",
  Z = "🇿",
}

function mapStringArrayToEmoji(str: string[]): string[] {
  let emojiStr = [];
  for (let char of str) {
    emojiStr.push(AlphabetEmoji[char as keyof typeof AlphabetEmoji]);
  }
  return emojiStr;
}

function filterAlphabet(str: string): string[] {
  return str
    .toUpperCase()
    .split("")
    .filter((char) => /^[A-Za-z]$/.test(char));
}

export async function execute(interaction: CommandInteraction) {
  //   emoji.forEach((element: EmojiIdentifierResolvable) => {
  const message = interaction.options.getString("text") ?? "fart";
  const blueMessage: string[] = mapStringArrayToEmoji(filterAlphabet(message));
  console.log(blueMessage);
  if (!message) {
    return;
  }
  if (blueMessage?.length !== 0 && blueMessage?.length <= 20) {
    blueMessage.forEach(async (element: EmojiIdentifierResolvable) => {
      //await interaction.deferReply({ ephemeral: true });
      const response = await interaction?.channel?.lastMessage?.react(element);
      console.log(response);
      //await interaction.reply({ content: "done!", ephemeral: true });
    });
    //   });
    // }
  }
}
