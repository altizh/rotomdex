exports.run = (client, message) => {

  if (message.author.bot) return;
  const settings = message.settings = client.getGuildSettings(message.guild);
  if (message.content.indexOf(settings.prefix) !== 0) return;

  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  cmd.run(client, message, args);
}
