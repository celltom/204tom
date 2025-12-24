# 使用 GitHub Pages 部署网站

## 🎯 方法一：使用 GitHub Actions 自动部署（推荐）

### 步骤 1：启用 GitHub Pages

1. 访问你的 GitHub 仓库：`https://github.com/celltom/204tom`
2. 点击仓库顶部的 **Settings**（设置）
3. 在左侧菜单中找到 **Pages**（页面）
4. 在 "Source" 部分：
   - 选择 **GitHub Actions**（不是 "Deploy from a branch"）
5. 保存设置

### 步骤 2：推送代码触发部署

代码已经配置好了 GitHub Actions，只需要推送一次即可：

```bash
cd /Users/tom/Cursor/204
git add .
git commit -m "配置 GitHub Pages 部署"
git push
```

### 步骤 3：查看部署状态

1. 在 GitHub 仓库页面，点击 **Actions** 标签
2. 你会看到 "Deploy to GitHub Pages" 工作流正在运行
3. 等待 2-3 分钟，部署完成后会显示绿色 ✓

### 步骤 4：访问网站

部署完成后，你的网站地址将是：
```
https://celltom.github.io/204tom/
```

**注意**：如果仓库名是 `204tom`，地址就是 `https://celltom.github.io/204tom/`

## 🎯 方法二：使用 Netlify（备选方案）

如果 GitHub Pages 有问题，可以尝试 Netlify：

1. 访问 [https://www.netlify.com](https://www.netlify.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择你的仓库 `celltom/204tom`
5. 配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击 **"Deploy site"**

## 🎯 方法三：手动部署到 GitHub Pages

如果自动部署不工作，可以手动部署：

```bash
cd /Users/tom/Cursor/204

# 构建项目
npm run build

# 进入构建目录
cd dist

# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Deploy to GitHub Pages"

# 推送到 gh-pages 分支
git branch -M gh-pages
git remote add origin https://github.com/celltom/204tom.git
git push -u origin gh-pages
```

然后在 GitHub 仓库设置中：
- Settings → Pages
- Source: 选择 `gh-pages` 分支
- 保存

## ✅ 部署完成后

1. **访问网站**：`https://celltom.github.io/204tom/`
2. **测试功能**：
   - 创建文件夹
   - 上传文件
   - 下载文件
   - 删除文件

## 🔄 更新网站

以后更新代码后，只需要：

```bash
git add .
git commit -m "更新描述"
git push
```

GitHub Actions 会自动重新部署！

## ⚠️ 重要提示

1. **Firebase 配置**：确保 Firebase 已正确配置（见 `FIREBASE_SETUP.md`）
2. **首次部署**：可能需要等待几分钟才能访问
3. **HTTPS**：GitHub Pages 自动提供 HTTPS，安全可靠

## 🐛 遇到问题？

- 检查 GitHub Actions 的部署日志
- 确认仓库设置中 Pages 已启用
- 检查 `vite.config.js` 中的 base 路径是否正确

