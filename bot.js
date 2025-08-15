const { Client, Collection, GatewayIntentBits, ActivityType } = require('discord.js'); // ActivityType eklendi
const fs = require('fs');
const db = require("quick.db");
const { prefix } = require('./Settings/config.json');
require('dotenv').config();
require('./stayInVoice.js');

// client nesnesi oluşturulurken intents eklendi
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    // Botunuzun ihtiyaç duyabileceği diğer intentleri buraya ekleyebilirsiniz
  ],
  presence: {
    status: "idle",
    activities: [{ name: "MED Ⅰ", type: ActivityType.Listening }] // ActivityType kullanıldı
  }
});

client.commands = new Collection();

// Global Hata Yakalama ve Loglama
process.on('unhandledRejection', error => {
  console.error('Unhandled Rejection at Promise:', error.message || error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught Exception thrown:', error.message || error);
});

// Komut dosyalarını yükleyin
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  try {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  } catch (error) {
    console.error(`Komut dosyasını yüklerken hata oluştu: ${file}`, error);
  }
}

// Mesaj olayını işleyin
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

// Durumları ayarla
const statuses = [
  { name: 'MED Ⅰ', type: ActivityType.Listening }, // ActivityType kullanıldı
  { name: 'MED 💚 hicckimse', type: ActivityType.Watching },
  { name: 'hicckimse 💛 MED', type: ActivityType.Watching },
  { name: 'MED ❤️ hicckimse', type: ActivityType.Watching },
  { name: 'hicckimse 🤍 MED', type: ActivityType.Watching },
  { name: 'MED 🤎 hicckimse', type: ActivityType.Watching },
  { name: 'hicckimse 💜 MED', type: ActivityType.Watching },
  { name: 'MED 🤎 hicckimse', type: ActivityType.Watching },
  { name: 'hicckimse 💙 MED', type: ActivityType.Watching }
];
let statusIndex = 0;

client.on('ready', () => {
  console.log(`Bot hazır: ${client.user.tag}`);

  // Durumları döngüye al
  setInterval(() => {
    statusIndex = (statusIndex + 1) % statuses.length;
    try {
      client.user.setPresence({
        status: 'idle',
        activities: [statuses[statusIndex]]
      });
    } catch (error) {
      console.error('Durum ayarlama hatası:', error);
    }
  }, 10000);
});

client.login(process.env.TOKEN);

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
