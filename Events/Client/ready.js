const { Client } = require("discord.js");
const logger = require("../../Structure/Functions/logger");

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    run: async (client) => {
        logger.info(`Login Successfully: ${client.user.username}`);

        const cmd = [];
        for (const entries of global.commands.toJSON()) {
            cmd.push(entries.data)
        };

        client.application.commands.set(cmd);
    }
}