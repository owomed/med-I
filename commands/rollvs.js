const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'rollvs',
    description: 'En az iki kullanıcıya Rollvs rolü verir.',
    async execute(client, message, args) {
        const allowedRoleID = '1238576058119487539'; // Komutu kullanabilecek kullanıcı ID'si
        const targetRoleID = '1238585776388968518'; // Kontrol edilecek ve değiştirilecek rol ID'si

        if (!message.member.roles.cache.has(allowedRoleID)) {
            return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        if (args.length < 2) {
            return message.reply('`Lütfen en az iki kullanıcı etiketleyin. Örnek: .rollvs @kullanıcı1 @kullanıcı2`');
        }

        // Her etiketlenen kullanıcı için işlem yap
        const memberMentions = message.mentions.members;

        if (!memberMentions.size) {
            return message.reply('`Lütfen geçerli kullanıcılar etiketleyin.`');
        }

        memberMentions.forEach(async member => {
            if (member.roles.cache.has(targetRoleID)) {
                try {
                    await member.roles.remove(targetRoleID);
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`<a:med_onay:1240943849795489812> ${member.user.tag} kullanıcısından rol alındı.`);
                    message.channel.send(embed);
                } catch (err) {
                    const embed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<a:med_hayir:1240942589977559081> ${member.user.tag} kullanıcısından rol alınamadı: ${err.message}`);
                    message.channel.send(embed);
                }
            } else {
                try {
                    await member.roles.add(targetRoleID);
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`<a:med_onay:1240943849795489812> ${member.user.tag} kullanıcısına rol verildi.`);
                    message.channel.send(embed);
                } catch (err) {
                    const embed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<a:med_hayir:1240942589977559081> ${member.user.tag} kullanıcısına rol verilemedi: ${err.message}`);
                    message.channel.send(embed);
                }
            }
        });
    },
};
