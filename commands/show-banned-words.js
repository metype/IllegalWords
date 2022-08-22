const { SlashCommandBuilder } = require('@discordjs/builders');
const { get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show-banned-words')
		.setDescription('Shows the list of banned words for this server.'),
	async execute(interaction) {
		let bannedWords = get(interaction.guildId).get('banned-words').object;
		console.log(bannedWords);
		if (bannedWords?.length > 0) {
			await interaction.reply({ content: `The list of server banned words is:\n ${bannedWords.join('\n')}`, ephemeral: true })
		} else {
			await interaction.reply({ content: 'The server does not have any banned words set up yet!', ephemeral: true })
		}
	},
};
