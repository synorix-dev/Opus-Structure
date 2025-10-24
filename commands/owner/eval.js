/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'eval',
  aliases: ['evaluate'],
  ownerOnly: true,
  run: async (client, message, args) => {
    try {
      const code = args.join(' ');
      if (!code) return message.reply('Please provide a code to evaluate.');
      let evaled = eval(code);
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      message.channel.send({ embeds: [new EmbedBuilder().setDescription(`\`\`\`js\n${evaled}\`\`\``)]});
    } catch (err) {
      const error = err.message || err.toString().replace(client.token, 'TOKEN');
      message.channel.send({ embeds: [new EmbedBuilder().setDescription(`\`\`\`js\n${error}\`\`\``)]});
    }
  }
}