const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-banned-word')
        .setDescription('Adds a word to the list of banned words for this server.')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to add to the list')
                .setRequired(true)),
    async execute(interaction) {
        if(!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_GUILD)) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
        if (get(interaction.guildId).get('banned-words', []).object.includes(interaction.options.getString('word').toLowerCase())) {
            return await interaction.reply({ content: `That word is already in the list!`, ephemeral: true });
        }
        get(interaction.guildId).get('banned-words', []).append(interaction.options.getString('word').toLowerCase());
        return await interaction.reply({ content: `Added word \'${interaction.options.getString('word').toLowerCase()}\' to the server's banned words list!`, ephemeral: true });
	},
};
