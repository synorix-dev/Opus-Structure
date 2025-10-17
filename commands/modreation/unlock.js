const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unlock',
  cat: 'moderation',
  description: 'Unlock the current channel',
  run: async (client, message) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply('❌ You don’t have permission to unlock channels.');
    await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true });

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle('🔓 Channel Unlocked')
      .setDescription(`This channel has been unlocked by ${message.author}.`)
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  },
};