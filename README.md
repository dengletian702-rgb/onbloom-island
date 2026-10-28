# 花屿 · Onbloom Island

以 AI 为起点，连接商业、营销和艺术的知识库与共学社区。

**在线访问：[花屿 Onbloom Island](https://dengletian702-rgb.github.io/onbloom-island/)**

## 内容

- AI 编年史、主题阅读、书架与提示词资料。
- 学习笔记与简历提示词工具。
- 原创漫画《一朵跟着走的花》与简历方法说明页。

## 本地运行

这是原生 HTML、CSS、JavaScript 静态网站，无须安装依赖或构建。

```sh
python3 -m http.server 8000
```

打开 <http://localhost:8000/>。请使用 HTTP 服务运行，以便漫画阅读器加载 `story.json`。

## 部署

仓库通过 GitHub Pages 从 `main` 分支的根目录发布。HTML、CSS、JavaScript 和图片直接作为网站文件使用；`.nojekyll` 关闭 Jekyll 处理。站内使用相对路径和 hash 路由，支持项目子路径部署。

## 数据与功能范围

笔记、收藏、学习记录和简历输入保存在当前浏览器的 `localStorage` 中。此版本没有服务端账号、跨设备同步或共享社区数据库；浏览器中的个人输入不会写入 GitHub 仓库。更换浏览器或域名不会自动迁移记录。

## 目录

```text
index.html              主站
app.js                  页面交互与本地数据
books.js                书架资料
chronicle.js            AI 编年史
styles.css / theme.css  样式
motion.js               动效
assets/                 站点插画、角色和纹理
comic-v3/               当前漫画阅读器和插画
resume-method/          简历方法说明页
```

发布目录保留当前网站使用的素材，未包含历史漫画、内部讨论原始文件、本机调度工具或个人配置。

## 开源与来源

本站原创代码及本站提供的原创素材采用 [MIT License](LICENSE)。插画与漫画在制作时使用了 AI 绘图工具。书籍、论文、引用资料和链接指向的第三方内容仍归原权利人所有，不受本站许可证授权。

简历方法参考 career-ops；相关作者、来源与许可说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 及站内说明页。
