
const util = require('util');
const chalk = require('chalk');
const http = require('http');
const https = require('https');
// const qs = require('querystring');

const [evn, cmdPath, ...argv] = process.argv;
const exec = util.promisify(require('child_process').exec);

const { log, error } = console;

async function list() {
  // default settings
  const options = {
    hostname: 'gitlab.joinuscn.com',
    port: 80,
    path: ``,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'PRIVATE-TOKEN': 'SycxHQ6QFCyyk2MF_GLs'
    }
  };

  // projects maps
  const ProjectIdMaps = {}; 

  // get projects disc 
  options.path = `/api/v4/projects?per_page=100`;
  const projects = await new Promise((resolve, reject) => {
    try{
      const req = http.request(options, res => {
        let ret = [];
        res.on('data', chunk => ret.push(chunk));
        res.on('end', e => {
          resolve(JSON.parse(Buffer.concat(ret).toString()))
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });
      req.end();

    }catch(e){
      resolve(e)
    }
  });

  // set maps key-values
  projects.forEach(project => ProjectIdMaps[project.id] = project.description);

  // get FE groups members  
  options.path = `/api/v4/groups/2/members`;
  const members = await new Promise((resolve, reject) => {
    try{

      const req = http.request(options, res => {
        let ret = [];
        res.on('data', chunk => ret.push(chunk));
        res.on('end', e => {
          resolve(JSON.parse(Buffer.concat(ret).toString()))
        });
      });
      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });
      req.end();

    }catch(e){
      resolve(e)
    }
  });
  
  // get events by all member
  const groupsEvents = await Promise.all(members.map(member => {
    options.path = `/api/v4/users/${member.id}/events?after=${argv[0]}&per_page=100&action=pushed`;
    return new Promise((resolve, reject) => {
      try{
        const req = http.request(options, res => {
          let ret = [];
          res.on('data', chunk => ret.push(chunk));
          res.on('end', e => {
            resolve(JSON.parse(Buffer.concat(ret).toString()))
          });
        });
  
        req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`);
        });
      
        req.end();
  
      }catch(e){
        resolve(e)
      }
    });
  }))



  log()
  log(chalk.green('//======= 个人日报 =======//'))
  log()
  const projectCommits = {}
  members.forEach( (member, index) => {
    const events = groupsEvents[index];
    log(chalk.blue.bold(member.name), chalk.bgYellowBright(`${events.length} commits after ${argv[0]}`));
    events.forEach((event, eindex) => {
      const projectName = ProjectIdMaps[event.project_id] || '其他';
      if(projectCommits[projectName] === undefined){
        projectCommits[projectName] = [];
      }
      projectCommits[projectName].push(event.push_data.commit_title);
      log(' ', chalk.bold(eindex + 1), event.push_data.commit_title);
    });
  });

  log()
  log(chalk.green('//======= 以下为项目日报 =======//'))
  log()

  let markdown = `\n## FE团队日报
-------------------------------
  ${
    Object.keys(projectCommits).map(key => {
      console.log(Array.from(new Set(projectCommits[key])))
      const commits = Array.from(new Set(projectCommits[key])).filter(commit => commit && commit.indexOf('Merge') === -1).map(commit => commit.replace(/^(\w+)\(?[\w\u4e00-\u9fa5]+\)?:/g, ''));
      log(chalk.blue.bold(key), chalk.bgYellowBright(`${commits.length} commits after ${argv[0]}`));
      return `\n### ${key}
      ${commits.map((commit, eindex) => {
        const num = eindex + 1;
        log(' ', chalk.bold(num));
        return `\n${num}. ${commit}`
      }).join('')}
      `
    }).join('\n')
  }

--------------------------------
> ${new Date().toLocaleString()}`

  console.log(markdown)
  
  if(argv[1] !== '-r'){
    return ;
  }

  // send issue notes
  const sendData = `body=${markdown}`
  options.path = `/api/v4/projects/102/issues/1/notes`;
  options.method = 'POST';
  options.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'PRIVATE-TOKEN': 'SycxHQ6QFCyyk2MF_GLs',
    'Content-Length': Buffer.byteLength(sendData)
  }
  const result = await new Promise((resolve, reject) => {
    try{
      const req = http.request(options, res => {
        let ret = "";
        res.on('data', chunk => ret += chunk);
        res.on('end', e => resolve(JSON.parse(ret)));
      });
      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      req.write(sendData);
      req.end();

    }catch(e){
      resolve(e)
    }
  });

  if(result.id) {
    markdown =`${markdown}  [详情](http://gitlab.joinuscn.com/jysd-fe/worklog/issues/1#note_${result.id})`
    robot(markdown)
    return;
  }

  log(chalk.red.bold(result.message))
  


  // const projects = ret.map(item => `${item.name}`).join(' ')
  // ret.forEach(item => log(chalk.blue(item.name), ':', chalk.green(item.web_url), chalk.bgYellowBright('docker')))
  // console.log(ret, options.path);
  // ret.forEach(item => log(chalk.blue(item.name), ':', chalk.green(item.target_title), chalk.bgYellowBright('docker')))

  // console.log(stdout)
}

function robot(note) {


  const postData = {
    msgtype: "markdown",
    at: {
      isAtAll: true
    },
    markdown: {
      title: "工作日报",
      text: note
    }
  }

  const postMeta = JSON.stringify(postData);
  const options = {
    hostname: 'oapi.dingtalk.com',
    port: 443,
    path: '/robot/send?access_token=e3592f1274b0d2bc7e1ef009f736e2b05477b8ef68dc90a8dcdef7287f0fce66',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postMeta)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // write data to request body
  req.write(postMeta);
  req.end();
}

list();
