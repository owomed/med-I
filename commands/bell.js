const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name : 'bell',
    data: new SlashCommandBuilder()
        .setName('bell')
        .setDescription('Kullanıcının bir role sahip olup olmadığını kontrol eder ve rolü verir/alır.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('İşlem yapılacak kullanıcı.')
                .setRequired(true)),
    
    async execute(client, interactionOrMessage, args) {
        let member;
        let responseMethod;

        // 2. Komutun prefix mi yoksa slash mı olduğunu kontrol edin
        if (interactionOrMessage.isCommand?.()) {
            // Slash komutu ise
            responseMethod = (content) => interactionOrMessage.reply({ content, ephemeral: true });
            member = interactionOrMessage.options.getMember('kullanıcı');
        } else {
            // Prefix komutu ise
            responseMethod = (content) => interactionOrMessage.reply({ content });
            member = interactionOrMessage.mentions.members.first();
            if (!member) {
                return responseMethod('`Bir kullanıcı etiketlemelisin.`');
            }
        }

        const roleToCheck = '1247597263300198421';
        
        // Etiketlenen kullanıcının varlığını kontrol edin.
        if (!member) {
            return responseMethod('`Belirtilen kullanıcı bulunamadı.`');
        }

        const guild = interactionOrMessage.guild;
        const role = guild.roles.cache.get(roleToCheck);

        if (!role) {
            return responseMethod(`\`ID'si ${roleToCheck} olan rol bulunamadı.\``);
        }

        // Komutu çalıştıran kişinin rol yönetme yetkisi kontrolü
        if (!interactionOrMessage.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return responseMethod('Bu komutu kullanmak için `Rolleri Yönet` yetkiniz olmalı.');
        }

        if (member.roles.cache.has(roleToCheck)) {
            try {
                await member.roles.remove(role);
                return responseMethod(`\`${member.user.tag} adlı kullanıcıdan ${role.name} rolü alındı.\``);
            } catch (error) {
                console.error('Rol alma hatası:', error);
                return responseMethod('Rol alınırken bir hata oluştu.');
            }
        } else {
            try {
                await member.roles.add(role);
                return responseMethod(`\`${member.user.tag} adlı kullanıcıya ${role.name} rolü verildi.\``);
            } catch (error) {
                console.error('Rol verme hatası:', error);
                return responseMethod('Rol verilirken bir hata oluştu.');
            }
        }
    },
};
