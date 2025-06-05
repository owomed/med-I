const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'choosevs',
    description: 'En az iki kullanıcıya Choosevs rolü verir.',
    async execute(client, message, args) {
        const allowedRoleID = '1238576058119487539'; // Komutu kullanabilecek rol ID'si
        const targetRoleID = '1247597661666672700'; // Kontrol edilecek ve değiştirilecek rol ID'si

        // Kullanıcının yeterli role sahip olup olmadığını kontrol et
        if (!message.member.roles.cache.has(allowedRoleID)) {
            return message.reply('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
        }

        // En az iki kullanıcı etiketlenmiş mi kontrol et
        if (args.length < 2) {
            return message.reply('`Lütfen en az iki kullanıcı etiketleyin. Örnek: .choosevs @kullanıcı1 @kullanıcı2`');
        }

        // Etiketlenen kullanıcılar
        const memberMentions = message.mentions.members;

        if (memberMentions.size < 2) {
            return message.reply('`Lütfen en az iki geçerli kullanıcı etiketleyin.`');
        }

        // Kullanıcılar üzerinde işlem yapma
        for (const member of memberMentions.values()) {
            try {
                if (member.roles.cache.has(targetRoleID)) {
                    await member.roles.remove(targetRoleID);
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`<a:med_onay:1240943849795489812> ${member.user.tag} kullanıcısından rol alındı.`);
                    message.channel.send(embed);
                } else {
                    await member.roles.add(targetRoleID);
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`<a:med_onay:1240943849795489812> ${member.user.tag} kullanıcısına rol verildi.`);
                    message.channel.send(embed);
                }
            } catch (err) {
                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`<a:med_hayir:1240942589977559081> ${member.user.tag} kullanıcısına rol verilemedi: ${err.message}`);
                message.channel.send(embed);
            }
        }
    },
};
