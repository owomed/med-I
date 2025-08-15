const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: '1sesgir',
    description: 'Botun belirli bir ses kanalına katılmasını sağlar.',
    async execute(client, message, args) {
        const channelId = '1243483710670635079'; // Ses kanalının ID'sini buraya ekleyin
        const voiceChannel = message.guild.channels.cache.get(channelId);

        // Ses kanalının varlığını ve türünü kontrol et
        if (!voiceChannel || voiceChannel.type !== 2) { // 2, V13 sonrası VoiceChannel türünü temsil eder.

            return message.reply({ content: '`Belirtilen ses kanalı bulunamadı veya geçerli bir ses kanalı değil.`' });
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            return message.reply({ content: '`Bot ses kanalına katıldı.`' });
        } catch (error) {
            console.error('Ses kanalına katılma hatası:', error);
            return message.reply({ content: '`Ses kanalına katılırken bir hata oluştu.`' });
        }
    },
};
