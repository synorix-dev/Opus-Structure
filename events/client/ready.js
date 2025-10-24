/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = async (client) => {
  client.once('ready', async () => {
    try {
      const activity = client.config.activity?.[0] || { type: 'PLAYING', name: 'Active' };

      console.clear();
      console.log(chalk.bold.cyanBright('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
      console.log(chalk.bold.cyanBright(`┃  ${chalk.whiteBright('BOT ONLINE & READY TO OPERATE')}              ┃`));
      console.log(chalk.bold.cyanBright('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'));

      console.log(`${chalk.gray('📘')} ${chalk.bold('Bot Information')}`);
      console.log(`${chalk.white('› Name:')} ${chalk.green(client.user.tag)}`);
      console.log(`${chalk.white('› ID:')} ${chalk.green(client.user.id)}`);
      console.log(`${chalk.white('› Guilds:')} ${chalk.green(client.guilds.cache.size)}`);
      console.log(`${chalk.white('› Users:')} ${chalk.green(client.users.cache.size)}`);
      console.log(`${chalk.white('› Ping:')} ${chalk.green(client.ws.ping)}ms`);
      console.log(`${chalk.white('› Uptime:')} ${chalk.green(Math.floor(process.uptime() / 60))}m\n`);

      console.log(`${chalk.gray('⚙️')} ${chalk.bold('Configuration')}`);
      console.log(`${chalk.white('› Private Mode:')} ${client.config.private ? chalk.green('Enabled') : chalk.red('Disabled')}`);
      console.log(`${chalk.white('› Music System:')} ${client.config.music ? chalk.green('Enabled') : chalk.red('Disabled')}`);

      mongoose.set('strictQuery', true);
      await mongoose.connect(client.config.databaseURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`${chalk.gray('🧩')} ${chalk.bold('Database Connection')}`);
      console.log(`${chalk.white('› Name:')} ${chalk.green(mongoose.connection.name)}`);
      console.log(`${chalk.white('› Host:')} ${chalk.green(mongoose.connection.host)}\n`);

      const activities = client.config.activity;

    let i = 0;
    setInterval(() => {
      client.user.setPresence({
        activities: [{ name: activities[i](), type: 4 }],
        status: "online",
      });
      i = (i + 1) % activities.length;
    }, 15 * 1000);
    console.log("[INFO] Sucessfully set the activity loop");
      console.log(chalk.greenBright.bold('✅ Bot Ready! ') + chalk.white(`Logged in as ${chalk.greenBright(client.user.tag)}\n`));
    } catch (error) {
      console.log(chalk.red.bold('❌ Startup Error Occurred!'));
      console.log(chalk.red(`› ${error.stack || error.message}\n`));
    }
  });
};