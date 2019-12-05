
require('ts-node').register();   // Allow use of TS files

const yargs = require("yargs");
const commandBackupSettings = require("./backupSettings");

yargs
.command(commandBackupSettings)
.help().argv;    // tslint:disable-line:no-unused-expression
