[根目录](../../CLAUDE.md) > [src](../CLAUDE.md) > **pages**

# pages 页面模块

**变更记录 (Changelog):**
- 2025-11-22 21:08:44 - 创建 pages 模块文档

## 模块职责

`pages` 模块包含应用的所有页面组件，每个页面对应一个核心功能模块。该模块是应用的主要功能载体，负责用户界面的渲染和用户交互的处理。

## 页面列表

| 页面文件 | 路由路径 | 主要功能 | 技术特点 |
|---------|---------|----------|----------|
| `Home.tsx` | `/` | 首页展示 | 动画效果，响应式设计 |
| `Assessment.tsx` | `/assessment` | 沟通能力评估 | 表单处理，结果分析 |
| `AIPractice.tsx` | `/ai-practice` | AI 对话练习 | 实时对话，消息分析 |
| `KnowledgeBase.tsx` | `/knowledge` | 知识库浏览 | 内容展示，分类筛选 |
| `ProgressTracking.tsx` | `/progress` | 进度追踪 | 数据可视化，图表展示 |

## 入口与启动

### 路由配置
所有页面通过 `App.tsx` 中的 `React Router` 进行路由配置：

```typescript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/assessment" element={<Assessment />} />
  <Route path="/ai-practice" element={<AIPractice />} />
  <Route path="/knowledge" element={<KnowledgeBase />} />
  <Route path="/progress" element={<ProgressTracking />} />
</Routes>
```

### 页面启动顺序
1. `main.tsx` → `App.tsx` → 各页面组件
2. 每个页面都通过 `AuthContext` 获取用户认证状态
3. 使用 `useTheme` Hook 获取主题信息

## 对外接口

### 页面组件接口
所有页面组件都遵循统一的接口规范：

```typescript
interface PageComponent {
  // 无 props，所有数据通过 Context 和内部状态管理
}
```

### 共享依赖
- `AuthContext`: 用户认证状态
- `useTheme`: 主题切换功能
- `Framer Motion`: 动画效果
- `Recharts`: 图表展示（部分页面）

## 关键依赖与配置

### 外部依赖
- **React Router DOM 7.3.0**: 路由管理
- **Framer Motion 12.9.2**: 页面动画和交互效果
- **Recharts 2.15.1**: 数据可视化（ProgressTracking, AIPractice）
- **Sonner 2.0.2**: 消息提示

### 内部依赖
- `@/contexts/authContext`: 认证状态管理
- `@/hooks/useTheme`: 主题切换
- `@/components/*`: 可复用组件
- `@/lib/supabase`: 数据服务（可选）

## 数据模型

### 评估结果模型 (Assessment)
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

### AI 对话模型 (AIPractice)
```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  analysis?: {
    languageExpression: number;
    emotionalManagement: number;
    logicalStructure: number;
    communicationEffectiveness: number;
    suggestions: string[];
  };
}
```

### 知识库模型 (KnowledgeBase)
```typescript
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
}
```

### 进度数据模型 (ProgressTracking)
```typescript
interface ProgressData {
  date: string;
  score: number;
  practiceCount: number;
  knowledgeCount: number;
}
```

## 测试与质量

### 当前测试覆盖
- **单元测试**: 0%
- **集成测试**: 0%
- **E2E 测试**: 0%

### 质量问题
- 缺少测试文件
- 部分页面组件过于复杂（如 AIPractice.tsx 1300+ 行）
- 缺少错误边界处理

### 建议改进
1. 为每个页面组件添加单元测试
2. 将复杂页面拆分为更小的子组件
3. 添加错误边界和加载状态处理
4. 添加页面级别的性能优化

## 常见问题 (FAQ)

### Q: 如何添加新页面？
A: 在当前目录创建新的 `.tsx` 文件，实现页面组件，然后在 `App.tsx` 中添加路由配置，并在 `Navbar.tsx` 中添加导航链接。

### Q: 页面间的数据如何传递？
A: 目前主要通过 React Context 和 localStorage 进行数据传递。复杂状态建议使用状态管理库。

### Q: 如何处理页面权限？
A: 通过 `AuthContext` 的 `isAuthenticated` 状态判断用户权限，未登录用户部分功能受限。

### Q: 页面性能如何优化？
A: 可以使用 React.memo、useMemo、useCallback 等优化手段，对于大型页面考虑代码分割。

## 相关文件清单

### 核心页面文件
- `Home.tsx` - 首页 (453 行)
- `Assessment.tsx` - 沟通评估 (部分读取，估计 200+ 行)
- `AIPractice.tsx` - AI 对话练习 (1302 行)
- `KnowledgeBase.tsx` - 知识库 (部分读取，估计 200+ 行)
- `ProgressTracking.tsx` - 进度追踪 (部分读取，估计 200+ 行)

### 统计信息
- **总文件数**: 5 个页面文件
- **总代码行数**: 估计 2300+ 行
- **平均复杂度**: 中高
- **测试覆盖**: 0%

## 变更记录 (Changelog)

- 2025-11-22 21:08:44 - 创建 pages 模块文档