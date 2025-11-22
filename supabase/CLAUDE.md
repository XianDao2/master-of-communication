[根目录](../../CLAUDE.md) > **supabase**

# Supabase模块 - 数据库管理

## 变更记录 (Changelog)
- **2025-11-22 21:48:48** - 初始化supabase模块文档

## 模块职责

supabase模块是沟通大师项目的数据层，负责：
- 数据库架构设计和迁移
- 数据安全性和访问控制
- 数据库脚本和工具
- 行级安全策略(RLS)配置
- 数据完整性约束

## 入口与启动

### 数据库结构
```
supabase/
├── migrations/           # 数据库迁移文件
└── scripts/            # 数据库脚本和工具
```

### 核心数据表
- `customers` - 用户客户信息
- `subscriptions` - 订阅管理
- `credits_history` - 积分交易历史
- `search_history` - 搜索历史记录
- `generation_batches` - 生成批次记录
- `generated_names` - 生成的名字数据

## 对外接口

### 数据库迁移 (`migrations/`)

#### 初始化表结构 (`20240326000000_init_tables.sql`)
**功能**: 创建核心业务表结构
**包含表**:
- `customers` - 客户信息表
- `credits_history` - 积分历史表
- `subscriptions` - 订阅表

**主要特性**:
- 用户与Supabase Auth集成
- 行级安全策略(RLS)
- 自动时间戳更新
- 数据完整性约束

#### 搜索历史表 (`20240327000000_create_search_history_table.sql`)
**功能**: 创建用户搜索历史记录表
**特性**:
- 搜索类型分类
- 用户关联
- 元数据支持
- 性能优化索引

#### 头像生成表 (`20250801000000_create_avatar_generations_table.sql`)
**功能**: 创建头像生成记录表
**特性**:
- 头像生成历史
- 参数记录
- 结果存储

### 数据库脚本 (`scripts/`)

#### 积分管理脚本
- `add_credits_to_user.sql` - 为用户添加积分
- `credits_audit_report.sql` - 积分审计报告
- `query_user_credits.sql` - 查询用户积分

**使用示例**:
```sql
-- 为用户添加积分
SELECT * FROM add_credits_to_user(
  'user-uuid',
  100,
  'purchase',
  '购买积分包'
);
```

## 关键依赖与配置

### 技术依赖
- **PostgreSQL**: 主数据库
- **Supabase**: 数据库服务平台
- **Row Level Security (RLS)**: 数据安全控制

### 环境配置
- Supabase项目配置
- 认证提供者设置
- 环境变量配置

## 数据模型

### 客户表 (`customers`)
```sql
CREATE TABLE public.customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    creem_customer_id text NOT NULL UNIQUE,
    email text NOT NULL,
    name text,
    country text,
    credits integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT customers_email_match CHECK (email = lower(email)),
    CONSTRAINT credits_non_negative CHECK (credits >= 0)
);
```

### 积分历史表 (`credits_history`)
```sql
CREATE TABLE public.credits_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL,
    type text NOT NULL CHECK (type IN ('add', 'subtract')),
    description text,
    creem_order_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb
);
```

### 订阅表 (`subscriptions`)
```sql
CREATE TABLE public.subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    creem_subscription_id text NOT NULL UNIQUE,
    creem_product_id text NOT NULL,
    status text NOT NULL CHECK (status IN ('incomplete', 'expired', 'active', 'past_due', 'canceled', 'unpaid', 'paused', 'trialing')),
    current_period_start timestamp with time zone NOT NULL,
    current_period_end timestamp with time zone NOT NULL,
    canceled_at timestamp with time zone,
    trial_end timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 搜索历史表 (`search_history`)
```sql
CREATE TABLE public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    search_type TEXT NOT NULL CHECK (search_type IN ('famous_person_search', 'pronunciation_search', 'other')),
    search_query TEXT NOT NULL,
    search_results JSONB NOT NULL DEFAULT '{}'::jsonb,
    search_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### 行级安全策略 (RLS)

#### 客户表策略
```sql
-- 用户只能查看自己的客户数据
CREATE POLICY "Users can view their own customer data"
    ON public.customers FOR SELECT
    USING (auth.uid() = user_id);

-- 服务角色可以管理所有客户数据
CREATE POLICY "Service role can manage customer data"
    ON public.customers FOR ALL
    USING (auth.role() = 'service_role');
```

#### 积分历史表策略
```sql
-- 用户可以查看自己的积分历史
CREATE POLICY "Users can view their own credits history"
    ON public.credits_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.customers
            WHERE customers.id = credits_history.customer_id
            AND customers.user_id = auth.uid()
        )
    );
```

#### 搜索历史表策略
```sql
-- 用户可以查看自己的搜索历史
CREATE POLICY "Users can view their own search history"
    ON public.search_history
    FOR SELECT
    USING (user_id = auth.uid());

-- 用户可以插入自己的搜索历史
CREATE POLICY "Users can insert their own search history"
    ON public.search_history
    FOR INSERT
    WITH CHECK (user_id = auth.uid());
```

## 测试与质量

### 数据库测试
- 迁移脚本测试
- 约束验证测试
- RLS策略测试
- 性能测试

### 数据完整性测试
- 外键约束测试
- 唯一约束测试
- 检查约束测试
- 触发器测试

### 安全测试
- RLS策略有效性测试
- 权限控制测试
- 数据隔离测试
- SQL注入防护测试

## 常见问题 (FAQ)

### Q: 如何创建新的数据库迁移？
A: 在`supabase/migrations/`目录下创建新的SQL文件，文件名格式为`YYYYMMDDHHMMSS_description.sql`，确保迁移是幂等的。

### Q: 如何配置行级安全策略？
A: 为每个表创建适当的RLS策略，确保用户只能访问自己的数据，使用`auth.uid()`函数获取当前用户ID。

### Q: 如何处理数据库升级？
A: 创建新的迁移文件，使用`ALTER TABLE`语句修改表结构，确保向后兼容性，在测试环境充分验证后再应用到生产环境。

### Q: 如何优化数据库性能？
A: 创建适当的索引，避免过度索引，定期分析查询性能，使用`EXPLAIN`分析查询计划。

### Q: 如何备份数据？
A: 使用Supabase提供的备份功能，定期导出重要数据，实施自动化备份策略，测试恢复流程。

## 相关文件清单

### 迁移文件
- `migrations/20240326000000_init_tables.sql`
- `migrations/20240327000000_create_search_history_table.sql`
- `migrations/20250801000000_create_avatar_generations_table.sql`

### 脚本文件
- `scripts/add_credits_to_user.sql`
- `scripts/credits_audit_report.sql`
- `scripts/query_user_credits.sql`

### 配置文件
- `supabase/config.toml` (如果存在)

### 文档
- `README.md` (如果存在)