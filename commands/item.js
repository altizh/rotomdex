const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  // empty argument or "help"
  if (args.length == 0) return message.reply("you didn't give me a item to look up!");
  if (args.length == 1 && args[0].toLowerCase() == "help") return client.commands.get("help").run(client, message, ["item"]);
  if (args.length == 1 && args[0].toLowerCase() == "random") return client.commands.get("loto").run(client, message, ["item"]);

  // retrieve item name
  let arg_str = args.join(" ").toLowerCase();
  let item_search = client.itemdex_lookup.get(arg_str);
  // get the emoji
  const emoji = client.emojis.find("name", "rotomdex");
  var title = `—\n`;

  // if no item, then there was likely a typo, rotomdex will suggest the next closest option
  if (!item_search) {
    item_search = await client.spellCheck(message, arg_str, client.itemdex, client.itemdex_lookup, "item");
    if(!item_search) return;
  }

  // item_search has to be a valid key now
  let item = client.itemdex.get(item_search);

  //create the embed
  const embed = new Discord.RichEmbed();
  embed.setAuthor(`${item.name}`);
  embed.setDescription(`${item.flavor_text}`);
  embed.attachFile(`./assets/items/${item.thumbnail}.png`);
  embed.setThumbnail(`attachment://${item.thumbnail}.png`);
  embed.setColor(13711930);
  message.channel.send(embed);
};

exports.conf = {
  enabled: true,
  aliases: ["i"],
  hidden: false
};

exports.help = {
  name: "item",
  category: "Pokédex",
  short_desc: "Look up data on any item.",
  long_desc: "Look up description and thumbnail of any item.",
  usage: "item <Item>",
  examples: ["item magnet", "item leftovers"]
};
