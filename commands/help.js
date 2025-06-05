const { MessageEmbed } = require('discord.js');

module.exports = {
  name: '1help',
  description: 'Tüm komutları listeler veya belirli bir komut hakkında bilgi verir.',
  aliases: ['1yardım'],
  usage: '[komut adı]',
  execute(client, message, args) {
    const data = [];
    const { commands } = client;

    if (!args.length) {
      data.push('Mevcut tüm komutlar:');
      data.push('```');
      data.push(commands.map(command => command.name).join('\n'));
      data.push('```');
      data.push(`Belirli bir komut hakkında bilgi almak için, \`.1help [komut adı]\` yazın.`);

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Komut Listesi')
        .setDescription(data.join('\n'));

      return message.channel.send(embed).catch(error => {
        console.error('Embed gönderilirken bir hata oluştu:', error);
        message.reply('Embed gönderilirken bir hata oluştu.');
      });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply('Bu isimde bir komut bulunamadı.');
    }

    data.push(`**İsim:** ${command.name}`);

    if (command.aliases) data.push(`**Takma İsimler:** ${command.aliases.join(', ')}`);
    if (command.description) data.push(`**Açıklama:** ${command.description}`);
    if (command.usage) data.push(`**Kullanım:** .${command.name} ${command.usage}`);

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Komut: ${command.name}`)
      .setDescription(data.join('\n'));

    message.channel.send(embed).catch(error => {
      console.error('Embed gönderilirken bir hata oluştu:', error);
      message.reply('Embed gönderilirken bir hata oluştu.');
    });
  },
};
