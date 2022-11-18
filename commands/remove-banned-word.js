const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('remove-banned-word')
	.setDescription('Removes a word from the list of banned words for this server.')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to removed from the list')
                .setRequired(true)),
	async execute(interaction) {
		if(!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_GUILD)) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
		if (get(interaction.guildId).get('banned-words', []).object.includes(interaction.options.getString('word').toLowerCase())) {
			get(interaction.guildId).get('banned-words', []).remove(interaction.options.getString('word').toLowerCase());
            return await interaction.reply({ content: `Removed word \'${interaction.options.getString('word').toLowerCase()}\' from the server's banned words list!`, ephemeral: true });
        }
        await interaction.reply({ content: 'That word is not in the server\'s banned words list!', ephemeral: true });
	},
};
