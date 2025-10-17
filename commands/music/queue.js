const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'Shows the current music queue with pagination.',
  usage: 'queue',
  example: 'queue',
  cat: 'music',
  cooldown: 3,
  inVc: true,
  sameVc: true,

  run: async (client, message) => {
    const player = client.kazagumo.players.get(message.guild.id);
    const color = client.config.embed_color || '#00FFFF';

    if (!player || !player.queue.current)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(color)
            .setAuthor({ name: 'No Music Playing', iconURL: client.user.displayAvatarURL() })
            .setDescription('There is no song currently playing in this server.')
        ],
      });

    const queue = player.queue;
    const songs = queue.map((t, i) => `**${i + 1}.** [${t.title}](${t.uri}) — \`${t.requester.tag}\``);

    const chunkSize = 10;
    const pages = [];
    for (let i = 0; i < songs.length; i += chunkSize) {
      const currentChunk = songs.slice(i, i + chunkSize).join('\n');
      const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: `🎶 ${message.guild.name} Queue`, iconURL: message.guild.iconURL({ dynamic: true }) })
        .setDescription(
          `**Now Playing:** [${queue.current.title}](${queue.current.uri}) — \`${queue.current.requester.tag}\`\n\n${currentChunk}`
        )
        .setFooter({ text: `Page ${Math.floor(i / chunkSize) + 1}/${Math.ceil(songs.length / chunkSize)}` });
      pages.push(embed);
    }

    let page = 0;
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('prev').setEmoji('◀️').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('next').setEmoji('▶️').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
    );

    const msg = await message.reply({ embeds: [pages[page]], components: [row] });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 120000,
    });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'prev') {
        page = page > 0 ? page - 1 : pages.length - 1;
      } else if (interaction.customId === 'next') {
        page = page + 1 < pages.length ? page + 1 : 0;
      } else if (interaction.customId === 'stop') {
        collector.stop();
        return interaction.update({ components: [] });
      }

      await interaction.update({ embeds: [pages[page]], components: [row] });
    });

    collector.on('end', () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  },
};