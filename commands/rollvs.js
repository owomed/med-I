const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'rollvs',
    description: 'En az iki kullanıcıya Rollvs rolü verir.',
    async execute(client, message, args) {
        const allowedRoleID = '1238576058119487539'; // Komutu kullanabilecek rol ID'si
        const targetRoleID = '1238585776388968518'; // Kontrol edilecek ve değiştirilecek rol ID'si

        // Kullanıcının yeterli role sahip olup olmadığını kontrol et
        if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
            return message.reply({ content: '`Bu komutu kullanma yetkiniz bulunmamaktadır.`' });
        }

        // En az iki kullanıcı etiketlenmiş mi kontrol et
        const memberMentions = message.mentions.members;
        
        if (memberMentions.size < 2) {
            return message.reply({ content: '`Lütfen en az iki geçerli kullanıcı etiketleyin. Örnek: .rollvs @kullanıcı1 @kullanıcı2`' });
        }

        // Her etiketlenen kullanıcı için işlem yap
        for (const member of memberMentions.values()) {
            if (member.roles.cache.has(targetRoleID)) {
                try {
                    await member.roles.remove(targetRoleID);
                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`<a:med_onay:1240943849795489812> ${member.user.tag} kullanıcısından rol alındı.`);
                    await message.channel.send({ embeds: [embed] });
                } catch (err) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<a:med_hayir:1240942589977559081> ${member.user.tag} kullanıcısından rol alınamadı: ${err.message}`);
                    await message.channel.send({ embeds: [embed] });
                }
            } else {
                try {
                    await member.roles.add(targetRoleID);
                    const embed = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`<a:med_onay:1240943849795489812> ${member.user.tag} kullanıcısına rol verildi.`);
                    await message.channel.send({ embeds: [embed] });
                } catch (err) {
                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`<a:med_hayir:1240942589977559081> ${member.user.tag} kullanıcısına rol verilemedi: ${err.message}`);
                    await message.channel.send({ embeds: [embed] });
                }
            }
        }
    },
};
