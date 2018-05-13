const Dictionary = require("meant")

module.exports = (client) => {

  client.getGuildSettings = (guild) => {
    const def = client.config.defaultSettings;
    if (!guild) return def;
    const returns = {};
    const overrides = client.settings.get(guild.id) || {};
    for (const key in def) {
      returns[key] = overrides[key] || def[key];
    }
    return returns;
  };

  client.awaitReply = async (msg, question, limit = 30000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return "timeout";
      return false;
    }
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.logger.log(`Loading Command: ${props.help.name}.`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  client.spellCheck = async (message, search, dex, dictionary, category) => {
    // basically a "did you mean" implementation
    const result = Dictionary(search, dictionary.keyArray());
    const emoji = client.emojis.find("name", "rotomdex");
    client.logger.spellcheck("--------------")
    client.logger.spellcheck("User typed: " + search);
    client.logger.spellcheck("Suggested result: " + result);
    // if they typed gibberish, odds are there are no results
    if (result.length == 0) {
      message.channel.send(`${emoji} Zzzzzrt? Does not compute! Did you spell it correctly?`);
      return false;
    }
    // if the user was close, the bot will ask if the user meant the suggested pokemon
    else {
      // the bot will wait for a y/n response so the user doesn't have to search again if the bot guessed correctly
      const response = await client.awaitReply(message, `${emoji} Zzzzzrt? I can't seem to find that ${category}! Were you looking for \`${dex.getProp(dictionary.get(result[0]),"name")}\`?`);
      if (["y", "yes"].includes(response.toLowerCase())) {
        return dictionary.get(result[0]);
      }
      // if the user says no, then the bot will exit and the user unfortunately has to search again
      else if (["n","no"].includes(response.toLowerCase())) {
        message.reply(`OK, just let me know what you're looking for!`);
        return false;
      }
      else return false;
    }
  };

  // <String>.toProperCase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
  };

  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });

}
