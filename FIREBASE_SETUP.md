# Firebase 配置检查清单

如果网站一直显示"正在连接到云盘..."，请按照以下步骤检查：

## 1. 启用匿名登录

1. 访问 [Firebase Console](https://console.firebase.google.com)
2. 选择项目：`myclouddisk-5da65`
3. 点击左侧菜单的 **Authentication**
4. 点击 **Sign-in method** 标签
5. 找到 **Anonymous** 登录方式
6. 如果未启用，点击它并点击 **Enable**
7. 点击 **Save**

## 2. 配置 Firestore 数据库

1. 在 Firebase Console 中，点击左侧菜单的 **Firestore Database**
2. 如果还没有创建数据库：
   - 点击 **Create database**
   - 选择 **Start in test mode**（用于测试）
   - 选择区域（建议选择离你最近的）
   - 点击 **Enable**

## 3. 设置 Firestore 安全规则

1. 在 Firestore Database 页面，点击 **Rules** 标签
2. 将规则替换为以下内容：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许已认证用户读写 artifacts 集合
    match /artifacts/{appId}/public/data/files/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. 点击 **Publish**

## 4. 检查网络连接

- 确保你的网络可以访问 Firebase 服务
- 如果在中国大陆，可能需要配置代理或使用 Firebase 的国内镜像

## 5. 检查浏览器控制台

1. 按 `F12` 打开开发者工具
2. 查看 **Console** 标签中的错误信息
3. 常见错误：
   - `auth/operation-not-allowed` - 匿名登录未启用
   - `permission-denied` - Firestore 规则问题
   - 网络错误 - 检查网络连接

## 6. 测试步骤

完成上述配置后：
1. 刷新浏览器页面
2. 等待 10 秒，如果还是无法连接，会显示具体错误信息
3. 查看浏览器控制台的错误信息

## 快速测试

如果配置正确，你应该能看到：
- ✅ 页面加载后几秒内显示云盘界面
- ✅ 顶部显示用户 ID（匿名用户）
- ✅ 可以创建文件夹和上传文件

## 需要帮助？

如果按照以上步骤仍然无法连接，请：
1. 截图浏览器控制台的错误信息
2. 检查 Firebase Console 中的项目设置
3. 确认 Firebase 配置信息是否正确

