const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '1help',
    description: 'Tüm komutları listeler veya belirli bir komut hakkında bilgi verir.',
    aliases: ['1yardım'],
    usage: '[komut adı]',
    async execute(client, message, args) { // async keyword'ünü ekledik
        const { commands } = client;

        if (!args.length) {
            const commandList = commands.map(command => `\`${command.name}\``).join(', ');
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Komut Listesi')
                .setDescription(
                    `Mevcut tüm komutlar:\n\n${commandList}\n\n` +
                    `Belirli bir komut hakkında bilgi almak için, \`.1help [komut adı]\` yazın.`
                );

            return message.channel.send({ embeds: [embed] }).catch(error => {
                console.error('Embed gönderilirken bir hata oluştu:', error);
            });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply({ content: '`Bu isimde bir komut bulunamadı.`' });
        }

        const data = [];

        data.push(`**İsim:** \`${command.name}\``);
        if (command.aliases && command.aliases.length > 0) {
            data.push(`**Takma İsimler:** \`${command.aliases.join(', ')}\``);
        }
        if (command.description) {
            data.push(`**Açıklama:** ${command.description}`);
        }
        if (command.usage) {
            data.push(`**Kullanım:** \`.${command.name} ${command.usage}\``);
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Komut: ${command.name}`)
            .setDescription(data.join('\n'));

        message.channel.send({ embeds: [embed] }).catch(error => {
            console.error('Embed gönderilirken bir hata oluştu:', error);
        });
    },
};
