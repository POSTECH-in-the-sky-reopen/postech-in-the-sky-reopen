const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buff-add')
        .setDescription('python tools/buff.py')
        .addIntegerOption(option => {
            return option.setName('missionnumber')
                .setRequired(true)
                .setDescription('돌발미션 번호')
        })
        .addIntegerOption(option => {
            return option.setName('group')
                .setRequired(true)
                .setDescription('지급 분반 번호')
        }),
    async execute(interaction) {
        try {
            missionName = "돌발미션 보상 " + interaction.options.getInteger('missionnumber')
            group = interaction.options.getInteger('group')
            execute_command(`python tools/buff.py --a "${missionName}" ${group}`, process.env.BASE)
            interaction.reply({ content: `${group}분반에게 ${missionName} 버프를 부여합니다...` })
        } catch (e){
            console.error(e.message);
        }
    }
};
