/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'purge',
  cat: 'mod',
  description: 'Advanced message purging with multiple filters.',
  usage: 'purge <amount> [bots|b|user|u|images|i|embeds|e] [@user]',
  example: 'purge 50 bots\npurge 20 user @Terror\npurge 100 images',
  permissions: [PermissionsBitField.Flags.ManageMessages],
  async run(client, message, args) {
    const embedColor = client.config.color || '#00FF66';

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('❌ Insufficient Permissions')
            .setDescription('You need **Manage Messages** permission to use this command.')
        ]
      });
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('❌ Missing Bot Permissions')
            .setDescription('I need **Manage Messages** permission to purge messages.')
        ]
      });
    }

    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('❌ Invalid Amount')
            .setDescription(`Provide a number between 1 and 100.\nUsage: \`${client.config.prefix}purge <amount> [bots|b|user|u|images|i|embeds|e] [@user]\``)
        ]
      });
    }

    const typeInput = args[1]?.toLowerCase() || null;
    const mentionedUser = message.mentions.users.first();

    let type;
    switch (typeInput) {
      case 'b': case 'bots': type = 'bots'; break;
      case 'u': case 'user': type = 'user'; break;
      case 'i': case 'images': type = 'images'; break;
      case 'e': case 'embeds': type = 'embeds'; break;
      default: type = null; break;
    }

    try {
      const messages = await message.channel.messages.fetch({ limit: amount });
      let toDelete;

      switch (type) {
        case 'bots':
          toDelete = messages.filter(m => m.author.bot);
          break;
        case 'user':
          if (!mentionedUser) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(embedColor)
                  .setTitle('❌ User Not Mentioned')
                  .setDescription('Please mention a valid user to purge their messages.')
              ]
            });
          }
          toDelete = messages.filter(m => m.author.id === mentionedUser.id);
          break;
        case 'images':
          toDelete = messages.filter(m => m.attachments.size > 0 || (m.embeds && m.embeds.some(e => e.image)));
          break;
        case 'embeds':
          toDelete = messages.filter(m => m.embeds.length > 0);
          break;
        default:
          toDelete = messages;
          break;
      }

      if (!toDelete || toDelete.size === 0) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColor)
              .setTitle('⚠️ Nothing To Delete')
              .setDescription('No messages matched the criteria.')
          ]
        });
      }

      await message.channel.bulkDelete(toDelete, true);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('✅ Purge Complete')
            .setDescription(`Deleted **${toDelete.size}** messages${mentionedUser ? ` from ${mentionedUser.tag}` : ''}${type ? ` (${type})` : ''}.`)
        ]
      }).then(msg => setTimeout(() => msg.delete().catch(() => null), 5000));

    } catch (err) {
      console.error('[PURGE ERROR]', err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('❌ Error')
            .setDescription('An error occurred while trying to purge messages.')
        ]
      });
    }
  }
};