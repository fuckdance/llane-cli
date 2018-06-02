const fs = require('fs');
const util = require('util');
const readline = require('readline');
const prompt = require('prompt');
const exec = util.promisify(require('child_process').exec);
const { log, error } = console;

config();
async function config() {
  const llaneConfigPath = `${process.env.HOME}/.llane.config.json`;
  const llaneConfig = {
    token: {}
  };

  if(fs.existsSync(llaneConfigPath)) {
    Object.assign(llaneConfig, require(llaneConfigPath));
  }

  const questions = [
    {
      name: "username",
      description: "type your gitlab username",
      type: "string",
      required: true
    },
    {
      name: "password",
      description: "type your gitlab password",
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

  // var {stdout, stderr} = await exec(`echo ${JSON.stringify(Object.assign(promptStdin, llaneConfig))} > ${process.env.HOME}/.llane.config.json`);
  fs.writeFileSync(llaneConfigPath, JSON.stringify(Object.assign(promptStdin, llaneConfig)));

  log('config success.')
  process.exit();

}