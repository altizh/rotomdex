const config = {
  "ownerID": process.env.OWNER_ID,
  "botID": process.env.BOT_ID,
  "testGuildID" : process.env.TEST_GUILD_ID,
  "token": process.env.TOKEN,
  "inviteURL": process.env.INVITE_URL,
  "defaultSettings" : {
    "prefix": "r.",
  },
};

module.exports = config;
