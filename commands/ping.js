const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    // 1. Slash Komut verilerini tanımlayın
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun gecikmesini hesaplar.'),
    
    // Prefix komutları için takma adlar
    name: '1ping',
    

    async execute(client, interactionOrMessage) {
        let sentMessage;
        
        // 2. Prefix veya Slash Komut olduğunu kontrol edin
        if (interactionOrMessage.isCommand?.()) {
            // Slash komutu ise, fetchReply ile yanıt mesajını alırız
            sentMessage = await interactionOrMessage.reply({ content: '`Ping hesaplanıyor...`', fetchReply: true });
        } else {
            // Prefix komutu ise
            sentMessage = await interactionOrMessage.reply('`Ping hesaplanıyor...`');
        }

        // Mesajlar arasındaki gecikmeyi hesapla
        const ping = sentMessage.createdTimestamp - interactionOrMessage.createdTimestamp;
        
        // WebSocket bağlantısının gecikmesini al
        const apiPing = Math.round(client.ws.ping);

        // Embed mesajı oluştur
        const embed = new EmbedBuilder()
            .setTitle('Pong! ')
            .setDescription(`Botun gecikmesi: **${ping}ms**\nAPI gecikmesi: **${apiPing}ms**`)
            .setColor('#00ff00')
            .setTimestamp();

        // Gönderilen mesajı düzenle
        if (interactionOrMessage.isCommand?.()) {
            await interactionOrMessage.editReply({ embeds: [embed], content: null });
        } else {
            await sentMessage.edit({ embeds: [embed], content: null });
        }
    },
};
