const util = require('util');
const readline = require('readline');
const prompt = require('prompt');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const { log, error } = console;
const WWWROOT = "//static.joinuscn.com";

init();
async function init() {

  const questions = [
    {
      name: "buildPath",
      description: "type your build path",
      type: "string",
      required: true
    },
    {
      name: "projectPath",
      description: "type your project path",
      type: "string",
      required: true
    }
  ]
  prompt.start();

  const promptStdin = await new Promise((resolve, reject) => {
    prompt.get(questions, (err, ret) => {
      if(err){
        throw err;
      }
      resolve(ret);
    });
  });

  var {stdout, stderr} = await exec(`echo ${JSON.stringify(promptStdin)} > ./.llane.project.json`);
  if(stderr) throw stderr;

  var GIT_REPOSITORY_URL = process.env.PWD;
  if(fs.existsSync('./.git')){
    var {stdout, stderr} = await exec(`git remote get-url origin`);
    if(stdout) GIT_REPOSITORY_URL = stdout;
  }

  const llaneConfig = require([process.env.HOME, '.llane.config.json'].join(path.sep));
  llaneConfig.token = llaneConfig.token || {};
  llaneConfig.token[md5(`${GIT_REPOSITORY_URL}${WWWROOT}${promptStdin.projectPath}`)] = 1;

  var {stdout, stderr } = await exec(`ssh root@192.168.5.17 "mkdir -p /home/wwwroot/${WWWROOT.substr(2)}${promptStdin.projectPath}"`);
  if(stderr) throw stderr;

  var {stdout, stderr} = await exec(`echo ${JSON.stringify(llaneConfig)} > ${process.env.HOME}/.llane.config.json`);
  if(stdout) log('stdout:', stdout);
  if(stderr) throw stderr;


  log('llane init this project success.');
  process.exit();

}

