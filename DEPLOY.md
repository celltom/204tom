# 部署指南

## 快速部署到 GitHub 和 Vercel

### 第一步：初始化 Git 仓库

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: MiniCloud 云盘应用"
```

### 第二步：创建 GitHub 仓库并推送代码

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库名称（例如：`myclouddisk`）
4. 选择 Public 或 Private
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

然后执行以下命令：

```bash
# 添加远程仓库（将 YOUR_USERNAME 和 YOUR_REPO_NAME 替换为你的实际值）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

### 第三步：部署到 Vercel

#### 方法一：通过 GitHub 自动部署（推荐）

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New..." → "Project"
4. 在 "Import Git Repository" 中选择你刚创建的仓库
5. 点击 "Import"
6. Vercel 会自动检测项目配置：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. 点击 "Deploy" 开始部署
8. 等待部署完成（通常需要 1-2 分钟）
9. 部署完成后，你会获得一个类似 `https://your-project.vercel.app` 的 URL

#### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 在项目目录中部署
vercel

# 按照提示操作：
# - Set up and deploy? Y
# - Which scope? 选择你的账号
# - Link to existing project? N
# - Project name? 输入项目名称
# - Directory? ./ (直接回车)
# - Override settings? N
```

### 第四步：配置 Firebase

确保你的 Firebase 项目已正确配置：

1. **Firestore Database**
   - 在 Firebase Console 中创建 Firestore 数据库
   - 设置安全规则（见 README.md）

2. **Authentication**
   - 在 Authentication 中启用 "Anonymous" 登录方式

3. **验证配置**
   - Firebase 配置已在 `src/firebase.js` 中设置
   - 确保配置信息正确

### 第五步：测试部署

1. 访问 Vercel 提供的 URL
2. 测试以下功能：
   - ✅ 页面正常加载
   - ✅ 可以创建文件夹
   - ✅ 可以上传文件
   - ✅ 可以下载文件
   - ✅ 可以删除文件和文件夹

## 后续更新

每次更新代码后，只需：

```bash
# 提交更改
git add .
git commit -m "更新描述"

# 推送到 GitHub
git push

# Vercel 会自动检测并重新部署
```

## 常见问题

### 1. 构建失败

- 检查 `package.json` 中的依赖是否正确
- 确保所有依赖都已安装：`npm install`
- 检查 `vite.config.js` 配置是否正确

### 2. 部署后无法访问

- 检查 Vercel 部署日志
- 确认 Firebase 配置正确
- 检查浏览器控制台是否有错误

### 3. Firebase 权限错误

- 检查 Firestore 安全规则
- 确保 Authentication 已启用匿名登录
- 检查 Firebase 项目设置

## 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 查看 Firebase Console 的日志
4. 参考 [Vercel 文档](https://vercel.com/docs)
5. 参考 [Firebase 文档](https://firebase.google.com/docs)

