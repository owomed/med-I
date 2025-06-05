module.exports = {
    name: 'choose',
    description: 'Belirli kanallarda Choosevs Katılımcısı rolünü etiketler.',
    async execute(client, message, args) {
        // Komutun kullanılabileceği kanalların ID'lerini ve kullanıcı ID'sini belirtin
        
        const allowedRoleID = '1238576058119487539';
        const mentionRoleID = '1247620556082384989';

        // Komutun kullanıldığı kanal ve kullanıcı kontrolü
      
        

        if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
            return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        // Etiketlenecek rolü etiketleyen mesaj gönderin
        message.channel.send(`<@&${mentionRoleID}>`);
    },
};
