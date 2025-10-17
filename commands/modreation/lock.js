const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'lock',
  cat: 'moderation',
  description: 'Lock the current channel',
  run: async (client, message) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply('❌ You don’t have permission to lock channels.');
    await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle('🔒 Channel Locked')
      .setDescription(`This channel has been locked by ${message.author}.`)
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  },
};