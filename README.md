# 网盘系统

### 项目介绍
该项目运行在LNMP环境上，界面整体布局采用Element-Ui，使用Mysql作为网盘数据存储，并用ThinkPHP作为后台接口返回json格式数据，前端利用axios统一获取和拦截数据，获取到的用户基本数据，使用Vuex共享，并用Vue.js作为数据驱动，后端使用JWT技术返回的token令牌，Vue-Router进行路由权限控制，目前项目实现了具有用户登录/注册，文件上传/下载/删除/分享，文件夹重命名/创建/删除功能的网盘系统。

### 项目地址
#### <a href="http://pan.52siren.fun" target="_blank" title="网盘系统">pan.52siren.fun</a>


### 前端项目部署
``` md
# 项目根目录安装依赖
npm install

# 浏览器访问localhost:6868 / 127.0.0.1:6868
npm run dev

# 打包编译生成静态资源
npm run build
```
### 后端项目部署
> 由于在本地调试接口的时候用的是Apache服务器，所以在部署到云服务器上时候才知道ThinkPHP不支持nginx，需要自行更改默认的伪静态规则，如果你云服务器使用的环境是nginx，可直接按照我这个配置规则来修改，即可让ThinkPHP在nginx环境下也能运行。

```nginx.conf
#当访问路径是/public/uploads/添加header下载字段
location /public/uploads/ {
    add_header Content-Disposition: 'attachment;';
    break;
}

#当访问路径是/public/就重定向到ThinkPHP入口处
location /public/ {
    rewrite  ^/public/(.*)$  /public/index.php?s=/$1  last;
    break;
}

#配合vue路由的history模式
location / {
  try_files $uri $uri/ /index.html;
}

```


### 项目已有的功能

1.用户登录/注册

2.文件上传/下载/删除/分享

3.文件夹重命名/创建/删除功能

### 登录页面
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%871.png)

### 注册页面
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%872.png)

### 网盘首页
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%873.png)

### 网盘文件实时搜索
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%874-1.png)

### 用户信息卡片
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%874-2.png)

### 文件上传
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%875.png)

### 导航条
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%876.png)

### 新建文件夹

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%877.png)

### 分享功能
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%878.png)

### 文件分享成功页
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%879.png)

### 查看文件加密分享页
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%8710.png)

### 查看文件公开分享页
<br />

![image](https://gitee.com/bean6/netdisk/raw/master/md-img/%E5%9B%BE%E7%89%8711.png)