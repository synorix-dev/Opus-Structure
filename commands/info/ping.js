/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

module.exports = {
  name: "ping",
  aliases: ["latency"],
  cat: 'info',
  description: "Shows bot latency",
  cooldown: 5,
  async run(client, message) {
    const msg = await message.reply("Pinging...");
    msg.edit(`Pong! Latency: **${client.ws.ping}ms**`);
  }
};
