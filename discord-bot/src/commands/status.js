const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('docker-compose ps'),
    async execute(interaction) {
        try {
            let res = await execute_command('docker-compose ps | grep postech-in-the-sky', process.env.BASE);
            interaction.reply({ content: codeBlock(res) })
        } catch (e){
            console.error(e.message);
        }
    }
};
