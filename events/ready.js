const chalk = require("chalk");
module.exports = async client => {

  client.user.setPresence({game: {name: 'Alolan Detective Laki', type:'WATCHING'}, status: 'online'});

  client.logger.ready(`Zzzrt! ${client.user.username} here, ready to serve ${chalk.green(client.users.size)} users in ${chalk.green(client.guilds.size)} serverzzz!`);
}
