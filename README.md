# MiniCloud - 云盘应用

一个基于 React + Firebase 的云盘应用，支持文件上传、下载、文件夹管理等功能。

## 功能特性

- 📁 文件夹管理：创建、浏览、删除文件夹
- 📤 文件上传：支持 PDF、PPT、图片、Word 等格式（最大 10MB）
- 📥 文件下载：快速下载已上传的文件
- 🗑️ 文件删除：删除不需要的文件和文件夹
- 👤 匿名登录：自动匿名登录，无需注册
- 📱 响应式设计：支持桌面和移动设备

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **后端**: Firebase (Firestore + Authentication)
- **图标**: Lucide React

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 运行。

### 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist/` 目录。

## 部署到 Vercel

### 方法一：通过 GitHub 自动部署

1. 将代码推送到 GitHub 仓库
2. 访问 [Vercel](https://vercel.com)
3. 使用 GitHub 账号登录
4. 点击 "New Project"
5. 导入你的 GitHub 仓库
6. Vercel 会自动检测项目配置并部署

### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel
```

## Firebase 配置

Firebase 配置已集成在 `src/firebase.js` 文件中。确保你的 Firebase 项目已启用：

- ✅ Firestore Database
- ✅ Authentication (匿名登录)
- ✅ Analytics (可选)

### Firestore 安全规则

为了确保应用正常工作，请在 Firebase Console 中设置以下 Firestore 安全规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/files/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Authentication 设置

在 Firebase Console 的 Authentication 部分，启用 "Anonymous" 登录方式。

## 项目结构

```
.
├── src/
│   ├── App.jsx          # 主应用组件
│   ├── main.jsx         # React 入口文件
│   ├── firebase.js      # Firebase 配置和初始化
│   └── index.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # Tailwind CSS 配置
├── vercel.json          # Vercel 部署配置
└── README.md            # 项目说明
```

## 许可证

MIT

