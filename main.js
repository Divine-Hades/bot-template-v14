const { Partials, Client, Collection, ClientPresence, EmbedBuilder, Colors, ButtonInteraction } = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const client = new Client({
    intents: [3276799],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.ThreadMember,
        Partials.User,
    ],
});

require('dotenv').config()

client.config = require("./Storage/config.json");
global.storage = require("./Storage/ClientStorage.json");

const storage = {
    client: require("./Storage/ClientStorage.json"),
    config: require("./Storage/config.json"),
}

global.client = client;
global.env = process.env;
global.commands = new Collection();
global.events = new Collection();
global.components = new Collection();


require("./Structure/handler")(client)

module.exports = { client, prisma, storage };

client.login(process.env.TOKEN); 