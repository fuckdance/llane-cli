
const util = require('util');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);

const { log, error } = console;

async function server() {

  log(chalk.red('todo => 0%.'));
}

server();