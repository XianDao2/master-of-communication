[根目录](../../CLAUDE.md) > **hooks**

# Hooks模块 - 自定义React Hooks

## 变更记录 (Changelog)
- **2025-11-22 21:48:48** - 初始化hooks模块文档

## 模块职责

hooks模块是沟通大师项目的状态管理层，负责：
- 封装复杂的业务逻辑
- 管理组件状态和副作用
- 提供可复用的状态逻辑
- 集成外部API和数据源
- 优化组件性能和用户体验

## 入口与启动

### 核心Hooks结构
```
hooks/
├── use-credits.ts        # 积分管理Hook
├── use-subscription.ts   # 订阅管理Hook
├── use-toast.ts         # 消息提示Hook
└── use-user.ts          # 用户状态Hook
```

### 主要Hooks文件
- `use-credits.ts` - 积分余额查询和管理
- `use-subscription.ts` - 订阅状态管理
- `use-toast.ts` - 全局消息提示
- `use-user.ts` - 用户认证状态

## 对外接口

### 积分管理Hook (`use-credits.ts`)

#### 功能
- 查询用户积分余额
- 监听积分变化
- 积分消费状态管理
- 错误处理和重试机制

#### 接口定义
```typescript
interface UseCreditsReturn {
  credits: number | null;
  loading: boolean;
  error: string | null;
  refreshCredits: () => Promise<void>;
  consumeCredits: (amount: number) => Promise<boolean>;
}
```

#### 使用示例
```typescript
const { credits, loading, error, consumeCredits } = useCredits();

// 消费积分
const handleGenerate = async () => {
  const success = await consumeCredits(1);
  if (success) {
    // 生成逻辑
  }
};
```

#### 特性
- 自动缓存和刷新
- 实时余额更新
- 并发请求处理
- 优雅的错误处理

### 订阅管理Hook (`use-subscription.ts`)

#### 功能
- 查询用户订阅状态
- 监听订阅变化
- 订阅权限验证
- 支付状态管理

#### 接口定义
```typescript
interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'expired' | 'past_due';
  current_period_end: string;
  creem_product_id: string;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  isActive: boolean;
  refreshSubscription: () => Promise<void>;
  canAccessPremium: boolean;
}
```

#### 使用示例
```typescript
const { subscription, isActive, canAccessPremium } = useSubscription();

// 检查高级功能访问权限
if (canAccessPremium) {
  // 显示高级功能
}
```

#### 特性
- 实时订阅状态更新
- 权限自动计算
- 支付状态同步
- 试用期管理

### 消息提示Hook (`use-toast.ts`)

#### 功能
- 全局消息提示管理
- 多种消息类型支持
- 消息队列管理
- 自定义样式和持续时间

#### 接口定义
```typescript
interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
}

interface UseToastReturn {
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (toastId?: string) => void;
  toasts: Toast[];
}
```

#### 使用示例
```typescript
const { toast } = useToast();

// 显示成功消息
toast({
  title: "操作成功",
  description: "您的名字已保存",
});

// 显示错误消息
toast({
  title: "操作失败",
  description: "请稍后重试",
  variant: "destructive",
});
```

#### 特性
- 自动消失机制
- 手动关闭支持
- 多消息并发显示
- 响应式设计适配

### 用户状态Hook (`use-user.ts`)

#### 功能
- 用户认证状态管理
- 用户信息查询
- 登录状态监听
- 权限验证

#### 接口定义
```typescript
interface User {
  id: string;
  email: string;
  created_at: string;
  metadata?: Record<string, any>;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}
```

#### 使用示例
```typescript
const { user, isAuthenticated } = useUser();

// 检查用户登录状态
if (isAuthenticated) {
  // 显示用户相关功能
}
```

#### 特性
- 自动认证状态同步
- 会话过期处理
- 用户信息缓存
- 安全的权限检查

## 关键依赖与配置

### 内部依赖
- `@/utils/supabase/*`: Supabase客户端
- `@/components/ui/*`: UI组件
- `@/types/*`: TypeScript类型定义

### 外部依赖
- `react`: React框架
- `@supabase/supabase-js`: Supabase客户端
- `@radix-ui/react-toast`: Toast组件基础

### React Hooks模式
- 使用`useState`管理本地状态
- 使用`useEffect`处理副作用
- 使用`useCallback`优化性能
- 使用`useMemo`缓存计算结果

## 状态管理模式

### 本地状态
- 组件内部状态管理
- 临时UI状态
- 表单输入状态
- 加载状态

### 全局状态
- 用户认证状态
- 积分余额状态
- 订阅状态
- 全局消息状态

### 服务端状态
- 数据库数据
- API响应数据
- 缓存数据
- 实时更新数据

## 测试与质量

### 单元测试
- Hook逻辑测试
- 状态变化测试
- 副作用测试
- 错误处理测试

### 集成测试
- 组件集成测试
- 数据流测试
- API集成测试
- 用户体验测试

### 性能测试
- 重渲染优化测试
- 内存泄漏测试
- 并发请求测试
- 缓存效果测试

## 最佳实践

### Hook设计原则
- 单一职责原则
- 可复用性优先
- 清晰的接口设计
- 完善的错误处理

### 性能优化
- 使用适当的依赖数组
- 避免不必要的重渲染
- 实现数据缓存
- 优化网络请求

### 错误处理
- 优雅的错误降级
- 用户友好的错误消息
- 详细的错误日志
- 自动重试机制

## 常见问题 (FAQ)

### Q: 如何创建新的自定义Hook？
A: 在`hooks/`目录下创建新文件，以`use-`开头命名，遵循现有的代码风格和TypeScript类型定义规范。

### Q: 如何处理API请求的错误？
A: 在Hook中实现统一的错误处理逻辑，提供错误状态和重试机制，使用toast显示用户友好的错误消息。

### Q: 如何优化Hook的性能？
A: 使用`useCallback`和`useMemo`优化函数和计算结果，合理设置依赖数组，避免不必要的重渲染。

### Q: 如何实现实时数据更新？
A: 使用Supabase的实时订阅功能，在Hook中监听数据变化，自动更新本地状态。

### Q: 如何管理全局状态？
A: 对于简单的全局状态，可以使用自定义Hook；对于复杂的状态管理，考虑使用状态管理库如Zustand或Redux。

## 相关文件清单

### 核心Hooks
- `use-credits.ts`
- `use-subscription.ts`
- `use-toast.ts`
- `use-user.ts`

### 类型定义
- `../types/credits.ts` (如果存在)
- `../types/subscriptions.ts`
- `../types/user.ts` (如果存在)

### 工具函数
- `../utils/supabase/client.ts`
- `../utils/credits-utils.ts`
- `../utils/subscriptions-utils.ts` (如果存在)