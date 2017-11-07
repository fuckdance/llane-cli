const util = require('util');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const path = require('path');

const { log, error } = console;
// 配置
const llaneConfig = require([process.env.USERPROFILE, '.llane.json'].join(path.sep));


release();


async function release() {

  log('npm run build ...');
  var { err, stdout, stderr } = await exec('npm run build');
  if(stdout) log('stdout:', stdout);
  if(stderr) log('stderr:', stderr);
  if(err) throw err;
  
  log('tar ...');
  var { err, stdout, stderr } = await exec('tar -zcvf ./static.tar ./dist');
  if(stdout) log('stdout:', stdout);
  if(stderr) log('stderr:', stderr);
  if(err) throw err;

  log('scp ...');
  const {rd: {user, remote}} = llaneConfig;
  var { err, stdout, stderr } = await exec(`scp -i ../../SecretKey/llanenet.pem ./static.tar ${user}@${remote}:/home/wwwroot/`);
  if(stdout) log('stdout:', stdout);
  if(stderr) log('stderr:', stderr);
  if(err) throw err;

  log();
  log(chalk.blue('release complete.'));
}

