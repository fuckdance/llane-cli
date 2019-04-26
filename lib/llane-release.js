const util = require('util');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const url = require('url');
const md5 = require('md5');
const http = require('http');
const [evn, cmdPath, ...argv] = process.argv;
const { log, error } = console;

const WWWROOT = "//static.joinuscn.com";




release();

async function release() {
  
  const llanePath = "/home/llane";
  const sepReg = /^\/+|\/+$/g;
  const llaneConfigPath = [process.env.HOME, '.llane.config.json'].join(path.sep);
  const projectConfigPath = [process.env.HOME, '.llane.config.json'].join(path.sep);

  const noticeParams = {
    release_status: "",
    author_name: "",
    project_name: process.env.PWD.split(/\/|\\/).pop(),
    public_path: "",
    env: argv[0] === "prod" ? "线上环境" : "测试环境",
    version: ""
  }

  // 配置
  if(!fs.existsSync(llaneConfigPath)){
    log('未读取到全局配置！请运行命令：llane config');
    return;
  }
  const llaneConfig = require([process.env.HOME, '.llane.config.json'].join(path.sep));
  noticeParams.author_name = llaneConfig.username;
  
  if(!fs.existsSync(projectConfigPath)){
    log('未读取到项目配置!请在当前项目下运行命令：llane init');
    return;
  }
  const projectConfig = require([process.env.PWD, '.llane.project.json'].join(path.sep));
  noticeParams.public_path = `http:${WWWROOT}/${projectConfig.projectPath.replace(sepReg, '')}`;
  
  try{

    var GIT_REPOSITORY_URL = process.env.PWD;
    if(fs.existsSync('./.git')){
      var {stdout, stderr} = await exec(`git remote get-url origin`);
      if(stdout) GIT_REPOSITORY_URL = stdout;
    }

    if(llaneConfig.token[md5(GIT_REPOSITORY_URL)] !== md5(`${GIT_REPOSITORY_URL}${WWWROOT}${projectConfig.projectPath}`)){
      noticeParams.err = 'ACCESS DENIED.';
      throw 'ACCESS DENIED.';
    };


    const GIT_REPOSITORY = url.parse(GIT_REPOSITORY_URL);
    const GIT_PATH = path.parse(GIT_REPOSITORY.path);
    const PROJECT_PATH = `${llanePath}/${GIT_REPOSITORY.name}`;


    log('release files ...');
    const {dir, name} = path.parse(argv[0] || '');
    const projectPath = `/home/wwwroot/${WWWROOT.replace(sepReg, '')}/${projectConfig.projectPath.replace(sepReg, '')}`;
    const buildPath = `${process.env.PWD}/${projectConfig.buildPath.replace(sepReg, '')}/*`;

    var { stdout, stderr } = await exec(`scp -r  ${buildPath} root@192.168.12.17:${projectPath}`);
    if(stdout) log('stdout:', stdout);
    if(stderr) throw stderr;

    if(argv[0] === "prod"){

      var { stdout, stderr } = await exec(`ssh root@192.168.12.17 "find ${projectPath} | grep -E \\"\\.(js|html)$\\" | xargs sed -i -d \\"s/192.168.12.17/static.joinuscn.com/g\\" "`);
      if(stdout) log('stdout:', stdout);
      if(stderr) throw stderr;

      var { err, stdout, stderr } = await exec(`ssh root@192.168.12.17 "ssh -p 16000 JYSD@218.206.205.10 \"mkdir -p ${projectPath}\""`);
      if(stdout) log('stdout:', stdout);
      if(stderr) throw stderr;

      var { stdout, stderr } = await exec(`ssh root@192.168.12.17 "scp -P 16000 -r ${projectPath}/* JYSD@218.206.205.10:${projectPath}"`);
      if(stdout) log('stdout:', stdout);
      if(stderr) throw stderr;
      
    }

    var { stdout, stderr } = await exec(`ssh root@192.168.12.17 "find ${projectPath} | grep -E \\"\\.(js|html)$\\" | xargs sed -i -d \\"s/static.joinuscn.com/192.168.12.17/g\\" "`);
    if(stdout) log('stdout:', stdout);
    if(stderr) throw stderr;


    log("release complete.")

    noticeParams.release_status = 'SUCCESS';
    robotNotice(noticeParams);
  }catch(e){
    // console.error(e);
    noticeParams.err = e;
    noticeParams.release_status = "FAILD";
    robotNotice(noticeParams);
    throw e;
  }

}

async function robotNotice (postData) {

  const postMeta = JSON.stringify(postData);
  const options = {
    hostname: '192.168.12.17',
    port: 3003,
    path: '/webhook',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-robot-type': 'Release Hook',
      'Content-Length': Buffer.byteLength(postMeta)
    }
  };

  const req = http.request(options);
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(postMeta);
  req.end();
}
