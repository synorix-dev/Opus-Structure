/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unban',
  cat: 'mod',
  usage: 'unban <userID>',
  description: 'Unban a previously banned user.',
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply('❌ You do not have permission to use this command.');

    const userId = args[0];
    if (!userId) return message.reply('⚠️ Please provide a user ID to unban.');

    try {
      const bannedUsers = await message.guild.bans.fetch();
      const user = bannedUsers.get(userId)?.user;

      if (!user)
        return message.reply('⚠️ This user is not banned or the ID is invalid.');

      await message.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTitle('✅ Member Unbanned')
        .setDescription(`**User:** ${user.tag}\n**By:** ${message.author.tag}`)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.reply('❌ Could not unban the specified user. Make sure the ID is correct.');
    }
  },
};