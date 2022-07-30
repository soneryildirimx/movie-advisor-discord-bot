import {
  Client,
  GatewayIntentBits,
  Routes,
  ActionRowBuilder,
  SelectMenuBuilder,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { hitMe, getRandomMovieByGenre } from "./utils.js";
import { commands, genres } from "./enums.js";
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
    await interaction.reply("Working on it.");
    const movie = await hitMe();
    await interaction.editReply(movie);
    return;
  }
  if (interaction.commandName === "genre") {
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("genre")
        .setPlaceholder("Nothing selected")
        .addOptions(...genres)
    );
    await interaction.reply({ content: "Select a genre", components: [row] });
  }
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === "genre") {
    await interaction.deferUpdate();
    const genreId = interaction.values[0];
    const movie = await getRandomMovieByGenre(genreId);
    await interaction.editReply(movie);
  }
});

client.login(process.env.TOKEN);
