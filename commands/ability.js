const Discord = require("discord.js");
const Dictionary = require("meant")

exports.run = async (client, message, args) => {

  // empty argument or "help"
  if (args.length == 0) return message.reply("you didn't give me an ability to look up!");
  if (args.length == 1 && args[0].toLowerCase() == "help") return client.commands.get("help").run(client, message, ["ability"]);
  if (args.length == 1 && args[0].toLowerCase() == "random") return client.commands.get("loto").run(client, message, ["ability"]);

  // remove case sensitivity of search
  let arg_str = args.join(" ").toLowerCase();

  // initialize some stuff
  var abilities = [];
  var title = `—\n`;
  const embed = new Discord.RichEmbed().setColor(13711930);;

  // retrieve ability or pokemon name
  let ability_search = client.abilitydex_lookup.get(arg_str);
  let pokemon_search = client.pokedex_lookup.get(arg_str);

  // if not an ability or pokemon, there was most likely a typo
  if (!ability_search && !pokemon_search) {
    // cross reference the ability dictionary first
    const ability_result = Dictionary(arg_str, client.abilitydex_lookup.keyArray());
    // if no results, then the user was probably typing a pokemon
    if (ability_result.length == 0) {
      // suggest the closest pokemon name match
      pokemon_search = await client.spellCheck(message, arg_str, client.pokedex, client.pokedex_lookup, "Pokémon's ability");
      if(!pokemon_search) return;
    }
    else {
      // if there was a result/some results, suggest the closest ability match
      ability_search = await client.spellCheck(message, arg_str, client.abilitydex, client.abilitydex_lookup, "ability");
      if(!ability_search) return;
    }
  }
  // get the pokemon's abilities and add some extra filler to the embed
  if (pokemon_search) {
    let pokemon = client.pokedex.get(pokemon_search);
    abilities = pokemon.ability_array;
    title = `—\n**${pokemon.name}** - ${pokemon.abilities}`;
    embed.addField(`#${pokemon.dex_entry.dex_num} - ${pokemon.name}`,`${pokemon.abilities}\n—`);
    embed.attachFile(`./assets/sprites/regular/${pokemon.thumbnail}.png`)
    embed.setThumbnail(`attachment://${pokemon.thumbnail}.png`);
  }
  // get the ability
  if (ability_search) abilities.push(ability_search);

  // add the ability information to the embed for each ability
  abilities.forEach(ability_search => {
    let ability = client.abilitydex.get(ability_search);
    embed.addField(`${ability.name}`,`${ability.flavor_text}`,true);
  });

  message.channel.send(title, embed);
};

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
  usage: "ability <Pokémon or Ability>",
  examples: ["ability levitate","ability rotom"]
};
