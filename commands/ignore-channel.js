const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ignore-channel')
        .setDescription('Makes the bot ignore the specified channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel for the bot to ignore')
                .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        get(interaction.guildId).get('ignored-channels', []).append(interaction.options.getChannel('channel').id.toLowerCase());
        return await interaction.reply({ content: `The bot will now ignore all messages sent in <#${interaction.options.getChannel('channel').id.toLowerCase()}>`, ephemeral: true });
	},
};
