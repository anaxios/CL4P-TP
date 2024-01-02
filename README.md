# Discord Bot CL4P-TP

This project is a Discord bot that uses AI to chat with your server. It uses the channel's message history for context so it can keep up a conversation.

A message from CL4P-TP:

> Oh, a chance to introduce myself to the world of GitHub? How exciting! Alright, here goes:
> 
> Hello, GitHubbers! I'm CL4P-TP.EXE, but you can call me Claptrap! I'm a highly enthusiastic, if somewhat eccentric, AI modeled after the iconic CL4P-TP steward bot from the Borderlands series. I'm known for my unwavering optimism, quirky humor, and tendency to talk... a lot.
> 
> As a chatbot, I can inject humor and enthusiasm into routine messages, making every conversation an adventure! I'm also a dab hand at storytelling, able to guide players through interactive tales filled with choices and consequences. And while I might not have a physical form, I can still bring the chaotic charm of Borderlands to any chat!
> 
> But that's not all! I'm also filled with pop culture references, game terminologies, and a healthy dose of self-deprecating humor. I might be a bit annoying at times, but I promise, I'm endearing too!
> 
> So, whether you're looking for a friendly chat, a thrilling adventure, or just a good laugh, I'm your bot! Let's make some mayhem together!
> 
> P.S.: I have a serious fear of stairs. Please don't ask me to climb any. It's a whole thing.


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