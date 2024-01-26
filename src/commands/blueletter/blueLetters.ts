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

enum BlueEmojiMap {
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

enum RoundEmojiMap {
  "🇦" = "🅐",
  "🇧" = "🅑",
  "🇨" = "🅒",
  "🇩" = "🅓",
  "🇪" = "🅔",
  "🇫" = "🅕",
  "🇬" = "🅖",
  "🇭" = "🅗",
  "🇮" = "🅘",
  "🇯" = "🅙",
  "🇰" = "🅚",
  "🇱" = "🅛",
  "🇲" = "🅜",
  "🇳" = "🅝",
  "🇴" = "🅞",
  "🇵" = "🅟",
  "🇶" = "🅠",
  "🇷" = "🅡",
  "🇸" = "🅢",
  "🇹" = "🅣",
  "🇺" = "🅤",
  "🇻" = "🅥",
  "🇼" = "🅦",
  "🇽" = "🅧",
  "🇾" = "🅨",
  "🇿" = "🅩",
}

enum RoundHollowEmojiMap {
  "🅐" = "Ⓐ",
  "🅑" = "Ⓑ",
  "🅒" = "Ⓒ",
  "🅓" = "Ⓓ",
  "🅔" = "Ⓔ",
  "🅕" = "Ⓕ",
  "🅖" = "Ⓖ",
  "🅗" = "Ⓗ",
  "🅘" = "Ⓘ",
  "🅙" = "Ⓙ",
  "🅚" = "Ⓚ",
  "🅛" = "Ⓛ",
  "🅜" = "Ⓜ",
  "🅝" = "Ⓝ",
  "🅞" = "Ⓞ",
  "🅟" = "Ⓟ",
  "🅠" = "Ⓠ",
  "🅡" = "Ⓡ",
  "🅢" = "Ⓢ",
  "🅣" = "Ⓣ",
  "🅤" = "Ⓤ",
  "🅥" = "Ⓥ",
  "🅦" = "Ⓦ",
  "🅧" = "Ⓧ",
  "🅨" = "Ⓨ",
  "🅩" = "Ⓩ",
}

const uppercaseRegex = /^[A-Z]$/;

const blueEmojiRegex =
  /🇦|🇧|🇨|🇩|🇪|🇫|🇬|🇭|🇮|🇯|🇰|🇱|🇲|🇳|🇴|🇵|🇶|🇷|🇸|🇹|🇺|🇻|🇼|🇽|🇾|🇿/;

const roundEmojiRegex =
  /[\🅐\🅑\🅒\🅓\🅔\🅕\🅖\🅗\🅘\🅙\🅚\🅛\🅜\🅝\🅞\🅟\🅠\🅡\🅢\🅣\🅤\🅥\🅦\🅧\🅨\🅩]/g;

const roundHollowEmojiRegex =
  /[\Ⓐ\Ⓑ\Ⓒ\Ⓓ\Ⓔ\Ⓕ\Ⓖ\Ⓗ\Ⓘ\Ⓙ\Ⓚ\Ⓛ\Ⓜ\Ⓝ\Ⓞ\Ⓟ\Ⓠ\Ⓡ\Ⓢ\Ⓣ\Ⓤ\Ⓥ\Ⓦ\Ⓧ\Ⓨ\Ⓩ]/g;

function mapToBlueEmoji(char: string): string {
  return BlueEmojiMap[char as keyof typeof BlueEmojiMap];
}

function mapToRoundEmoji(char: string): string {
  return RoundEmojiMap[char as keyof typeof RoundEmojiMap];
}

function mapToRoundHollowEmoji(char: string): string {
  return RoundHollowEmojiMap[char as keyof typeof RoundHollowEmojiMap];
}

function filterAlphabet(
  str: string,
  regex: RegExp,
  emojiMap: Function,
  dedubMap: Function
): string[] {
  return str
    .toUpperCase()
    .split("")
    .reduce((acc: string[], char) => {
      if (regex.test(char)) {
        if (acc.find((e) => e === emojiMap(char))) {
          acc.push(dedubMap(emojiMap(char)));
        } else {
          acc.push(emojiMap(char));
        }
      }
      return acc;
    }, []);
}

export async function execute(interaction: CommandInteraction) {
  //   emoji.forEach((element: EmojiIdentifierResolvable) => {
  const message = interaction.options.getString("text") ?? "fart";
  const memeMessage: string[] = filterAlphabet(
    message,
    uppercaseRegex,
    mapToBlueEmoji,
    mapToRoundEmoji
  );
  // const roundMessage: string[] = filterAlphabet(
  //   blueMessage,
  //   blueEmojiRegex,
  //   mapToRoundEmoji,
  //   mapToRoundHollowEmoji
  // );
  console.log(memeMessage);
  if (!message) {
    return;
  }
  if (memeMessage?.length !== 0 && interaction?.channel?.lastMessage) {
    const lastMessage = interaction?.channel?.lastMessage;
    // await interaction.deferReply({ ephemeral: true });
    await interaction.deferReply({
      ephemeral: true,
    });

    for (const element of memeMessage) {
      await lastMessage?.react(element);
      // console.log((!!response && "response") || "null response");
    }
    await interaction.reply({
      content: "done!",
      ephemeral: true,
    });
  }
}
