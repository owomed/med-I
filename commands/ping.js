const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '1ping',
    description: 'Botun gecikmesini hesaplar',
    async execute(client, message, args) {
        // Ping mesajı gönder ve yanıtı bekle
        const sentMessage = await message.reply('`Ping hesaplanıyor...`');
        
        // Mesajlar arasındaki gecikmeyi hesapla
        const ping = sentMessage.createdTimestamp - message.createdTimestamp;
        
        // WebSocket bağlantısının gecikmesini al
        const apiPing = Math.round(client.ws.ping);

        // Embed mesajı oluştur
        const embed = new EmbedBuilder()
            .setTitle('Pong! 🏓')
            .setDescription(`Botun gecikmesi: **${ping}ms**\nAPI gecikmesi: **${apiPing}ms**`)
            .setColor('#00ff00')
            .setTimestamp();

        // Gönderilen mesajı düzenle
        await sentMessage.edit({ embeds: [embed], content: null });
    }
};
