const Discord = require("discord.js");
const Dictionary = require("meant")

exports.run = async (client, message, args) => {

  // remove case sensitivity of search
  let search = args.join(" ").toLowerCase();

  var abilities = [];
  const embed = new Discord.RichEmbed().setColor(13711930);;
  var title = `—\n`;

  // retrieve pokemon name
  let ability = client.abilitydex_lookup.get(search);
  let pkmn = client.pokedex_lookup.get(search);

  if (!ability && !pkmn) {
    const ability_result = Dictionary(search, client.abilitydex_lookup.keyArray());
    if (ability_result.length == 0) {
      pkmn = await client.spellCheck(message, search, client.pokedex, client.pokedex_lookup, "Pokémon's ability");
      if(!pkmn) return;
    }
    else {
      ability = await client.spellCheck(message, search, client.abilitydex, client.abilitydex_lookup, "ability");
      if(!ability) return;
    }
  }
  if (pkmn) {
    let pokemon = client.pokedex.get(pkmn);
    abilities = pokemon.ability_array;
    title = `—\n**${pokemon.name}** - ${pokemon.abilities}`;
    embed.addField(`#${pokemon.dex_entry.dex_num} - ${pokemon.name}`,`${pokemon.abilities}\n—`);
    embed.attachFile(`./assets/sprites/regular/${pokemon.thumbnail}.png`)
    embed.setThumbnail(`attachment://${pokemon.thumbnail}.png`);
  }
  if (ability) abilities.push(ability);

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
