const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  // remove case sensitivity of search
  let search = args.join(" ").toLowerCase();

  var abilities = [];
  const embed = new Discord.RichEmbed().setColor(13711930);;
  var title = `—\n`;

  // retrieve pokemon name
  let ability = client.abilitydex_lookup.get(search);
  let pkmn = client.pokedex_lookup.get(search);

  if (pkmn) {
    let pokemon = client.pokedex.get(pkmn);
    abilities = pokemon.ability_array;
    title = `—\n**${pokemon.name}** - ${pokemon.abilities}`;
    //embed.setImage(`https://play.pokemonshowdown.com/sprites/xyani/${pokemon.gif_id}.gif`);
    embed.addField(`#${pokemon.dex_entry.dex_num} - ${pokemon.name}`,`${pokemon.abilities}\n—`);
    embed.attachFile(`./assets/sprites/regular/${pokemon.thumbnail}.png`)
    embed.setThumbnail(`attachment://${pokemon.thumbnail}.png`);
    //embed.setColor(client.typedex.getProp(pokemon.type1,"color"));
  }
  // if the name is not a real pokemon,
  else if (!ability) {
    message.channel.send("Zzzzzrt! I don't know that ability! Did you spell it correctly?");
    //client.test.set(message.createdTimestamp, search);
    return;
  } else {
    abilities.push(ability);
  }

  abilities.forEach(ability => {
    let dex = client.abilitydex.get(ability);
    embed.addField(`${dex.name}`,`${dex.flavor_text}`,true);
  });

  //const emoji = client.emojis.find("name", "rotomdex");
  message.channel.send(title, embed);

}

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name: "ability",
  category: "Miscellaneous",
  description: "Zzzzrrt! Look up data on any ability!",
  usage: "ability <ability>"
};
