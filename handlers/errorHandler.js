/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

const chalk = require('chalk');

module.exports = (client) => {
    process.on("uncaughtException", (err) => {
  console.error(chalk.bgRed.white("[UncaughtException]"), err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.bgYellow.black("[UnhandledRejection]"), reason);
});

process.on("SIGINT", () => {
  console.log(chalk.red("[Bot Shutdown] Received SIGINT. Shutting down gracefully..."));
  process.exit(0);
});
}
