const { EmbedBuilder } = require('discord.js');
const Prefix = require('../../schemas/prefix');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Shows all available commands.',
  run: async (client, message, args) => {
    const prefixData = await Prefix.findOne({ guildId: message.guild.id });
    const prefix = prefixData ? prefixData.prefix : client.config.prefix;

    if (args[0]) {
      const cmd = client.commands.get(args[0].toLowerCase());
      if (!cmd)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.color || '#00FF66')
              .setDescription(`No command found with the name \`${args[0]}\`.`)
              .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL(),
              }),
          ],
          allowedMentions: { repliedUser: false },
        });

      const embed = new EmbedBuilder()
        .setColor(client.config.color || '#00FF66')
        .setAuthor({
          name: `Command: ${cmd.name}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .addFields(
          { name: 'Name', value: `\`${cmd.name}\`` },
          {
            name: 'Aliases',
            value: `\`${cmd.aliases ? cmd.aliases.join(', ') : 'None'}\``,
          },
          {
            name: 'Description',
            value: `\`${cmd.description || 'No description provided.'}\``,
          },
          { name: 'Usage', value: `\`${prefix}${cmd.usage || cmd.name}\`` },
          {
            name: 'Example',
            value: `\`${prefix}${cmd.example || cmd.name}\``,
          }
        )
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL(),
        });

      return message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }

    const commandsPath = path.join(__dirname, '../../commands');
    const folders = fs
      .readdirSync(commandsPath)
      .filter((folder) => folder.toLowerCase() !== 'owner');

    const embed = new EmbedBuilder()
      .setColor(client.config.color || '#00FF66')
      .setAuthor({
        name: `${client.user.username} Help Menu`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      });

    for (const folder of folders) {
      const folderPath = path.join(commandsPath, folder);
      const commandFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith('.js'));

      const commandNames = commandFiles
        .map((file) => {
          const cmd = require(`${folderPath}/${file}`);
          return cmd.name ? `\`${cmd.name}\`` : null;
        })
        .filter(Boolean);

      if (commandNames.length > 0) {
        embed.addFields({
          name: `📁 ${folder.charAt(0).toUpperCase() + folder.slice(1)}`,
          value: commandNames.join(', '),
          inline: false,
        });
      }
    }

    embed.addFields({
      name: '📘 Usage',
      value: `Use \`${prefix}help <command>\` for more info about a command.`,
    });

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
};
