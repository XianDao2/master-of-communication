[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **hooks**

# hooks 自定义 Hooks 模块

**变更记录 (Changelog):**
- 2025-11-22 21:08:44 - 创建 hooks 模块文档

## 模块职责

`hooks` 模块提供可复用的自定义 React Hooks，用于抽取和共享业务逻辑。该模块遵循 React Hooks 的最佳实践，提供类型安全的业务逻辑封装。

## 模块结构

### 核心文件
- `useAuth.ts` - 认证状态 Hook (12 行)
- `useTheme.ts` - 主题切换 Hook (未详细读取)

### 功能特性
- **认证管理**: 封装认证状态的访问和使用
- **主题切换**: 提供明暗主题切换功能
- **类型安全**: 完整的 TypeScript 类型定义
- **错误处理**: Hook 使用错误的边界检查

## 入口与启动

### Hook 导入方式
```typescript
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
```

### Hook 使用流程
1. 在组件中导入需要的 Hook
2. 调用 Hook 获取状态和方法
3. 在组件中使用返回的状态和方法

## 对外接口

### useAuth Hook 接口
```typescript
function useAuth(): AuthContextType {
  // 返回 AuthContext 的值
  // 如果不在 AuthProvider 内使用，抛出错误
}
```

### useTheme Hook 接口 (推测)
```typescript
function useTheme(): {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
} {
  // 返回主题状态和切换方法
}
```

## 关键依赖与配置

### 外部依赖
- **React 18.3.1**: Hooks API
- **TypeScript**: 类型系统

### 内部依赖
- `@/contexts/authContext`: 认证状态 (useAuth)
- 可能依赖 `@/lib/utils`: 主题相关工具函数 (useTheme)

### 配置要求
- 无特殊配置要求
- 需要在相应的 Provider 内使用

## 数据模型

### 认证状态模型
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
}
```

### 主题状态模型 (推测)
```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
}
```

## 测试与质量

### 当前测试覆盖
- **单元测试**: 0%
- **集成测试**: 0%
- **Hook 测试**: 0%

### 质量评估
- **代码简洁性**: 高 (useAuth 仅 12 行)
- **类型安全**: 高
- **错误处理**: 完善 (useAuth 有边界检查)
- **可复用性**: 高

### 建议改进
1. 为每个 Hook 添加单元测试
2. 添加更多实用的业务逻辑 Hooks
3. 实现 Hook 的性能优化
4. 添加 Hook 使用文档和示例

## 常见问题 (FAQ)

### Q: 如何创建新的 Hook？
A: 在当前目录创建 `.ts` 文件，以 `use` 开头命名，导出函数，遵循 React Hooks 规则。

### Q: Hook 的命名规范是什么？
A: 必须以 `use` 开头，使用驼峰命名法，如 `useAuth`, `useTheme`。

### Q: 如何确保 Hook 的正确使用？
A: 在 Hook 内部添加错误检查，确保在正确的 Provider 上下文中使用。

### Q: Hook 的性能如何优化？
A: 使用 `useCallback`, `useMemo` 等优化 Hook，避免不必要的重新计算。

### Q: 可以在哪些组件中使用这些 Hook？
A: `useAuth` 必须在 `AuthProvider` 内使用，`useTheme` 可能在 `ThemeProvider` 内使用。

## 相关文件清单

### 核心文件
- `useAuth.ts` - 认证状态 Hook (12 行)
- `useTheme.ts` - 主题切换 Hook (未详细读取)

### 依赖文件
- `@/contexts/authContext.ts` - 认证上下文
- 可能的主题相关文件

### 统计信息
- **总文件数**: 2 个 Hook 文件
- **总代码行数**: 估计 50+ 行
- **平均复杂度**: 低
- **测试覆盖**: 0%
- **复用率**: 高

## 变更记录 (Changelog)

- 2025-11-22 21:08:44 - 创建 hooks 模块文档