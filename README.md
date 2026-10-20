# 我的个人网站

## llwwds 的话

**这个项目的意义是什么**

这是我的个人网站，用炫酷的前端呈现我的个人简历。它要解决的不是"没有网页"，而是"没有一个能代表我自己审美的入口"：黑底白字、只有一页上下滚动，第一屏是一块可以跟随鼠标流动的液态玻璃，第二屏横排四张金属反光卡片，用来放我的经历和项目作品。

短期内它是纯静态站点（无后端、无数据库、无登录），先把"好看且真能上线"这件事做完；后续再在同一套壳里加个人博客和内容分享（转载我喜欢的博客、我收集到的资料）。

**对你而言这个项目怎么用**

- 本地看效果：装依赖后 `npm run dev`，浏览器打开终端打印的地址。
- 改内容：卡片文案集中在 `src/App.jsx` 顶部的 `CARDS` 数组，改完保存即热更新。
- 上线：`npm run build` 产出 `dist/`，把这一个目录丢到任意静态托管（GitHub Pages / Cloudflare Pages / Nginx）即可。

## How to start（for your agent）

前置条件：Node.js ≥ 20（本项目在 Node v24.19.0 上验证）、npm ≥ 10。

```bash
cd <本仓库根目录>
npm install
npm run dev      # 开发服务器，默认 http://127.0.0.1:5183/
npm run build    # 生产构建，产物在 dist/
npm run preview  # 本地预览 dist/
```

最小验证：打开 `http://127.0.0.1:5183/`，第一屏应出现大号白色 "llwwds" 字样与被它折射的液态玻璃，鼠标移动时玻璃跟随；向下滚动一屏应看到 4 张金属反光卡片。控制台无报错即通过。

注意：5173 端口已被本机其他服务占用，本项目固定使用 5183。

## 文件夹定义

```
我的个人网站/
├── index.html                      # Vite 入口 HTML，站点 <title> 与 favicon 在此
├── vite.config.js                  # Vite + React 插件配置，dev 端口固定 5183
├── package.json                    # 依赖与脚本；版本号与 tag 同步维护
├── src/
│   ├── main.jsx                    # React 挂载入口，加载全局样式与 Geist 字体
│   ├── App.jsx                     # 唯一主页：第一屏 Fluid Glass + 第二屏 4 张卡片；卡片数据在顶部 CARDS
│   ├── styles/
│   │   ├── global.css              # 设计变量（黑底白字）、section 骨架、hero 布局
│   │   ├── hero.css                # 第一屏专属覆盖（字体、字号策略）
│   │   └── cards.css               # 第二屏排版与 16:9 / 9:16 两套适配
│   └── components/
│       ├── FluidGlass/             # 复刻 React Bits Fluid Glass（JS + CSS）
│       └── ReflectiveCard/         # 复刻 React Bits Reflective Card（JS + CSS）
├── public/
│   ├── videos/reflection-night.mp4 # Reflective Card 官方反光视频
│   └── favicon.svg
├── THIRD_PARTY_NOTICES.md          # 复刻组件与素材的来源、许可证原文
└── AGENTS.md                       # Agent 在本项目内的工作契约
```

不进入版本管理：`node_modules/`、`dist/`、`.vite/`、日志、本地 `.env*`（见 `.gitignore`）。

## 设计思路讲解

### 核心架构决策

1. **Vite + React 单页，不引路由**。当前只有一个主页面，上下滚动即可；将来加博客时再引入路由层，避免现在为假想需求付代价。
2. **组件"原样复刻"而非"参考重写"**。Fluid Glass 与 Reflective Card 的 JS/CSS 直接取自 reactbits.dev 页面 Code 面板（本地仅改文件名），因此 WebGL 着色器、物理惯性和默认参数与官网完全一致；想调参只通过 props 传值，不改组件内部逻辑。
3. **纯静态**。所有渲染都在浏览器内完成（两块 WebGL2 canvas），没有服务端依赖，`dist/` 可直接托管。
4. **样式分三层**：`global.css` 定义变量与骨架，`hero.css` / `cards.css` 只做对应屏的排版覆盖。复刻组件的 CSS 保持原样，不被全局样式污染（作用域限定在 `.hero__stage` 内）。

### 数据流

```
index.html
  → src/main.jsx（挂载 + 字体 + 全局样式）
    → App.jsx
        ├─ CARDS 常量（卡片文案/条目，未来接 Markdown 或 API 的位置）
        ├─ useCardSize()（读视口宽高 → 计算卡片像素尺寸）
        ├─ <FluidGlass text="llwwds" .../>  → WebGL2 canvas：文字纹理 + 液态玻璃折射
        └─ <ReflectiveCard .../> ×4         → 每卡一个 WebGL2 canvas：视频纹理 → 模糊/金属化 → 倾斜反光
```

两块组件都自己监听 `ResizeObserver` / `IntersectionObserver`，离开视口或页面隐藏时停止动画循环。

### 16:9 与 9:16 两套适配

| 屏幕 | 第一屏 | 第二屏 |
| --- | --- | --- |
| 横向（16:9 及更宽） | 占满一屏，玻璃与文字按容器宽度自适应 | 4 张卡片同排、一屏内完整可见；卡片宽度由 `useCardSize()` 在"可用宽度 / 4"和"可用高度"之间取小值 |
| 竖向（9:16 及更窄） | 占满一屏，玻璃尺寸随容器收缩 | 卡片保持可读尺寸，改为横向滚动 + 吸附（scroll-snap），一次看 1.2 张 |

矮屏（高度 < 620px，如手机横屏）额外压缩标题与留白，并隐藏提示行，保证第二屏仍能整屏看全。

### 模块耦合关系

- `App.jsx` 是唯一的编排层，持有卡片数据与尺寸计算；两个组件只吃 props，互不依赖。
- 组件内部状态（鼠标位置、动画帧）不外泄，父层不需要也不应该感知；替换卡片内容只动 `CARDS`，不需要碰组件。
- 未来加博客时，建议在 `App.jsx` 之外新增路由层，`FluidGlass` / `ReflectiveCard` 可原样复用为博客首页视觉。

## 当前版本状态

- 版本：`v0.1.0.0`
- 稳定性：可运行、可构建；第一屏与第二屏在两个比例下均已实测（1440×900、1920×1080、1280×720、844×390、390×844）。
- 已知局限：
  - 卡片内容是 Reflective Card 官方示例文案（`Alexander Doe / Senior Developer / 8901 2345 6789`），等待替换为真实经历与作品。
  - 暂无博客、文章列表、导航、页脚与 SEO/OG 元信息。
  - 无自动化测试；验证方式为真实浏览器截图核对。
- 未支持：多页面路由、暗色/亮色切换、CMS 或后端接口。

## 文档入口

- 复刻来源与许可证：`THIRD_PARTY_NOTICES.md`
- Agent 工作契约：`AGENTS.md`
