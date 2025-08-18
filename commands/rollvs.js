const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Prefix komutları için ad ve takma ad
    name: 'rollvs',
    aliases: ['rollvs'],

    // Slash Komut verileri (sadece 2 kullanıcı için)
    data: new SlashCommandBuilder()
        .setName('rollvs')
        .setDescription('İki kullanıcıya Rollvs rolü verir/alır.')
        .addUserOption(option =>
            option.setName('kullanıcı1')
                .setDescription('Birinci kullanıcıyı seçin.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('kullanıcı2')
                .setDescription('İkinci kullanıcıyı seçin.')
                .setRequired(true)),

    async execute(client, interactionOrMessage, args) {
        const allowedRoleID = '1238576058119487539';
        const targetRoleID = '1238585776388968518';

        let membersToProcess = [];
        let isSlashCommand = interactionOrMessage.isCommand?.();

        if (isSlashCommand) {
            await interactionOrMessage.deferReply({ ephemeral: false });
            membersToProcess.push(
                interactionOrMessage.options.getMember('kullanıcı1'),
                interactionOrMessage.options.getMember('kullanıcı2')
            );
        } else {
            membersToProcess = interactionOrMessage.mentions.members.first(2);
        }

        const authorMember = interactionOrMessage.member;
        if (!authorMember || !authorMember.roles.cache.has(allowedRoleID)) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
            
            return isSlashCommand
                ? await interactionOrMessage.editReply({ embeds: [embed] })
                : await interactionOrMessage.reply({ embeds: [embed] });
        }
        
        if (membersToProcess.length !== 2) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('`Lütfen iki geçerli kullanıcı etiketleyin.`');
            return isSlashCommand
                ? await interactionOrMessage.editReply({ embeds: [embed] })
                : await interactionOrMessage.reply({ embeds: [embed] });
        }
        
        const [member1, member2] = membersToProcess;
        
        const targetRole = interactionOrMessage.guild.roles.cache.get(targetRoleID);
        if (!targetRole) {
            const errorEmbed = new EmbedBuilder().setColor('Red').setDescription('Hedef rol bulunamadı.');
            return isSlashCommand
                ? await interactionOrMessage.editReply({ embeds: [errorEmbed] })
                : await interactionOrMessage.reply({ embeds: [errorEmbed] });
        }

        let results = [];
        for (const member of [member1, member2]) {
            try {
                if (member.roles.cache.has(targetRoleID)) {
                    await member.roles.remove(targetRoleID);
                    results.push(`🟢 **${member.user.tag}** kullanıcısından rol alındı.`);
                } else {
                    await member.roles.add(targetRoleID);
                    results.push(`<:check:1407066920686981230> **${member.user.tag}** kullanıcısına rol verildi.`);
                }
            } catch (err) {
                console.error(`Rol işlemi hatası: ${member.user.tag}`, err);
                results.push(`🔴 **${member.user.tag}** kullanıcısına rol verilemedi: \`${err.message}\``);
            }
        }

        const finalEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('`Rollvs` Rol Güncelleme Sonuçları')
            .setDescription(results.join('\n'));

        // --- DÜZELTİLEN SON SATIR ---
        if (isSlashCommand) {
            await interactionOrMessage.editReply({ embeds: [finalEmbed] });
        } else {
            await interactionOrMessage.reply({ embeds: [finalEmbed] });
        }
    },
};
