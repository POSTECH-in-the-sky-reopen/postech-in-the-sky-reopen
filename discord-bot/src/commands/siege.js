const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { execute_command } = require('../util/exec');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('siege')
        .setDescription('python tools/siege.py')
        .addIntegerOption(option => {
            return option.setName('money')
                .setRequired(true)
                .setDescription('점령자에게 줄 재화의 양')
        })
        .addIntegerOption(option => {
            return option.setName('itemid')
                .setRequired(true)
                .setDescription('점령자에게 줄 아이템의 ID')
        }),
    async execute(interaction) {
        try {
            money = interaction.options.getInteger('money')
            itemId = interaction.options.getInteger('itemid')
            execute_command(`python tools/siege.py ${money} ${itemId}`, process.env.BASE)
            interaction.reply({ content: '정산을 진행합니다...' })
        } catch (e){
            console.error(e.message);
        }
    }
};
