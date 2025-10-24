const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
  client.on('guildCreate', async (guild) => {
    const owner = await client.users.fetch(guild.ownerId);
    if (client.config.private === true) {
      if (!client.config.owners.includes(guild.ownerId)) {

       const embed = new EmbedBuilder().setColor(client.config.color || '#00FF66').setDescription(`Hey ${owner.tag}, this bot is private. You can't add it to your servers please get permission from the bot owner to add it to your server.`).setThumbnail(client.user.displayAvatarURL()).setTimestamp();
        owner.send({ embeds: [embed] }).catch(() => {});
        
        await guild.leave()
      }
    }
  })
}