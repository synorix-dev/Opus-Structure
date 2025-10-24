/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  description: 'Skips the current song or multiple songs in the queue.',
  usage: 'skip [amount]',
  example: 'skip 2',
  cat: 'music',
  cooldown: 3,
  inVc: true,
  sameVc: true,

  run: async (client, message, args) => {
    const color = client.config.embed_color || '#00FFFF';
    const player = client.kazagumo.players.get(message.guild.id);

    if (!player || !player.queue.current) {
      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: 'Nothing Playing', iconURL: client.user.displayAvatarURL() })
        .setDescription('There is no song currently playing.');
      return message.reply({ embeds: [embed] });
    }

    const memberVc = message.member.voice.channel;
    if (!memberVc || memberVc.id !== player.voiceId) {
      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: 'Not in Same Voice Channel', iconURL: client.user.displayAvatarURL() })
        .setDescription('You must be in the **same voice channel** as me to skip songs.');
      return message.reply({ embeds: [embed] });
    }

    let amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1) amount = 1;

    const queueLength = player.queue.length;
    if (amount > queueLength + 1) {
      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: 'Invalid Skip Amount', iconURL: client.user.displayAvatarURL() })
        .setDescription(`There are only **${queueLength + 1}** songs (including current).`);
      return message.reply({ embeds: [embed] });
    }

    const current = player.queue.current;
    const skippedTracks = [];

    if (amount > 1) {
      for (let i = 0; i < amount - 1; i++) {
        const removed = player.queue.shift();
        if (removed) skippedTracks.push(removed.title);
      }
    }

    await player.skip();

    const embed = new EmbedBuilder()
      .setColor(color)
      .setAuthor({ name: 'Track Skipped', iconURL: client.user.displayAvatarURL() })
      .setDescription(
        amount > 1
          ? `⏭️ Skipped **${amount}** tracks.\n\n**Removed:**\n${skippedTracks.map((t) => `• ${t}`).join('\n')}`
          : `⏭️ Skipped **[${current.title}](${current.uri})**`
      )
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    return message.reply({ embeds: [embed] }).catch(() => {});
  },
};