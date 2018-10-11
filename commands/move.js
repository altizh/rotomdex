const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  // empty argument or "help"
  if (args.length == 0) return message.reply("you didn't give me a move to look up!");
  if (args.length == 1 && args[0].toLowerCase() == "help") return client.commands.get("help").run(client, message, ["move"]);
  if (args.length == 1 && args[0].toLowerCase() == "random") return client.commands.get("loto").run(client, message, ["move"]);

  let z_flag = 0;

  // if they prefix the move name with "z", make the result the z-move
  if (args[0].toLowerCase() == "z") {
    z_flag = 1;
    args.shift();
  }

  // retrieve move name
  let arg_str = args.join(" ").toLowerCase();
  let move_search = client.movedex_lookup.get(arg_str);
  // get the emoji
  const emoji = client.emojis.find("name", "rotomdex");
  var title = `—\n${emoji} Hey! That'zzzz a powerful move!`;

  // if no move, then there was likely a typo, rotomdex will suggest the next closest option
  if (!move_search) {
    move_search = await client.spellCheck(message, arg_str, client.movedex, client.movedex_lookup, "move");
    if(!move_search) return;
  }

  // move_search has to be a valid key now
  let move = client.movedex.get(move_search);
  let color = client.typedex.getProp(move.type.toLowerCase(),"color");

  //create the embed
  const embed = new Discord.RichEmbed().setColor(color);
  if (move.z_move == 1) {
    embed.setAuthor(`${move.name}`);
    if (move.name == "Extreme Evoboost") embed.setDescription(`${move.flavor_text}\n\n**Effect**: ${move.z_effect}\n\n**Z-Crystal**: ${move.z_crystal.replace("-"," ").toProperCase()}`);
    else if (move.category == "undefined") embed.setDescription(`${move.flavor_text}\n\n**Z-Crystal**: ${move.z_crystal.replace("-"," ").toProperCase()}\t\t\t**Power**: ${move.power}\t\t\t**Category**: Varies`);
    else embed.setDescription(`${move.flavor_text}\n\n**Z-Crystal**: ${move.z_crystal.replace("-"," ").toProperCase()}\t\t\t**Power**: ${move.power}`);
    embed.setImage(`https://raw.githubusercontent.com/msikma/pokesprite/master/icons/z-crystals/${move.z_crystal}--bag.png`);
  }
  else if(!z_flag) {
    embed.setAuthor(`${move.name}`);
    if (move.priority > 0) embed.setDescription(`${move.flavor_text}\n\n**PP**: ${move.pp}\t\t\t**Power**: ${move.power}\t\t\t**Accuracy**: ${move.accuracy}\t\t\t**Priority**: +${move.priority}`);
    else if (move.priority < 0) embed.setDescription(`${move.flavor_text}\n\n**PP**: ${move.pp}\t\t\t**Power**: ${move.power}\t\t\t**Accuracy**: ${move.accuracy}\t\t\t**Priority**: ${move.priority}`);
    else embed.setDescription(`${move.flavor_text}\n\n**PP**: ${move.pp}\t\t\t**Power**: ${move.power}\t\t\t**Accuracy**: ${move.accuracy}`);
  }
  else {
    if (move.name == "Struggle") return message.channel.send("Zzzz! Struggle doesn't have a Z-Move!")
    let z_move = client.movedex.get(client.movedex_lookup.get(move.z_crystal));
    if (move.category == "Status") {
      embed.setAuthor(`Z-${move.name}`)
      if (move.priority > 0) embed.setDescription(`${move.flavor_text}\n\n**Power**: ${move.power}\t\t\t**Accuracy**: ${move.accuracy}\t\t\t**Priority**: +${move.priority}\n\n**Additional Effect**: ${move.z_effect}\n\n**Z-Crystal**: ${move.z_crystal.replace("-"," ").toProperCase()}`);
      else if (move.priority < 0) embed.setDescription(`${move.flavor_text}\n\n**Power**: ${move.power}\t\t\t**Accuracy**: ${move.accuracy}\t\t\t**Priority**: ${move.priority}\n\n**Additional Effect**: ${move.z_effect}\n\n**Z-Crystal**: ${move.z_crystal.replace("-"," ").toProperCase()}`);
      else embed.setDescription(`${move.flavor_text}\n\n**Power**: ${move.power}\t\t\t**Accuracy**: ${move.accuracy}\n\n**Additional Effect**: ${move.z_effect}\n\n**Z-Crystal**: ${move.z_crystal.replace("-"," ").toProperCase()}`);
    }
    else {
      embed.setAuthor(`${z_move.name} (from ${move.name})`)
      embed.setDescription(`${z_move.flavor_text.slice(0,-50)}\n\n**Z-Crystal**: ${move.z_crystal.replace("-"," ").toProperCase()}\t\t\t**Power**: ${move.z_effect}`);
    }
    embed.setImage(`https://raw.githubusercontent.com/msikma/pokesprite/master/icons/z-crystals/${move.z_crystal}--bag.png`);
  }

  embed.attachFile(`./assets/moves/${move.type.toLowerCase()}${move.category.toLowerCase()}.png`);
  embed.setThumbnail(`attachment://${move.type.toLowerCase()}${move.category.toLowerCase()}.png`);
  message.channel.send(title, embed);
};

exports.conf = {
  enabled: true,
  aliases: ["m"],
  hidden: false
};

exports.help = {
  name: "move",
  category: "Pokédex",
  short_desc: "Look up data on any move.",
  long_desc: "Look up the move data (PP, power, accuracy, etc.) on any move. Preceding the move with `z` will give you the Z-move details.",
  usage: "move <Move>",
  examples: ["move thunderbolt", "move z willowisp"]
};
