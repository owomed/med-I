module.exports = {
  name: 'rulet',
  description: 'Kullanıcının belirli bir role sahip olup olmadığını kontrol eder ve bu role göre işlemi gerçekleştirir.',
  args: true,
  usage: '@kullanıcı',
  async execute(client, message, args) {
    if (!message.mentions.users.size) {
      // Hata mesajını güncel yapıya göre düzenledik
      return message.reply({ content: '`Bir kullanıcı etiketlemelisin.`' });
    }

    const roleToCheck = '1267050088459407495'; // Kullanıcının sahip olup olmadığını kontrol edeceğimiz rol ID'si
    const mentionedUser = message.mentions.members.first(); // Etiketlenen kullanıcı
    const guild = message.guild; // Mesajın atıldığı sunucu

    if (!mentionedUser) {
      return message.reply({ content: '`Belirtilen kullanıcı bulunamadı.`' });
    }

    const role = guild.roles.cache.get(roleToCheck);

    if (!role) {
      return message.reply({ content: `\`ID'si ${roleToCheck} olan rol bulunamadı.\`` });
    }

    if (mentionedUser.roles.cache.has(roleToCheck)) {
      // Kullanıcının rolü varsa al
      try {
        await mentionedUser.roles.remove(role);
        return message.reply({ content: `\`${mentionedUser.user.tag} adlı kullanıcıdan ${role.name} rolü alındı.\`` });
      } catch (error) {
        console.error('Rol alma hatası:', error);
        return message.reply({ content: 'Rol alınırken bir hata oluştu.' });
      }
    } else {
      // Kullanıcının rolü yoksa ver
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
