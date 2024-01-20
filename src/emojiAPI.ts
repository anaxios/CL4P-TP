import Logger from "./utils/logger";

export type EmojiAPI = InstanceType<typeof emojiAPI>;

export default class emojiAPI {
  constructor() {
    this.logger = new Logger();
    this.withEmoji = /\p{Extended_Pictographic}/u;
  }

  async init() {
    return;
  }

  async send(message) {
    const { content } = message;

    try {
      const url = new URL("https://api.j3nkn5.cc/emoji");
      url.searchParams.set("query", content);
      url.searchParams.set("temp", "0.5");
      url.searchParams.set("model", "upstage/SOLAR-0-70b-16bit");
      console.log(url.toString());
      const request = new Request(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      });

      const response = await fetch(request);

      if (!response.ok) {
        return new Error(`HTTP error! status: ${response.status}`);
      }

      return this.testEmoji(await response.text());
    } catch (error) {
      console.log(error);
    }
  }

  testEmoji(message) {
    const result = Array.from(message).filter((emoji) =>
      this.withEmoji.test(emoji)
    );
    return result.slice(0, 20);
  }
}
