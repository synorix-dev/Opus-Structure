const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'hide',
  cat: 'moderation',
  description: 'Hide the current channel',
  run: async (client, message) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply('❌ You don’t have permission to hide channels.');
    await message.channel.permissionOverwrites.edit(message.guild.id, { ViewChannel: false });

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle('🙈 Channel Hidden')
      .setDescription(`This channel has been hidden by ${message.author}.`)
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  },
};