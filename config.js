/**
 * Opus Structure v1.6
 * Copyright (c) 2025 SYNORIX
 * Licensed under the Opus Structure License v1.6
 * Free to use and modify — Commercial use prohibited.
 */

module.exports = {
  token: '', // Your bot token here
  private: true, // Set to false if you want your bot to be public
  music: true, // Set to false if you don't want to use music commands
  prefix: '>', // Your Bot Prefix here
  color: 0x2F3136, // EmbedColor
  owners: [''], // Your discord ID Here
  databaseURL: '', // Your MongoDB URL Here
  activity: [
      () => `Opus Structure | V1.6 | Public`,
      () => `Opus Structure By synorix.dev2`,
      () => `https://github.com/synorix-dev/Opus-Structure/tree/main#`,
  ], // Bot Activities
  nodes: [
   {
       name: 'Lavalink',
       url: 'lavalink.jirayu.net:13592',
       secure: false,
       auth: 'youshallnotpass'
    }
  ] // Lavalink Nodes
};
