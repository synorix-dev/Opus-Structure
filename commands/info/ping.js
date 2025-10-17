module.exports = {
  name: "ping",
  aliases: ["latency"],
  cat: 'info',
  description: "Shows bot latency",
  cooldown: 5,
  async run(client, message) {
    const msg = await message.reply("Pinging...");
    msg.edit(`Pong! Latency: **${client.ws.ping}ms**`);
  }
};
