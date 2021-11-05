require("dotenv").config();
const {Client, Intents, TextChannel} = require("discord.js");
const axios = require('axios');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let botChannel;

client.once('ready', () => {
    console.log('Ready!');
    console.log(`Logged in as ${client.user.tag}!`)
    // setup bot channel
    client.channels.fetch(process.env.DISCORD_BOT_CHANNEL_ID)
        .then(channel => botChannel = channel)
        .catch(console.error);
    startBot();
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(function(e) {
    console.log(e);
});

async function updateStatus(stats) {
    client.guilds.cache.forEach((guild, id) => {
        guild.members.cache.get(client.user.id).setNickname(`${stats.value_classification} (${stats.value})`);
    })
}

function startBot() {
    getFGIndex();
    setInterval(getFGIndex, 600000);    
}

async function getFGIndex() {
    axios.get('https://api.alternative.me/fng/?limit=1'
    ).then((response) => {
        try {
          console.log('response');
            let stats = response.data.data[0];
            console.log(stats);
            updateStatus(stats);
      } catch (err) {
            console.error('failed getFGIndex response : ' + err.message);
        }
    }).catch((error) => {
        console.error(error);
    });
}