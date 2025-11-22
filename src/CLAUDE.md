[根目录](../../CLAUDE.md) > **src**

# src 源代码模块

**变更记录 (Changelog):**
- 2025-11-22 21:08:44 - 创建 src 模块文档

## 模块职责

`src` 目录是项目的核心源代码模块，包含了所有前端业务逻辑、组件、页面和工具函数。该模块采用标准的 React 项目结构，按功能职责进行子模块划分。

## 子模块结构

### pages/ - 页面组件模块
- **职责**: 定义应用的所有页面路由和主要功能界面
- **入口文件**: 各页面组件通过 `App.tsx` 进行路由配置
- **测试状态**: 无测试文件

### components/ - 可复用组件模块
- **职责**: 提供可复用的 UI 组件，包括布局、交互组件等
- **特点**: 使用 Framer Motion 实现动画效果，支持响应式设计
- **测试状态**: 无测试文件

### contexts/ - 状态管理模块
- **职责**: 提供全局状态管理，主要是用户认证状态
- **核心文件**: `authContext.ts` - 用户认证上下文
- **测试状态**: 无测试文件

### hooks/ - 自定义 Hooks 模块
- **职责**: 提供可复用的业务逻辑 Hooks
- **核心文件**:
  - `useAuth.ts` - 认证状态 Hook
  - `useTheme.ts` - 主题切换 Hook
- **测试状态**: 无测试文件

### lib/ - 工具库模块
- **职责**: 提供工具函数、配置和第三方服务集成
- **核心文件**:
  - `supabase.ts` - Supabase 数据库集成
  - `utils.ts` - 通用工具函数
- **测试状态**: 无测试文件

## 关键依赖与配置

### 外部依赖
- **React 18.3.1**: 核心框架
- **TypeScript 5.7.2**: 类型系统
- **React Router DOM 7.3.0**: 路由管理
- **Framer Motion 12.9.2**: 动画库
- **Tailwind CSS 3.4.17**: 样式框架
- **Supabase 2.45.6**: 后端服务（可选）

### 内部依赖
- 各子模块之间存在相互依赖关系
- `contexts` 模块被 `hooks` 和 `pages` 模块依赖
- `lib` 模块被多个其他模块依赖

## 数据模型

### 用户认证模型
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}
```

### AI 对话模型
```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  analysis?: MessageAnalysis;
}
```

### 评估模型
```typescript
interface AssessmentResult {
  communicationStyle: string;
  strengths: string[];
  areasForImprovement: string[];
  scores: {
    languageExpression: number;
    emotionalManagement: number;
    logicalStructure: number;
    communicationEffectiveness: number;
  };
}
```

## 测试与质量

### 当前测试覆盖
- **单元测试**: 0%
- **集成测试**: 0%
- **E2E 测试**: 0%

### 质量工具配置
- **TypeScript**: 严格模式已启用
- **ESLint**: 未配置
- **Prettier**: 未配置

### 建议改进
1. 添加 Jest + React Testing Library 进行组件测试
2. 配置 ESLint + Prettier 保证代码质量
3. 添加 Cypress 或 Playwright 进行 E2E 测试

## 常见问题 (FAQ)

### Q: 如何添加新页面？
A: 在 `pages/` 目录创建新组件，然后在 `App.tsx` 中添加路由配置，并在 `Navbar.tsx` 中添加导航链接。

### Q: 如何修改主题？
A: 主题逻辑在 `hooks/useTheme.ts` 中，使用 Tailwind CSS 的 dark: 前缀来定义深色模式样式。

### Q: Supabase 配置是必须的吗？
A: 不是必须的。项目支持模拟数据模式，即使没有配置 Supabase 也能正常运行。

### Q: 如何添加新的组件？
A: 在 `components/` 目录创建新组件，遵循现有的命名规范和代码结构。

## 相关文件清单

### 核心文件
- `App.tsx` - 应用主组件和路由配置
- `main.tsx` - 应用入口文件
- `index.css` - 全局样式文件

### 配置文件
- `vite-env.d.ts` - Vite 类型声明文件

### 统计信息
- **总文件数**: 17 个文件
- **TypeScript 文件**: 15 个
- **CSS 文件**: 1 个
- **类型声明文件**: 1 个

## 变更记录 (Changelog)

- 2025-11-22 21:08:44 - 创建 src 模块文档