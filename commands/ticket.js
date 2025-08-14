const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "ticket",
  description: "Kullanıcıya Ticket katılım rolü verir/alır.",
  args: true,
  usage: "@kullanıcı veya 'all'", // Kullanım bilgisini güncelledim
  async execute(client, message, args) {
    const allowedRoleID = "1238598132745506856";
    const roleToCheck = "1405559110677823622";
    const guild = message.guild;
    const logChannelID = "1237313546354823218";
    const logChannel = guild.channels.cache.get(logChannelID);
    
    // Yetki kontrolü
    if (!message.member || !message.member.roles.cache.has(allowedRoleID)) {
      return message.reply("`Bu komutu kullanma yetkiniz bulunmamaktadır.`");
    }

    const role = guild.roles.cache.get(roleToCheck);

    if (!role) {
      return message.reply(`\`ID'si ${roleToCheck} olan rol bulunamadı.\``);
    }
    
    // Toplu rol alma işlevi
    if (args[0] === 'all') {
      const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(roleToCheck));
      
      // Onay mesajı gönder
      const confirmationEmbed = new MessageEmbed()
        .setColor('ORANGE')
        .setDescription(`**${membersWithRole.size}** kişiden ${role} rolünü kaldırmak istediğinizden emin misiniz? Onaylamak için **evet** yazın.`);
      
      const sentMessage = await message.channel.send({ embeds: [confirmationEmbed] });
      
      // Kullanıcının onayını bekle
      const filter = response => response.author.id === message.author.id && response.content.toLowerCase() === 'evet';
      const collector = message.channel.createMessageCollector({ filter, time: 15000, max: 1 });
      
      collector.on('collect', async response => {
        let rolesRemovedCount = 0;
        for (const member of membersWithRole.values()) {
          try {
            await member.roles.remove(roleToCheck);
            rolesRemovedCount++;
          } catch (error) {
            console.error(`Rol kaldırılamadı: ${member.user.tag}, Hata: ${error.message}`);
          }
        }
        
        const successEmbed = new MessageEmbed()
          .setColor('GREEN')
          .setDescription(`Başarıyla **${rolesRemovedCount}** kişiden ${role} rolü kaldırıldı. <a:med_verify3:1242796325121298532>`);
        message.channel.send({ embeds: [successEmbed] });
        
        if (logChannel) {
          const logEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('GREEN')
            .setDescription(`**${message.author.tag}** tarafından **${rolesRemovedCount}** kişiden ${role} rolü toplu olarak kaldırıldı.`);
          logChannel.send({ embeds: [logEmbed] });
        }
        sentMessage.delete().catch(() => {});
        response.delete().catch(() => {});
      });
      
      collector.on('end', collected => {
        if (collected.size === 0) {
          const timeoutEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('Onay süresi doldu. Toplu rol kaldırma işlemi iptal edildi.');
          message.channel.send({ embeds: [timeoutEmbed] });
        }
      });
      
      return;
    }

    // Normal rol ekleme/kaldırma işlevi
    if (!message.mentions.users.size) {
      return message.reply("Bir kullanıcı etiketlemelisin.");
    }
    
    const mentionedUser = message.mentions.members.first();
    let embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor('Random');

    if (mentionedUser.roles.cache.has(roleToCheck)) {
      // Kullanıcının rolü varsa al
      await mentionedUser.roles.remove(roleToCheck);
      embed.setDescription(`${mentionedUser} adlı kullanıcıdan ${role} rolü alındı. <a:med_verify3:1242796325121298532>`);
      message.channel.send({ embeds: [embed] });
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
    } else {
      // Kullanıcının rolü yoksa ver
      await mentionedUser.roles.add(roleToCheck);
      embed.setDescription(`${mentionedUser} adlı kullanıcıya ${role} rolü verildi. <a:med_verify3:1242796325121298532>`);
      message.channel.send({ embeds: [embed] });
      if (logChannel) {
        logChannel.send({ embeds: [embed] });
      }
    }
  },
};
