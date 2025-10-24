/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'reconnect',
  description: 'Reconnects the bot to the voice channel and restarts the current track.',
  cat: 'music',
  usage: 'reconnect',
  cooldown: 5,
  example: 'reconnect',
  inVc: true,
  sameVc: true,

  run: async (client, message) => {
    const player = client.kazagumo.players.get(message.guild.id);
    const color = client.config.color || '#00FFFF';

    if (!player) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setDescription('⚠️ There is no active player in this server.')
        ],
        allowedMentions: { repliedUser: false },
      });
    }

    const vc = message.guild.channels.cache.get(player.voiceId);
    if (!vc) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setDescription('❌ The original voice channel could not be found.')
        ],
        allowedMentions: { repliedUser: false },
      });
    }

    const currentTrack = player.queue.current;
    if (!currentTrack) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setDescription('⚠️ There is no song currently playing to restart.')
        ],
        allowedMentions: { repliedUser: false },
      });
    }

    try {
      const textChannelId = player.textId;

      await player.destroy();

      const newPlayer = await client.kazagumo.createPlayer({
        guildId: message.guild.id,
        voiceId: vc.id,
        textId: textChannelId,
        deaf: true,
      });

      await newPlayer.play(currentTrack, { startTime: 0 });

      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: '🔄 Player Reconnected', iconURL: client.user.displayAvatarURL() })
        .setDescription(`Reconnected to <#${vc.id}> and restarted **${currentTrack.title}**.`);

      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } catch (err) {
      console.error('[RECONNECT ERROR]', err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setDescription('❌ Failed to reconnect the player. Please try again.')
        ],
        allowedMentions: { repliedUser: false },
      });
    }
  },
};