[根目录](../../CLAUDE.md) > **config**

# Config模块 - 配置管理

## 变更记录 (Changelog)
- **2025-11-22 21:48:48** - 初始化config模块文档

## 模块职责

config模块是沟通大师项目的配置管理层，负责：
- 应用程序配置管理
- 环境变量配置
- 第三方服务配置
- 功能开关和特性配置
- 开发和生产环境配置分离

## 入口与启动

### 配置文件结构
```
config/
├── subscriptions.ts    # 订阅系统配置
└── (其他配置文件...)
```

### 主要配置文件
- `subscriptions.ts` - 订阅计划和积分配置

## 对外接口

### 订阅系统配置 (`subscriptions.ts`)

#### 功能
- 定义订阅计划和价格
- 配置积分包和价格
- 管理功能权限
- 配置支付相关参数

#### 配置内容
```typescript
// 订阅计划配置
export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic-monthly',
    name: '基础月费',
    description: '适合个人学习者的基础方案',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    creem_product_id: 'prod_basic_monthly',
    features: [
      {
        id: 'generations',
        name: '名字生成',
        description: '每月可生成30个中文名字',
        limit: 30,
        unit: '个/月'
      },
      {
        id: 'pronunciation',
        name: '发音学习',
        description: '无限次发音学习',
        included: true
      },
      {
        id: 'support',
        name: '邮件支持',
        description: '工作日邮件技术支持',
        included: true
      }
    ],
    metadata: {
      popular: false,
      recommended: false
    }
  },
  {
    id: 'premium-monthly',
    name: '高级月费',
    description: '适合专业学习者的完整方案',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    creem_product_id: 'prod_premium_monthly',
    features: [
      {
        id: 'generations',
        name: '名字生成',
        description: '每月可生成100个中文名字',
        limit: 100,
        unit: '个/月'
      },
      {
        id: 'premium_generations',
        name: '高级名字生成',
        description: 'AI驱动的个性化名字生成',
        included: true
      },
      {
        id: 'pronunciation',
        name: '发音学习',
        description: '无限次发音学习',
        included: true
      },
      {
        id: 'avatar_generation',
        name: '头像生成',
        description: '每月可生成5个个性化头像',
        limit: 5,
        unit: '个/月'
      },
      {
        id: 'priority_support',
        name: '优先支持',
        description: '24小时优先技术支持',
        included: true
      },
      {
        id: 'export_data',
        name: '数据导出',
        description: '支持导出学习数据',
        included: true
      }
    ],
    metadata: {
      popular: true,
      recommended: true
    }
  },
  {
    id: 'premium-yearly',
    name: '高级年费',
    description: '最优惠的年度方案',
    price: 199.99,
    currency: 'USD',
    interval: 'year',
    creem_product_id: 'prod_premium_yearly',
    features: [
      {
        id: 'generations',
        name: '名字生成',
        description: '每月可生成150个中文名字',
        limit: 150,
        unit: '个/月'
      },
      {
        id: 'premium_generations',
        name: '高级名字生成',
        description: 'AI驱动的个性化名字生成',
        included: true
      },
      {
        id: 'pronunciation',
        name: '发音学习',
        description: '无限次发音学习',
        included: true
      },
      {
        id: 'avatar_generation',
        name: '头像生成',
        description: '每月可生成10个个性化头像',
        limit: 10,
        unit: '个/月'
      },
      {
        id: 'priority_support',
        name: '优先支持',
        description: '24小时优先技术支持',
        included: true
      },
      {
        id: 'export_data',
        name: '数据导出',
        description: '支持导出学习数据',
        included: true
      }
    ],
    metadata: {
      popular: false,
      recommended: false,
      discount: '17% OFF'
    }
  }
];

// 积分包配置
export const CREDITS_PACKAGES = [
  {
    id: 'credits-small',
    name: '小额积分包',
    description: '适合偶尔使用的用户',
    credits: 10,
    price: 4.99,
    currency: 'USD',
    creem_product_id: 'prod_credits_small',
    bonus_credits: 0,
    metadata: {
      popular: false
    }
  },
  {
    id: 'credits-medium',
    name: '中额积分包',
    description: '最受欢迎的积分包',
    credits: 25,
    price: 9.99,
    currency: 'USD',
    creem_product_id: 'prod_credits_medium',
    bonus_credits: 5,
    metadata: {
      popular: true,
      value: '20% BONUS'
    }
  },
  {
    id: 'credits-large',
    name: '大额积分包',
    description: '适合重度用户的最佳选择',
    credits: 50,
    price: 19.99,
    currency: 'USD',
    creem_product_id: 'prod_credits_large',
    bonus_credits: 15,
    metadata: {
      popular: false,
      value: '30% BONUS'
    }
  },
  {
    id: 'credits-xlarge',
    name: '超大额积分包',
    description: '专业用户的超值选择',
    credits: 100,
    price: 39.99,
    currency: 'USD',
    creem_product_id: 'prod_credits_xlarge',
    bonus_credits: 40,
    metadata: {
      popular: false,
      value: '40% BONUS'
    }
  }
];

// 功能权限配置
export const FEATURES_CONFIG = {
  // 免费用户功能
  free: {
    daily_generations_limit: 3,
    can_save_names: false,
    can_export_data: false,
    has_priority_support: false,
    max_search_history: 10
  },
  // 基础订阅功能
  basic: {
    daily_generations_limit: 30,
    can_save_names: true,
    can_export_data: false,
    has_priority_support: false,
    max_search_history: 100
  },
  // 高级订阅功能
  premium: {
    daily_generations_limit: 100,
    can_save_names: true,
    can_export_data: true,
    has_priority_support: true,
    max_search_history: 1000
  }
};

// 支付配置
export const PAYMENT_CONFIG = {
  // 支持的货币
  supported_currencies: ['USD', 'CNY', 'EUR'],
  // 默认货币
  default_currency: 'USD',
  // 支付超时时间（分钟）
  payment_timeout: 30,
  // 重试次数
  max_retry_attempts: 3,
  // Webhook验证
  webhook_secret: process.env.CREEM_WEBHOOK_SECRET,
  // 成功重定向URL
  success_url: process.env.CREEM_SUCCESS_URL || 'http://localhost:3000/dashboard'
};

// AI服务配置
export const AI_CONFIG = {
  // OpenAI配置
  openai: {
    model: 'gpt-4',
    max_tokens: 2000,
    temperature: 0.7,
    timeout: 30000
  },
  // OpenRouter配置
  openrouter: {
    model: 'google/gemini-2.5-flash',
    max_tokens: 1200,
    temperature: 0.8,
    timeout: 30000
  },
  // 免费用户限制
  free_user_limits: {
    daily_requests: 10,
    request_timeout: 10000
  }
};

// 应用配置
export const APP_CONFIG = {
  // 站点信息
  site: {
    name: '沟通大师',
    description: 'AI驱动的中文学习平台',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: '/logo.png',
    favicon: '/favicon.ico'
  },
  // SEO配置
  seo: {
    title: '沟通大师 - AI中文学习平台',
    description: '通过AI技术快速学习中文，包括名字生成、发音学习等功能',
    keywords: ['中文学习', 'AI学习', '中文名字', '发音学习'],
    author: '沟通大师团队'
  },
  // 功能开关
  features: {
    enable_registration: true,
    enable_premium_features: true,
    enable_avatar_generation: true,
    enable_pdf_export: true,
    enable_analytics: process.env.NODE_ENV === 'production'
  },
  // 限制配置
  limits: {
    max_name_length: 50,
    max_search_query_length: 100,
    max_upload_size: 5 * 1024 * 1024, // 5MB
    max_concurrent_requests: 5
  }
};
```

#### 使用示例
```typescript
import { SUBSCRIPTION_PLANS, CREDITS_PACKAGES, FEATURES_CONFIG } from '@/config/subscriptions';

// 获取订阅计划
function getSubscriptionPlan(planId: string) {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

// 获取用户功能权限
function getUserFeatures(subscriptionType: 'free' | 'basic' | 'premium') {
  return FEATURES_CONFIG[subscriptionType];
}

// 计算积分包价值
function calculatePackageValue(packageId: string) {
  const package_ = CREDITS_PACKAGES.find(pkg => pkg.id === packageId);
  if (!package_) return 0;

  const totalCredits = package_.credits + (package_.bonus_credits || 0);
  return totalCredits / package_.price;
}
```

## 关键依赖与配置

### 环境变量依赖
```bash
# 站点配置
NEXT_PUBLIC_SITE_URL=http://你的线上地址

# Creem配置
CREEM_WEBHOOK_SECRET=你的webhook密钥
CREEM_SUCCESS_URL=http://你的线上地址/dashboard

# AI服务配置
OPENAI_API_KEY=你的OpenAI密钥
OPENROUTER_API_KEY=你的OpenRouter密钥
```

### 内部依赖
- `@/types/*`: 类型定义
- `@/utils/*`: 配置验证工具

### 配置验证
- 使用Zod进行配置验证
- 环境变量必需性检查
- 配置格式验证

## 配置管理策略

### 环境分离
- **开发环境**: 本地开发配置
- **测试环境**: 测试服务器配置
- **生产环境**: 正式服务器配置

### 配置优先级
1. 环境变量（最高优先级）
2. 配置文件
3. 默认值（最低优先级）

### 敏感信息处理
- 敏感配置通过环境变量注入
- 配置文件中不包含密钥信息
- 使用`.env.example`模板

## 测试与质量

### 配置测试
- 配置格式验证测试
- 环境变量检查测试
- 配置加载测试
- 配置变更测试

### 集成测试
- 配置与业务逻辑集成测试
- 不同环境配置测试
- 配置错误处理测试

### 安全测试
- 敏感信息泄露测试
- 环境变量安全性测试
- 配置访问权限测试

## 最佳实践

### 配置设计原则
- 集中化配置管理
- 环境隔离
- 类型安全
- 易于维护

### 配置组织策略
- 按功能模块组织配置
- 使用常量定义配置值
- 提供配置文档
- 支持配置热更新

### 配置验证模式
- 运行时配置验证
- 启动时配置检查
- 配置变更监控
- 配置错误报告

## 常见问题 (FAQ)

### Q: 如何添加新的配置项？
A: 在相应的配置文件中添加新的配置项，确保有完整的类型定义和文档说明，更新相关的测试用例。

### Q: 如何处理环境特定的配置？
A: 使用环境变量区分不同环境的配置，在配置文件中读取环境变量，提供默认值作为降级方案。

### Q: 如何确保配置的安全性？
A: 敏感信息通过环境变量管理，不在代码中硬编码，使用配置验证确保必需的配置项存在。

### Q: 如何管理配置的版本控制？
A: 配置文件纳入版本控制，但`.env`文件和敏感信息排除在外，使用`.env.example`作为模板。

### Q: 如何测试配置的有效性？
A: 编写配置验证函数，在应用启动时检查配置的完整性和有效性，提供详细的错误信息。

## 相关文件清单

### 配置文件
- `subscriptions.ts`
- `app.ts` (如果存在)
- `database.ts` (如果存在)
- `ai.ts` (如果存在)
- `payment.ts` (如果存在)

### 环境变量模板
- `.env.example`
- `.env.local`
- `.env.development`
- `.env.production`

### 验证文件
- `config.validator.ts` (如果存在)
- `config.test.ts` (如果存在)