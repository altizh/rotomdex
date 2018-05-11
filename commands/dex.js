const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  // remove case sensitivity of search
  let search = args.join(" ").toLowerCase();

  // if they prefix the pokemon name with "shiny"
  if (args[0].toLowerCase() == "shiny") {
    message.reply("Zrt? I think you meant to use the `shiny` command!")
    return;
  }

  // retrieve pokemon name
  let pkmn = client.pokedex_lookup.get(search);

  // if the name is not a real pokemon,
  if (!pkmn) {
    message.channel.send("Zzzzzrt! I don't know that Pokémon! Did you spell it correctly?");
    //client.test.set(message.createdTimestamp, search);
    return;
  }

  let dex = client.pokedex.get(pkmn);

  const embed = new Discord.RichEmbed()
    .setAuthor(`#${dex.dex_entry.dex_num} - ${dex.name}`)
    .setColor(13711930)
    //.setColor(client.typedex.getProp(dex.type1,"color"))
    .setDescription(`*${dex.dex_entry.category} Pokémon*`)
    .setImage(`https://play.pokemonshowdown.com/sprites/xyani/${dex.regular_gif}.gif`)
    .attachFile(`./assets/sprites/regular/${dex.thumbnail}.png`)
    .setThumbnail(`attachment://${dex.thumbnail}.png`)
    .addField("Type",`${dex.type}`)
    .addField("Height",`${dex.height.m} (${dex.height.ft})`,true)
    .addField("Weight",`${dex.weight.kg} (${dex.weight.lbs})`,true)
    .addField("Description",`${dex.dex_entry.flavor_text} *(${dex.dex_entry.src})*`);
    //.addField("Stats", `HP: **${dex.base_stats.hp}** \tAtk: **${dex.base_stats.atk}** \tDef: **${dex.base_stats.def}** \tSpA: **${dex.base_stats.spa}** \tSpD: **${dex.base_stats.spd}** \tSpe: **${dex.base_stats.spe}** \tTotal: **${dex.base_stats.tot}**`);

  const emoji = client.emojis.find("name", "rotomdex");
  var title = `—\n${emoji} ` + client.test.get("dex").random();
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
  if (search == "tho") {
    title = `—\n${emoji} Diggerzzzby tho?`
  }
  message.channel.send(title ,embed);

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
