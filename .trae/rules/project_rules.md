# 沟通大师 - AI中文学习平台

## 变更记录 (Changelog)
- **2025-11-22 21:48:48** - 初始化AI上下文文档，完成项目架构分析和模块识别

## 项目愿景

沟通大师是一个基于AI的中文学习平台，专注于帮助用户通过创新的发音联想方法快速掌握中文。平台结合了现代Web技术、人工智能和个性化学习体验，为全球中文学习者提供高效、有趣的学习工具。

## 架构总览

### 技术栈
- **前端框架**: Next.js 15.1.7 (App Router)
- **开发语言**: TypeScript 5.7.2
- **UI框架**: React 19.0.0
- **样式**: Tailwind CSS 3.4.17 + Radix UI
- **动画**: Framer Motion 12.23.11
- **后端服务**: Supabase (数据库、认证、存储)
- **AI服务**: OpenAI/OpenRouter API
- **支付系统**: Creem.io
- **PDF生成**: Puppeteer 24.15.0

### 核心功能模块
1. **AI中文名字生成器** - 基于用户信息生成个性化中文名字
2. **中文发音学习工具** - 通过英文单词联想学习中文发音
3. **用户认证与授权** - 基于Supabase的完整身份验证系统
4. **订阅与积分系统** - 与Creem.io集成的支付和计费系统
5. **头像生成器** - AI驱动的个性化头像生成
6. **学习历史追踪** - 完整的用户学习记录和进度管理

## 模块索引

| 模块路径 | 职责描述 | 技术栈 | 主要文件 |
|---------|---------|-------|---------|
| `app/` | Next.js应用路由和页面 | Next.js 15, React 19, TypeScript | `layout.tsx`, `page.tsx`, `actions.ts` |
| `components/` | React组件库 | React, Radix UI, Tailwind CSS | `ui/`, `dashboard/`, `product/` |
| `utils/` | 工具函数和配置 | TypeScript, Supabase SSR | `supabase/`, `credits-utils.ts` |
| `supabase/` | 数据库迁移和脚本 | PostgreSQL, SQL | `migrations/`, `scripts/` |
| `hooks/` | 自定义React Hooks | React, TypeScript | `use-credits.ts`, `use-subscription.ts` |
| `types/` | TypeScript类型定义 | TypeScript | `creem.ts`, `subscriptions.ts` |

## 运行与开发

### 环境要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户
- Creem.io 账户
- OpenAI/OpenRouter API Key

### 快速启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 环境变量配置
```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的服务角色密钥

# Creem配置
CREEM_API_KEY=你的creem key
CREEM_WEBHOOK_SECRET=你的webhook密钥
CREEM_API_URL=https://test-api.creem.io/v1

# AI服务配置
OPENAI_API_KEY=你的OpenAI密钥
OPENROUTER_API_KEY=你的OpenRouter密钥

# 站点配置
NEXT_PUBLIC_SITE_URL=http://你的线上地址
CREEM_SUCCESS_URL=http://你的线上地址/dashboard
```

## 测试策略

### 单元测试
- 使用Jest进行组件和工具函数测试
- 测试覆盖率达到80%以上
- 重点测试认证、支付、AI集成等核心功能

### 集成测试
- Supabase数据库操作测试
- API路由端到端测试
- 支付流程集成测试

### 用户界面测试
- 使用Playwright进行端到端UI测试
- 响应式设计测试
- 用户交互流程测试

## 编码规范

### TypeScript规范
- 严格模式启用所有类型检查
- 使用接口定义数据结构
- 避免使用`any`类型，优先使用具体类型

### React规范
- 使用函数组件和Hooks
- 组件文件使用PascalCase命名
- 自定义Hooks以`use`开头

### 样式规范
- 使用Tailwind CSS类名
- 遵循BEM命名约定
- 响应式设计优先

### 代码组织
- 按功能模块组织代码
- 组件、页面、工具函数分离
- 使用绝对路径导入`@/`别名

## AI使用指引

### AI集成点
1. **中文名字生成** - 使用Gemini 2.5 Flash模型
2. **发音匹配** - 使用GPT-4进行中英文发音分析
3. **头像生成** - 集成DALL-E或Stable Diffusion
4. **个性化推荐** - 基于用户学习历史提供智能建议

### 提示词工程
- 使用结构化提示词确保输出一致性
- 实现降级机制处理AI服务不可用情况
- 记录AI调用日志用于分析和优化

### 成本控制
- 实施积分系统控制AI使用量
- 为免费用户提供每日使用限制
- 批量处理减少API调用成本

## 部署与运维

### 生产环境部署
- 推荐使用Vercel进行部署
- 配置环境变量和域名
- 设置CDN加速静态资源

### 监控与日志
- 使用Supabase内置监控
- 实施错误追踪和性能监控
- 定期备份数据库

### 安全考虑
- 实施行级安全策略(RLS)
- 验证所有用户输入
- 定期更新依赖包修复安全漏洞

## 相关链接
- [Supabase文档](https://supabase.com/docs)
- [Next.js文档](https://nextjs.org/docs)
- [Creem.io文档](https://docs.creem.io)
- [OpenAI API文档](https://platform.openai.com/docs)