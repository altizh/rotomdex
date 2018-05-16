const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  // help
  if (args.length == 1 && args[0].toLowerCase() == "help" ) return client.commands.get("help").run(client, message, ["loto"]);

  const emoji = client.emojis.find("name", "rotomdex");
  if (args.length == 0) {
    const embed = new Discord.RichEmbed()
    const response = await client.awaitReply(message, `${emoji} Sorry to keep you waiting! It's Roto Loto Time, say \`stop\` to get your prize!`);
    if (["stop"].includes(response.toLowerCase())) {
      let loto = client.script.get("loto").random();
      let filename = `${loto.name.slice(5).replace(" ","-").toLowerCase()}`
      embed.setTitle(`${loto.name}`);
      embed.setDescription(`${loto.effect}`)
      embed.setThumbnail(`https://raw.githubusercontent.com/msikma/pokesprite/master/icons/roto/${filename}.png`);
    }
    else return;
    var title = `—\n${emoji} Hey, look at that! That'zzz an amazing power!`;
    embed.setColor(13711930);
    return message.channel.send(title, embed);
  }

  if (Number.isInteger(parseInt(args[0], 10)) && parseInt(args[0], 10) > 0) {
    message.reply(`you rolled a ${Math.ceil(Math.random() * parseInt(args[0], 10))}!`);
  }

  if (args[0] == "dex" || args[0] == "pokemon" || args[0] == "mon") return client.commands.get("dex").run(client, message, [client.pokedex_lookup.random()], 0);
  if (args[0] == "ability") return client.commands.get("ability").run(client, message, [client.abilitydex_lookup.random()], 0);
  if (args[0] == "move") return client.commands.get("move").run(client, message, [client.movedex_lookup.random()], 0);
  if (args[0] == "sprite") return client.commands.get("sprite").run(client, message, [client.pokedex_lookup.random()], 0);
  if (args[0] == "item") return client.commands.get("item").run(client, message, [client.itemdex_lookup.random()], 0);
};

exports.conf = {
  enabled: true,
  aliases: ["random","roll"],
  hidden: false
};

exports.help = {
  name: "loto",
  category: "Rotom Dex Fun",
  short_desc: "Play Roto Loto! Get a Roto Power or roll a random number, Pokémon, move, or ability!",
  long_desc: `Play Roto Loto and get a Roto Power! Adding a number, "dex", "move", or "ability" after the command will return a random number, Pokémon, move, or ability instead. `,
  usage: "loto <Number, Pokémon, Move, or Ability>",
  examples: ["loto 100", "loto dex", "loto move", "loto ability"]
};
