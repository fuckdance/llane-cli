## 使用说明
### 安装
```bash
## http 安装
npm install git+http://gitlab.joinuscn.com/jysd-fe/llane-cli.git -g
## or ssh安装
npm install git+git@gitlab.joinuscn.com:jysd-fe/llane-cli.git -g
```

### 首次使用
```bash
llane config
```

### 首次发布
```bash
cd projectPath
```
```bash
## 请按照配置清单输入相应项
llane init
```
```bash
## 测试服务器
llane release
## 正式服务器
llane release prod 
```




### 当前所有项目发布配置清单
```javascript
.llane.project.json
{"buildPath":"images","projectPath":"/assets/images"}

article_web/.llane.project.json
{"buildPath":"/","projectPath":"/h5/tifenbao/"}

article_webview/.llane.project.json
{"buildPath":"/","projectPath":"/h5/tifenbao"}

campus-card-supplement/.llane.project.json
{"buildPath":"/dist","projectPath":"/admin/patchcard"}

card-assistant-ant/.llane.project.json
{"buildPath":"/build","projectPath":"/alipay/lifestyle"}

competition/.llane.project.json
{"buildPath":"/build","projectPath":"/ijxparent/upload"}

competition-teacher/.llane.project.json
{"buildPath":"/build","projectPath":"/ijxteacher/vote"}

display_h5/.llane.project.json
{"buildPath":"/","projectPath":"/h5/events/"}

enter_class_qrcode/.llane.project.json
{"buildPath":"/build","projectPath":"/h5/teacher-qrcode"}

h5-about/.llane.project.json
{"buildPath":"/","projectPath":"/app/qingyulan"}

h5-activity/.llane.project.json
{"buildPath":"/build","projectPath":"/h5/activity"}

h5-class-invitation/.llane.project.json
{"buildPath":"/build","projectPath":"/h5/class-invitation"}

h5-notice/.llane.project.json
{"buildPath":"/src","projectPath":"/h5/qingyulan-download"}

h5-open-business/.llane.project.json
{"buildPath":"/build","projectPath":"/h5/qingyulan/business"}

h5-weekly/.llane.project.json
{"buildPath":"/build","projectPath":"/h5/weekly"}

h5_base/.llane.project.json
{"buildPath":"/","projectPath":"/h5-base/"}

periodical-allocation/.llane.project.json
{"buildPath":"/dist","projectPath":"/ijx/periodical"}

qyl-admin/.llane.project.json
{"buildPath":"/dist","projectPath":"/pc/admin/v2"}

qyl_card_h5/.llane.project.json
{"buildPath":"/","projectPath":"/h5/card-center"}

redPacket/.llane.project.json
{"buildPath":"/build","projectPath":"/h5/red-pocket/4g-data"}

student-evaluation-teacher-app/.llane.project.json
{"buildPath":"/build","projectPath":"/ijxteacher/evaluation"}

teacher-entry/.llane.project.json
{"buildPath":"/build","projectPath":"/h5/class-claim"}

zwds-admin-static/.llane.project.json
{"buildPath":"/dist","projectPath":"/zwds/admin"}

zwds_react/.llane.project.json
{"buildPath":"/build","projectPath":"/events/article/pc"}
```
