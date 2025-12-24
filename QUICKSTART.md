# 快速开始

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

## 部署到 GitHub 和 Vercel

### 一键部署步骤

1. **初始化 Git 并推送到 GitHub**

```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit: MiniCloud 云盘应用"

# 在 GitHub 创建新仓库后，执行：
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

2. **在 Vercel 部署**

   - 访问 https://vercel.com
   - 使用 GitHub 登录
   - 点击 "New Project"
   - 选择你的仓库
   - 点击 "Deploy"（Vercel 会自动检测配置）

3. **完成！**

   部署完成后，你会获得一个公共 URL，任何人都可以访问你的云盘应用。

## 重要提示

⚠️ **Firebase 配置**

Firebase 配置已经在 `src/firebase.js` 中设置好了。确保：

1. Firebase 项目已启用 Firestore Database
2. 已启用 Anonymous Authentication
3. Firestore 安全规则已正确配置（见 README.md）

## 功能测试清单

部署后，请测试以下功能：

- [ ] 页面正常加载
- [ ] 可以创建文件夹
- [ ] 可以上传文件（PDF、图片、Word、PPT 等）
- [ ] 可以下载文件
- [ ] 可以删除文件和文件夹
- [ ] 文件夹导航正常工作

## 需要帮助？

查看 `DEPLOY.md` 获取详细的部署指南。

