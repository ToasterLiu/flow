<h1 align="center"><a href="https://flowoss.com">Flow - Open Source Software (OSS)</a></h1>

<h2 align="center">Redefine ePub reader</h2>

<p align="center">Free. Open source. Browser-based.</p>

<h1 align="center"><a href="https://flowoss.com">Flow - 开源软件 (OSS)</a></h1>

<h2 align="center">重新定义 ePub 阅读器</h2>

<p align="center">免费。开源。基于浏览器。</p>

<p align="center"><img src="apps/website/public/screenshots/en-US.webp"/></p>

## 功能特点

- 网格布局
- 书籍内搜索
- 图片预览
- 自定义排版
- 高亮和注释
- 主题
- 通过链接分享/下载书籍
- 数据导出
- 云存储
- **AI 大语言模型 (LLM) 集成**：可以直接在阅读时选中文字询问AI，获取智能解释和总结

## 开发

### 先决条件

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/downloads)

### 克隆仓库

```bash
git clone https://github.com/pacexy/flow
```

### 安装依赖

```bash
pnpm i
```

### 项目工具栈

这个项目是一个基于 pnpm 和 Turborepo 的 JavaScript/TypeScript 单体仓库（monorepo）。主要工具包括：

- **pnpm** - 快速、节省磁盘空间的包管理器
- **Turborepo** - 高性能的 JavaScript/TypeScript 单体仓库构建系统
- **Next.js** - React 应用框架
- **React** - 用户界面库
- **TypeScript** - JavaScript 类型检查
- **Tailwind CSS** - CSS 框架
- **Docker** - 容器化平台
- **Husky** - Git hooks 管理
- 以及其他 [更多工具](#工具列表)

### 开发工作流程

#### 基础命令
```bash
# 基本开发（并行运行所有包的开发服务器）
pnpm dev

# 构建所有包
pnpm build

# 运行 lint 检查
pnpm lint

# 格式化代码
pnpm format

# 检查代码格式
pnpm format:check

# TypeScript 类型检查
pnpm type-check

# 清理构建产物
pnpm clean

# 完全清理（包括 node_modules）
pnpm clean-all
```

#### 工作区特定命令
```bash
# 为特定包运行开发命令
pnpm --filter reader run dev      # 只运行 reader 应用
pnpm --filter website run dev     # 只运行 website 应用
pnpm --filter epubjs run test     # 只运行 epubjs 包的测试
```

#### Docker 命令
```bash
# 构建 Docker 镜像
pnpm docker:build

# 启动 Docker 容器（后台运行）
pnpm docker:up

# 查看容器日志
pnpm docker:logs

# 重启容器
pnpm docker:restart

# 停止容器
pnpm docker:down
```

### 配置环境变量

将所有 `.env.local.example` 文件复制并重命名为 `.env.local`，然后设置环境变量。

在 `.env.local` 中，您可以配置 LLM 相关环境变量，例如：

```bash
NEXT_PUBLIC_LLM_API_BASE_URL=https://api.openai.com/v1/chat/completions
NEXT_PUBLIC_LLM_API_KEY=your_openai_api_key
NEXT_PUBLIC_LLM_MODEL_NAME=gpt-3.5-turbo
NEXT_PUBLIC_LLM_SYSTEM_PROMPT=You are a helpful assistant.
```

您也可以在应用程序设置页面中动态配置 LLM 参数。

### 运行应用

```bash
pnpm dev
```

## 自托管

自托管前，您需要[配置环境变量](#配置环境变量)。

### Docker

您可以使用 docker-compose：

```sh
docker compose up -d
```

或手动构建镜像并运行：

```sh
docker build -t flow .
docker run -p 3000:3000 --env-file apps/reader/.env.local flow
```

## 贡献

您可以通过多种方式参与此项目，例如：

- [提交错误和功能请求](https://github.com/pacexy/flow/issues/new)，并帮助我们验证它们
- [提交拉取请求](https://github.com/pacexy/flow/pulls)

## 工具列表

以下是项目中使用的所有工具的完整列表：

### 包管理与构建系统
- **pnpm** - 快速、节省磁盘空间的包管理器
- **Turborepo** - 高性能的 JavaScript/TypeScript 单体仓库构建系统
- **Webpack** - 模块打包工具 (用于 epubjs 包)
- **Babel** - 现代 JavaScript 特性编译器

### 后端与运行时
- **Node.js** - JavaScript 运行时环境

### 前端框架与库
- **Next.js** - 生产应用的 React 框架
- **React** - 用户界面构建库
- **React DOM** - React DOM 操作包
- **Recoil** - React 状态管理库
- **SWR** - React 数据获取库
- **Valtio** - 基于代理的状态管理库
- **Dexie** - IndexedDB 封装库
- **Dexie React Hooks** - Dexie 的 React hooks

### 样式与 UI
- **Tailwind CSS** - 实用优先的 CSS 框架
- **PostCSS** - CSS 处理工具
- **Autoprefixer** - CSS 厂商前缀添加器
- **clsx** - 条件构造 className 字符串的工具
- **react-icons** - React 图标组件
- **react-focus-lock** - 容器内焦点锁定工具
- **react-photo-view** - 图片查看器组件
- **react-cool-virtual** - 虚拟滚动解决方案
- **react-highlight-words** - 文本中高亮指定词汇
- **@literal-ui** - UI 组件库 (core, hooks, next)
- **M3 Tokens** - Material Design 3 设计令牌

### 数据与存储
- **LocalForage** - 离线存储库
- **JSZip** - 创建、读取和编辑 zip 文件
- **FileSaver** - 浏览器文件保存
- **UUID** - 唯一标识符生成器
- **Nookies** - Next.js cookie 工具

### 测试与质量
- **Husky** - Git hooks 管理器
- **Lint-staged** - 预提交钩子运行器
- **ESLint** - JavaScript 代码检查工具
- **Prettier** - 代码格式化工具
- **TypeScript** - JavaScript 类型检查
- **Mocha** - JavaScript 测试框架
- **Karma** - JavaScript 测试运行器

### 日期与时间
- **Day.js** - 时间/日期操作库

### 文件处理
- **@xmldom/xmldom** - XML DOM 解析器
- **Core-js** - JavaScript 标准库

### 国际化与 SEO
- **next-seo** - Next.js SEO 管理
- **next-translate** - Next.js 国际化

### 实用工具与帮助函数
- **Lodash** - 实用工具库
- **Event-emitter** - 事件处理模式
- **Marks-pane** - 文本测量工具
- **React-use** - React hooks 集合
- **Path-webpack** - 路径操作
- **@github/mini-throttle** - 节流工具

### 认证与外部服务
- **Dropbox** - Dropbox API 客户端
- **OpenAI** - OpenAI API 客户端库

### 监控
- **Sentry** - 错误跟踪和监控 (Next.js 集成)

### 构建与开发工具
- **Cross-env** - 跨平台环境变量设置
- **Terser-webpack-plugin** - Webpack JavaScript 压缩工具
- **Babel Loader** - Webpack Babel 加载器
- **Raw-loader** - Webpack 原始文本加载器
- **webpack-dev-server** - Webpack 开发服务器

### 文档
- **Documentation.js** - 文档生成器
- **JSDoc** - JavaScript 文档生成器
- **TSD-JSDoc** - TypeScript 声明文件的 JSDoc 工具链

### 类型定义
- **@types** - 各种库的 TypeScript 类型定义
  - node, react, react-dom, file-saver, uuid, localforage, react-highlight-words

### 开发工具 (全局)
- **Docker** - 容器化平台
- **Docker Compose** - 多容器 Docker 应用

---

## 致谢

- [Epub.js](https://github.com/futurepress/epub.js/)
- [React](https://github.com/facebook/react)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org)
- [Vercel](https://vercel.com)
- [Turborepo](https://turbo.build/repo)
- [OpenAI](https://openai.com) (用于 LLM 集成功能)
