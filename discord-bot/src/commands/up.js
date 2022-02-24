const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('up')
        .setDescription('docker-compose up -d'),
    async execute(interaction) {
        try {
            execute_command('docker-compose up -d', process.env.BASE);
            interaction.reply({ content: '서버 ON' });
        } catch (e){
            console.error(e.message);
        }
    }
};
