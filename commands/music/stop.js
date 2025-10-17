const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stop',
  aliases: ['leave', 'disconnect'],
  cat: 'music',
  description: 'Stops the music and disconnects the bot from the voice channel',
  inVc: true,
  sameVc: true,
  cooldown: 5,

  async run(client, message) {
    const player = client.kazagumo.players.get(message.guild.id);

    if (!player)
      return message.reply('There is no active player in this server.');

    player.destroy();

    const embed = new EmbedBuilder()
      .setTitle('Stopped Playback')
      .setDescription(`${client.emojis?.stop || '🛑'} The music has been stopped and the bot left the voice channel.`)
      .setColor(client.config.color);

    await message.channel.send({ embeds: [embed] });
  }
};
