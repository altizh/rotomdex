const Discord = require("discord.js");
const Dictionary = require("meant")

exports.run = async (client, message, args) => {

  // empty argument or "help"
  if (args.length == 0) return message.reply("you didn't give me an ability to look up!");
  if (args[0].toLowerCase() == "help" && args.length == 1) return client.commands.get("help").run(client, message, ["ability"]);

  // remove case sensitivity of search
  let search = args.join(" ").toLowerCase();

  // initialize some stuff
  var abilities = [];
  const embed = new Discord.RichEmbed().setColor(13711930);;
  var title = `—\n`;

  // retrieve ability or pokemon name
  let ability = client.abilitydex_lookup.get(search);
  let pkmn = client.pokedex_lookup.get(search);

  // if not an ability or pokemon, there was most likely a typo
  if (!ability && !pkmn) {
    // cross reference the ability dictionary first
    const ability_result = Dictionary(search, client.abilitydex_lookup.keyArray());
    // if no results, then the user was probably typing a pokemon
    if (ability_result.length == 0) {
      // suggest the closest pokemon name match
      pkmn = await client.spellCheck(message, search, client.pokedex, client.pokedex_lookup, "Pokémon's ability");
      if(!pkmn) return;
    }
    else {
      // if there was a result/some results, suggest the closest ability match
      ability = await client.spellCheck(message, search, client.abilitydex, client.abilitydex_lookup, "ability");
      if(!ability) return;
    }
  }
  // get the pokemon's abilities and add some extra filler to the embed
  if (pkmn) {
    let pokemon = client.pokedex.get(pkmn);
    abilities = pokemon.ability_array;
    title = `—\n**${pokemon.name}** - ${pokemon.abilities}`;
    embed.addField(`#${pokemon.dex_entry.dex_num} - ${pokemon.name}`,`${pokemon.abilities}\n—`);
    embed.attachFile(`./assets/sprites/regular/${pokemon.thumbnail}.png`)
    embed.setThumbnail(`attachment://${pokemon.thumbnail}.png`);
  }
  // get the ability
  if (ability) abilities.push(ability);

  // add the ability information to the embed for each ability
  abilities.forEach(ability => {
    let dex = client.abilitydex.get(ability);
    embed.addField(`${dex.name}`,`${dex.flavor_text}`,true);
  });

  message.channel.send(title, embed);

}

exports.conf = {
  enabled: true,
  aliases: [],
  hidden: false
};

exports.help = {
  name: "ability",
  category: "Pokédex",
  short_desc: "Look up ability effects.",
  long_desc: "Look up the effect of an ability, or effects of a Pokémon's abilities.",
  usage: "ability <Pokémon or ability>",
  examples: ["ability levitate","ability rotom"]
};
