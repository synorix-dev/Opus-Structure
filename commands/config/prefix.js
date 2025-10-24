const { EmbedBuilder } = require('discord.js');
const Prefix = require('../../schemas/prefix');

module.exports = {
  name: 'prefix',
  description: 'Set the prefix for the bot in your server.',
  usage: 'prefix <new-prefix>',
  example: 'prefix !',
  permissions: ['ManageServer'],
  run: async (client, message, args) => {
    const newPrefix = args[0];
    if (!newPrefix) {
      const embed = new EmbedBuilder()
      .setColor(client.config.color || '#00FF66')
      .setDescription('Please provide a new prefix e.g. `>prefix !`')
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.reply({
        embeds: [embed],
        allowedMentions: {
          repliedUser: false
        }
      });
    }
    await Prefix.findOneAndUpdate(
      { guildId: message.guild.id },
      { prefix: newPrefix },
      { upsert: true }
    );
    const embed = new EmbedBuilder().setColor(client.config.color || '#00FF66').setDescription(`Prefix updated to \`${newPrefix}\``).setFooter({ text: `Requested By ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }});
  }
}