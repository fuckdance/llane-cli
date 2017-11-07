

const util = require('util');
const chalk = require('chalk');
const path = require('path');
const exec = util.promisify(require('child_process').exec);


const { log, error } = console;
const [evn, cmdPath, ...argv] = process.argv;
const pkg = require('../package.json');


const {PWD } = process.env;

async function init() {

  console.log();
  var {stdout, stderr} = await exec(`cp -rf ${JSON.stringify(path.resolve(cmdPath,'../../templates/app'))} ${path.resolve(PWD,"./")}`);
  if(stdout) log('stdout:', stdout);
  if(stderr) log('stderr:', stderr);

  console.log('// todo ...');
  // var {stdout, stderr} = await exec(`npm install ${Object.keys(pkg.dependencies).join(' ')} --save`);
  // if(stdout) log('stdout:', stdout);
  // if(stderr) log('stderr:', stderr);

}

// export default init;
exports.default = init;
