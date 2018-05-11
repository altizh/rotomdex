const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  let search = args.join(" ").toLowerCase();

}

exports.conf = {
  enabled: true,
  aliases: [],
};

exports.help = {
  name: "test",
  category: "Miscellaneous",
  description: "test",
  usage: "test"
};
