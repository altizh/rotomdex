const Dictionary = require("meant")

module.exports = (client) => {

  // getting per-guild settings (currently just prefix)
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

  // await reply function
  client.awaitReply = async (msg, question, limit = 30000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  // load command called on bot start
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

  // unload command called during reload
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

  // generic spellcheck function that cross references the lookup dictionaries
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
    // if the user was close, the bot will ask if the user meant the closest match
    else {
      // the bot will wait for a y/n response so the user doesn't have to search again if the bot guessed correctly
      const response = await client.awaitReply(message, `${emoji} Zzzzzrt? I can't seem to find that ${category}! Were you looking for \`${dex.getProp(dictionary.get(result[0]),"name")}\`?`);
      if (["y", "yes", "yea", "yeah", "yuh", "yep"].includes(response.toLowerCase())) {
        return dictionary.get(result[0]);
      }
      // if the user says no, then the bot will exit and the user will unfortunately have to search again
      else if (["n","no","nope","nuh","negative"].includes(response.toLowerCase())) {
        message.reply(`OK, just let me know what you're looking for!`);
        return false;
      }
      else return false;
    }
  };

  // returns the string in "Proper Case"
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  // returns a random element in the array
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
  };

  // error catching/handling
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });

}
