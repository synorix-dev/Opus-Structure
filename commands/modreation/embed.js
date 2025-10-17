const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "embed",
  description: "Customize an embed and send it",
  permissions: ['ManageMassages'],
  run: async (client, message, args) => {
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!channel) channel = message.channel;

    const embed = new EmbedBuilder()
      .setTitle("Customize this embed")
      .setDescription("Customise this embed using the select menu below.")
      .setColor(client.color);

    const menu = new StringSelectMenuBuilder()
      .setCustomId("embed_select")
      .setPlaceholder("Select a section to customize")
      .addOptions([
        { label: "Basic", description: "Edit title, description, color", value: "basic" },
        { label: "Images", description: "Edit thumbnail and image", value: "images" },
        { label: "Author", description: "Edit author text and url", value: "author" },
        { label: "Footer", description: "Edit footer text and icon url", value: "footer" },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("send_embed").setLabel("✅ Send Embed").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("cancel_embed").setLabel("❌ Cancel").setStyle(ButtonStyle.Danger)
    );

    const msg = await message.channel.send({ embeds: [embed], components: [row, row2] });

    const collector = msg.createMessageComponentCollector({ time: 600000 });

    collector.on("collect", async (interaction) => {
      if (interaction.user.id !== message.author.id)
        return interaction.reply({ content: "❌ Only the command author can use this.", ephemeral: true });

      if (interaction.isStringSelectMenu()) {
        let modal;
        switch (interaction.values[0]) {
          case "basic":
            modal = new ModalBuilder().setCustomId("modal_basic").setTitle("Edit Basic").addComponents(
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("title").setLabel("Title").setStyle(TextInputStyle.Short).setRequired(false)),
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("description").setLabel("Description").setStyle(TextInputStyle.Paragraph).setRequired(false)),
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("color").setLabel("Color (HEX)").setStyle(TextInputStyle.Short).setRequired(false))
            );
            break;
          case "images":
            modal = new ModalBuilder().setCustomId("modal_images").setTitle("Edit Images").addComponents(
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("thumbnail").setLabel("Thumbnail URL").setStyle(TextInputStyle.Short).setRequired(false)),
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("image").setLabel("Image URL").setStyle(TextInputStyle.Short).setRequired(false))
            );
            break;
          case "author":
            modal = new ModalBuilder().setCustomId("modal_author").setTitle("Edit Author").addComponents(
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("author_text").setLabel("Author Text").setStyle(TextInputStyle.Short).setRequired(false)),
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("author_url").setLabel("Author URL").setStyle(TextInputStyle.Short).setRequired(false))
            );
            break;
          case "footer":
            modal = new ModalBuilder().setCustomId("modal_footer").setTitle("Edit Footer").addComponents(
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("footer_text").setLabel("Footer Text").setStyle(TextInputStyle.Short).setRequired(false)),
              new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("footer_url").setLabel("Footer Icon URL").setStyle(TextInputStyle.Short).setRequired(false))
            );
            break;
        }
        await interaction.showModal(modal);
      }

      if (interaction.isButton()) {
        if (interaction.customId === "send_embed") {
          await channel.send({ embeds: [embed] });
          await interaction.reply({ content: "✅ Embed sent!", ephemeral: true });
          await msg.delete().catch(() => {});
          collector.stop();
        }
        if (interaction.customId === "cancel_embed") {
          await interaction.reply({ content: "❌ Embed creation cancelled.", ephemeral: true });
          await msg.delete().catch(() => {});
          collector.stop();
        }
      }
    });

    client.on("interactionCreate", async (i) => {
      if (!i.isModalSubmit()) return;
      if (i.user.id !== message.author.id) return;

      if (i.customId === "modal_basic") {
        const title = i.fields.getTextInputValue("title") || null;
        const desc = i.fields.getTextInputValue("description") || null;
        const color = i.fields.getTextInputValue("color") || client.color;
        if (title) embed.setTitle(title); else embed.setTitle(null);
        if (desc) embed.setDescription(desc); else embed.setDescription(null);
        embed.setColor(color);
      }

      if (i.customId === "modal_images") {
        const thumbnail = i.fields.getTextInputValue("thumbnail");
        const image = i.fields.getTextInputValue("image");
        if (thumbnail) embed.setThumbnail(thumbnail); else embed.setThumbnail(null);
        if (image) embed.setImage(image); else embed.setImage(null);
      }

      if (i.customId === "modal_author") {
        const text = i.fields.getTextInputValue("author_text");
        const url = i.fields.getTextInputValue("author_url");
        if (text) embed.setAuthor({ name: text, iconURL: url || null });
        else embed.setAuthor(null);
      }

      if (i.customId === "modal_footer") {
        const text = i.fields.getTextInputValue("footer_text");
        const url = i.fields.getTextInputValue("footer_url");
        if (text) embed.setFooter({ text: text, iconURL: url || null });
        else embed.setFooter(null);
      }

      await i.reply({ content: "✅ Embed updated!", ephemeral: true });
      await msg.edit({ embeds: [embed], components: [row, row2] });
    });
  },
}