exports.run = (client) => {

  client.user.setPresence({game: {name: 'Alolan Detective Laki', type:'WATCHING'}, status: 'online'});
  client.logger.log("Zzzrt! Ready!");
}
