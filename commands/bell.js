module.exports = {
  name: 'bell',
  description: 'Kullanıcının belirli bir role sahip olup olmadığını kontrol eder ve bu role göre işlemi gerçekleştirir.',
  args: true,
  usage: '@kullanıcı',
  async execute(client, message, args) {
    // Mesaj içeriği "args" ile gelirken, botun çalışması için
    // öncelikle mesaj içeriğinin varlığına dair bir kontrol yapılması iyi olur.
    if (!args[0]) {
      return message.reply({ content: '`Bir kullanıcı etiketlemelisin.`' });
    }

    const roleToCheck = '1247597263300198421';
    const mentionedUser = message.mentions.members.first();
    
    // Etiketlenen kullanıcının varlığını kontrol edin.
    if (!mentionedUser) {
      return message.reply({ content: '`Belirtilen kullanıcı bulunamadı.`' });
    }

    const guild = message.guild;
    const role = guild.roles.cache.get(roleToCheck);

    if (!role) {
      return message.reply({ content: `\`ID'si ${roleToCheck} olan rol bulunamadı.\`` });
    }

    if (mentionedUser.roles.cache.has(roleToCheck)) {
      try {
        await mentionedUser.roles.remove(role);
        return message.reply({ content: `\`${mentionedUser.user.tag} adlı kullanıcıdan ${role.name} rolü alındı.\`` });
      } catch (error) {
        console.error('Rol alma hatası:', error);
        return message.reply({ content: 'Rol alınırken bir hata oluştu.' });
      }
    } else {
      try {
        await mentionedUser.roles.add(role);
        return message.reply({ content: `\`${mentionedUser.user.tag} adlı kullanıcıya ${role.name} rolü verildi.\`` });
      } catch (error) {
        console.error('Rol verme hatası:', error);
        return message.reply({ content: 'Rol verilirken bir hata oluştu.' });
      }
    }
  },
};
