const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('down')
        .setDescription('docker-compose down'),
    async execute(interaction) {
        try {
            execute_command('docker-compose down', process.env.BASE);
            interaction.reply({ content: '서버 OFF' });
        } catch (e){
            console.error(e.message);
        }
    }
};
