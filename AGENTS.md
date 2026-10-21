# AGENTS.md — my-personal-website

## 项目定位

llwwds 的个人网站：黑底白字、单页上下滚动的简历型展示页。短期纯静态，长期在同一壳内扩展个人博客与内容分享。

## 关键目录与入口

| 位置 | 作用 |
| --- | --- |
| `src/App.jsx` | 唯一主页编排；卡片内容数据在文件顶部 `CARDS` |
| `src/styles/global.css` | 设计变量（黑底白字）、section 骨架、hero 布局 |
| `src/styles/hero.css`、`src/styles/cards.css` | 两屏各自的排版与 16:9 / 9:16 适配 |
| `src/components/FluidGlass/` | 复刻的 React Bits Fluid Glass，**视为只读第三方源码** |
| `src/components/ReflectiveCard/` | 复刻的 React Bits Reflective Card，**视为只读第三方源码** |
| `src/assets/reflection-night.mp4` | Reflective Card 官方反光视频素材（构建时内联进单文件 HTML，**不要**放回 `public/`） |
| `THIRD_PARTY_NOTICES.md` | 复刻来源与许可证，改动复刻范围时必须同步 |

## 命令

```bash
npm install
npm run dev      # http://127.0.0.1:5183/
npm run build    # 产出单文件 dist/index.html（JS/CSS/字体/视频全内联）
npm run preview
```

无 lint、无测试脚本；改动的验证方式是 `npm run build` 通过 + 真实浏览器在 16:9 与 9:16 视口下截图核对，并对 `dist/index.html` 用 `file://` 直接打开做冒烟验证。

## 构建产物契约

`dist/index.html` 必须是**单文件自包含**的（`vite-plugin-singlefile` + `base: './'`），双击即可打开、可放到任意子目录。因此：

- 新增静态资源一律 `import` 进 JS（如 `import video from './assets/x.mp4'`），**不要**放 `public/`——`public/` 里的文件不会被内联，`file://` 下会 404。
- 不要移除 `viteSingleFile()`、不要改 `base` 为绝对路径、不要开 `cssCodeSplit`，否则"双击打开"能力会退化。
- 用浏览器验收时，**必须**验证 `file://.../dist/index.html`，不能只在 dev server 下看。

## 允许与禁止的改动

- **不修改复刻组件的内部实现**（着色器、物理参数、默认值）。用户要求的"复刻"意为 100% 照搬官方代码；调参只通过 `App.jsx` 传 props。
- 需要升级复刻组件时，重新从 reactbits.dev 的 Code 面板整份替换文件，不手工打补丁，并同步更新 `THIRD_PARTY_NOTICES.md`。
- 卡片文案与新增卡片：只改 `App.jsx` 的 `CARDS`。新增第 5 张及以后卡片需同步检查 `cards.css` 的横排/滚动布局。
- 不引入 CSS 框架或 UI 库替换现有排版；不把 `FluidGlass` / `ReflectiveCard` 改成 CDN 或外部依赖。
- 不引入后端、数据库、登录或构建期服务端渲染；本项目保持纯静态可托管。
- 秘密（token、密钥、账号）不得进入源码、README、`public/` 或任何提交内容。

## 适配契约

所有视觉改动必须在以下视口实测通过，不出现横向溢出、第二屏被裁切或卡片不可读：

| 比例 | 视口 |
| --- | --- |
| 16:9 | 1440×900、1920×1080、1280×720 |
| 9:16 | 390×844 |
| 极端 | 844×390（手机横屏）、768×1366 |

## 版本与 Git

- 版本号三段式（当前 `0.1.0.0`），tag 与 `package.json` / README 同步。
- 提交前确认 `dist/`、`node_modules/`、日志未进入暂存区。
- 未经用户当次明确授权，不 push、不发布、不部署。
