const { REST, Routes } = require('discord.js');
require('dotenv').config();

const token = process.env.TOKEN;
const clientId = '1236223806851256361'; // Buraya botunuzun Uygulama ID'sini girin
const guildId = 'SUNUCUNUN (GUILD) ID'Sİ'; // Sadece o sunucudaki komutları silmek için sunucu ID'sini girin (isteğe bağlı)

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Sunucu komutları sıfırlanıyor...');

    // Belirli bir sunucudaki (guild) komutları silmek için Routes.applicationGuildCommands kullanın
   // await rest.put(
   //   Routes.applicationGuildCommands(clientId, guildId),
    //  { body: [] },
   // );

    // Eğer global komutları silmek isterseniz aşağıdaki satırı kullanın
     await rest.put(
       Routes.applicationCommands(clientId),
       { body: [] },
     );

    console.log('Komutlar başarıyla silindi.');
  } catch (error) {
    console.error(error);
  }
})();
