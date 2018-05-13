const Discord = require("discord.js");

exports.run = async (client, message, [action, key, ...value]) => {

  if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("you aren't authorizzzed to change the prefix!");

  const settings = message.settings;
  const overrides = client.settings.get(message.guild.id);

  if (action === "change" || action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    // User must specify a key that actually exists!
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    // User must specify a value to change.
    if (value.length < 1) return message.reply("Please specify a new value");
    // User must specify a different value than the current one.
    if (value.join(" ") === settings[key]) return message.reply("This setting already has that value!");
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});

    // setProp is an enmap feature, it defines a single property of an object in an enmap key/value pair.
    client.settings.setProp(message.guild.id, key, value.join(" "));

    // Confirm everything is fine!
    message.reply(`${key} successfully edited to ${value.join(" ")}`);
  } else

  // Resets a key to the default value
  if (action === "reset") {
    if (!key) return message.reply("Please specify a key to reset.");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    if (!overrides[key]) return message.reply("This key does not have an override and is already using defaults.");

    // Good demonstration of the custom awaitReply method in `./modules/functions.js` !
    const response = await client.awaitReply(message, `Are you sure you want to reset ${key} to the default value?`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response.toLowerCase())) {
      // We delete the `key` here.
      delete overrides[key];
      client.settings.set(message.guild.id, overrides);
      message.reply(`${key} was successfully reset.`);
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n","no","cancel"].includes(response)) {
      message.reply("Action cancelled.");
    }
  } else

  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (!settings[key]) return message.reply("This key does not exist in the settings");
    const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
    message.reply(`The value of ${key} is currently ${settings[key]}${isDefault}`);
  } else {
    message.channel.send(inspect(settings), {code: "json"});
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name: "test",
  category: "Secret",
  description: "test",
  usage: "test"
};
