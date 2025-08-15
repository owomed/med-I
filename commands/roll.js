module.exports = {
    name: 'roll',
    description: 'Belirli kanalda Rollvs Katılımcısı rolünü etiketler.',
    async execute(client, message, args) {
        // Komutun kullanılabileceği kanalların ID'lerini ve kullanıcı ID'sini belirtin
        const allowedChannelIDs = ['1373685143394320525'];
        const allowedRoleID = '1238576058119487539';
        const mentionRoleID = '1238181107741098115';

        // Komutun kullanıldığı kanal ve kullanıcı kontrolü
        if (!allowedChannelIDs.includes(message.channel.id)) {
            return message.reply({ content: '`Bu komut bu kanalda kullanılamaz.`' });
        }

        if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
            return message.reply({ content: '`Bu komutu kullanma yetkiniz bulunmamaktadır.`' });
        }

        // Etiketlenecek rolü etiketleyen mesaj gönderin
        try {
            await message.channel.send(`<@&${mentionRoleID}>`);
        } catch (error) {
            console.error('Rol etiketlenirken bir hata oluştu:', error);
            message.reply({ content: 'Rol etiketlenirken bir hata meydana geldi.' });
        }
    },
};
