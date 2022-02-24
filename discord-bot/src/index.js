const fs = require('fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const {Client, Intents, Collection} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

const commands = [];

// Loading commands from the commands folder
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Creating a collection for commands in client
client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// When the client is ready, this only runs once
client.once('ready', () => {
    console.log('Ready!');
    // Registering the commands in the client
    const CLIENT_ID = process.env.APP_ID;
    const rest = new REST({
        version: '9'
    }).setToken(process.env.TOKEN);
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                },
            );
            console.log('Successfully registered application commands globally');
        } catch (error) {
            if (error) console.error(error);
        }
    })();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!' });
    }
});

client.login(process.env.TOKEN);
