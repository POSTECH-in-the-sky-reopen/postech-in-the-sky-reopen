const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('내부에서만 접속 가능'),
    async execute(interaction) {
        try {
            await execute_command('cp nginx-certbot/data/nginx/app.conf.closed nginx-certbot/data/nginx/app.conf', process.env.BASE);
            await execute_command('docker exec postech-in-the-sky_nginx_1 service nginx reload', process.env.BASE);
            interaction.reply({ content: '서버 접근 막았습니다.' });
        } catch (e){
            console.error(e.message);
        }
    }
};
