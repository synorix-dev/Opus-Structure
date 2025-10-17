const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warn = require('../../schemas/warn');

module.exports = {
  name: 'warn',
  cat: 'moderation',
  description: 'Warn a user',
  usage: 'warn <user> [reason]',
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) &&
        !message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply('❌ You don’t have permission to warn members.');

    const user = message.mentions.members.first();
    if (!user) return message.reply('⚠️ Please mention a valid user.');
    if (user.id === message.author.id) return message.reply('❌ You cannot warn yourself.');

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await Warn.create({
      guildId: message.guild.id,
      userId: user.id,
      moderatorId: message.author.id,
      reason,
      date: Date.now(),
    });

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle('⚠️ Member Warned')
      .setDescription(`**User:** ${user.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};