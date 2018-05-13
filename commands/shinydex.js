exports.run = async (client, message, args) => {

  // just call the dex command but with a shiny flag
  client.commands.get("dex").run(client, message, args, 1);

}

exports.conf = {
  enabled: true,
  aliases: ["sdex","shdex","shinyd"],
};

exports.help = {
  name: "shinydex",
  category: "Secret",
  description: "What's that? It'zzzz so shiny! Zzzt!.",
  usage: "shinydex <Pokémon>"
};
