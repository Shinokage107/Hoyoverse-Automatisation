require("dotenv").config();
const fs = require("fs");
const CronJob = require('cron').CronJob;
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const login = require('./logins/loginManager.js');
const { Console } = require("console");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  loginQ.start();
});


var loginQ = new CronJob(
	'00 21 * * * *',
	function() {
    console.log('starting logins');
    login.startHki3loginRoutine(client);
      login.startGenshinLoginRoutine(client);
      login.startTotLoginRoutine(client);
    console.log('login process ended');
	},
	null,
	true,
	'America/Los_Angeles'
);



client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  client.commands.forEach((command) => {
    if (interaction.commandName === command.name && command.type === "user") {
      command.execute(interaction);
    }

    if (interaction.commandName === command.name && command.type === "dev") {
      if (interaction.user.id === process.env.DEV_ID) {
        command.execute(interaction);
      } else {
        interaction.reply(
          "You are not a dev! The command u are trying to use is Dev only"
        );
      }
    }
  });
});

client.login(process.env.BOT_TOKEN);