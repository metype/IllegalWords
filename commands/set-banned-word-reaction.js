const { SlashCommandBuilder } = require('@discordjs/builders');
const { set, get } = require('../settings');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-banned-word-reaction')
		.setDescription('Determines how the bot reacts to a word on the server\'s list of banned words being said.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('apply-role')
				.setDescription('Applies a specific role to anyone who sends a message containing a banned word')
				.addRoleOption(option => option.setName('role').setDescription('The role to apply').setRequired(true)))
		.addSubcommand(subcommand =>
				subcommand
					.setName('direct-message')
					.setDescription('Send a message to anyone who sends a message containing a banned word')
					.addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true)))
		.addSubcommand(subcommand =>
				subcommand
					.setName('delete-message')
					.setDescription('Deletes the message containing the banned word'))
		.addSubcommandGroup(subcommand =>
			subcommand
				.setName('infraction')
				.setDescription('Apply infractions to anyone who sends a messahe containing a banned word')
				.addSubcommand(subcommand =>
					subcommand
						.setName('apply-role')
						.setDescription('Applies a specific role to anyone who exceeds the infraction limit')
						.addRoleOption(option => option.setName('role').setDescription('The role to apply').setRequired(true))
						.addIntegerOption(option => option.setName('limit').setDescription('The infraction limit').setRequired(true)))
				.addSubcommand(subcommand =>
					subcommand
						.setName('direct-message')
						.setDescription('Send a message to anyone who exceeds the infraction limit')
						.addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true))
						.addIntegerOption(option => option.setName('limit').setDescription('The infraction limit').setRequired(true)))),
	async execute(interaction) {
		if(!interaction.memberPermissions.has('ADMINISTRATOR')) return await interaction.reply({ content: `You cannot perform this action!`, ephemeral: true });
		if (interaction.options.getSubcommandGroup(false) === 'infraction') {
			let limit = interaction.options.getInteger('limit');
			get(interaction.guildId).set('response-type', 'infraction');
			get(interaction.guildId).set('infraction-limit', limit);
			if (interaction.options.getSubcommand() === 'apply-role') {
				let role = interaction.options.getRole('role');
				get(interaction.guildId).set('infraction-response-type', 'apply-role');
				get(interaction.guildId).set('role-id', role.id);
				return await interaction.reply({ content: `Set the reaction to a banned word to : Apply role '${role.name}' on infraction limit of ${limit}.`, ephemeral: true });
			}
			if (interaction.options.getSubcommand() === 'direct-message') {
				let message = interaction.options.getString('message');
				get(interaction.guildId).set('infraction-response-type', 'direct-message');
				get(interaction.guildId).set('message-content', message);
				return await interaction.reply({ content: `Set the reaction to a banned word to : Send direct message with content : '${message}' on infraction limit of ${limit}.`, ephemeral: true });
			}
		} else {
			if (interaction.options.getSubcommand() === 'apply-role') {
				let role = interaction.options.getRole('role');
				get(interaction.guildId).set('response-type', 'apply-role');
				get(interaction.guildId).set('role-id', role.id);
				return await interaction.reply({ content: `Set the reaction to a banned word to : Apply role '${role.name}' on message.`, ephemeral: true });
			}
			if (interaction.options.getSubcommand() === 'direct-message') {
				let message = interaction.options.getString('message');
				get(interaction.guildId).set('response-type', 'direct-message');
				get(interaction.guildId).set('message-content', message);
				return await interaction.reply({ content: `Set the reaction to a banned word to : Send direct message with content : '${message}' on message.`, ephemeral: true });
			}
			if (interaction.options.getSubcommand() === 'delete-message') {
				get(interaction.guildId).set('response-type', 'delete-message');
				return await interaction.reply({ content: `Set the reaction to a banned word to : Delete message.`, ephemeral: true });
			}
		}
	},
};
