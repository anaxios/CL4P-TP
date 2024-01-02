# Discord Bot CL4P-TP

This project is a Discord bot that uses AI to chat with your server.

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

### Commands

The bot supports the following commands:

- `addchannel`: Gives the bot access to a channel. You must provide the channel ID. This command does not have DM permission.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.