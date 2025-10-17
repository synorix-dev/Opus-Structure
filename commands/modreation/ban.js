const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'ban',
  cat: 'mod',
  aliases: ['banish'],
  usage: 'ban <user> [reason]',
  description: 'Ban a member from the server.',
  run: async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(' ') || 'No reason provided';

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply('❌ You do not have permission to use this command.');

    if (!member)
      return message.reply('⚠️ Please mention a valid member to ban.');

    if (!member.bannable)
      return message.reply('❌ I cannot ban this user. They may have higher permissions.');

    try {
      await member.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle('You have been banned!')
            .setDescription(`You were banned from **${message.guild.name}**.\n**Reason:** ${reason}`)
            .setTimestamp(),
        ],
      }).catch(() => null);

      await member.ban({ reason });

      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTitle('🔨 Member Banned')
        .setDescription(`**User:** ${member.user.tag}\n**By:** ${message.author.tag}\n**Reason:** ${reason}`)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.reply('❌ Something went wrong while trying to ban this member.');
    }
  },
};