const fs = require('fs');
module.exports = (client) => {
  const folders = fs.readdirSync('./commands');
  for (const folder of folders) {
    const files = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const cmd = require(`../commands/${folder}/${file}`);
      if (!cmd.name) continue;
      client.commands.set(cmd.name, cmd);
      if (cmd.aliases && cmd.aliases.length) {
        cmd.aliases.forEach(a => client.commands.set(a, cmd));
      }
    }
  }
  console.log(`[COMMANDS] ${client.commands.size} loaded`);
};
