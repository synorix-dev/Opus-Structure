/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "autoplay",
  description: "Toggle autoplay for continuous playback",
  aliases: ['ap'],
  run: async (client, message, args) => {
      function embed(title, description) {
        const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(client.config.color)
     if (description) embed.setDescription(description)
        message.reply({ embeds: [embed] })
      }
      
    const player = client.kazagumo.players.get(message.guild.id);
    if (!player) return embed('No Player Found', "❌ No active music player in this server.");

    const current = player.data.get("autoplay") || false;
    player.data.set("autoplay", !current);

    return embed('Autoplay System', `✅ Autoplay is now **${!current ? "enabled" : "disabled"}**.`);
  },
};