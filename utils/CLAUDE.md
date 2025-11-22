[根目录](../../CLAUDE.md) > **utils**

# Utils模块 - 工具函数库

## 变更记录 (Changelog)
- **2025-11-22 21:48:48** - 初始化utils模块文档

## 模块职责

utils模块是沟通大师项目的工具层，负责：
- Supabase客户端配置和管理
- 业务逻辑工具函数
- 数据处理和转换
- PDF生成和模板
- 表单存储管理
- 认证和授权工具

## 入口与启动

### 核心工具结构
```
utils/
├── supabase/             # Supabase相关工具
├── credits-utils.ts      # 积分系统工具
├── search-history-utils.ts # 搜索历史工具
├── pdf-templates/        # PDF生成模板
├── form-storage.ts       # 表单存储管理
├── utils.ts             # 通用工具函数
└── creem/               # Creem支付工具
```

### 主要工具文件
- `supabase/client.ts` - 客户端Supabase配置
- `supabase/server.ts` - 服务器端Supabase配置
- `credits-utils.ts` - 积分操作工具
- `search-history-utils.ts` - 搜索历史管理

## 对外接口

### Supabase工具 (`supabase/`)

#### 客户端配置 (`client.ts`)
```typescript
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
```

#### 服务器端配置 (`server.ts`)
- 创建服务器端Supabase客户端
- 用于API路由和服务器组件
- 支持服务角色权限

#### 中间件 (`middleware.ts`)
- 会话管理和更新
- 认证状态维护
- 路由保护逻辑

#### 服务角色 (`service-role.ts`)
- 管理员权限操作
- 数据库管理功能
- 系统级操作

#### 订阅工具 (`subscriptions.ts`)
- 订阅状态管理
- 订阅权限检查
- 订阅相关操作

### 业务工具函数

#### 积分工具 (`credits-utils.ts`)
- **功能**: 积分余额查询和消费
- **主要接口**:
  ```typescript
  export async function consumeCredits(
    userId: string,
    amount: number,
    description: string
  ): Promise<{ success: boolean; error?: string }>
  ```
- **特性**:
  - 积分余额验证
  - 积分消费记录
  - 事务处理
  - 错误处理

#### 搜索历史工具 (`search-history-utils.ts`)
- **功能**: 用户搜索历史记录管理
- **主要接口**:
  ```typescript
  export async function recordSearchHistory(
    userId: string,
    searchType: 'famous_person_search' | 'pronunciation_search' | 'other',
    searchQuery: string,
    searchResults: any
  ): Promise<void>
  ```
- **特性**:
  - 搜索类型分类
  - 结果数据存储
  - 用户关联
  - 元数据支持

#### PDF生成工具 (`pdf-templates/`)
- **name-certificate.ts**: 名字证书生成模板
- **功能**: 使用Puppeteer生成PDF证书
- **特性**:
  - 模板化设计
  - 动态内容插入
  - 样式自定义
  - 批量生成支持

#### 表单存储工具 (`form-storage.ts`)
- **功能**: 表单数据本地存储管理
- **特性**:
  - 本地存储读写
  - 表单状态持久化
  - 数据验证
  - 自动清理

#### 通用工具 (`utils.ts`)
- **encodedRedirect()**: 编码重定向工具
- **错误处理**: 统一错误处理格式
- **数据验证**: 通用数据验证函数
- **格式化工具**: 数据格式化函数

#### Creem支付工具 (`creem/`)
- **verify-signature.ts**: Webhook签名验证
- **功能**: 验证Creem webhook请求的真实性
- **特性**:
  - HMAC签名验证
  - 安全性检查
  - 错误处理

## 关键依赖与配置

### 内部依赖
- `@/types/*`: TypeScript类型定义
- `@/app/*`: 应用路由和动作

### 外部依赖
- `@supabase/ssr`: Supabase SSR支持
- `@supabase/supabase-js`: Supabase客户端
- `puppeteer`: PDF生成和浏览器自动化
- `zod`: 数据验证

### 环境变量依赖
```typescript
// Supabase配置
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

// Creem配置
CREEM_API_KEY
CREEM_WEBHOOK_SECRET
```

## 数据模型

### 积分系统数据
```typescript
interface CreditTransaction {
  id: string;
  customer_id: string;
  amount: number;
  type: 'add' | 'subtract';
  description: string;
  creem_order_id?: string;
  created_at: string;
  metadata: Record<string, any>;
}
```

### 搜索历史数据
```typescript
interface SearchHistoryRecord {
  id: string;
  user_id: string;
  customer_id: string;
  search_type: 'famous_person_search' | 'pronunciation_search' | 'other';
  search_query: string;
  search_results: Record<string, any>;
  search_date: string;
  metadata: Record<string, any>;
}
```

### 订阅数据
```typescript
interface Subscription {
  id: string;
  customer_id: string;
  creem_subscription_id: string;
  creem_product_id: string;
  status: 'incomplete' | 'expired' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  trial_end?: string;
  metadata: Record<string, any>;
}
```

## 测试与质量

### 单元测试
- 工具函数逻辑测试
- 数据转换验证
- 错误处理测试
- 边界条件测试

### 集成测试
- Supabase操作测试
- PDF生成测试
- 支付流程测试
- 数据库事务测试

### 安全测试
- 签名验证测试
- 权限控制测试
- 数据加密测试
- 输入验证测试

## 常见问题 (FAQ)

### Q: 如何添加新的工具函数？
A: 在相应的子目录下创建新文件，遵循现有的命名约定和代码风格，确保函数有完整的TypeScript类型定义。

### Q: 如何处理Supabase连接错误？
A: 使用try-catch包装所有Supabase操作，实现重试机制，并提供用户友好的错误消息。

### Q: 如何确保PDF生成的稳定性？
A: 实现错误处理和重试机制，监控Puppeteer进程，设置合理的超时时间。

### Q: 如何管理积分系统的事务一致性？
A: 使用数据库事务确保积分操作的原子性，实现适当的锁机制，记录详细的操作日志。

### Q: 如何验证webhook请求的真实性？
A: 使用HMAC签名验证，比较请求签名和计算签名，确保密钥安全存储。

## 相关文件清单

### Supabase工具
- `supabase/client.ts`
- `supabase/server.ts`
- `supabase/middleware.ts`
- `supabase/service-role.ts`
- `supabase/subscriptions.ts`

### 业务工具函数
- `credits-utils.ts`
- `search-history-utils.ts`
- `form-storage.ts`
- `utils.ts`

### PDF生成模板
- `pdf-templates/name-certificate.ts`

### 支付工具
- `creem/verify-signature.ts`

### 配置文件
- `config/subscriptions.ts`