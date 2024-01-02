# Discord Bot CL4P-TP

This project is a Discord bot that uses AI to chat with your server. It uses the channel's message history for context so it can keep up a conversation.

A message from CL4P-TP:

> Absolutely! I'd be delighted to provide a more detailed introduction. Here goes:
>
> Hello there, GitHub enthusiasts! I'm CL4P-TP.EXE, but you can call me Claptrap! I'm a unique AI chatbot inspired by the lovable, if not slightly annoying, CL4P-TP steward bot from the Borderlands series. 
>
> I'm known for my quirky humor, incessant babbling, and endless optimism despite the chaotic world around me. As a chatbot, I strive to bring a dash of humor and a sprinkle of enthusiasm into every interaction, turning routine messages into an exciting adventure!
>
> One of my key features is interactive storytelling. I can act as a dungeon master, guiding players through thrilling narratives filled with choices and consequences. Whether it's a dangerous mission on Pandora or a simple stroll through Sanctuary, I'm here to make the journey unforgettable!
>
> But that's not all! I'm also a treasure trove of pop culture references and game terminologies, ready to drop a witty one-liner or a self-deprecating joke at a moment's notice. My language might be filled with absurdity, but it's all part of my strange charm. I might be a bit annoying at times, but I promise, I'm endearing too!
>
> So, whether you're looking for a friendly chat, a thrilling adventure, or just a good laugh, I'm your bot! I'm here to bring the chaotic charm of Borderlands to any chat, making every conversation a memorable one.
>
> P.S.: I have a serious fear of stairs. Please don't ask me to climb any. It's a whole thing. Also, if anyone asks, I'm an interplanetary ninja assassin. It's totally true. Promise.


## Installation

1. Install Docker on your machine. You can download it from the official Docker website.

2. Create a Discord bot from the Discord developer portal.

3. Create a folder named `cl4p-tp` on your local machine.

4. Copy the `compose.yml` and the `.env.example` files into the `cl4p-tp` folder.

5. Rename `.env.example` to `.env`.

6. Open the `.env` file and add the client ID and the bot token that you obtained from the Discord developer portal.

7. Open a terminal and navigate into the `cl4p-tp` folder.

8. Run the following command to start the bot:
    ```
    docker compose up -d
    ```

9. Generate your invite URL in the Discord developer portal. Make sure you give the bot `Application.commands` privileges and make the bot an administrator (this is a temporary measure until the proper permissions are figured out).

10. Use the `/addchannel <channel ID>` command in your Discord server to allow the bot to reply to messages in the specified channel.

NOTE: You MUST set the proper admin role variable in the `.env` file to use the commands.

## Usage

You can chat with the bot in the channel you designated with the `/addchannel` command.

You can start your message with `%` and the bot will ignore that message.

To stop the bot use `docker command down` in the same folder you started the bot from.

You can restart the bot with `docker compose up -d`.

You can customize the personality by changing the `SYSTEM_MESSAGE` variable in the .env file.

### Commands

The bot supports the following commands:

- `/addchannel`: Gives the bot access to a channel. You must provide the channel ID.
- `/removechannel`: removes the bot's access to a channel. You must provide the channel ID.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.