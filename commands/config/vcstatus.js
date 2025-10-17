const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const VCStatus = require("../../schemas/vcstatus");

module.exports = {
  name: "vcstatus",
  description: "Enable or disable the VC Status system",
  usage: "vcstatus <enable|disable>",
  aliases: ["vc"],
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ You need the `Manage Server` permission to use this command.")
        ]
      });
    }

    const option = args[0]?.toLowerCase();
    if (!["enable", "disable"].includes(option)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("⚠️ Usage: `vcstatus <enable|disable>`")
        ]
      });
    }

    let data = await VCStatus.findOne({ guildId: message.guild.id });
    if (!data) data = await VCStatus.create({ guildId: message.guild.id });

    data.enabled = option === "enable";
    await data.save();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(`✅ VC Status system has been **${data.enabled ? "enabled" : "disabled"}**.`)
      ]
    });
  }
};