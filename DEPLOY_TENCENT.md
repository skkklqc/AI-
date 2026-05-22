# 腾讯云轻量应用服务器部署指南

目标：把项目部署成一个公网链接，面试官打开即可体验。

推荐服务器：

- 腾讯云轻量应用服务器
- Ubuntu 22.04 LTS
- 1 核 2G 或以上
- 防火墙放行 `80`、`443`、`22`

## 1. 登录服务器

在本机 PowerShell 中登录服务器：

```bash
ssh root@你的服务器公网IP
```

## 2. 安装基础环境

```bash
apt update
apt install -y curl git nginx gnupg ca-certificates
```

安装 Node.js 22：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

安装 PM2：

```bash
npm install -g pm2
```

## 3. 安装 MongoDB

Ubuntu 22.04 可使用 MongoDB 官方源：

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl enable mongod
systemctl start mongod
systemctl status mongod
```

如果 MongoDB 官方源下载较慢，也可以使用腾讯云上的 MongoDB 云数据库，或者改用 MongoDB Atlas。只要最终拿到 `MONGODB_URI` 即可。

## 4. 上传项目代码

推荐先把项目推到 GitHub 或 Gitee，然后服务器拉取：

```bash
cd /www
git clone https://github.com/你的用户名/campus-used-book-platform.git
cd campus-used-book-platform
```

如果还没有 `/www`：

```bash
mkdir -p /www
```

## 5. 配置生产环境变量

```bash
cp server/.env.production.example server/.env
nano server/.env
```

本机 MongoDB 可这样填：

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campus_used_books
JWT_SECRET=请换成一串很长的随机字符
```

保存退出：`Ctrl + O`，回车，`Ctrl + X`。

## 6. 安装依赖并构建

```bash
npm install
npm run build
```

## 7. 初始化演示数据

第一次部署时执行：

```bash
npm run seed
```

注意：这个命令会清空当前数据库并写入演示数据。如果后续有真实数据，不要再执行。

## 8. 用 PM2 启动项目

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

检查状态：

```bash
pm2 status
pm2 logs campus-used-book-platform
```

此时服务器内部应该可以访问：

```bash
curl http://127.0.0.1:5000/api/health
```

## 9. 配置 Nginx

复制项目里的 Nginx 配置：

```bash
cp deploy/nginx-campus-used-book.conf /etc/nginx/conf.d/campus-used-book.conf
nano /etc/nginx/conf.d/campus-used-book.conf
```

把这一行：

```nginx
server_name your_domain_or_server_ip;
```

改成你的服务器公网 IP 或域名，例如：

```nginx
server_name 你的服务器公网IP;
```

检查并重启 Nginx：

```bash
nginx -t
systemctl reload nginx
```

## 10. 腾讯云控制台放行端口

在腾讯云轻量应用服务器控制台：

- 防火墙放行 `80`
- 如果要用 HTTPS，再放行 `443`
- SSH 保持 `22`

## 11. 访问项目

浏览器打开：

```text
http://你的服务器公网IP
```

如果绑定了域名：

```text
http://你的域名
```

## 12. 更新项目

以后代码更新后，在服务器执行：

```bash
cd /www/campus-used-book-platform
git pull
npm run build
pm2 restart campus-used-book-platform
```

## 常见问题

### 页面打不开

检查服务是否运行：

```bash
pm2 status
systemctl status nginx
curl http://127.0.0.1:5000/api/health
```

### 数据库连接失败

检查 MongoDB：

```bash
systemctl status mongod
```

检查 `server/.env` 中的 `MONGODB_URI` 是否正确。

### 访问 IP 显示 502

通常是 Node 服务没启动或端口不对：

```bash
pm2 logs campus-used-book-platform
```

确认 `server/.env` 中 `PORT=5000`，Nginx 中也是 `proxy_pass http://127.0.0.1:5000;`。
