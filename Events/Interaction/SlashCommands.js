const { Client, Interaction } = require("discord.js");
const { prisma } = require("../../main");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Interaction} interaction 
     * @param {Client} client 
     */
    run: async (client, interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = global.commands.get(interaction.commandName); 
        if (!command) return interaction.reply({
            content: "This command is outdated.", 
            ephemeral: true
        });

        command.execute(interaction, client); 
    }
} 