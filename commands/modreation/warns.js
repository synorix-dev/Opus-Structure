const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Warn = require('../../schemas/warn');

module.exports = {
  name: 'warns',
  cat: 'moderation',
  minArgs: 0,
  description: 'View your warnings or another user’s (if you have permission)',
  usage: 'warns [user]',
  run: async (client, message, args) => {
    const target = message.mentions.members.first() || message.member;
    const isSelf = target.id === message.author.id;

    if (
      !isSelf &&
      !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) &&
      !message.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return message.reply('❌ You don’t have permission to view other users’ warnings.');
    }

    const warns = await Warn.find({ guildId: message.guild.id, userId: target.id });

    if (!warns.length) {
      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setDescription(isSelf ? '✅ You have no warnings.' : `✅ ${target.user.tag} has no warnings.`);

      return message.reply({ embeds: [embed] });
    }

    const warnList = warns
      .map(
        (w, i) =>
          `**${i + 1}.** ${w.reason}\n**Moderator:** <@${w.moderatorId}> • <t:${Math.floor(
            w.date / 1000
          )}:R>`
      )
      .join('\n\n')
      .slice(0, 4000);

    const embed = new EmbedBuilder()
      .setColor(client.config.color)
      .setTitle(isSelf ? '⚠️ Your Warnings' : `⚠️ ${target.user.tag}'s Warnings`)
      .setDescription(warnList)
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};