/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'play',
  aliases: ['p'],
  usage: 'play <song>',
  cat: 'music',
  description: 'Plays a song',
  minArgs: 1,
  inVc: true,
  sameVc: true,
  cooldown: 5,

  async run(client, message, args) {
    if (!args.length) return message.reply('Please provide a song to play.');

    const sendEmbed = async (title, description) => {
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(client.config.color);
      await message.channel.send({ embeds: [embed] });
    };

    const query = args.join(' ');
    const channel = message.member.voice.channel;

    if (!channel) return message.reply('You must be in a voice channel to play music.');

    const player = await client.kazagumo.createPlayer({
      guildId: message.guild.id,
      voiceId: channel.id,
      textId: message.channel.id,
      deaf: true
    });

    const result = await client.kazagumo.search(query, { requester: message.author });

    if (!result.tracks.length)
      return sendEmbed('No Results', `${client.emojis?.cross || '❌'} No results found for your query.`);

    const track = result.tracks[0];
    player.queue.add(track);

    if (!player.playing && !player.paused) player.play();

    await sendEmbed('Added to Queue', `${client.emojis?.check || '☑️'} Added **[${track.title}](${track.uri})** to queue.`);
  }
};
