const { EmbedBuilder } = require('discord.js');
const cooldown = require('../../utils/cooldown');
const { permissionCheck } = require('../../utils/permissions');
const NoPrefixUser = require('../../schemas/noprefix');

module.exports = (client) => {
  client.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;

    const prefix = client.config.prefix;
  const content = message.content.trim();
  const botMention = `<@${client.user.id}>`;
  const botMentionNick = `<@!${client.user.id}>`;
    const mentionRegex = new RegExp(`^<@!?${client.user.id}>`);
    let usedPrefix = null;

    if (content.startsWith(prefix)) {
    usedPrefix = prefix;
  } else if (content.startsWith(botMention) || content.startsWith(botMentionNick)) {
    usedPrefix = content.startsWith(botMention) ? botMention : botMentionNick;
  } else {
    const noPrefixEntry = await NoPrefixUser.findOne({ userId: message.author.id });
    if (!noPrefixEntry) return;
  }

      let commandString = content;
  if (usedPrefix) {
    commandString = content.slice(usedPrefix.length).trim();
  }

  if (!commandString.length) return;

  const args = commandString.split(/ +/);
    
    const name = args.shift()?.toLowerCase();
    const cmd = client.commands.get(name);
    if (!cmd) return;

    const embedColor = client.config.embed_color || '#00FF66';
    if (cmd.cat === 'music' && client.config.music !== true) {
      return;
    }
   if (!cmd.cat === 'music' && message.guild.id !== '1425011586854031373') {
       const g = client.guilds.cache.get('1425011586854031373');
      const e = new EmbedBuilder()
      .setTitle('⚠️ You cant use this command')
      .setDescription(`This command can be only used in ${g.name}`)
      .setColor(client.config.color)
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.reply({ embeds: [e], allowedMentions: { repliedUser: false } });
   }

    if (cmd.inVc && !message.member.voice.channel) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Voice Channel Required', iconURL: client.user.displayAvatarURL() })
        .setDescription('🎧 You must be **in a voice channel** to use this command.')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    if (
      cmd.sameVc &&
      message.guild.members.me.voice?.channel &&
      message.member.voice?.channelId !== message.guild.members.me.voice?.channelId
    ) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Same Channel Required', iconURL: client.user.displayAvatarURL() })
        .setDescription('🔊 You must be **in the same voice channel as me** to use this command.')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    if (cmd.ownerOnly && !client.config.owners.includes(message.author.id)) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Access Denied', iconURL: client.user.displayAvatarURL() })
        .setDescription('🚫 This command is **restricted to bot owners only.**')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    if (!permissionCheck(message.member, cmd.permissions || [])) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Insufficient Permissions', iconURL: client.user.displayAvatarURL() })
        .setDescription('⚠️ You **do not have permission** to use this command.')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    const cd = cooldown(client, message.author.id, cmd.name, cmd.cooldown || 3);
    if (cd) {
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Cooldown Active', iconURL: client.user.displayAvatarURL() })
        .setDescription(`⏳ Please wait **${cd}** before using this command again.`)
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
      
      if (cmd.usage) {
      const usageParts = cmd.usage.split(/ +/);
      const requiredArgsCount = usageParts.filter((p) => p.startsWith('<') && p.endsWith('>')).length;

      if (args.length < requiredArgsCount) {
        const usageEmbed = new EmbedBuilder()
          .setColor(embedColor)
          .setAuthor({ name: 'Incorrect Usage', iconURL: client.user.displayAvatarURL() })
          .setDescription(
            `❌ Correct Usage:\n\`${prefix}${cmd.usage}\`${cmd.example ? `\n\n💡 Example: \`${prefix}${cmd.example}\`` : ''}`
          )
          .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
        return message.reply({ embeds: [usageEmbed], allowedMentions: { repliedUser: false } });
      }
    }
    
    try {
      await cmd.run(client, message, args);
    } catch (err) {
      console.error(`[COMMAND ERROR] ${cmd.name}:`, err);
      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setAuthor({ name: 'Command Error', iconURL: client.user.displayAvatarURL() })
        .setDescription('⚠️ An unexpected error occurred while executing this command.\nPlease try again later.')
        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
  });
};
