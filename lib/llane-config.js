const util = require('util');
const readline = require('readline');
const prompt = require('prompt');
const exec = util.promisify(require('child_process').exec);
const { log, error } = console;

config();
async function config() {

  const llaneConfig = {
    token: {}
  };
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

  var {stdout, stderr} = await exec(`echo ${JSON.stringify(Object.assign(promptStdin, llaneConfig))} > ${process.env.HOME}/.llane.config.json`);
  if(stdout) log('stdout:', stdout);
  if(stderr) throw stderr;

  log('config success.')
  process.exit();

}