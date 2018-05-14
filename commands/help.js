exports.run = (client, message, args) => {
  // no specific command
  const emoji = client.emojis.find("name", "rotomdex");

  if (!args[0]) {

    const myCommands = client.commands.filter(cmd => cmd.conf.hidden !== true)
    // Here we have to get the command names only, and we use that array to get the longest name.
    // This make the help commands "aligned" in the output.
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `== Rotom Dex Instruction Manual ==
                  \nSimply use the prefix (${message.settings.prefix}) and a command below to use Rotom Dex!\nIf Rotom Dex asks for clarification, you can respond with [Y/N].
                  \n[Use ${message.settings.prefix}help <command> for further details about that command]\n`;
    const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    sorted.forEach( c => {
      const cat = c.help.category.toProperCase();
      if (currentCategory !== cat) {
        output += `\n= ${cat} =\n`;
        currentCategory = cat;
      }
      output += `${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.short_desc}\n`;
    });

    message.channel.send(`—\n${emoji} Zzt! I found the manual for... me! Zz-zz! \`\`\`asciidoc\n${output}\n\`\`\``);
  }
  //specific command is called
  else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (command.conf.hidden) return;
      let output= `== Command: ${command.help.name} ==
                  \n${command.help.long_desc}
                  \nusage    :: ${message.settings.prefix}${command.help.usage}`
      if(command.conf.aliases.length !== 0) {
        output += `\naliases  :: ${message.settings.prefix}${command.conf.aliases.join(`, ${message.settings.prefix}`)}`
      }
      output += `\n\nexamples :: ${message.settings.prefix}${command.help.examples.join(` | ${message.settings.prefix}`)}`;
      message.channel.send(`—\n${emoji} Here'zzz the page for \`${args[0]}\`! \`\`\`asciidoc\n${output}\n\`\`\``);
    }
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  hidden: false
};

exports.help = {
  name: "help",
  category: "System",
  short_desc: "Displays available commands.",
  long_desc: "Displays all commands that are available for you to use.",
  usage: "help <command>",
  examples: ["help", "help dex"]
};
