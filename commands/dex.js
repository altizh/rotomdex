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

  // retrieve pokemon name
  let pkmn = client.pokedex_lookup.get(search);
  // get the emoji
  const emoji = client.emojis.find("name", "rotomdex");

  // if the name is not a real pokemon,
  if (!pkmn) {
    // basically a "did you mean" implementation
    const result = Dictionary(search, client.pokedex_lookup.keyArray());
    client.logger.spellcheck("--------------")
    client.logger.spellcheck("User typed: " + search);
    client.logger.spellcheck("Suggested result: " + result);
    // if they typed gibberish, odds are there are no results
    if (result.length == 0) {
      message.channel.send(`${emoji} Zzzzzrt? I can't find that Pokémon! Did you spell it correctly?`);
      return;
    }
    // if the user was close, the bot will ask if the user meant the suggested pokemon
    else {
      // the bot will wait for a y/n response so the user doesn't have to search again if the bot guessed correctly
      const response = await client.awaitReply(message, `${emoji} Zzzzzrt? I can't find that Pokémon! Were you looking for \`${client.pokedex.getProp(client.pokedex_lookup.get(result[0]),"name")}\`?`);
      if (["y", "yes"].includes(response.toLowerCase())) {
        pkmn = client.pokedex_lookup.get(result[0]);
      }
      // if the user says no, then the bot will exit and the user unfortunately has to search again
      else if (["n","no"].includes(response.toLowerCase())) {
        message.reply("OK, just let me know which Pokémon you're looking for!");
        return;
      }
      else return;
    }
  }

  // pkmn has to be a valid key now
  let dex = client.pokedex.get(pkmn);

  //create the embed
  const embed = new Discord.RichEmbed()
    //regular vs. shiny has some slight differences, most noticably the sprites
    if(!shiny) {
      embed.setAuthor(`#${dex.dex_entry.dex_num} - ${dex.name}`);
      embed.setDescription(`*${dex.dex_entry.category} Pokémon*`);
      embed.setImage(`https://play.pokemonshowdown.com/sprites/xyani/${dex.regular_gif}.gif`);
      embed.attachFile(`./assets/sprites/regular/${dex.thumbnail}.png`);
      embed.setThumbnail(`attachment://${dex.thumbnail}.png`);
    }
    else {
      embed.setAuthor(`#${dex.dex_entry.dex_num} - ✧ Shiny ${dex.name} ✧`);
      embed.setDescription(`*${dex.dex_entry.category} Pokémon*`);
      embed.setImage(`https://play.pokemonshowdown.com/sprites/xyani-shiny/${dex.shiny_gif}.gif`);
      embed.attachFile(`./assets/sprites/shiny/${dex.thumbnail}.png`);
      embed.setThumbnail(`attachment://${dex.thumbnail}.png`);
    }
    // metadata that is the same between regular and shiny pokemon
    embed.addField("Type",`${dex.type}`)
    embed.addField("Height",`${dex.height.m} (${dex.height.ft})`,true)
    embed.addField("Weight",`${dex.weight.kg} (${dex.weight.lbs})`,true)
    embed.addField("Description",`${dex.dex_entry.flavor_text} *(${dex.dex_entry.src})*`)
    embed.setColor(13711930);

  // cycle through some scripts to introduce some personality, certain flags will always trigger the same phrases (i.e. legendary)
  var title = `—\n${emoji} ` + client.script.get("dex").random();
  if (dex.name == "Rotom" || dex.name == "Heat Rotom" || dex.name == "Wash Rotom" || dex.name == "Frost Rotom" || dex.name == "Fan Rotom" || dex.name == "Mow Rotom") {
    title = `—\n${emoji} Hey it'zzz me!`;
  }
  if (dex.name == "Tapu Koko" || dex.name == "Tape Lele" || dex.name == "Tapu Bulu" || dex.name == "Tapu Fini") {
    title = `—\n${emoji} Zzzrt! It'zzz a Guardian Deity!`;
  }
  if (dex.name == "Type: Null" || dex.name == "Silvally") {
    title = `—\n${emoji} Zzzrt?! This Pokémon... I don’t even know how to describe it... But my circuitzzz are tingling!`;
  }
  if (dex.legendary) {
    title = `—\n${emoji} Zzzrt! It'zzz a Legendary Pokémon! Let'zzz check it out!`;
  }
  if (dex.mythical) {
    title = `—\n${emoji} Zzzrk?! Wait... Izzz that— Izzz that a Mythical Pokémon?!`;
  }
  if (dex.ub) {
    title = `—\n${emoji} Zzzrt?! It'zzz an unidentified Pokémon! Go check it out quick!`;
  }
  // memes
  if (search == "tho") {
    title = `—\n${emoji} Diggerzzzby tho?`
  }

  message.channel.send(title, embed);
}

exports.conf = {
  enabled: true,
  aliases: ["d"],
};

exports.help = {
  name: "dex",
  category: "Miscellaneous",
  description: "Zzzzrrt! Look up data on any pokémon!",
  usage: "dex <Pokémon>"
};
