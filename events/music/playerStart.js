const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = (client) => {
  if (client.config.music === false) return;

  client.kazagumo.on('playerStart', async (player, track) => {
    try {
      const textChannel = client.channels.cache.get(player.textId);
      if (!textChannel) return;

      const voiceChannel = client.channels.cache.get(player.voiceId);

      if (voiceChannel?.type === 13) {
        try {
          const botMember = voiceChannel.guild.members.me;
          if (botMember.voice.suppress) await botMember.voice.setSuppressed(false);
        } catch (err) {
          console.warn(`[STAGE SPEAK ERROR] Cannot make bot speak in ${voiceChannel.name}: ${err.message}`);
        }
      }

      const loopMode = player.loop || 'none';
      const embed = new EmbedBuilder()
        .setTitle('Now Playing')
        .setDescription(`**[${track.title}](${track.uri})**`)
        .addFields(
          { name: 'Artist', value: track.author || 'Unknown', inline: true },
          { name: 'Requested by', value: `${track.requester || 'OrganicMC • Core'}`, inline: true },
          { name: 'Duration', value: track.isStream ? '🔴 Live' : `\`${formatDuration(track.length)}\``, inline: true }
        )
        .setThumbnail(track.thumbnail || null)
        .setColor(client.config.color)
        .setFooter({ text: 'Use the buttons below to control playback' })
        .setTimestamp();

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('music_pause').setEmoji('⏸️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('music_shuffle').setEmoji('🔀').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('music_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('music_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('music_loop').setEmoji('🔁').setStyle(loopMode === 'none' ? ButtonStyle.Secondary : ButtonStyle.Success)
      );

      const msg = await textChannel.send({ embeds: [embed], components: [buttons] });
      player.data.set('message', msg);

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: track.length
      });

      collector.on('collect', async (interaction) => {
        if (!interaction.member.voice.channel || interaction.member.voice.channel.id !== player.voiceId) {
          return interaction.reply({
            embeds: [createResponseEmbed('⚠️ You must be in the same voice channel to use the controls.')],
            ephemeral: true
          });
        }

        switch (interaction.customId) {
          case 'music_pause':
            player.pause(!player.paused);
            return interaction.reply({ embeds: [createResponseEmbed(player.paused ? '⏸️ Music paused.' : '▶️ Music resumed.')], ephemeral: true });
          case 'music_shuffle':
            if (player.queue.length < 3) return interaction.reply({ embeds: [createResponseEmbed('Queue must have at least 3 songs to shuffle.')], ephemeral: true });
            player.queue.shuffle();
            return interaction.reply({ embeds: [createResponseEmbed('🔀 Shuffled the queue!')], ephemeral: true });
          case 'music_skip':
            player.skip();
            return interaction.reply({ embeds: [createResponseEmbed('⏭️ Skipped to the next track.')], ephemeral: true });
          case 'music_stop':
            player.destroy();
            collector.stop('stopped');
            return interaction.reply({ embeds: [createResponseEmbed('🛑 Music stopped and disconnected.')], ephemeral: true });
          case 'music_loop':
            let newLoopMode = player.loop === 'none' ? 'track' : player.loop === 'track' ? 'queue' : 'none';
            player.setLoop(newLoopMode);
            const loopEmbed = new EmbedBuilder()
              .setColor(client.config.color)
              .setDescription(newLoopMode === 'track' ? '🔂 Looping **current track**.' : newLoopMode === 'queue' ? '🔁 Looping **entire queue**.' : '⏹️ Loop disabled.');
            const updatedButtons = new ActionRowBuilder().addComponents(
              new ButtonBuilder().setCustomId('music_pause').setEmoji('⏸️').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('music_shuffle').setEmoji('🔀').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('music_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
              new ButtonBuilder().setCustomId('music_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
              new ButtonBuilder().setCustomId('music_loop').setEmoji('🔁').setStyle(newLoopMode === 'none' ? ButtonStyle.Secondary : ButtonStyle.Success)
            );
            await msg.edit({ components: [updatedButtons] });
            return interaction.reply({ embeds: [loopEmbed], ephemeral: true });
        }
      });

      collector.on('end', async () => {
        const disabledButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('music_pause').setEmoji('⏸️').setStyle(ButtonStyle.Secondary).setDisabled(true),
          new ButtonBuilder().setCustomId('music_shuffle').setEmoji('🔀').setStyle(ButtonStyle.Secondary).setDisabled(true),
          new ButtonBuilder().setCustomId('music_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary).setDisabled(true),
          new ButtonBuilder().setCustomId('music_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger).setDisabled(true),
          new ButtonBuilder().setCustomId('music_loop').setEmoji('🔁').setStyle(ButtonStyle.Secondary).setDisabled(true)
        );
        await msg.edit({ components: [disabledButtons] });
      });

    } catch (err) {
      console.error(`[MUSIC]: playerStart error -> ${err.message}`);
    }
  });
};

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

function createResponseEmbed(text) {
  return new EmbedBuilder().setDescription(text).setColor('#00AEEF');
}