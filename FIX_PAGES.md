# 修复 GitHub Pages 部署问题

## 🔧 方法一：手动启用 GitHub Pages（推荐）

### 步骤 1：启用 Pages

1. 访问你的仓库：`https://github.com/celltom/204tom`
2. 点击仓库顶部的 **Settings**
3. 在左侧菜单中找到 **Pages**
4. 在 "Source" 部分：
   - 选择 **GitHub Actions**（不是 "Deploy from a branch"）
5. 点击 **Save**

### 步骤 2：重新运行部署

1. 在仓库页面，点击 **Actions** 标签
2. 找到失败的部署，点击它
3. 点击右上角的 **"Re-run all jobs"**（重新运行所有作业）
4. 等待部署完成

## 🔧 方法二：使用 gh-pages 分支（更简单）

如果 GitHub Actions 有问题，可以使用传统方法：

### 步骤 1：构建项目

```bash
cd /Users/tom/Cursor/204
npm run build
```

### 步骤 2：部署到 gh-pages 分支

```bash
# 安装 gh-pages 工具
npm install --save-dev gh-pages

# 添加部署脚本到 package.json（我会帮你添加）
# 然后运行：
npm run deploy
```

### 步骤 3：在 GitHub 设置 Pages

1. 访问仓库 Settings → Pages
2. Source 选择 **gh-pages** 分支
3. 保存

## 🔧 方法三：使用 Netlify（最简单，推荐）

Netlify 通常不需要额外验证，部署更简单：

1. 访问 [https://www.netlify.com](https://www.netlify.com)
2. 点击 **"Sign up"** → 选择 **"GitHub"** 登录
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择你的仓库 `celltom/204tom`
5. 配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击 **"Deploy site"**
7. 等待 1-2 分钟，会得到一个地址如：`https://random-name.netlify.app`

## 📝 我已经更新了 workflow 文件

我已经在 workflow 中添加了 `enablement: true` 参数，这应该能自动启用 Pages。

请先尝试方法一，如果还是不行，使用方法三（Netlify）最简单可靠。

