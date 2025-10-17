const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'shuffle',
  description: 'Shuffles the current queue.',
  usage: 'shuffle',
  example: 'shuffle',
  cat: 'music',
  cooldown: 3,
  inVc: true,
  sameVc: true,

  run: async (client, message) => {
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
        .setDescription('You must be in the **same voice channel** as me to shuffle the queue.');
      return message.reply({ embeds: [embed] });
    }

    if (player.queue.length < 2) {
      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: 'Not Enough Songs', iconURL: client.user.displayAvatarURL() })
        .setDescription('You need at least **2 songs** in the queue to shuffle.');
      return message.reply({ embeds: [embed] });
    }

    player.queue.shuffle();

    const embed = new EmbedBuilder()
      .setColor(color)
      .setAuthor({ name: 'Queue Shuffled', iconURL: client.user.displayAvatarURL() })
      .setDescription(`🔀 Successfully shuffled **${player.queue.length}** tracks in the queue.`)
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

    return message.reply({ embeds: [embed] }).catch(() => {});
  },
};