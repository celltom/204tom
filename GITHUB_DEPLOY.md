# 部署到 GitHub 和 Vercel - 完整指南

## ✅ 第一步：代码已准备好

你的代码已经提交到本地 Git 仓库了！

## 📝 第二步：在 GitHub 创建新仓库

1. **访问 GitHub**
   - 打开浏览器，访问 [https://github.com](https://github.com)
   - 登录你的 GitHub 账号（如果没有账号，先注册一个）

2. **创建新仓库**
   - 点击右上角的 **"+"** 号
   - 选择 **"New repository"**

3. **填写仓库信息**
   - **Repository name**: 输入 `myclouddisk`（或你喜欢的名字）
   - **Description**: 可选，填写 "MiniCloud 云盘应用"
   - **Visibility**: 选择 **Public**（公开，这样大家都能访问）或 **Private**（私有）
   - ⚠️ **重要**: **不要**勾选 "Initialize this repository with a README"
   - 点击 **"Create repository"**

4. **复制仓库地址**
   - GitHub 会显示一个页面，上面有仓库地址
   - 复制这个地址，格式类似：`https://github.com/YOUR_USERNAME/myclouddisk.git`

## 🚀 第三步：推送代码到 GitHub

在终端中执行以下命令（将 `YOUR_USERNAME` 和 `myclouddisk` 替换为你的实际值）：

```bash
cd /Users/tom/Cursor/204

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/myclouddisk.git

# 推送代码
git branch -M main
git push -u origin main
```

**示例**（如果你的用户名是 `tom`，仓库名是 `myclouddisk`）：
```bash
git remote add origin https://github.com/tom/myclouddisk.git
git branch -M main
git push -u origin main
```

执行后会要求输入 GitHub 用户名和密码（或 Personal Access Token）。

## 🌐 第四步：部署到 Vercel（让网站可以被访问）

1. **访问 Vercel**
   - 打开 [https://vercel.com](https://vercel.com)
   - 点击 **"Sign Up"** 或 **"Log In"**
   - 选择 **"Continue with GitHub"**（使用 GitHub 账号登录）

2. **导入项目**
   - 登录后，点击 **"Add New..."** → **"Project"**
   - 在 "Import Git Repository" 中找到你刚创建的仓库
   - 点击 **"Import"**

3. **配置项目**
   - Vercel 会自动检测项目配置：
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - 如果检测正确，直接点击 **"Deploy"**

4. **等待部署**
   - 部署通常需要 1-2 分钟
   - 你会看到部署进度

5. **获取网站地址**
   - 部署完成后，你会看到一个类似 `https://myclouddisk.vercel.app` 的地址
   - 这个地址就是你的网站，**任何人都可以访问！**

## 🎉 完成！

现在你的网站已经部署好了：
- ✅ 代码在 GitHub 上
- ✅ 网站在 Vercel 上，所有人都可以访问
- ✅ 可以上传、下载文件，创建文件夹

## 📌 后续更新

以后如果修改了代码，只需要：

```bash
cd /Users/tom/Cursor/204
git add .
git commit -m "更新描述"
git push
```

Vercel 会自动检测到更新并重新部署！

## ⚠️ 重要提示

在部署前，确保：

1. **Firebase 配置已完成**
   - 匿名登录已启用（见 `FIREBASE_SETUP.md`）
   - Firestore 数据库已创建
   - Firestore 安全规则已配置

2. **测试本地运行**
   - 运行 `npm run dev` 确保网站正常工作

## 需要帮助？

如果遇到问题：
- 查看 `DEPLOY.md` 获取更详细的说明
- 查看 `FIREBASE_SETUP.md` 配置 Firebase
- 检查浏览器控制台的错误信息

