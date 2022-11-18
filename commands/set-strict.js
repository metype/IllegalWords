const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-strict')
        .setDescription('Selects if the bot uses strict-mode when processing messages.')
        .addBooleanOption(option =>
            option.setName('strict')
                .setDescription('Whether or not the bot\'s word-matching is strict or not.')
                .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_GUILD)) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        get(interaction.guildId).set('strict-mode', interaction.options.getBoolean('strict'));
        return await interaction.reply({ content: `The bot will now ${interaction.options.getBoolean('strict')?'use':'not use'} strict mode.`, ephemeral: true });
	},
};
