const fs = require('fs/promises');
const path = require('path');
const logger = require('./logger');
const _ = require('lodash');
const Table = require('cli-table3');
const { Events } = require('discord.js');

module.exports = { loadFiles };

async function loadFiles(client, option = { path: './commands', type: 'commands' }) {
    const table = new Table()
    try {
        const absolutePath = path.resolve(path.join(__dirname, option.path));
        const loadedFiles = await loadFilesRecursively(absolutePath);

        for (const entry of loadedFiles) {
            const file = require(entry);
            const entrySplit = entry.split(path.join(__dirname, `../../${option.type}/`))[1];
            if (option.type == 'commands') {
                //Check if command has name and description
                if (!file?.data?.name || !file?.data?.description) {
                    logger.error(`Load Files Error - Type: Commands | Entry: ${entrySplit} | Reason: This commands file don't have name or description, Please include that before adding to commands system! }`);
                    continue;
                } else if (global.commands.has(file.data.name)) {
                    logger.error(`Load Files Error - Type: Commands | Entry ${entrySplit} | Reason: This command file is duplicate command name!`);
                    continue;
                }

                global.commands.set(file.data.name, file);

                table.push(["+", file.data.name, entrySplit]);
            } else if (option.type == 'events') {
                if (!file?.name) {
                    logger.error(`Load Files Error - Type: Events | Entry: ${entrySplit} | Reason: This event file don't have name, Please include that before adding to events system!`);
                    continue;
                } else if (!Object.values(Events).includes(file.name)) {
                    logger.error(`Load Files Error - Type: Events | Entry: ${entrySplit} | Reason: This event file name does not exist in existing events name!`);
                    continue;
                } else if (global.events.has(file.name)) {
                    logger.error(`Load Files Error - Type: Events | Entry: ${entrySplit} | Reason: This event file is duplicate event name!`);
                    continue;
                }

                global.events.set(file.name, file);

                table.push(["+", file.name, entrySplit]);
            } else if (option.type == 'components') {
                const resDuplicate = global.components.some((value, key) => {
                    return key == file.name && file.action
                });

                if (!file?.name || !file.action) {
                    logger.error(`Load Files Error - Type: Events | Entry: ${entrySplit} | Reason: This event file don't have name or action, Please include that before adding to components system!`);
                    continue;
                }

                if (resDuplicate) {
                    logger.error(`Load Files Error - Type: Components | Entry: ${entrySplit} | Reason: This component file is duplicate component name and action!`);
                    continue;
                }

                global.components.set(file.name, file);

                table.push(["+", file.name, file.action, entrySplit]);
            } else {
                logger.error(`Load Files Error - Type: ${option?.type} does not exist! Please check this issue!`)
                continue;
            }

        }
        if (option.type == 'components') {
            table.options.head = [table.length, _.startCase(option.type), "Action", "Entries"];
            table.options.colWidths = [5, 25, 15, 30]
        }
        else {
            table.options.head = [table.length, _.startCase(option.type), "Entries"];
            table.options.colWidths = [5, 25, 30]
        }
        console.log(table.toString());
    } catch (e) {
        logger.error(e);
    }
}

async function loadFilesRecursively(folderPath) {
    const files = [];
    const entries = await fs.readdir(folderPath);

    for (const entry of entries) {
        const entryPath = path.join(folderPath, entry);
        const stat = await fs.stat(entryPath);

        if (stat.isDirectory()) {
            const subfolderFiles = await loadFilesRecursively(entryPath);
            files.push(...subfolderFiles);
        } else if (entryPath.toLowerCase().endsWith('.js') && !entry.toLowerCase().includes('.s')) {
            // Load only JavaScript files with a .js extension and not ending with '.s.js'
            files.push(entryPath);
        }
    }

    return files;
}
