const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const fs = require('fs')
const {
    config
} = require('dotenv');
config({
    path: `${__dirname}/.env`
});
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}
client.login(process.env.TOKEN);