const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'choose', 
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Belirli kanallarda Choosevs Katılımcısı rolünü etiketler.'),

    async execute(client, interactionOrMessage) {
        let member;
        let responseChannel;
        let responseMethod;

        // 2. Komutun prefix mi yoksa slash mı olduğunu kontrol edin
        if (interactionOrMessage.isCommand?.()) {
            // Slash komutu ise
            member = interactionOrMessage.member;
            responseChannel = interactionOrMessage.channel;
            responseMethod = (content) => interactionOrMessage.reply({ content, ephemeral: true });
        } else {
            // Prefix komutu ise
            member = interactionOrMessage.member;
            responseChannel = interactionOrMessage.channel;
            responseMethod = (content) => interactionOrMessage.reply({ content });
        }

        // Bu komutu kullanabilecek yetkili rolün ID'si
        const allowedRoleID = '1238576058119487539';
        // Etiketlenecek rolün ID'si
        const mentionRoleID = '1247620556082384989';

        // Mesajı gönderen kullanıcının yetkili role sahip olup olmadığını kontrol et
        if (!member || !member.roles.cache.has(allowedRoleID)) {
            return responseMethod('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        try {
            // Rol etiketleme işlemi için `<@&ROL_ID>` formatı kullanılır
            // Slash komutları için direkt interaction'a yanıt vermektense, kanala mesaj göndeririz.
            if (interactionOrMessage.isCommand?.()) {
                await interactionOrMessage.deferReply({ ephemeral: false }); // Yükleniyor... mesajı gönderir
                await responseChannel.send(`<@&${mentionRoleID}>`);
                return interactionOrMessage.deleteReply(); // Yükleniyor... mesajını siler
            } else {
                await responseChannel.send(`<@&${mentionRoleID}>`);
            }
        } catch (error) {
            console.error('Rol etiketlenirken bir hata oluştu:', error);
            if (interactionOrMessage.isCommand?.()) {
                interactionOrMessage.editReply({ content: 'Rol etiketlenirken bir hata meydana geldi.', ephemeral: true });
            } else {
                responseChannel.send({ content: 'Rol etiketlenirken bir hata meydana geldi.' });
            }
        }
    },
};
