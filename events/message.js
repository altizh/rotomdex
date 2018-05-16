module.exports = (client, message) => {

  // filter out bot messages
  if (message.author.bot) return;

  // retrieve server settings (currently just the prefix)
  const settings = message.settings = client.getGuildSettings(message.guild);

  // for new users who don't know the prefix, mentioning the bot will tell them the prefix and to use the help for more details
  if (message.content.startsWith(`<@${client.config.botID}>`)) {
    const emoji = client.emojis.find("name", "rotomdex");
    message.channel.send(`${emoji} Zzt! Please use \`${settings.prefix}\` to interact with me! For a list of commands, just say \`${settings.prefix}help\`.`);
  };

  // if the message does not begin with the prefix, then don't do anything
  if (message.content.indexOf(settings.prefix) !== 0) return;

  // separate the query by space characters
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  // get the intended command
  const command = args.shift().toLowerCase();

  // if the command is valid or is an alias, run it
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  cmd.run(client, message, args);
}
