const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('up-build')
        .setDescription('docker-compose up --build -d'),
    async execute(interaction) {
        try {
            await execute_command('docker container logs postech-in-the-sky_app_1 >> logs', process.env.BASE);
            await execute_command('docker image prune -f', process.env.BASE);
            interaction.reply({ content: '서버 ON, 변경사항 적용될 것' });
            execute_command('docker-compose up --build -d', process.env.BASE);
        } catch (e){
            console.error(e.message);
        }
    }
};
