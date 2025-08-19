const { Client, Collection, GatewayIntentBits, ActivityType, Events } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const db = require("quick.db"); // quick.db kütüphanesini kullanıyorsanız gerekli
const { prefix } = require('./Settings/config.json');
require('dotenv').config();

// Render için HTTP sunucusu
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot aktif ve çalışıyor.');
});

app.listen(port, () => {
    console.log(`Render HTTP sunucusu ${port} portunda dinleniyor.`);
});

// client nesnesi oluşturulurken gerekli intentler eklendi
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

client.commands = new Collection();
client.slashCommands = new Collection();

// Global Hata Yakalama ve Loglama
process.on('unhandledRejection', error => {
    console.error('Unhandled Rejection at Promise:', error.message || error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception thrown:', error.message || error);
});

// Komut dosyalarını yükleyin (hem prefix hem de slash)
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        if (command.name) {
            client.commands.set(command.name, command);
        }
        if (command.data) {
            client.slashCommands.set(command.data.name, command);
        }
    } catch (error) {
        console.error(`Komut dosyasını yüklerken hata oluştu: ${file}`, error);
    }
}

// Mesaj olayını işleyin (Prefix Komutları)
client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(x => x.aliases && x.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error('Komut çalıştırma hatası:', error);
        message.reply('Komut çalıştırılırken bir hata oluştu.');
    }
});

// Etkileşim olayını işleyin (Slash Komutları)
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error('Slash komut çalıştırma hatası:', error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Bu komutu çalıştırırken bir hata oluştu!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Bu komutu çalıştırırken bir hata oluştu!', ephemeral: true });
        }
    }
});

// Bot hazır olduğunda yapılacak işlemler
client.on('ready', () => {
    console.log(`Bot hazır: ${client.user.tag}`);

    // Durum ayarları
    client.user.setPresence({
        status: 'idle',
        activities: [{
            name: 'Custom Status',
            state: 'OwO 💛 MED ile ilgileniyor',
            type: ActivityType.Custom,
        }]
    });
    console.log(`Ayarlanan status: ${client.user.presence.status}`);
    console.log(`Ayarlanan aktivite: ${JSON.stringify(client.user.presence.activities)}`);

    // Ses kanalına bağlanma mantığı
    const channelId = '1235643294973956158'; // Ses kanalının ID'sini buraya ekleyin
    const guild = client.guilds.cache.first();

    if (!guild) {
        console.error('Sunucu bulunamadı.');
        return;
    }

    const voiceChannel = guild.channels.cache.get(channelId);
    if (!voiceChannel) {
        console.error('Ses kanalı bulunamadı.');
        return;
    }

    const joinChannel = () => {
        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            console.log('Ses kanalına katıldı.');

            connection.on('disconnect', () => {
                console.log('Ses kanalı bağlantısı kesildi, yeniden bağlanıyor...');
                setTimeout(joinChannel, 5000); // 5 saniye sonra yeniden bağlan
            });

        } catch (error) {
            console.error('Ses kanalına bağlanırken hata oluştu:', error);
            setTimeout(joinChannel, 5000); // 5 saniye sonra yeniden dene
        }
    };
    joinChannel();
});

// Bot giriş
client.login(process.env.TOKEN).catch(error => console.error('Bot giriş hatası:', error));
