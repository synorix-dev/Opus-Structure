/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'bans',
  cat: 'mod',
  description: 'Show a list of all banned users.',
  run: async (client, message) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply('❌ You do not have permission to use this command.');

    try {
      const bans = await message.guild.bans.fetch();
      if (bans.size === 0)
        return message.reply('✅ There are no banned users in this server.');

      const banList = bans.map((ban) => `• **${ban.user.tag}** (${ban.user.id})`).join('\n');

      const embed = new EmbedBuilder()
        .setColor(client.config.color)
        .setTitle(`🚫 Banned Users [${bans.size}]`)
        .setDescription(banList.length > 4000 ? `${banList.slice(0, 4000)}...` : banList)
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.reply('❌ Something went wrong while fetching the ban list.');
    }
  },
};