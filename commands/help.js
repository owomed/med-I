const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    // 1. Slash Komut verilerini tanımlayın
    data: new SlashCommandBuilder()
        .setName('help') // '1help' yerine 'help' daha standart
        .setDescription('Tüm komutları listeler veya belirli bir komut hakkında bilgi verir.')
        .addStringOption(option =>
            option.setName('komut_adı')
                .setDescription('Bilgi almak istediğiniz komutun adı.')
                .setRequired(false)),

    name : '1help',
    aliases: [ '1yardım'],
    
    async execute(client, interactionOrMessage, args) {
        let responseChannel;
        let commandName;
        let isSlashCommand = false;

        if (interactionOrMessage.isCommand?.()) {
            // Slash komutu ise
            responseChannel = interactionOrMessage.channel;
            commandName = interactionOrMessage.options.getString('komut_adı');
            isSlashCommand = true;
        } else {
            // Prefix komutu ise
            responseChannel = interactionOrMessage.channel;
            commandName = args[0] ? args[0].toLowerCase() : null;
        }

        const commandsToDisplay = isSlashCommand ? client.slashCommands : client.commands;

        if (!commandName) {
            const commandList = commandsToDisplay.map(command => `\`${command.name || command.data.name}\``).join(', ');
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Komut Listesi')
                .setDescription(
                    `Mevcut tüm komutlar:\n\n${commandList}\n\n` +
                    `Belirli bir komut hakkında bilgi almak için, ${isSlashCommand ? '`/help [komut_adı]`' : '`.1help [komut_adı]`'} yazın.`
                );
            return responseChannel.send({ embeds: [embed] });
        }

        const command = commandsToDisplay.get(commandName) || commandsToDisplay.find(c => c.aliases && c.aliases.includes(commandName));

        if (!command) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('`Bu isimde bir komut bulunamadı.`');
            return responseChannel.send({ embeds: [embed] });
        }

        const data = [];

        // Hem slash hem de prefix komutları için bilgi al
        const cmdName = command.name || command.data.name;
        const cmdDescription = command.description || command.data.description;
        const cmdAliases = command.aliases;
        const cmdUsage = command.usage;
        
        data.push(`**İsim:** \`${cmdName}\``);
        if (cmdAliases && cmdAliases.length > 0) {
            data.push(`**Takma İsimler:** \`${cmdAliases.join(', ')}\``);
        }
        if (cmdDescription) {
            data.push(`**Açıklama:** ${cmdDescription}`);
        }
        if (cmdUsage) {
            data.push(`**Prefix Kullanımı:** \`.${cmdName} ${cmdUsage}\``);
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Komut: ${cmdName}`)
            .setDescription(data.join('\n'));

        responseChannel.send({ embeds: [embed] });
    },
};
