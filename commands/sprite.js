const Discord = require("discord.js");
const Dictionary = require("meant")

exports.run = async (client, message, args, shiny) => {

  // empty argument or "help"
  if (args.length == 0) return message.reply("you didn't give me a Pokémon to look up!");
  if (args.length == 1 && args[0].toLowerCase() == "help") return client.commands.get("help").run(client, message, ["sprite"]);
  if (args.length == 1 && args[0].toLowerCase() == "random") return client.commands.get("loto").run(client, message, ["sprite"]);

  // default is not shiny
  if(!shiny) shiny = 0;
  // random gen 6/7 full shiny odds, so if a user just searches for a regular pokemon they have a 1/4096 odds to get a shiny result, just a fun nod to the games
  let shiny_chance = Math.floor(Math.random() * 4096);
  client.logger.shiny("--------------");
  client.logger.shiny(args);
  client.logger.shiny("Shiny Value: " + shiny_chance);
  // random number between 1 and 4096, happens to be my Ultra Sun TSV
  if (shiny_chance == 398) {
    shiny = 1;
  }

  // if they prefix the pokemon name with "shiny", make the result shiny and remove "shiny" from the search
  if (args[0].toLowerCase() == "shiny") {
    shiny = 1;
    args.shift();
  }

  // retrieve pokemon name
  let arg_str = args.join(" ").toLowerCase();
  let pokemon_search = client.pokedex_lookup.get(arg_str);

  // if no pokemon, then there was likely a typo, rotomdex will suggest the next closest option
  if (!pokemon_search) {
    pokemon_search = await client.spellCheck(message, arg_str, client.pokedex, client.pokedex_lookup, "Pokémon");
    if(!pokemon_search) return;
  }

  // pokemon_search has to be a valid key now
  let pokemon = client.pokedex.get(pokemon_search);

  // return the corresponding sprite
  if(!shiny) message.channel.send({files: [`https://play.pokemonshowdown.com/sprites/xyani/${pokemon.regular_gif}.gif`]});
  else message.channel.send({files: [`https://play.pokemonshowdown.com/sprites/xyani-shiny/${pokemon.shiny_gif}.gif`]});
};

exports.conf = {
  enabled: true,
  aliases: ["s"],
  hidden: false
};

exports.help = {
  name: "sprite",
  category: "Pokédex",
  short_desc: "Get the sprite animation for a Pokémon.",
  long_desc: "Get the front 3D sprite animation for a Pokémon. Preceding the Pokémon with `shiny` will give you a shiny result.",
  usage: "sprite <Pokémon>",
  examples: ["sprite rotom mow", "sprite shiny fan-rotom"]
};
