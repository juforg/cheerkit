# CheerKit

<p align = "center">
<img alt="cheerkit" src="http://wntc.oss-cn-shanghai.aliyuncs.com/2019/7/21/1563695956026.png">
<br><br>


![GitHub All Releases](https://img.shields.io/github/downloads/juforg/cheerkit/total.svg) 
[![🚀 V2 Build](https://github.com/juforg/cheerkit/actions/workflows/release.yml/badge.svg?branch=v2)](https://github.com/juforg/cheerkit/actions/workflows/release.yml)

![GitHub Releases (by Asset)](https://img.shields.io/github/downloads/juforg/cheerkit/v0.2.0/cheerkit-setup-0.2.0.exe.svg)
![GitHub Releases (by Asset)](https://img.shields.io/github/downloads/juforg/cheerkit/v0.2.0/cheerkit-0.2.0.dmg.svg)
## 描述
程序员鼓励师 programmer cheerleaders ，支持Windows，Mac
定时提醒弹框提醒
node 10
# 计划
- [x] 静态图片 jpg
- [x] 动图 gif
- [ ] 视频 mp4

# 欢迎投递 鼓励用的资源
> 若侵权则删

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
```

### Compiles and minifies for production
```
npm run electron:build
```

### Lints and fixes files
```
npm run lint
```


### 激励的语句收集
- 你想拥有你从未有过的东西，那么你必须去做你从未做过的事！
- 思路比结论更重要
- 天赋决定了你能达到的上限，努力程度决定了你能达到的下限。以绝大多数人的努力程度之低，远远没有达到要去拼天赋的地步
- 没人在乎你的落魄，没人在乎你的低沉，更没人在乎你的孤单，但每个人都会仰视你的辉煌！
- 人生哪能多如意，万事只求半称心

- 做别人想做却做不了的事 
- 达则兼济天下，穷则独善其身


### 目录结构

├── assets // 其他资源
├── build // 构建
│   └── icons // 图标
│   └── win-unpacked // 未打包资源
├── dist_electron // 静态资源
│   ├── electron
│   │   └── main.js
│   └── web
├── src // 源码目录
│   ├── main // 主进程
│   │   ├── index.dev.js
│   │   └── index.js // 入口文件
│   ├── renderer // 渲染进程
│   │   ├── assets // 资源
│   │   ├── components // 公共组件目录
│   │   ├── router // 前端路由
│   │   ├── store // 状态管理
│   │   ├── views // 页面目录
│   │   ├── App.vue // 根组件
│   │   └── main.js // 入口文件
│   └── index.ejs
├── static // 纯静态资源
├── .babelrc
├── package-lock.json
├── package.json // 包配置文件
└── README.md // 项目介绍

### 鸣谢
- https://juejin.im/post/5bc53aade51d453df0447927
- https://www.jianshu.com/p/fca56d635091
- https://mp.weixin.qq.com/s/2omP9OQVE7YzNZCYb5Sjfg
- https://github.com/hilanmiao/NSIS-UI
- https://github.com/hilanmiao/Demo-Electron
- https://github.com/hilanmiao/LanMiaoDesktop
- https://github.com/fiahfy/picty
