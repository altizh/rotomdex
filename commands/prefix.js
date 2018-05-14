const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  const settings = message.settings;
  const overrides = client.settings.get(message.guild.id);

  // empty argument or "help"
  if (args.length == 0) return message.reply(`the current prefix is \`${settings["prefix"]}\``);
  if (args[0].toLowerCase() == "help" && args.length == 1) return client.commands.get("help").run(client, message, ["prefix"]);

  if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("you aren't authorizzzed to change the prefix!");

  if (args[0].toLowerCase() == "reset" && args.length > 1) return message.reply("\`reset\` can't be use to start the prefix, sorry!");
  if (args[0].toLowerCase() == "help" && args.length > 1) return message.reply("\`help\` can't be use to start the prefix, sorry!");
  let new_prefix = args.join(" ").toLowerCase();
  if (new_prefix.charAt(0) == "@") return message.reply("\`@\` can't be use to start the prefix, sorry!");
  if (new_prefix.charAt(0) == "#") return message.reply("\`#\` can't be use to start the prefix, sorry!");

  if(new_prefix == "reset") {
    if (settings["prefix"] === client.config.defaultSettings.prefix) return message.reply("this is already the default prefix!");
    const response = await client.awaitReply(message, `Reset the prefix back to \`${client.config.defaultSettings.prefix}\`? [Y/N]`);
    if (["y", "yes"].includes(response.toLowerCase())) {
      delete overrides["prefix"];
      client.settings.set(message.guild.id, overrides);
      message.reply(`the prefix was successfully reset back to \`${client.config.defaultSettings.prefix}\`.`);
    }
    else if (["n","no","cancel"].includes(response)) {
      message.reply("the prefix was not reset.");
    }
  }
  else {
    if (new_prefix === settings["prefix"]) return message.reply("this is already the prefix!");
    //const response = await client.awaitReply(message, `Confirm change the prefix to \`${new_prefix}\`? [Y/N]`);
    //if (["y", "yes"].includes(response.toLowerCase())) {
      if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
      client.settings.setProp(message.guild.id, "prefix", new_prefix);
      message.reply(`the prefix was successfully changed to ${new_prefix}`);
    //}
    //else if (["n","no","cancel"].includes(response)) {
      //message.reply("the prefix was not changed.");
    //}
  }

};

exports.conf = {
  enabled: true,
  aliases: [],
  hidden: false
};

exports.help = {
  name: "prefix",
  category: "system",
  short_desc: "Change the prefix used to call Rotom Dex. *REQUIRES SERVER MANAGE PERMISSIONS",
  long_desc: "Change the prefix used to call Rotom Dex. Can only be used if you have Server Manage Permissions. Anything leading with \"@\", \"#\", \"help\", and \"reset\" are not allowed.",
  usage: "prefix <desired prefix or reset>",
  examples: ["prefix roto.", "prefix rotom?", "prefix reset"]
};
