const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    // 1. Slash Komut verilerini tanımlayın
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Kullanıcılara veya toplu olarak Ticket rolü verir/alır.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Belirli bir kullanıcıya rol verir/alır.')
                .addUserOption(option =>
                    option.setName('kullanıcı')
                        .setDescription('İşlem yapılacak kullanıcı.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Ticket rolüne sahip tüm kullanıcılardan rolü alır.')),
    
    // Prefix komutları için ad
    name: 'ticket',
    aliases: [],

    async execute(client, interactionOrMessage, args) {
        const allowedRoleID = "1238598132745506856";
        const roleToCheck = "1405559110677823622";
        const logChannelID = "1237313546354823218";
        const guild = interactionOrMessage.guild;
        const logChannel = guild.channels.cache.get(logChannelID);
        
        // Komutu kullananın yetki kontrolü
        if (!interactionOrMessage.member || !interactionOrMessage.member.roles.cache.has(allowedRoleID)) {
            const embed = new EmbedBuilder().setColor('Red').setDescription('`Bu komutu kullanma yetkiniz bulunmamaktadır.`');
            return interactionOrMessage.isCommand?.() ? interactionOrMessage.reply({ embeds: [embed], ephemeral: true }) : interactionOrMessage.reply({ embeds: [embed] });
        }

        const role = guild.roles.cache.get(roleToCheck);
        if (!role) {
            const embed = new EmbedBuilder().setColor('Red').setDescription(`\`ID'si ${roleToCheck} olan rol bulunamadı.\``);
            return interactionOrMessage.isCommand?.() ? interactionOrMessage.reply({ embeds: [embed], ephemeral: true }) : interactionOrMessage.reply({ embeds: [embed] });
        }

        // Komutun hangi tür olduğunu belirle
        let isSlashCommand = interactionOrMessage.isCommand?.();
        let subcommand = isSlashCommand ? interactionOrMessage.options.getSubcommand() : (args[0] === 'all' ? 'all' : 'user');

        if (subcommand === 'all') {
            const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(roleToCheck));
            
            // Butonlu onay mekanizması
            const confirmButton = new ButtonBuilder()
                .setCustomId('confirm_remove_all')
                .setLabel('Onayla')
                .setStyle(ButtonStyle.Danger);
            const cancelButton = new ButtonBuilder()
                .setCustomId('cancel_remove_all')
                .setLabel('İptal')
                .setStyle(ButtonStyle.Secondary);
            const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

            const confirmationEmbed = new EmbedBuilder()
                .setColor('Orange')
                .setDescription(`**${membersWithRole.size}** kişiden **${role.name}** rolünü kaldırmak istediğinizden emin misiniz?`);
            
            let sentMessage;
            if (isSlashCommand) {
                sentMessage = await interactionOrMessage.reply({ embeds: [confirmationEmbed], components: [row] });
            } else {
                sentMessage = await interactionOrMessage.channel.send({ embeds: [confirmationEmbed], components: [row] });
            }

            const collectorFilter = i => i.user.id === interactionOrMessage.user?.id || i.user.id === interactionOrMessage.author?.id;
            const collector = sentMessage.createMessageComponentCollector({ filter: collectorFilter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'confirm_remove_all') {
                    let rolesRemovedCount = 0;
                    for (const member of membersWithRole.values()) {
                        try {
                            await member.roles.remove(roleToCheck);
                            rolesRemovedCount++;
                        } catch (error) {
                            console.error(`Rol kaldırılamadı: ${member.user.tag}, Hata: ${error.message}`);
                        }
                    }
                    const successEmbed = new EmbedBuilder()
                        .setColor('Green')
                        .setDescription(`Başarıyla **${rolesRemovedCount}** kişiden **${role.name}** rolü kaldırıldı. <a:med_verify3:1242796325121298532>`);
                    await i.update({ embeds: [successEmbed], components: [] });

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setAuthor({ name: (isSlashCommand ? interactionOrMessage.user.tag : interactionOrMessage.author.tag), iconURL: (isSlashCommand ? interactionOrMessage.user.displayAvatarURL() : interactionOrMessage.author.displayAvatarURL()) })
                            .setColor('Green')
                            .setDescription(`**${(isSlashCommand ? interactionOrMessage.user.tag : interactionOrMessage.author.tag)}** tarafından **${rolesRemovedCount}** kişiden **${role.name}** rolü toplu olarak kaldırıldı.`);
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                } else if (i.customId === 'cancel_remove_all') {
                    const cancelEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('Toplu rol kaldırma işlemi iptal edildi.');
                    await i.update({ embeds: [cancelEmbed], components: [] });
                }
            });

            collector.on('end', async collected => {
                if (collected.size === 0) {
                    const timeoutEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('Onay süresi doldu. Toplu rol kaldırma işlemi iptal edildi.');
                    await sentMessage.edit({ embeds: [timeoutEmbed], components: [] });
                }
            });

        } else if (subcommand === 'user') {
            let mentionedUser;
            let responseMethod;

            if (isSlashCommand) {
                mentionedUser = interactionOrMessage.options.getMember('kullanıcı');
                responseMethod = (embed) => interactionOrMessage.reply({ embeds: [embed], ephemeral: true });
            } else {
                mentionedUser = interactionOrMessage.mentions.members.first();
                responseMethod = (embed) => interactionOrMessage.reply({ embeds: [embed] });
                if (!mentionedUser) {
                    return interactionOrMessage.reply({ content: '`Bir kullanıcı etiketlemelisin.`' });
                }
            }

            if (!mentionedUser) {
                return responseMethod(new EmbedBuilder().setColor('Red').setDescription('`Belirtilen kullanıcı bulunamadı.`'));
            }

            const embed = new EmbedBuilder()
                .setAuthor({ name: interactionOrMessage.user?.tag || interactionOrMessage.author.tag, iconURL: interactionOrMessage.user?.displayAvatarURL() || interactionOrMessage.author.displayAvatarURL() })
                .setColor('Random');

            if (mentionedUser.roles.cache.has(roleToCheck)) {
                try {
                    await mentionedUser.roles.remove(roleToCheck);
                    embed.setDescription(`**${mentionedUser.user.tag}** adlı kullanıcıdan **${role.name}** rolü alındı. <a:med_verify3:1242796325121298532>`);
                    await responseMethod(embed);
                    if (logChannel) {
                        await logChannel.send({ embeds: [embed] });
                    }
                } catch (error) {
                    console.error(`Rol kaldırma hatası: ${error}`);
                    embed.setDescription('Rol kaldırılırken bir hata oluştu.');
                    await responseMethod(embed);
                }
            } else {
                try {
                    await mentionedUser.roles.add(roleToCheck);
                    embed.setDescription(`**${mentionedUser.user.tag}** adlı kullanıcıya **${role.name}** rolü verildi. <a:med_verify3:1242796325121298532>`);
                    await responseMethod(embed);
                    if (logChannel) {
                        await logChannel.send({ embeds: [embed] });
                    }
                } catch (error) {
                    console.error(`Rol verme hatası: ${error}`);
                    embed.setDescription('Rol verilirken bir hata oluştu.');
                    await responseMethod(embed);
                }
            }
        }
    },
};
