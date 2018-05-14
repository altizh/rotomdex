exports.run = async (client, message, args) => {// eslint-disable-line no-unused-vars
  if (message.author.id !== client.config.ownerID) return;
  if (!args || args.length < 1) return message.reply("you didn't say what to reload!");

  let response = await client.unloadCommand(args[0]);
  if (response) return message.reply(`Error Unloading: ${response}`);

  response = client.loadCommand(args[0]);
  if (response) return message.reply(`Error Loading: ${response}`);

  message.reply(`transmitting data... Zz...zzt... ... ... \`${args[0]}\` has been reloaded!`);
};

exports.conf = {
  enabled: true,
  aliases: [],
  hidden: true
};

exports.help = {
  name: "reload",
  category: "System",
  short_desc: "Reloads a command that has been modified.",
  long_desc: "Reloads a command that has been modified.",
  usage: "reload [command]",
  examples: ["reload ability"]
};
