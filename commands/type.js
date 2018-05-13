const Discord = require("discord.js");
const Dictionary = require("meant")

exports.run = async (client, message, args) => {

  let search = args.join(" ").toLowerCase();
  if (args.length == 1) {
    args = search.split(/[\/, -]+/g);
  }

  // arrays for each type effectiveness category
  const def_weak = [];
  const def_neutral = [];
  const def_resist = [];
  const def_immune = [];
  const atk_super = [];
  const atk_neutral = [];
  const atk_notvery = [];
  const atk_no = [];

  // embeds for the final sent message
  const defense = new Discord.RichEmbed();
  const attack = new Discord.RichEmbed();

  var title = "";
  // if the user only requests a single type, then rotomdex will return attacking and defending efficacies
  var single_type = 0;

  // argument check setup
  let pkmn = client.pokedex_lookup.get(search);
  let t1 = client.typedex.get(args[0].toLowerCase());
  let t2 = t1;
  if (args.length >= 2) {
    t2 = client.typedex.get(args[1].toLowerCase());
  }

  // these if/else if should catch every input the user sends
  // if the user sends more than 2 valid types, then the bot will highlight "up to two types"
  if (args.length > 2 && t1 && t2) {
    message.channel.send(`Zrt? Please tell me **up to** two types **or** a Pokémon!`);
    return;
  }
  // if one type is correct and the other is incorrect or "none", then the bot will point out where the error is
  else if ((t1 && (!t2 || (args.length >= 2 && args[1].toLowerCase() == "none"))) || ((!t1 || args[0].toLowerCase() == "none") && t2)) {
    // if the user sends more than 2 valid types, then the bot will highlight "up to two types"
    if (args.length > 2) message.channel.send(`Zrt? Please tell me **up to** two types **or** a Pokémon!`);
    // if the first type is invalid
    else if (!t1 || args[0].toLowerCase() == "none") message.channel.send(`Zrt? **${args[0]}** izzz not a type!`);
    // if the second type is invalid
    else message.channel.send(`Zrt? **${args[1]}** izzz not a type!`);
    return;
  }
  // if both types are incorrect and it isn't a pokemon, we can see if the user made a typo when typing a pokemon name
  else if (!pkmn && (!t1 || !t2)) {
    const result = Dictionary(search, client.pokedex_lookup.keyArray());
    if (result.length == 0) {
      message.channel.send(`Zrt? Please tell me **up to** two types **or** a Pokémon!`);
      return;
    }
    else {
      pkmn = await client.spellCheck(message, search, client.pokedex, client.pokedex_lookup, "Pokémon's type");
      if(!pkmn) return;
    }
  }
  // if it is a pokemon, then pull the typing from pokedex table
  if (pkmn) {
    let dex = client.pokedex.get(pkmn);
    args = [`${dex.type1}`,`${dex.type2}`];
    title = `—\n**${dex.name}** - ${dex.type}`;
    defense.addField(`#${dex.dex_entry.dex_num} - ${dex.name}`,`${dex.type}\n—`);
    defense.attachFile(`./assets/sprites/regular/${dex.thumbnail}.png`)
    defense.setThumbnail(`attachment://${dex.thumbnail}.png`);
  }
  // if the user types the same type twice, then only use one of them since this does not exist
  if (args[0] == args[1]) {
    args.pop();
  }

  // dual type or pokemon name entered
  if (args.length == 2) {
    // get the JSONObject under "defense" for both types
    let type1 = client.typedex.getProp(args[0].toLowerCase(),"defense");
    let type2 = client.typedex.getProp(args[1].toLowerCase(),"defense");
    // get color of primary type
    let color = client.typedex.getProp(args[0].toLowerCase(),"color");
    defense.setColor(color);
    if (!pkmn) {
      defense.attachFile(`./assets/types/dual/${args[0].toLowerCase()}${args[1].toLowerCase()}.png`);
      defense.setThumbnail(`attachment://${args[0].toLowerCase()}${args[1].toLowerCase()}.png`);
    }

    if (title == "") title = `—\n**${client.typedex.getProp(args[0].toLowerCase(),"name")}/${client.typedex.getProp(args[1].toLowerCase(),"name")}**`;
    for (var key in type1) {
      // multiply the values together to get dual type weakness i.e. if one type is weak but the other type resists, then it will cancel out and be 1x effective
      var val = type1[key] * type2[key];
      // put the type in the corresponding array, bolding the types that have been amplified in effectiveness (both types are weak or both resist)
      if (val == 4) def_weak.push(`**${key.toProperCase()}**`);
      if (val == 2) def_weak.push(key.toProperCase());
      if (val == 1) def_neutral.push(key.toProperCase());
      if (val == 0.5) def_resist.push(key.toProperCase());
      if (val == 0.25) def_resist.push(`**${key.toProperCase()}**`);
      if (val == 0) def_immune.push(key.toProperCase());
    }
  }
  // single type
  else if (args.length == 1) {
    // check this flag to set up options for later
    single_type = 1;
    // get the JSONObject under "defense" and "offense"
    let type_def = client.typedex.getProp(args[0].toLowerCase(),"defense");
    let type_atk = client.typedex.getProp(args[0].toLowerCase(),"offense");
    // get the color of type
    let color = client.typedex.getProp(args[0].toLowerCase(),"color");
    defense.setColor(color);
    defense.attachFile(`./assets/types/single/${args[0].toLowerCase()}.png`);
    defense.setThumbnail(`attachment://${args[0].toLowerCase()}.png`);
    attack.setColor(color);
    attack.attachFile(`./assets/types/single/${args[0].toLowerCase()}.png`);
    attack.setThumbnail(`attachment://${args[0].toLowerCase()}.png`);
    //const emoji = client.emojis.find("name", `${args[0].toLowerCase()}type`);
    if (title == "") title = `—\n**${client.typedex.getProp(args[0].toLowerCase(),"name")}**`;
    // first populate the defensive arrays
    for (var key in type_def) {
      var val_def = type_def[key];
      if (val_def == 2) def_weak.push(key.toProperCase());
      if (val_def == 1) def_neutral.push(key.toProperCase());
      if (val_def == 0.5) def_resist.push(key.toProperCase());
      if (val_def == 0) def_immune.push(key.toProperCase());
    }
    // then populate the offensive arrays
    for (var key in type_atk) {
      var val_atk = type_atk[key];
      if (val_atk == 2) atk_super.push(key.toProperCase());
      if (val_atk == 1) atk_neutral.push(key.toProperCase());
      if (val_atk == 0.5) atk_notvery.push(key.toProperCase());
      if (val_atk == 0) atk_no.push(key.toProperCase());
    }
  }

  // turn all the arrays into strings in preparation for the RichEmbed
  let atk_super_str = atk_super.join(", ");
  let atk_neutral_str = atk_neutral.join(", ");
  let atk_notvery_str = atk_notvery.join(", ");
  let atk_no_str = atk_no.join(", ");

  let def_weak_str = def_weak.join(", ");
  let def_neutral_str = def_neutral.join(", ");
  let def_resist_str = def_resist.join(", ");
  let def_immune_str = def_immune.join(", ");

  // only add the field if there is something to add
  if (atk_super_str) attack.addField("Super Effective",atk_super_str);
  if (atk_neutral_str) attack.addField("Neutral",atk_neutral_str);
  if (atk_notvery_str) attack.addField("Not Very Effective",atk_notvery_str);
  if (atk_no_str) attack.addField("No Effect",atk_no_str);

  if (def_weak_str) defense.addField("Weak",def_weak_str);
  if (def_neutral_str) defense.addField("Neutral",def_neutral_str);
  if (def_resist_str) defense.addField("Resists",def_resist_str);
  if (def_immune_str) defense.addField("Immune",def_immune_str);

  // dual type just sends a single embed while single type sends the defense and offense embed
  if(!single_type) message.channel.send(`${title}`,defense);
  if(single_type) {
    message.channel.send(`${title} - When Defending`,defense);
    message.channel.send(`${title} - When Attacking`,attack);
  }

}

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name: "type",
  category: "Miscellaneous",
  description: "Look up type effectiveness for up to two types or a Pokémon!",
  usage: "type <type 1 or Pokémon> <type 2>"
};
