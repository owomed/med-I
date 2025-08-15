module.exports = {
    name: 'choose',
    description: 'Belirli kanallarda Choosevs Katılımcısı rolünü etiketler.',
    async execute(client, message, args) {
        // Bu komutu kullanabilecek yetkili rolün ID'si
        const allowedRoleID = '1238576058119487539';
        // Etiketlenecek rolün ID'si
        const mentionRoleID = '1247620556082384989';

        // Mesajı gönderen kullanıcının yetkili role sahip olup olmadığını kontrol et
        if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
            // Yetkisi yoksa uyarı mesajı gönder
            return message.reply({ content: '`Bu komutu kullanma yetkiniz bulunmamaktadır.`' });
        }

        // Etiketlenecek rolü etiketleyen mesaj gönder
        // Rol etiketleme işlemi için `<@&ROL_ID>` formatı kullanılır
        try {
            await message.channel.send(`<@&${mentionRoleID}>`);
        } catch (error) {
            console.error('Rol etiketlenirken bir hata oluştu:', error);
            message.reply({ content: 'Rol etiketlenirken bir hata meydana geldi.' });
        }
    },
};
