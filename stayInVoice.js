const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const channelId = '1235643294973956158'; // Ses kanalının ID'sini buraya ekleyin

client.once('ready', async () => {
  console.log(`Bot hazır: ${client.user.tag}`);

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

      // Bağlantı kesildiğinde yeniden bağlan
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

client.login(process.env.TOKEN).catch(error => console.error('Bot giriş hatası:', error));
