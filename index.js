const { Client, EmbedBuilder } = require('discord.js');
const Rcon = require('rcon-client').Rcon;

const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });

const config = {
  token: process.env.TOKEN,
  channelId: process.env.CHANNEL_ID,
  rconHost: process.env.RCON_HOST,
  rconPort: process.env.RCON_PORT,
  rconPassword: process.env.RCON_PASSWORD,
};

let rcon;

client.once('ready', async () => {
  console.log('Rage Pirates Bot online!');
  const channel = client.channels.cache.get(config.channelId);
  if (channel) channel.send('**Rage Pirates Zomboid Bot connected! Monitoring server stats.**');

  rcon = new Rcon({
    host: config.rconHost,
    port: config.rconPort,
    password: config.rconPassword,
  });
  await rcon.connect();
  console.log('RCON connected');

  // Auto online count every 5 min
  setInterval(async () => {
    try {
      const response = await rcon.send('players');
      if (channel) channel.send(`**Online Players:** ${response || 'None'}`);
    } catch (e) {}
  }, 300000);
});

client.login(config.token);
