[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **contexts**

# contexts 状态管理模块

**变更记录 (Changelog):**
- 2025-11-22 21:08:44 - 创建 contexts 模块文档

## 模块职责

`contexts` 模块提供全局状态管理功能，目前主要包含用户认证状态管理。该模块使用 React Context API，为整个应用提供统一的状态管理解决方案。

## 模块结构

### 核心文件
- `authContext.ts` - 用户认证上下文（312 行）

### 功能特性
- **用户认证**: 登录、注册、登出功能
- **状态持久化**: localStorage 支持
- **Supabase 集成**: 支持真实数据库和模拟数据
- **类型安全**: 完整的 TypeScript 类型定义

## 入口与启动

### Context 提供者
```typescript
// 在 App.tsx 中使用
<AuthContext.Provider value={authValue}>
  <App />
</AuthContext.Provider>
```

### Hook 使用方式
```typescript
// 在组件中使用
const { isAuthenticated, user, login, logout } = useContext(AuthContext);
```

### 启动流程
1. `useAuthProvider` 初始化认证状态
2. 检查 localStorage 中的保存状态
3. 设置 Supabase 认证监听器
4. 提供认证方法给整个应用

## 对外接口

### AuthContext 接口
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
}
```

### 用户数据模型
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}
```

### 认证方法
- `login(email, password)`: 用户登录
- `register(email, password, username)`: 用户注册
- `logout()`: 用户登出
- `useAuthProvider()`: 认证状态管理 Hook

## 关键依赖与配置

### 外部依赖
- **React 18.3.1**: Context API
- **Supabase 2.45.6**: 后端认证服务（可选）
- **Sonner 2.0.2**: 消息提示

### 内部依赖
- `@/lib/supabase`: Supabase 客户端配置

### 配置要求
- 需要配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 环境变量
- 未配置时自动使用模拟数据模式

## 数据模型

### 认证状态模型
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}
```

### 模拟用户数据
```typescript
export const mockUserData: User = {
  id: "user-123",
  username: "demo_user",
  email: "demo@example.com",
  role: "user",
  createdAt: "2025-01-01T00:00:00Z"
};
```

### Supabase 用户资料模型
```typescript
interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}
```

## 测试与质量

### 当前测试覆盖
- **单元测试**: 0%
- **集成测试**: 0%
- **E2E 测试**: 0%

### 质量评估
- **类型安全**: 高 (完整 TypeScript 类型)
- **错误处理**: 完善 (try-catch, 用户友好的错误消息)
- **代码复杂度**: 中等 (312 行)
- **可维护性**: 高

### 潜在问题
1. **localStorage 安全性**: 敏感信息存储在客户端
2. **Supabase 依赖**: 网络问题时可能影响用户体验
3. **状态同步**: 多标签页状态同步问题

### 建议改进
1. 添加认证状态的单测
2. 实现 token 刷新机制
3. 添加更多的安全措施（如 CSRF 保护）
4. 优化错误处理和用户反馈

## 常见问题 (FAQ)

### Q: 如何启用 Supabase 认证？
A: 在 `.env` 文件中配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`，系统会自动检测并使用真实认证。

### Q: 模拟模式和真实模式有什么区别？
A: 模拟模式使用固定的测试数据，无需网络连接；真实模式连接 Supabase 数据库，支持真实的用户注册和登录。

### Q: 用户数据如何持久化？
A: 认证状态通过 localStorage 持久化，用户资料在 Supabase 模式下存储在数据库中。

### Q: 如何处理认证过期？
A: 当前版本没有实现 token 刷新机制，建议在后续版本中添加。

### Q: 如何添加新的认证方法？
A: 可以在 `authContext.ts` 中添加新的认证方法，如第三方登录（Google、GitHub 等）。

## 相关文件清单

### 核心文件
- `authContext.ts` - 认证上下文实现 (312 行)

### 依赖文件
- `@/lib/supabase.ts` - Supabase 客户端配置
- `@/hooks/useAuth.ts` - 认证 Hook 封装

### 统计信息
- **总文件数**: 1 个核心文件
- **总代码行数**: 312 行
- **复杂度**: 中等
- **测试覆盖**: 0%
- **类型覆盖**: 100%

## 变更记录 (Changelog)

- 2025-11-22 21:08:44 - 创建 contexts 模块文档