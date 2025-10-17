const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warn = require('../../schemas/warn');

module.exports = {
  name: 'unwarn',
  cat: 'moderation',
  description: 'Remove one warning from a user',
  usage: 'unwarn <user>',
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) &&
        !message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply('❌ You don’t have permission to remove warnings.');

    const user = message.mentions.members.first();
    if (!user) return message.reply('⚠️ Please mention a valid user.');

    const warn = await Warn.findOne({ guildId: message.guild.id, userId: user.id });
    if (!warn) return message.reply('✅ This user has no warnings.');

    await Warn.deleteOne({ _id: warn._id });

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle('✅ Warning Removed')
      .setDescription(`**User:** ${user.user.tag}\n**Moderator:** ${message.author.tag}`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};