[根目录](../../CLAUDE.md) > **types**

# Types模块 - TypeScript类型定义

## 变更记录 (Changelog)
- **2025-11-22 21:48:48** - 初始化types模块文档

## 模块职责

types模块是沟通大师项目的类型定义层，负责：
- 全局TypeScript类型定义
- API接口类型规范
- 数据模型类型声明
- 第三方服务类型集成
- 类型安全性和开发体验优化

## 入口与启动

### 核心类型结构
```
types/
├── creem.ts            # Creem支付服务类型
├── subscriptions.ts    # 订阅系统类型
└── (其他类型文件...)
```

### 主要类型文件
- `creem.ts` - Creem.io支付服务相关类型
- `subscriptions.ts` - 订阅系统相关类型

## 对外接口

### Creem支付服务类型 (`creem.ts`)

#### 功能
- 定义Creem.io API请求和响应类型
- 支付产品和订阅类型
- Webhook事件类型
- 错误类型定义

#### 核心类型定义
```typescript
// Creem产品类型
export interface CreemProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'subscription' | 'credits';
  metadata?: Record<string, any>;
}

// 支付会话类型
export interface CreemCheckoutSession {
  id: string;
  checkout_url: string;
  product_id: string;
  customer: {
    email: string;
    name?: string;
  };
  metadata?: Record<string, any>;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  expires_at: string;
}

// 客户类型
export interface CreemCustomer {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

// 订阅类型
export interface CreemSubscription {
  id: string;
  customer_id: string;
  product_id: string;
  status: 'incomplete' | 'expired' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  trial_end?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Webhook事件类型
export interface CreemWebhookEvent {
  id: string;
  type: 'checkout.completed' | 'subscription.created' | 'subscription.updated' | 'subscription.canceled';
  data: CreemCheckoutSession | CreemSubscription;
  created_at: string;
}

// API错误类型
export interface CreemError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

#### 使用示例
```typescript
import type { CreemCheckoutSession, CreemWebhookEvent } from '@/types/creem';

// 处理webhook事件
function handleWebhook(event: CreemWebhookEvent) {
  switch (event.type) {
    case 'checkout.completed':
      const session = event.data as CreemCheckoutSession;
      // 处理支付完成
      break;
    case 'subscription.created':
      const subscription = event.data as CreemSubscription;
      // 处理订阅创建
      break;
  }
}
```

### 订阅系统类型 (`subscriptions.ts`)

#### 功能
- 定义订阅计划和功能类型
- 订阅状态和权限类型
- 积分系统类型
- 订阅配置类型

#### 核心类型定义
```typescript
// 订阅计划类型
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: SubscriptionFeature[];
  metadata?: Record<string, any>;
}

// 订阅功能类型
export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  unit?: string;
}

// 用户订阅状态类型
export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  trial_end?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// 订阅权限类型
export interface SubscriptionPermissions {
  canAccessPremiumFeatures: boolean;
  maxGenerationsPerDay: number;
  hasPrioritySupport: boolean;
  canExportData: boolean;
  customFeatures: Record<string, boolean | number>;
}

// 积分类型
export interface CreditsPackage {
  id: string;
  name: string;
  description: string;
  credits: number;
  price: number;
  currency: string;
  bonus_credits?: number;
  metadata?: Record<string, any>;
}

// 积分交易类型
export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'add' | 'subtract';
  description: string;
  balance_after: number;
  reference_id?: string;
  reference_type?: 'purchase' | 'usage' | 'bonus' | 'refund';
  metadata?: Record<string, any>;
  created_at: string;
}

// 积分余额类型
export interface CreditBalance {
  user_id: string;
  balance: number;
  last_updated: string;
  metadata?: Record<string, any>;
}
```

#### 使用示例
```typescript
import type {
  SubscriptionPlan,
  UserSubscription,
  SubscriptionPermissions,
  CreditsPackage
} from '@/types/subscriptions';

// 检查用户权限
function checkUserPermissions(subscription: UserSubscription): SubscriptionPermissions {
  const plan = getSubscriptionPlan(subscription.plan_id);

  return {
    canAccessPremiumFeatures: subscription.status === 'active',
    maxGenerationsPerDay: plan.features.find(f => f.id === 'generations')?.limit || 10,
    hasPrioritySupport: plan.features.some(f => f.id === 'priority_support'),
    canExportData: plan.features.some(f => f.id === 'export'),
    customFeatures: {}
  };
}

// 计算积分包价值
function calculateCreditsValue(package: CreditsPackage): number {
  const totalCredits = package.credits + (package.bonus_credits || 0);
  return totalCredits / package.price; // 每单位货币的积分
}
```

## 关键依赖与配置

### 内部依赖
- `zod`: 数据验证和类型推断
- `@/utils/*`: 工具函数类型

### 外部依赖
- TypeScript 5.7.2
- 第三方服务SDK类型定义

### 类型生成工具
- 如果使用类型生成工具，相关配置文件

## 类型安全策略

### 严格类型检查
```typescript
// tsconfig.json中的严格模式配置
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true
  }
}
```

### 类型验证
- 使用Zod进行运行时类型验证
- API请求和响应类型安全
- 数据库操作类型安全
- 组件Props类型安全

### 类型继承和组合
```typescript
// 基础响应类型
export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

// API响应类型
export interface ApiResponse<T> extends BaseResponse {
  data?: T;
  error?: string;
  code?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

## 测试与质量

### 类型测试
- 类型兼容性测试
- 接口实现测试
- 泛型约束测试
- 类型推断测试

### 数据验证测试
- Zod Schema测试
- API响应验证测试
- 表单数据验证测试
- 数据库记录验证测试

### 集成测试
- 类型与实际数据匹配测试
- 第三方API类型兼容性测试
- 前后端类型一致性测试

## 最佳实践

### 类型设计原则
- 明确性优于简洁性
- 优先使用接口而非类型别名
- 合理使用泛型和条件类型
- 保持类型定义的可维护性

### 类型组织策略
- 按功能模块组织类型
- 避免循环依赖
- 使用命名空间避免冲突
- 提供完整的类型文档

### 类型安全模式
- 使用联合类型替代可选字段
- 使用字面量类型约束值范围
- 使用模板类型进行类型转换
- 使用守卫函数进行类型收窄

## 常见问题 (FAQ)

### Q: 如何添加新的类型定义？
A: 在相应的类型文件中添加新的接口或类型，遵循现有的命名约定，提供完整的类型文档。

### Q: 如何处理第三方API的类型？
A: 创建专门的类型文件定义第三方API的类型，定期更新以匹配API变更，使用适当的类型转换。

### Q: 如何确保类型安全？
A: 启用TypeScript严格模式，使用Zod进行运行时验证，编写类型测试，定期检查类型错误。

### Q: 如何处理复杂的数据类型？
A: 使用组合模式构建复杂类型，使用泛型提高类型复用性，使用工具类型简化类型操作。

### Q: 如何维护类型定义的更新？
A: 建立类型变更的版本控制，定期审查和重构类型定义，保持与实际代码的同步更新。

## 相关文件清单

### 核心类型文件
- `creem.ts`
- `subscriptions.ts`

### 扩展类型文件
- `user.ts` (如果存在)
- `api.ts` (如果存在)
- `database.ts` (如果存在)
- `components.ts` (如果存在)

### 工具类型
- `utils.ts` (如果存在)
- `generics.ts` (如果存在)
- `validators.ts` (如果存在)

### 配置文件
- `tsconfig.json`
- `package.json` (TypeScript相关配置)