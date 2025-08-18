const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Prefix komutları için ad ve takma ad
    name: 'choosevs',
    aliases: ['choosevs'],
    
    // Slash Komut verileri (2 veya daha fazla kullanıcı için)
    data: new SlashCommandBuilder()
        .setName('choosevs')
        .setDescription('En az iki kullanıcıya Choosevs rolü verir/alır.')
        .addUserOption(option =>
            option.setName('kullanıcı1')
                .setDescription('Birinci kullanıcı')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('kullanıcı2')
                .setDescription('İkinci kullanıcı')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('kullanıcı3')
                .setDescription('Üçüncü kullanıcı')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('kullanıcı4')
                .setDescription('Dördüncü kullanıcı')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('kullanıcı5')
                .setDescription('Beşinci kullanıcı')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('kullanıcı6')
                .setDescription('Altıncı kullanıcı')
                .setRequired(false)),
    
    async execute(client, interactionOrMessage, args) {
        // ---- Komutun Başlangıcı ----
        const allowedRoleID = '1238576058119487539';
        const targetRoleID = '1247597661666672700';
        
        let membersToProcess = [];
        let isSlashCommand = interactionOrMessage.isCommand?.();

        // Slash komutu ise yanıtı ertele
        if (isSlashCommand) {
            await interactionOrMessage.deferReply({ ephemeral: false });
            for (let i = 1; i <= 6; i++) {
                const member = interactionOrMessage.options.getMember(`kullanıcı${i}`);
                if (member) membersToProcess.push(member);
            }
        } else {
            membersToProcess = Array.from(interactionOrMessage.mentions.members.values());
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
        
        if (membersToProcess.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('`Lütfen en az iki geçerli kullanıcı etiketleyin.`');
            return isSlashCommand
                ? await interactionOrMessage.editReply({ embeds: [embed] })
                : await interactionOrMessage.reply({ embeds: [embed] });
        }
        
        // Rol verme/alma işlemleri için sonucu tutacak dizi
        let results = [];
        
        const targetRole = interactionOrMessage.guild.roles.cache.get(targetRoleID);
        if (!targetRole) {
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Hedef rol bulunamadı. Lütfen yöneticilerinizle iletişime geçin.');
            return isSlashCommand
                ? await interactionOrMessage.editReply({ embeds: [errorEmbed] })
                : await interactionOrMessage.reply({ embeds: [errorEmbed] });
        }

        // Kullanıcılar üzerinde işlem yapma
        for (const member of membersToProcess) {
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
        
        // Sonuçları gösteren embed'i oluştur
        const finalEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('`Choosevs` Rol Güncelleme Sonuçları')
            .setDescription(results.join('\n'));

        // --- DÜZELTİLEN SON SATIR ---
        if (isSlashCommand) {
            await interactionOrMessage.editReply({ embeds: [finalEmbed] });
        } else {
            await interactionOrMessage.reply({ embeds: [finalEmbed] });
        }
    },
};
