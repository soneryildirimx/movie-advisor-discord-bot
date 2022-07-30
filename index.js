import { Client, GatewayIntentBits, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { hitMe } from "./utils.js";
import { commands } from "./enums.js";
import dotenv from "dotenv";
dotenv.config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
      { body: commands }
    );
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hit-me") {
    const movie = await hitMe();
    await interaction.reply(movie);
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "ping") {
    message.reply("Pong");
  }
});

client.login(process.env.TOKEN);
