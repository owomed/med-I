const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'roll', 
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Belirli kanalda Rollvs Katılımcısı rolünü etiketler.'),

    async execute(client, interactionOrMessage) {
        let member;
        let responseChannel;
        let responseMethod;

        // 2. Prefix veya Slash Komut olduğunu kontrol edin
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

        const allowedChannelIDs = ['1373685143394320525'];
        const allowedRoleID = '1238576058119487539';
        const mentionRoleID = '1238181107741098115';

        // Kanal ve kullanıcı yetki kontrolü
        if (!allowedChannelIDs.includes(responseChannel.id)) {
            return responseMethod('`Bu komut bu kanalda kullanılamaz.`');
        }

        if (!member || !member.roles.cache.has(allowedRoleID)) {
            return responseMethod('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        // Etiketlenecek rolü etiketleyen mesaj gönderin
        try {
            if (interactionOrMessage.isCommand?.()) {
                await interactionOrMessage.deferReply({ ephemeral: false });
                await responseChannel.send(`<@&${mentionRoleID}>`);
                return interactionOrMessage.deleteReply();
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
