const chalk = require("chalk");
const moment = require("moment");

exports.log = (content, type = "log") => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
    }
    case "warn": {
      return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
    }
    case "error": {
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
    }
    case "debug": {
      return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
    }
    case "cmd": {
      return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
    }
    case "ready": {
      return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
    }
    case "shiny": {
      return console.log(`${timestamp} ${chalk.bgCyan.bold(type.toUpperCase())} ${content} `);
    }
    case "spellcheck": {
      return console.log(`${timestamp} ${chalk.bgGreen(type.toUpperCase())} ${content} `);
    }
    default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
  }
};

exports.warn = (...args) => this.log(...args, "warn");
exports.error = (...args) => this.log(...args, "error");
exports.debug = (...args) => this.log(...args, "debug");
exports.cmd = (...args) => this.log(...args, "cmd");
exports.ready = (...args) => this.log(...args, "ready");
exports.shiny = (...args) => this.log(...args, "shiny");
exports.spellcheck = (...args) => this.log(...args, "spellcheck");
