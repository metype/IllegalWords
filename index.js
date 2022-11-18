const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { setSaveInterval, get } = require('./settings');

let dictionaryWords = new Set(fs.readFileSync('./words-alpha.txt').toString().split('\n'));

setSaveInterval(15000);

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', (message) => {
    if (message.member.permissions.has('ADMINISTRATOR')) return;
    for (channel of get(message.guild.id).get('ignored-channels', []).object) {
        if(message.channelId == channel) return;
    }
    let words = message.content.split(' ');
    let bannedWordUser = false;
    for (let word of words) {
        for (banned of get(message.guild.id).get('banned-words', []).object) {
            if (word.toLowerCase().includes(banned)) {
                if(get(message.guild.id).get('strict-mode',false).object == true){
                    bannedWordUser = true | bannedWordUser;
                }else{
                    bannedWordUser = (word.toLowerCase() == banned) | bannedWordUser;
                }
            }
        }
    }
    if (bannedWordUser) {
        let user = get(message.guild.id).get('users').get(message.author.id, {
            infractions: 0,
        }).object;
        if (get(message.guild.id).get('response-type').object == "infraction") {
            user.infractions++;
            if (user.infractions >= get(message.guild.id).get("infraction-limit").object) {
                if (get(message.guild.id).get('infraction-response-type').object == "apply-role") {
                    let role = message.guild.roles.cache.find(r => r.id === get(message.guild.id).get('role-id').object);
                    if (role == undefined) return;
                    try { 
                        message.member.roles.add(role);
                    } catch (err) {
                        return;
                    }
                }
                if (get(message.guild.id).get('infraction-response-type').object == "direct-message") {
                    message.member.send(get(message.guild.id).get('message-content').object);
                }
                user.infractions = 0;
            }
        } else {
            if (get(message.guild.id).get('response-type').object == "apply-role") {
                let role = message.guild.roles.cache.find(r => r.id === get(message.guild.id).get('role-id').object);
                if (role == undefined) return;
                try { 
                    message.member.roles.add(role);
                } catch (err) {
                    return;
                }
            }
            if (get(message.guild.id).get('response-type').object == "direct-message") {
                message.member.send(get(message.guild.id).get('message-content').object);
            }
            if (get(message.guild.id).get('response-type').object == "delete-message") {
                if (message.deletable) {
                    message.delete();
                } else {
                    console.log("Cannot delete message.")
                }
            }
        }
        get(message.guild.id).get('users').set(message.author.id, user);
    }
})

client.login(token);