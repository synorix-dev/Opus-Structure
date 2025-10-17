const { EmbedBuilder } = require("discord.js");
const ms = require("ms");
const NoPrefixUser = require("../../schemas/noprefix");
const config = require("../../config.js");

module.exports = {
  name: "noprefix",
  aliases: ["np"],
  ownerOnly: true,
  description: "Manage global no prefix users with optional expiry duration",
  usage: 'np add/remove/list <user> [duration]',
  example: 'np add @synorix.dev2 30d',
  run: async (client, message, args) => {
    if (!args[0]) return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription("Usage: noprefix add/remove @user [duration]")] });

    const sub = args[0].toLowerCase();
    const user = message.mentions.users.first() || await client.users.fetch(args[1]).catch(() => null);
    if (!user) return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription("Please mention a valid user.")] });

    if (sub === "add") {
      const durationStr = args[2]; 
      let expiresAt = null;
      if (durationStr) {
        const durationMs = ms(durationStr);
        if (!durationMs) return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription("Invalid duration format. Use 1h, 30m, 2d etc.")] });
        expiresAt = new Date(Date.now() + durationMs);
      }

      let existing = await NoPrefixUser.findOne({ userId: user.id });
      if (existing) {
        existing.expiresAt = expiresAt;
        await existing.save();
        return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription(`${user.tag} already had no prefix access, expiry updated.`)] });
      }

      await NoPrefixUser.create({ userId: user.id, expiresAt });
      return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription(`${user.tag} granted global no prefix access${expiresAt ? ` until <t:${Math.floor(expiresAt.getTime()/1000)}:R>` : " permanently"}.`)] });
    }

    if (sub === "remove") {
      const existing = await NoPrefixUser.findOne({ userId: user.id });
      if (!existing) return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription(`${user.tag} does not have no prefix access.`)] });
      await NoPrefixUser.deleteOne({ userId: user.id });
      return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription(`${user.tag} no prefix access removed.`)] });
    }

    return message.reply({ embeds: [new EmbedBuilder().setColor(config.color).setDescription("Invalid subcommand. Use add or remove.")] });
  }
};