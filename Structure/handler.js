const { loadFiles } = require("./Functions/loadFiles");

module.exports = async (client) => {
    await loadFiles(client, { path: '../../Commands', type: 'commands' })
    await loadFiles(client, { path: '../../Events', type: 'events' })
    await loadFiles(client, { path: '../../Components', type: 'components' })

    const allEvents = global.events.toJSON();

    for (const events of allEvents) {
        if (events?.once) client.once(events.name, (...args) => events.run(client, ...args));
        else client.on(events.name, (...args) => events.run(client, ...args))
    }
}   