module.exports = {
  name: 'rulet',
  description: 'Kullanıcının belirli bir role sahip olup olmadığını kontrol eder ve bu role göre işlemi gerçekleştirir.',
  args: true,
  usage: '@kullanıcı',
  async execute(client, message, args) {
    if (!message.mentions.users.size) {
      return message.reply('Bir kullanıcı etiketlemelisin.');
    }

    const roleToCheck = '1267050088459407495'; // Kullanıcının sahip olup olmadığını kontrol edeceğimiz rol ID'si
    const mentionedUser = message.mentions.members.first(); // Etiketlenen kullanıcı
    const guild = message.guild; // Mesajın atıldığı sunucu

    if (!mentionedUser) {
      return message.reply('`Belirtilen kullanıcı bulunamadı.`');
    }

    const role = guild.roles.cache.get(roleToCheck);

    if (!role) {
      return message.reply(`\`ID'si ${roleToCheck} olan rol bulunamadı.\``);
    }

    if (mentionedUser.roles.cache.has(roleToCheck)) {
      // Kullanıcının rolü varsa al
      await mentionedUser.roles.remove(roleToCheck);
      return message.reply(`\`${mentionedUser.user.tag} adlı kullanıcıdan ${role.name} rolü alındı.\``);
    } else {
      // Kullanıcının rolü yoksa ver
      await mentionedUser.roles.add(roleToCheck);
      return message.reply(`\`${mentionedUser.user.tag} adlı kullanıcıya ${role.name} rolü verildi.\``);
    }
  },
};
