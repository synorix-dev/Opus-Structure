const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unhide',
  cat: 'moderation',
  description: 'Unhide the current channel',
  run: async (client, message) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply('❌ You don’t have permission to unhide channels.');
    await message.channel.permissionOverwrites.edit(message.guild.id, { ViewChannel: true });

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle('👁️ Channel Unhidden')
      .setDescription(`This channel has been made visible again by ${message.author}.`)
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  },
};