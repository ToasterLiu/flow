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

## 致谢

- [Epub.js](https://github.com/futurepress/epub.js/)
- [React](https://github.com/facebook/react)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org)
- [Vercel](https://vercel.com)
- [Turborepo](https://turbo.build/repo)
- [OpenAI](https://openai.com) (用于 LLM 集成功能)
