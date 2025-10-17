const { Kazagumo } = require('kazagumo');
const { Connectors } = require('shoukaku');
const SpotifyPlugin = require('kazagumo-spotify');

module.exports = (client) => {
    console.log('[CONFIG] Loading Music Module | Opus Structure 1.5');

  const nodes = [
    {
      name: 'Jirayu Network',
      url: 'lavalink.jirayu.net:13592',
      auth: 'youshallnotpass',
      secure: false
    }
  ];
  
  client.kazagumo = new Kazagumo({
    plugins: [
      new SpotifyPlugin({
        clientId: 'e6f84fbec2b44a77bf35a20c5ffa54b8',
        client,
        playlistPageLimit: 1,
        albumPageLimit: 1,
        searchLimit: 10,
        searchMarket: "US",
      })
    ],
    defaultSearchEngine: 'ytsearch',
    send: (guildId, payload) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    }
  }, new Connectors.DiscordJS(client), client.config.nodes);

  client.kazagumo.on('ready', (name) => console.log(`[LAVALINK] ${name} connected`));
  client.kazagumo.on('error', (name, error) => console.error(`[LAVALINK] ${name}: Error Caught`, error));
};
