const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buff-validate')
        .setDescription('python tools/buff.py'),
    async execute(interaction) {
        try {
            execute_command(`python tools/buff.py --v`, process.env.BASE)
            interaction.reply({ content: '아이템 컬렉션 버프 validation을 진행합니다...' })
        } catch (e){
            console.error(e.message);
        }
    }
};
