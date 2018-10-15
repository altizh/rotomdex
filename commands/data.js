const Discord = require("discord.js");

exports.run = async (client, message, args, shiny) => {

  // empty argument or "help"
  if (args.length == 0) return message.reply("you didn't give me a Pokémon to look up!");
  if (args.length == 1 && args[0].toLowerCase() == "help") return client.commands.get("help").run(client, message, ["dex"]);
  if (args.length == 1 && args[0].toLowerCase() == "random") return client.commands.get("loto").run(client, message, ["dex"]);

  // default is not shiny
  if (!shiny) shiny = 0;
  // random gen 6/7 full shiny odds, so if a user just searches for a regular pokemon they have a 1/4096 odds to get a shiny result, just a fun nod to the games
  let shiny_chance = Math.floor(Math.random() * 4096);
  client.logger.shiny("--------------");
  client.logger.shiny(args);
  client.logger.shiny("Shiny Value: " + shiny_chance);
  // random number between 1 and 4096, 0398 happens to be my Ultra Sun TSV
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
  // get the emoji
  const emoji = client.emojis.find("name", "rotomdex");

  // if no pokemon, then there was likely a typo, rotomdex will suggest the next closest option
  if (!pokemon_search) {
    pokemon_search = await client.spellCheck(message, arg_str, client.pokedex, client.pokedex_lookup, "Pokémon");
    if(!pokemon_search) return;
  }

  // pokemon_search has to be a valid key now
  let pokemon = client.pokedex.get(pokemon_search);

  //create the embed
  const embed = new Discord.RichEmbed()
    //regular vs. shiny has some slight differences, most noticably the sprites
    if(!shiny) {
      embed.setAuthor(`${pokemon.name}`);
      //embed.setDescription(`*${pokemon.dex_entry.category} Pokémon*`);
      //embed.setImage(`https://play.pokemonshowdown.com/sprites/xyani/${pokemon.regular_gif}.gif`);
      embed.attachFile(`./assets/sprites/regular/${pokemon.thumbnail}.png`);
      embed.setThumbnail(`attachment://${pokemon.thumbnail}.png`);
    }
    else {
      embed.setAuthor(`✧ Shiny ${pokemon.name} ✧`);
      //embed.setDescription(`*${pokemon.dex_entry.category} Pokémon*`);
      //embed.setImage(`https://play.pokemonshowdown.com/sprites/xyani-shiny/${pokemon.shiny_gif}.gif`);
      embed.attachFile(`./assets/sprites/shiny/${pokemon.thumbnail}.png`);
      embed.setThumbnail(`attachment://${pokemon.thumbnail}.png`);
    }
    // metadata that is the same between regular and shiny pokemon
    //embed.addField("Type",`${pokemon.type}`)
    //embed.addField("Height",`${pokemon.height.m} (${pokemon.height.ft})`,true)
    //embed.addField("Weight",`${pokemon.weight.kg} (${pokemon.weight.lbs})`,true)
    //embed.addField("Description",`${pokemon.dex_entry.flavor_text} *(${pokemon.dex_entry.src})*`)

    //embed.addField("HP",`${pokemon.base_stats.hp}`)
    //embed.addField("Atk",`${pokemon.base_stats.atk}`)
    //embed.addField("Def",`${pokemon.base_stats.def}`)
    //embed.addField("SpA",`${pokemon.base_stats.spa}`)
    //embed.addField("SpD",`${pokemon.base_stats.spd}`)
    //embed.addField("Spe",`${pokemon.base_stats.spe}`)

    embed.addField("Abilities",`${pokemon.abilities}`);
    embed.addField("Base Stats",`**HP**: ${pokemon.base_stats.hp}\t|\t**Atk**: ${pokemon.base_stats.atk}\t|\t**Def**: ${pokemon.base_stats.def}\t|\t**SpA**: ${pokemon.base_stats.spa}\t|\t**SpD**: ${pokemon.base_stats.spd}\t|\t**Spe**: ${pokemon.base_stats.spe}\t|\t**Total**: ${pokemon.base_stats.tot}`);

    embed.setColor(13711930);

  // cycle through some scripts to introduce some personality, certain flags will always trigger the same phrases (i.e. legendary)
  var title = `—\n${emoji} ` + client.script.get("dex").random();
  if (pokemon.name == "Rotom" || pokemon.name == "Heat Rotom" || pokemon.name == "Wash Rotom" || pokemon.name == "Frost Rotom" || pokemon.name == "Fan Rotom" || pokemon.name == "Mow Rotom") {
    title = `—\n${emoji} Hey it'zzz me!`;
  }
  if (pokemon.name == "Tapu Koko" || pokemon.name == "Tape Lele" || pokemon.name == "Tapu Bulu" || pokemon.name == "Tapu Fini") {
    title = `—\n${emoji} Zzzrt! It'zzz a Guardian Deity!`;
  }
  if (pokemon.name == "Type: Null" || pokemon.name == "Silvally") {
    title = `—\n${emoji} Zzzrt?! This Pokémon... I don’t even know how to describe it... But my circuitzzz are tingling!`;
  }
  if (pokemon.legendary) {
    title = `—\n${emoji} Zzzrt! It'zzz a Legendary Pokémon! Let'zzz check it out!`;
  }
  if (pokemon.mythical) {
    title = `—\n${emoji} Zzzrk?! Wait... Izzz that— Izzz that a Mythical Pokémon?!`;
  }
  if (pokemon.ub) {
    title = `—\n${emoji} Zzzrt?! It'zzz an unidentified Pokémon! Go check it out quick!`;
  }
  // memes
  if (arg_str == "tho") {
    title = `—\n${emoji} Diggerzzzby tho?`
  }

  message.channel.send(title, embed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  hidden: false
};

exports.help = {
  name: "data",
  category: "System",
  short_desc: "Look up game data on any Pokémon",
  long_desc: "Look up the game data (stats, abilities) on any Pokémon.",
  usage: "data <Pokémon>",
  examples: ["data rotom-w"]
};
