const Discord = require("discord.js");
const package = require("../package.json");

exports.run = (client, message, args) => {

  const emoji = client.emojis.find("name", "rotomdex");
  const embed = new Discord.RichEmbed();
  embed.setAuthor("Rotom Dex");
  embed.setDescription(
`Hey, it'zzz Rotom!
I found my way into the Pokémon Bank serverzzz
and now I have access to the full National Dex!\n
Say \`${message.settings.prefix}help\` to get a list of commandzzz!
If you like me, [invite me to another server.](${client.config.inviteURL})`)
  embed.setFooter(`Rotom Dex v${package.version} | discord.js | by kudda`)
  embed.attachFile(`./assets/rotomdex2.png`);
  embed.setThumbnail(`attachment://rotomdex2.png`);
  embed.setColor(13711930);
  var title = `—\n${emoji} Hey it'zzz me!`;
  message.channel.send(title,embed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  hidden: false
};

exports.help = {
  name: "about",
  category: "System",
  short_desc: "Rotom Dex information.",
  long_desc: "Build and background information on Rotom Dex.",
  usage: "about",
  examples: ["about"]
};
