const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { Kazagumo } = require('kazagumo');
const { Connectors } = require('shoukaku');
const SpotifyPlugin = require('kazagumo-spotify');
const config = require('./config');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.DirectMessages],
   partials: [Partials.Channel, Partials.Message]
});

const kazagumo = new Kazagumo({
    plugins: [
      new SpotifyPlugin({
        clientId: 'e6f84fbec2b44a77bf35a20c5ffa54b8',
            clientSecret: '498f461b962443cfaf9539c610e2ea81',
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
  }, new Connectors.DiscordJS(client), config.nodes);
client.kazagumo = kazagumo;
client.commands = new Collection();
client.cooldowns = new Collection();
client.events = new Collection();
client.config = config;
client.color = config.color;
require('./handlers/commandHandler')(client);
require('./handlers/eventHandler')(client);
require('./handlers/errorHandler')(client);

  client.kazagumo.on('ready', (name) => console.log(`[LAVALINK] ${name} connected`));
  client.kazagumo.on('error', (name, error) => console.error(`[LAVALINK] ${name}: Error Caught`, error));

client.login(config.token);
