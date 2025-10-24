/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const mongoose = require('mongoose');
const VCStatus = require('../../schemas/vcstatus');

module.exports = (client) => {
  client.kazagumo.on('playerStart', async (player, track) => {
    try {
      const guild = client.guilds.cache.get(player.guildId);
      if (!guild) return;

      const vc = guild.channels.cache.get(player.voiceId);
      if (!vc || vc.type !== 13) return;

      const data = await VCStatus.findOne({ guildId: guild.id });
      if (!data || data.enabled !== true) return;

      await vc.setTopic(track.title).catch(() => {});
    } catch (err) {
      console.error('[VC STATUS ERROR]', err);
    }
  });
};