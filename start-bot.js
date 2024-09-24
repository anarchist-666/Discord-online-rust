const { Client, GatewayIntentBits } = require('discord.js');
const Gamedig = require('gamedig'); 
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/config.json')));
const onlineMessageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/MessageOnlineConfig.json')));
const offlineMessageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/MessageOffOnlineConfig.json')));
const dataFilePath = path.join(__dirname, 'config/data.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let statusMessage = null;


function saveMessageId(messageId) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ messageId }), 'utf8');
}

function loadMessageId() {
    if (fs.existsSync(dataFilePath)) {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        return data.messageId;
    }
    return null;
}

async function updateServerStatus() {
    try {
        const serverStatus = await Gamedig.query({
            type: 'rust',
            host: config.server.ip,
            port: config.server.queryPort
        });

        let playersOnline = serverStatus.players.length; 
        let maxPlayers = serverStatus.maxplayers; 

        let onlineMessage = JSON.stringify(onlineMessageConfig)
            .replace('{serverStatus.players}', playersOnline || '0') 
            .replace('{serverStatus.maxPlayers}', maxPlayers);

        if (playersOnline === 1) {
            onlineMessage = onlineMessage.replace('{message}', 'There is 1 player online');
        } else {
            onlineMessage = onlineMessage.replace('{message}', `There are ${playersOnline} players online`);
        }

        const onlineMessageData = JSON.parse(onlineMessage);

        const channel = await client.channels.fetch(config.channelId);

        if (statusMessage) {
            await statusMessage.edit(onlineMessageData);
        } else {
            statusMessage = await channel.send(onlineMessageData);
            saveMessageId(statusMessage.id);
        }
    } catch (error) {
        console.log('Ошибка при запросе статуса сервера или сервер выключен:', error.message);

        const channel = await client.channels.fetch(config.channelId);

        if (statusMessage) {
            await statusMessage.edit(offlineMessageConfig);
        } else {
            statusMessage = await channel.send(offlineMessageConfig);
            saveMessageId(statusMessage.id);
        }
    }
}

client.once('ready', async () => {
    console.log('Бот запущен!');

    const channel = await client.channels.fetch(config.channelId);

    const savedMessageId = loadMessageId();
    if (savedMessageId) {
        try {
            statusMessage = await channel.messages.fetch(savedMessageId);
        } catch (error) {
            console.log('Не удалось загрузить сохраненное сообщение:', error.message);
        }
    }

    updateServerStatus();
    setInterval(updateServerStatus, config.updateInterval * 1000);
});

client.login(config.token);