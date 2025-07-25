# 简陋的在线 Android 工具箱

## 功能

- [x] ProGuard 反混淆工具
- [x] Qualcomm Splash.img 生成工具
- [x] Android bootanimation.zip 生成工具
- [ ] 在线ADB工具
- [ ] 获取APK签名证书指纹
- [ ] 其他

## 技术栈

- Next.js 15
- TypeScript 5
- React 19
- Tailwind CSS 4

## 部署

```bash
apt install google-android-cmdline-tools-11.0-installer

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

git clone https://github.com/halifox/android_tools.git
cd android_tools

npm install
npm run build
npm run start
```

## 许可证

本项目遵循 [GPL-3.0 License](LICENSE)。