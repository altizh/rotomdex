const Discord = require("discord.js");
const Dictionary = require("meant")

exports.run = async (client, message, args, shiny) => {

  // default is not shiny
  if(!shiny) shiny = 0;
  // random gen 6/7 full shiny odds, so if a user just searches for a regular pokemon they have a 1/4096 odds to get a shiny result, just a fun nod to the games
  let shiny_chance = Math.floor(Math.random() * 4096);
  client.logger.shiny("--------------")
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

  let search = args.join(" ").toLowerCase();

  let pkmn = client.pokedex_lookup.get(search);

  if (!pkmn) {
    pkmn = await client.spellCheck(message, search, client.pokedex, client.pokedex_lookup, "Pokémon");
    if(!pkmn) return;
  }

  // pkmn has to be a valid key now
  let dex = client.pokedex.get(pkmn);

    if(!shiny) message.channel.send({files: [`https://play.pokemonshowdown.com/sprites/xyani/${dex.regular_gif}.gif`]});
    else message.channel.send({files: [`https://play.pokemonshowdown.com/sprites/xyani-shiny/${dex.shiny_gif}.gif`]});
}

exports.conf = {
  enabled: true,
  aliases: ["s"],
};

exports.help = {
  name: "sprite",
  category: "Miscellaneous",
  description: "Zzzzrrt! Look up data on any pokémon!",
  usage: "sprite <Pokémon>"
};
