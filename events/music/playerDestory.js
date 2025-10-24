/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {
  if (client.config.music === false) return;

  client.kazagumo.on('playerDestroy', async (player) => {
    try {
      const channel = client.channels.cache.get(player.textId);
      if (!channel) return console.warn(`Channel with ID ${player.textId} not found.`);

      const embed = new EmbedBuilder()
        .setAuthor({ name: 'Queue Concluded', iconURL: client.user.displayAvatarURL() })
        .setColor(client.config.color || '#00FFFF');

      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Error in playerDestroy event:', err);
    }
  });
};
