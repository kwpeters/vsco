// Allow use of TS files
require('ts-node').register();


const yargs = require("yargs");
const commandBackupSettings = require("./backupSettings");
const commandRestoreSettings = require("./restoreSettings");


yargs
.command(commandBackupSettings)
.command(commandRestoreSettings)
.help().argv;    // tslint:disable-line:no-unused-expression
