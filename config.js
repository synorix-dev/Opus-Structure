module.exports = {
  token: '', // Your bot token here
  private: true, // Set to false if you want your bot to be public
  music: true, // Set to false if you don't want to use music commands
  prefix: '>', // Your Bot Prefix here
  color: 0xFFF000, // EmbedColor
  owners: [''], // Your discord ID Here
  databaseURL: '', // Your MongoDB URL Here
  activity: [
      () => `Opus Structure | V1.6 | Public Updated`,
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