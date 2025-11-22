[根目录](../../CLAUDE.md) > **app**

# App模块 - Next.js应用路由

## 变更记录 (Changelog)
- **2025-11-22 21:48:48** - 初始化app模块文档

## 模块职责

app模块是沟通大师项目的核心应用层，基于Next.js 15 App Router架构，负责：
- 页面路由和布局管理
- API端点实现
- 用户认证和授权
- 核心业务逻辑处理
- 服务器组件和客户端组件的协调

## 入口与启动

### 根布局 (`layout.tsx`)
- **文件路径**: `e:\Project\沟通大师\app\layout.tsx`
- **主要功能**:
  - 应用全局布局结构
  - 主题切换支持 (next-themes)
  - 用户认证状态管理
  - 元数据配置 (SEO优化)
  - 字体配置 (Geist字体)

### 首页 (`page.tsx`)
- **文件路径**: `e:\Project\沟通大师\app\page.tsx`
- **主要功能**:
  - 应用主页展示
  - 发音学习工具集成
  - 响应式设计实现
  - Framer Motion动画效果

### 服务器动作 (`actions.ts`)
- **文件路径**: `e:\Project\沟通大师\app\actions.ts`
- **主要功能**:
  - 用户注册/登录/登出
  - 密码重置功能
  - Creem支付会话创建
  - 服务器端数据处理

## 对外接口

### 认证页面组 (`(auth-pages)/`)
- **sign-in/page.tsx**: 用户登录页面
- **sign-up/page.tsx**: 用户注册页面
- **forgot-password/page.tsx**: 忘记密码页面
- **layout.tsx**: 认证页面布局

### 仪表板模块 (`dashboard/`)
- **page.tsx**: 用户主仪表板
- **reset-password/page.tsx**: 密码重置页面

### 产品功能模块 (`product/`)
- **random-generator/page.tsx**: 随机名字生成器
- **about/page.tsx**: 产品介绍页面

### API路由 (`api/`)

#### 支付系统API
- **api/creem/create-checkout/route.ts**: 创建支付会话
- **api/creem/customer-portal/route.ts**: 客户门户
- **api/webhooks/creem/route.ts**: Creem webhook处理

#### 积分系统API
- **api/credits/route.ts**: 积分余额查询


## 关键依赖与配置

### 内部依赖
- `@/utils/supabase/*`: Supabase客户端配置
- `@/components/*`: React组件
- `@/hooks/*`: 自定义Hooks
- `@/types/*`: TypeScript类型定义

### 外部依赖
- `@supabase/ssr`: 服务器端Supabase集成
- `@supabase/supabase-js`: Supabase客户端
- `next`: Next.js框架
- `react`: React框架
- `zod`: 数据验证

## 数据模型

### 用户认证数据
- 通过Supabase Auth管理用户身份
- 支持邮箱密码和OAuth登录
- 会话管理通过中间件处理

### 业务数据
- **customers**: 用户客户信息
- **subscriptions**: 订阅状态
- **credits_history**: 积分交易记录

## 测试与质量

### 单元测试
- 测试服务器动作的正确性
- 验证API路由的输入输出
- 检查认证和授权逻辑

### 集成测试
- Supabase数据库操作测试
- 支付流程端到端测试
- AI服务集成测试

### 错误处理
- 统一的错误响应格式
- 适当的HTTP状态码
- 用户友好的错误消息
- 详细的错误日志记录

## 常见问题 (FAQ)

### Q: 如何添加新的API路由？
A: 在`app/api/`目录下创建新的文件夹和`route.ts`文件，遵循RESTful API设计原则。

### Q: 如何保护需要认证的页面？
A: 使用中间件进行认证检查，或者在页面组件中使用`createClient()`验证用户状态。

### Q: 如何处理AI服务的错误？
A: 实现降级机制，当AI服务不可用时提供备用方案，并记录详细的错误日志。

### Q: 如何优化页面加载性能？
A: 使用Next.js的静态生成(SSG)和服务器端渲染(SSR)特性，优化图片和资源加载。

## 相关文件清单

### 页面文件
- `layout.tsx` - 根布局
- `page.tsx` - 首页
- `actions.ts` - 服务器动作
- `middleware.ts` - 中间件

### 认证页面
- `(auth-pages)/layout.tsx`
- `(auth-pages)/sign-in/page.tsx`
- `(auth-pages)/sign-up/page.tsx`
- `(auth-pages)/forgot-password/page.tsx`

### 仪表板页面
- `dashboard/page.tsx`
- `dashboard/reset-password/page.tsx`

### 产品页面
- `product/random-generator/page.tsx`
- `product/about/page.tsx`

### API路由
- `api/chinese-names/generate/route.ts`
- `api/pronunciation/route.ts`
- `api/creem/create-checkout/route.ts`
- `api/creem/customer-portal/route.ts`
- `api/webhooks/creem/route.ts`
