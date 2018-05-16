const Discord = require("discord.js");
const Dictionary = require("meant")

exports.run = async (client, message, args) => {

  // empty argument or "help"
  if (args.length == 0) return message.reply("you didn't give me a type to look up!");
  if (args.length == 1 && args[0].toLowerCase() == "help") return client.commands.get("help").run(client, message, ["type"]);

  let arg_str = args.join(" ").toLowerCase();
  // use regex to pull apart types separated by slash, comma, dash, etc.
  if (args.length == 1) args = arg_str.split(/[\/\\\|\,\ \-\–\−\—\_\;\:]+/g);

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
  // if the user requests a move type, then rotomdex will return just the attacking efficacy
  var move_type = 0;

  // argument check setup
  let pokemon_search = client.pokedex_lookup.get(arg_str);
  let move_search = client.movedex_lookup.get(arg_str);
  let t1 = client.typedex.get(args[0].toLowerCase());
  let t2 = t1;
  if (args.length >= 2) {
    t2 = client.typedex.get(args[1].toLowerCase());
  }

  // these if/else if should catch every input the user sends
  // if the user sends more than 2 valid types, then the bot will highlight "up to two types"
  if (args.length > 2 && t1 && t2) {
    message.channel.send(`Zrt? Please give me a Pokémon, move, or **up to** two typezzz to look up!`);
    return;
  }
  // if not a move or pokemon and if one type is correct and the other is incorrect or "none", then the bot will point out where the error is
  else if (!pokemon_search && !move_search && ((t1 && (!t2 || (args.length >= 2 && args[1].toLowerCase() == "none"))) || ((!t1 || args[0].toLowerCase() == "none") && t2))) {
    // if the user sends more than 2 valid types, then the bot will highlight "up to two types"
    if (args.length > 2) message.channel.send(`Zrt? Please give me a Pokémon, move, or **up to** two typezzz to look up!`);
    // if the first type is invalid
    else if (!t1 || args[0].toLowerCase() == "none") message.channel.send(`Zrt? **${args[0]}** izzz not a type!`);
    // if the second type is invalid
    else message.channel.send(`Zrt? **${args[1]}** izzz not a type!`);
    return;
  }
  // if both types are incorrect and it isn't a pokemon or move, we can see if the user made a typo
  else if (!pokemon_search && !move_search && (!t1 || !t2)) {
    // check the combined dictionary to get the most likely result
    const result = Dictionary(arg_str, client.pokedex_lookup.keyArray().concat(client.movedex_lookup.keyArray()));
    // if no results, the user most likely just typed gibberish
    if (result.length == 0) {
      message.channel.send(`Zrt? Please give me a Pokémon, move, or **up to** two typezzz to look up!`);
    }
    else {
      // check if the result was from the pokemon dictionary
      if (client.pokedex_lookup.get(result[0])) {
        pokemon_search = await client.spellCheck(message, arg_str, client.pokedex, client.pokedex_lookup, "Pokémon");
        if(!pokemon_search) return;
      }
      // otherwise it was from the move dictionary
      else if (client.movedex_lookup.get(result[0])) {
        move_search = await client.spellCheck(message, arg_str, client.movedex, client.movedex_lookup, "move");
        if(!move_search) return;
      }
      // no else case since the result has to be one or the other
    }
  }
  // if it is a pokemon, then pull the typing from pokedex table
  if (pokemon_search) {
    let pokemon = client.pokedex.get(pokemon_search);
    args = [`${pokemon.type1}`,`${pokemon.type2}`];
    title = `—\n**${pokemon.name}** - ${pokemon.type}`;
    defense.addField(`#${pokemon.dex_entry.dex_num} - ${pokemon.name}`,`${pokemon.type}\n—`);
    defense.attachFile(`./assets/sprites/regular/${pokemon.thumbnail}.png`)
    defense.setThumbnail(`attachment://${pokemon.thumbnail}.png`);
  }
  // if it is a move, the pull the typing from the movedex table
  else if (move_search) {
    let move = client.movedex.get(move_search);
    args = [`${move.type}`];
    title = `—\n**${move.name}** - ${move.type}`;
    attack.addField(`${move.name}`, `—`);
    if (move.name == "Flying Press") attack.setFooter(`※ Flying Press is Fighting and Flying type simultaneously`);
    if (move.name == "Freeze-Dry") attack.setFooter(`※ Freeze-Dry is super effective on Water-type Pokémon`)
    move_type = 1;
  }

  // if the user types the same type twice, then only use one of them since this does not exist
  if (args[0] == args[1]) args.pop();

  // dual type or pokemon name entered
  if (args.length == 2) {
    // get the object under "defense" for both types
    let pokemon = client.pokedex.get(pokemon_search);
    let type1 = client.typedex.getProp(args[0].toLowerCase(),"defense");
    let type2 = client.typedex.getProp(args[1].toLowerCase(),"defense");
    // get color of primary type
    let color = client.typedex.getProp(args[0].toLowerCase(),"color");
    defense.setColor(color);
    if (!pokemon_search) {
      defense.attachFile(`./assets/types/dual/${args[0].toLowerCase()}${args[1].toLowerCase()}.png`);
      defense.setThumbnail(`attachment://${args[0].toLowerCase()}${args[1].toLowerCase()}.png`);
    }

    if (title == "") title = `—\n**${client.typedex.getProp(args[0].toLowerCase(),"name")}/${client.typedex.getProp(args[1].toLowerCase(),"name")}**`;

    // disclaimers for pokemon that have potential immunities from their abilities
    if (pokemon && pokemon.ability_array.length > 1) {
      let abilities = [];
      let immunities = [];
      pokemon.ability_array.forEach(ability => {
        switch(ability) {
          case "lightning-rod": abilities.push("Lightning Rod"); immunities.push("Electric-type"); break;
          case "motor-drive": abilities.push("Motor Drive"); immunities.push("Electric-type"); break;
          case "volt-absorb": abilities.push("Volt Absorb"); immunities.push("Electric-type"); break;
          case "flash-fire": abilities.push("Flash Fire"); immunities.push("Fire-type"); break;
          case "sap-sipper": abilities.push("Sap Sipper"); immunities.push("Grass-type"); break;
          case "levitate": abilities.push("Levitate"); immunities.push("Ground-type"); break;
          case "dry-skin": abilities.push("Dry Skin"); immunities.push("Water-type"); break;
          case "storm-drain": abilities.push("Storm Drain"); immunities.push("Water-type"); break;
          case "water-absorb": abilities.push("Water Absorb"); immunities.push("Water-type"); break;
        }
      });
      if(abilities.length > 0) {
        let disclaimer = `※ This Pokémon may have the ability ${[...new Set(abilities)].join(" or ")}, which would give it ${[...new Set(immunities)].join(" or ")} immunity.`;
        defense.setFooter(disclaimer);
      }
    }

    for (var key in type1) {
      // multiply the values together to get dual type weakness i.e. if one type is weak but the other type resists, then it will cancel out and be 1x effective
      var val = type1[key] * type2[key];
      // some pokemon have type immunities due to having only a single possible ability and this is kept in the loop since it changes the type calculations
      if (pokemon && pokemon.ability_array.length == 1) {
        if (pokemon.ability_array[0] == "levitate" && key == "ground") {defense.setFooter("※ This Pokémon can only have the ability Levitate, which gives it Ground-type immunity."); val = 0;}
        if (pokemon.ability_array[0] == "water-absorb" && key == "water") {defense.setFooter("※ This Pokémon can only have the ability Water Absorb, which gives it Water-type immunity."); val = 0;}
        if (pokemon.ability_array[0] == "volt-absorb" && key == "electric") {defense.setFooter("※ This Pokémon can only have the ability Volt Absorb, which gives it Electric-type immunity."); val = 0;}
        if (pokemon.ability_array[0] == "lightning-rod" && key == "electric") {defense.setFooter("※ This Pokémon can only have the ability Lightning Rod, which gives it Electric-type immunity."); val = 0;}
      }

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
    let move = client.movedex.get(move_search);
    // get the color of type
    let color = client.typedex.getProp(args[0].toLowerCase(),"color");
    // get the JSONObject under "defense" and "offense"
    let type_atk = client.typedex.getProp(args[0].toLowerCase(),"offense");
    attack.setColor(color);
    attack.attachFile(`./assets/types/single/${args[0].toLowerCase()}.png`);
    attack.setThumbnail(`attachment://${args[0].toLowerCase()}.png`);
    //const emoji = client.emojis.find("name", `${args[0].toLowerCase()}type`);
    if (title == "") title = `—\n**${client.typedex.getProp(args[0].toLowerCase(),"name")}**`;
    // first populate the defensive arrays, if looking up a move, skip this
    if (!move_type) {
      let type_def = client.typedex.getProp(args[0].toLowerCase(),"defense");
      defense.setColor(color);
      defense.attachFile(`./assets/types/single/${args[0].toLowerCase()}.png`);
      defense.setThumbnail(`attachment://${args[0].toLowerCase()}.png`);
      for (var key in type_def) {
        var val_def = type_def[key];
        if (val_def == 2) def_weak.push(key.toProperCase());
        if (val_def == 1) def_neutral.push(key.toProperCase());
        if (val_def == 0.5) def_resist.push(key.toProperCase());
        if (val_def == 0) def_immune.push(key.toProperCase());
      }
    }
    // then populate the offensive arrays
    for (var key in type_atk) {
      // flying press and freeze dry edge cases
      if (move_type) {
        // flying press is fighting and flying simultaneously
        if (move.name == "Flying Press") {
          let type_fly = client.typedex.getProp("flying","offense");
          var val_atk = type_atk[key] * type_fly[key];
        }
        // freeze dry is super effective against water
        else if (move.name == "Freeze-Dry" && key == "water") {
          if (key == "water") var val_atk = 2;
          else var val_atk = type_atk[key];
        }
        else var val_atk = type_atk[key];
      }
      else var val_atk = type_atk[key];
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
  if (single_type && !move_type) {
    message.channel.send(`${title} - When Defending`,defense);
    // add timeout to make sure defense comes first
    setTimeout(() => {message.channel.send(`${title} - When Attacking`,attack)}, 300);
  }
  else if (move_type) message.channel.send(`${title}`,attack);
  else message.channel.send(`${title}`,defense);
};

exports.conf = {
  enabled: true,
  aliases: ["coverage"],
  hidden: false
};

exports.help = {
  name: "type",
  category: "Pokédex",
  short_desc: "Get type information for types, Pokémon, or moves.",
  long_desc: "Look up the type effectiveness of a single Pokémon or move, or up to two types (separated by a comma, slash, dash, or space). Looking up a single type will give you offensive effectiveness as well.",
  usage: "type <Pokémon, Move, or Type 1> <Type 2>",
  examples: ["type rotomheat", "type thunder wave", "type electric", "type electric ghost"]
};
