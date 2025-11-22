-- 沟通大师业务数据库表结构
-- 创建日期: 2025-11-22
-- 描述: 沟通技巧提升平台的核心业务表

-- ============================================
-- 1. 用户资料扩展表 (profiles)
-- ============================================
-- 扩展 auth.users 表，添加用户基本信息
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text not null unique,
    email text not null unique,
    full_name text,
    avatar_url text,
    bio text,
    role text default 'user' check (role in ('user', 'admin', 'moderator')),
    level integer default 1 check (level >= 1 and level <= 100),
    experience_points integer default 0 check (experience_points >= 0),
    learning_streak integer default 0 check (learning_streak >= 0),
    last_login_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb,

    constraint profiles_email_match check (email = lower(email))
);

-- ============================================
-- 2. 沟通场景表 (scenarios)
-- ============================================
-- 存储所有可用的沟通练习场景
create table public.scenarios (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text not null,
    category text not null check (category in ('work', 'social', 'family', 'education')),
    difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
    estimated_duration integer not null check (estimated_duration > 0), -- 预计完成时间(分钟)
    role text not null, -- 用户扮演的角色
    goal text not null, -- 沟通目标
    initial_message text not null, -- AI初始消息
    topics text[] default '{}', -- 相关话题标签
    is_active boolean default true,
    is_premium boolean default false, -- 是否需要付费
    usage_count integer default 0 check (usage_count >= 0),
    rating numeric(2,1) default 0.0 check (rating >= 0.0 and rating <= 5.0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb
);

-- ============================================
-- 3. 对话记录表 (conversations)
-- ============================================
-- 存储用户与AI的对话历史
create table public.conversations (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    scenario_id uuid references public.scenarios(id) on delete set null,
    title text not null,
    status text default 'active' check (status in ('active', 'completed', 'abandoned')),
    messages_count integer default 0 check (messages_count >= 0),
    last_message text,
    overall_score numeric(3,1), -- 总体评分(0-100)
    language_expression_score numeric(3,1), -- 语言表达评分
    emotional_management_score numeric(3,1), -- 情绪管理评分
    logical_structure_score numeric(3,1), -- 逻辑结构评分
    communication_effectiveness_score numeric(3,1), -- 沟通效果评分
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 4. 消息详情表 (messages)
-- ============================================
-- 存储对话中的每一条消息详情
create table public.messages (
    id uuid primary key default uuid_generate_v4(),
    conversation_id uuid references public.conversations(id) on delete cascade not null,
    sender_type text not null check (sender_type in ('user', 'ai')),
    content text not null,
    message_type text default 'text' check (message_type in ('text', 'system')),
    language_expression_score numeric(3,1), -- 语言表达评分
    emotional_management_score numeric(3,1), -- 情绪管理评分
    logical_structure_score numeric(3,1), -- 逻辑结构评分
    communication_effectiveness_score numeric(3,1), -- 沟通效果评分
    suggestions jsonb default '[]'::jsonb, -- 改进建议数组
    optimal_response text, -- AI推荐的最佳回复
    response_time_ms integer, -- 响应时间(毫秒)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 5. 沟通评估表 (assessments)
-- ============================================
-- 存储用户的沟通能力评估结果
create table public.assessments (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    assessment_type text not null check (assessment_type in ('initial', 'progress', 'final')),
    overall_score numeric(3,1) not null check (overall_score >= 0.0 and overall_score <= 100.0),
    language_expression_score numeric(3,1),
    emotional_management_score numeric(3,1),
    logical_structure_score numeric(3,1),
    communication_effectiveness_score numeric(3,1),
    communication_style text, -- 沟通风格类型
    strengths text[] default '{}', -- 优势
    improvement_areas text[] default '{}', -- 改进领域
    recommendations jsonb default '[]'::jsonb, -- 个性化建议
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 6. 知识库文章表 (articles)
-- ============================================
-- 存储沟通技巧相关的文章和教程
create table public.articles (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    slug text not null unique,
    content text not null,
    excerpt text, -- 文章摘要
    featured_image_url text,
    category text not null check (category in ('basic', 'emotion', 'work', 'social', 'family')),
    subcategory text,
    tags text[] default '{}',
    reading_time integer not null check (reading_time > 0), -- 阅读时间(分钟)
    difficulty_level text default 'beginner' check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
    is_premium boolean default false,
    view_count integer default 0 check (view_count >= 0),
    like_count integer default 0 check (like_count >= 0),
    is_published boolean default false,
    published_at timestamp with time zone,
    author_id uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb
);

-- ============================================
-- 7. 学习进度表 (learning_progress)
-- ============================================
-- 追踪用户的学习进度和成就
create table public.learning_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    content_type text not null check (content_type in ('scenario', 'article', 'assessment')),
    content_id uuid not null,
    status text default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
    progress_percentage numeric(5,2) default 0.0 check (progress_percentage >= 0.0 and progress_percentage <= 100.0),
    time_spent_seconds integer default 0 check (time_spent_seconds >= 0), -- 学习时长(秒)
    score numeric(5,2), -- 完成得分
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint learning_progress_unique unique (user_id, content_type, content_id)
);

-- ============================================
-- 8. 成就徽章表 (achievements)
-- ============================================
-- 定义用户可获得的成就和徽章
create table public.achievements (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text not null,
    icon_url text,
    category text not null check (category in ('completion', 'streak', 'skill', 'social')),
    requirement_type text not null check (requirement_type in ('conversations_count', 'assessments_score', 'learning_streak', 'articles_read')),
    requirement_value integer not null check (requirement_value > 0),
    points_value integer not null check (points_value > 0), -- 获得的积分值
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 9. 用户成就表 (user_achievements)
-- ============================================
-- 记录用户获得的成就
create table public.user_achievements (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    achievement_id uuid references public.achievements(id) on delete cascade not null,
    unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb default '{}'::jsonb,

    constraint user_achievements_unique unique (user_id, achievement_id)
);

-- ============================================
-- 10. 学习统计表 (learning_statistics)
-- ============================================
-- 汇总用户的学习统计数据
create table public.learning_statistics (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    date date not null,
    conversations_completed integer default 0 check (conversations_completed >= 0),
    messages_sent integer default 0 check (messages_sent >= 0),
    articles_read integer default 0 check (articles_read >= 0),
    assessments_taken integer default 0 check (assessments_taken >= 0),
    learning_time_seconds integer default 0 check (learning_time_seconds >= 0),
    experience_gained integer default 0 check (experience_gained >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint learning_statistics_unique unique (user_id, date)
);

-- ============================================
-- 11. 用户反馈表 (user_feedback)
-- ============================================
-- 收集用户对功能和内容的反馈
create table public.user_feedback (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete set null,
    feedback_type text not null check (feedback_type in ('bug_report', 'feature_request', 'general_feedback', 'content_suggestion')),
    content text not null,
    rating integer check (rating >= 1 and rating <= 5),
    status text default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
    response text, -- 管理员回复
    resolved_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 12. 沟通工具表 (communication_tools)
-- ============================================
-- 存储实用的沟通工具和模板
create table public.communication_tools (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text not null,
    category text not null check (category in ('template', 'checklist', 'framework', 'exercise')),
    content jsonb not null, -- 工具内容(JSON格式)
    difficulty_level text default 'beginner' check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
    usage_count integer default 0 check (usage_count >= 0),
    is_premium boolean default false,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- 索引创建
-- ============================================

-- Profiles 索引
create index profiles_username_idx on public.profiles(username);
create index profiles_email_idx on public.profiles(email);
create index profiles_level_idx on public.profiles(level);
create index profiles_experience_points_idx on public.profiles(experience_points);

-- Scenarios 索引
create index scenarios_category_idx on public.scenarios(category);
create index scenarios_difficulty_idx on public.scenarios(difficulty);
create index scenarios_is_active_idx on public.scenarios(is_active);
create index scenarios_is_premium_idx on public.scenarios(is_premium);
create index scenarios_rating_idx on public.scenarios(rating);

-- Conversations 索引
create index conversations_user_id_idx on public.conversations(user_id);
create index conversations_scenario_id_idx on public.conversations(scenario_id);
create index conversations_status_idx on public.conversations(status);
create index conversations_created_at_idx on public.conversations(created_at);
create index conversations_overall_score_idx on public.conversations(overall_score);

-- Messages 索引
create index messages_conversation_id_idx on public.messages(conversation_id);
create index messages_sender_type_idx on public.messages(sender_type);
create index messages_created_at_idx on public.messages(created_at);

-- Assessments 索引
create index assessments_user_id_idx on public.assessments(user_id);
create index assessments_assessment_type_idx on public.assessments(assessment_type);
create index assessments_completed_at_idx on public.assessments(completed_at);

-- Articles 索引
create index articles_category_idx on public.articles(category);
create index articles_subcategory_idx on public.articles(subcategory);
create index articles_difficulty_level_idx on public.articles(difficulty_level);
create index articles_is_published_idx on public.articles(is_published);
create index articles_is_premium_idx on public.articles(is_premium);
create index articles_published_at_idx on public.articles(published_at);
create index articles_author_id_idx on public.articles(author_id);
create index articles_view_count_idx on public.articles(view_count);

-- Learning Progress 索引
create index learning_progress_user_id_idx on public.learning_progress(user_id);
create index learning_progress_content_type_idx on public.learning_progress(content_type);
create index learning_progress_status_idx on public.learning_progress(status);

-- Achievements 索引
create index achievements_category_idx on public.achievements(category);
create index achievements_requirement_type_idx on public.achievements(requirement_type);
create index achievements_is_active_idx on public.achievements(is_active);

-- User Achievements 索引
create index user_achievements_user_id_idx on public.user_achievements(user_id);
create index user_achievements_achievement_id_idx on public.user_achievements(achievement_id);
create index user_achievements_unlocked_at_idx on public.user_achievements(unlocked_at);

-- Learning Statistics 索引
create index learning_statistics_user_id_idx on public.learning_statistics(user_id);
create index learning_statistics_date_idx on public.learning_statistics(date);

-- User Feedback 索引
create index user_feedback_user_id_idx on public.user_feedback(user_id);
create index user_feedback_feedback_type_idx on public.user_feedback(feedback_type);
create index user_feedback_status_idx on public.user_feedback(status);
create index user_feedback_created_at_idx on public.user_feedback(created_at);

-- Communication Tools 索引
create index communication_tools_category_idx on public.communication_tools(category);
create index communication_tools_difficulty_level_idx on public.communication_tools(difficulty_level);
create index communication_tools_is_premium_idx on public.communication_tools(is_premium);
create index communication_tools_is_active_idx on public.communication_tools(is_active);

-- ============================================
-- 触发器函数创建
-- ============================================

-- updated_at 触发器函数
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- 为需要 updated_at 字段的表创建触发器
create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_scenarios_updated_at
    before update on public.scenarios
    for each row
    execute function public.handle_updated_at();

create trigger handle_conversations_updated_at
    before update on public.conversations
    for each row
    execute function public.handle_updated_at();

create trigger handle_articles_updated_at
    before update on public.articles
    for each row
    execute function public.handle_updated_at();

create trigger handle_learning_progress_updated_at
    before update on public.learning_progress
    for each row
    execute function public.handle_updated_at();

create trigger handle_user_feedback_updated_at
    before update on public.user_feedback
    for each row
    execute function public.handle_updated_at();

create trigger handle_communication_tools_updated_at
    before update on public.communication_tools
    for each row
    execute function public.handle_updated_at();

-- 自动更新对话消息数量
create or replace function public.update_conversation_messages_count()
returns trigger as $$
begin
    if tg_op = 'INSERT' then
        update public.conversations
        set messages_count = messages_count + 1,
            updated_at = timezone('utc'::text, now())
        where id = new.conversation_id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger update_messages_count_on_insert
    after insert on public.messages
    for each row
    execute function public.update_conversation_messages_count();

-- 自动更新文章阅读数量
create or replace function public.increment_article_view_count()
returns trigger as $$
begin
    if tg_op = 'UPDATE' and new.status = 'completed' and old.status != 'completed' then
        update public.articles
        set view_count = view_count + 1
        where id = new.content_id and new.content_type = 'article';
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger trigger_article_view_count
    after update on public.learning_progress
    for each row
    execute function public.increment_article_view_count();

-- ============================================
-- 行级安全策略 (RLS)
-- ============================================

-- 启用 RLS
alter table public.profiles enable row level security;
alter table public.scenarios enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.assessments enable row level security;
alter table public.articles enable row level security;
alter table public.learning_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.learning_statistics enable row level security;
alter table public.user_feedback enable row level security;
alter table public.communication_tools enable row level security;

-- Profiles 策略
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Scenarios 策略 (所有人可查看，管理员可管理)
create policy "Everyone can view active scenarios"
    on public.scenarios for select
    using (is_active = true);

create policy "Authenticated users can view premium scenarios"
    on public.scenarios for select
    using (auth.role() = 'authenticated' and is_premium = false);

create policy "Admins can manage scenarios"
    on public.scenarios for all
    using (auth.role() = 'service_role');

-- Conversations 策略
create policy "Users can view their own conversations"
    on public.conversations for select
    using (auth.uid() = user_id);

create policy "Users can create their own conversations"
    on public.conversations for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
    on public.conversations for update
    using (auth.uid() = user_id);

create policy "Users can delete their own conversations"
    on public.conversations for delete
    using (auth.uid() = user_id);

-- Messages 策略
create policy "Users can view messages in their conversations"
    on public.messages for select
    using (
        exists (
            select 1 from public.conversations
            where conversations.id = messages.conversation_id
            and conversations.user_id = auth.uid()
        )
    );

create policy "Users can create messages in their conversations"
    on public.messages for insert
    with check (
        exists (
            select 1 from public.conversations
            where conversations.id = messages.conversation_id
            and conversations.user_id = auth.uid()
        )
    );

-- Assessments 策略
create policy "Users can view their own assessments"
    on public.assessments for select
    using (auth.uid() = user_id);

create policy "Users can create their own assessments"
    on public.assessments for insert
    with check (auth.uid() = user_id);

-- Articles 策略 (发布文章所有人可查看，付费文章需要权限)
create policy "Everyone can view published articles"
    on public.articles for select
    using (is_published = true and is_premium = false);

create policy "Authenticated users can view premium articles"
    on public.articles for select
    using (auth.role() = 'authenticated' and is_published = true);

create policy "Authors can manage their own articles"
    on public.articles for all
    using (auth.uid() = author_id);

create policy "Admins can manage all articles"
    on public.articles for all
    using (auth.role() = 'service_role');

-- Learning Progress 策略
create policy "Users can view their own learning progress"
    on public.learning_progress for select
    using (auth.uid() = user_id);

create policy "Users can create their own learning progress"
    on public.learning_progress for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own learning progress"
    on public.learning_progress for update
    using (auth.uid() = user_id);

-- Achievements 策略 (所有人可查看成就)
create policy "Everyone can view achievements"
    on public.achievements for select
    using (is_active = true);

-- User Achievements 策略
create policy "Users can view their own achievements"
    on public.user_achievements for select
    using (auth.uid() = user_id);

create policy "System can create user achievements"
    on public.user_achievements for insert
    using (auth.role() = 'service_role');

-- Learning Statistics 策略
create policy "Users can view their own learning statistics"
    on public.learning_statistics for select
    using (auth.uid() = user_id);

create policy "System can create learning statistics"
    on public.learning_statistics for insert
    using (auth.role() = 'service_role');

-- User Feedback 策略
create policy "Users can view their own feedback"
    on public.user_feedback for select
    using (auth.uid() = user_id);

create policy "Users can create feedback"
    on public.user_feedback for insert
    with check (auth.uid() = user_id);

create policy "Admins can manage feedback"
    on public.user_feedback for all
    using (auth.role() = 'service_role');

-- Communication Tools 策略 (所有人可查看基础工具)
create policy "Everyone can view active tools"
    on public.communication_tools for select
    using (is_active = true and is_premium = false);

create policy "Authenticated users can view premium tools"
    on public.communication_tools for select
    using (auth.role() = 'authenticated' and is_active = true);

create policy "Admins can manage tools"
    on public.communication_tools for all
    using (auth.role() = 'service_role');

-- ============================================
-- 权限设置
-- ============================================

-- 给认证用户授予基本权限
grant usage on schema public to authenticated;
grant select on all tables in schema public to authenticated;
grant insert, update, delete on public.profiles to authenticated;
grant insert, update, delete on public.conversations to authenticated;
grant insert on public.messages to authenticated;
grant insert, update on public.learning_progress to authenticated;
grant insert on public.user_feedback to authenticated;

-- 给服务角色授予完全权限
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- ============================================
-- 初始数据插入
-- ============================================

-- 插入默认沟通场景数据
insert into public.scenarios (title, description, category, difficulty, estimated_duration, role, goal, initial_message, topics) values
('工作汇报', '向你的经理汇报项目进展情况', 'work', 'beginner', 10, '项目经理', '清晰传达项目进展，获取反馈和支持', '你好，我想了解一下项目的最新进展情况。', array['项目进度', '团队协作', '问题解决']),
('客户谈判', '与客户讨论合同条款和价格', 'work', 'intermediate', 15, '销售经理', '达成双方满意的协议，维护客户关系', '我们对你们的报价有些顾虑，能否再调整一下？', array['价格谈判', '需求理解', '价值展示']),
('团队冲突', '解决团队成员之间的分歧和冲突', 'work', 'advanced', 20, '团队领导', '调和矛盾，促进团队合作', '我觉得你分配的任务不公平，为什么总是让我做这些？', array['冲突解决', '情绪管理', '团队建设']),
('初次见面', '在社交场合中与陌生人建立连接', 'social', 'beginner', 8, '新认识的朋友', '建立良好第一印象，开启对话', '你好，我是新来的，很高兴认识你。', array['自我介绍', '兴趣发现', '积极倾听']),
('拒绝邀请', '委婉拒绝他人的邀请而不伤害感情', 'social', 'intermediate', 12, '朋友', '清晰表达立场，保持友好关系', '周末要不要一起去爬山？', array['拒绝技巧', '替代方案', '情感安抚']),
('亲子沟通', '与孩子讨论学习和生活问题', 'family', 'beginner', 15, '家长', '建立信任，有效引导', '爸爸/妈妈，我不想去上学了。', array['倾听理解', '情绪安抚', '问题解决']),
('面试沟通', '在求职面试中展示自己的能力', 'work', 'intermediate', 25, '求职者', '充分展示优势，获得工作机会', '请介绍一下你自己和你的工作经验。', array['自我展示', '能力证明', '问题回答']),
('道歉技巧', '真诚道歉并修复关系', 'social', 'intermediate', 10, '朋友/同事', '表达歉意，获得原谅', '你昨天答应的事情没有做到，我很失望。', array['真诚道歉', '承担责任', '修复关系']),
('表扬反馈', '给予他人积极有效的表扬', 'work', 'beginner', 8, '管理者/同事', '鼓励他人，提升团队氛围', '感谢你在项目中的帮助，做得很好！', array['具体表扬', '积极反馈', '鼓励激励']),
('意见分歧', '处理与他人意见不合的情况', 'social', 'advanced', 18, '朋友/同事', '理性讨论，求同存异', '我不同意你的观点，我认为这样做不合适。', array['理性讨论', '尊重差异', '寻求共识']);

-- 插入默认成就数据
insert into public.achievements (name, description, category, requirement_type, requirement_value, points_value, icon_url) values
('对话新手', '完成第一次AI对话练习', 'completion', 'conversations_count', 1, 10, '🎯'),
('沟通达人', '完成10次AI对话练习', 'completion', 'conversations_count', 10, 50, '💬'),
('对话专家', '完成50次AI对话练习', 'completion', 'conversations_count', 50, 200, '🏆'),
('评估先锋', '完成第一次沟通评估', 'completion', 'assessments_score', 1, 15, '📊'),
('优秀沟通者', '评估得分达到80分以上', 'skill', 'assessments_score', 80, 30, '⭐'),
('沟通大师', '评估得分达到95分以上', 'skill', 'assessments_score', 95, 100, '👑'),
('学习坚持者', '连续学习7天', 'streak', 'learning_streak', 7, 40, '🔥'),
('知识探索者', '阅读5篇知识库文章', 'completion', 'articles_read', 5, 25, '📚'),
('阅读达人', '阅读20篇知识库文章', 'completion', 'articles_read', 20, 80, '📖'),
('持续学习者', '连续学习30天', 'streak', 'learning_streak', 30, 150, '🌟');

-- 插入默认沟通工具数据
insert into public.communication_tools (name, description, category, content, difficulty_level) values
('非暴力沟通模板', '基于非暴力沟通模式的表达模板', 'template', '{"structure": ["观察", "感受", "需要", "请求"], "example": "当我看到[观察]，我感到[感受]，因为我需要[需要]，你是否愿意[请求]？"}', 'beginner'),
('沟通准备检查清单', '重要沟通前的准备事项检查', 'checklist', '{"items": ["明确目标", "了解对方", "准备论据", "选择时机", "预估反应"]}', 'beginner'),
('STAR反馈框架', '结构化反馈的STAR框架', 'framework', '{"structure": ["Situation情境", "Task任务", "Action行动", "Result结果"], "usage": "用于工作反馈和绩效评估"}', 'intermediate'),
('积极倾听练习', '提升倾听能力的练习方法', 'exercise', '{"steps": ["专注聆听", "不打断", "提问确认", "总结反馈"], "duration": "15分钟"}', 'beginner'),
('冲突解决五步法', '解决冲突的结构化方法', 'framework', '{"steps": ["冷静情绪", "了解需求", "寻找共识", "制定方案", "跟踪效果"], "usage": "适用于各类冲突场景"}', 'advanced'),
('演讲结构模板', '有效演讲的结构模板', 'template', '{"structure": ["开场", "主体论点", "论据支持", "总结结尾"], "tips": "每个部分控制在2-3分钟"}', 'intermediate');

-- ============================================
-- 创建视图
-- ============================================

-- 用户学习总览视图
create or replace view public.user_learning_overview as
select
    u.id as user_id,
    p.username,
    p.level,
    p.experience_points,
    p.learning_streak,
    count(distinct case when lp.status = 'completed' then lp.content_id end) as completed_items,
    count(c.id) as total_conversations,
    count(a.id) as total_assessments,
    coalesce(avg(c.overall_score), 0) as avg_conversation_score,
    coalesce(avg(a.overall_score), 0) as avg_assessment_score,
    count(ua.id) as total_achievements,
    coalesce(sum(ls.learning_time_seconds), 0) as total_learning_time_seconds
from auth.users u
left join public.profiles p on u.id = p.id
left join public.learning_progress lp on u.id = lp.user_id and lp.status = 'completed'
left join public.conversations c on u.id = c.user_id
left join public.assessments a on u.id = a.user_id
left join public.user_achievements ua on u.id = ua.user_id
left join public.learning_statistics ls on u.id = ls.user_id
group by u.id, p.username, p.level, p.experience_points, p.learning_streak;

-- 场景统计视图
create or replace view public.scenario_statistics as
select
    s.id,
    s.title,
    s.category,
    s.difficulty,
    s.is_premium,
    count(c.id) as usage_count,
    coalesce(avg(c.overall_score), 0) as avg_score,
    coalesce(avg(c.language_expression_score), 0) as avg_language_score,
    coalesce(avg(c.emotional_management_score), 0) as avg_emotional_score,
    coalesce(avg(c.logical_structure_score), 0) as avg_logic_score,
    coalesce(avg(c.communication_effectiveness_score), 0) as avg_effectiveness_score
from public.scenarios s
left join public.conversations c on s.id = c.scenario_id
group by s.id, s.title, s.category, s.difficulty, s.is_premium;

-- 热门文章视图
create or replace view public.popular_articles as
select
    a.id,
    a.title,
    a.category,
    a.subcategory,
    a.view_count,
    a.like_count,
    a.reading_time,
    a.difficulty_level,
    a.is_premium,
    a.published_at,
    (a.view_count * 0.7 + a.like_count * 0.3) as popularity_score
from public.articles a
where a.is_published = true
order by popularity_score desc;

-- ============================================
-- 创建函数
-- ============================================

-- 计算用户级别函数
create or replace function public.calculate_user_level(p_experience_points integer)
returns integer as $$
declare
    v_level integer;
begin
    -- 级别计算公式: 每级需要的经验值 = level * 100
    v_level := floor(sqrt(p_experience_points / 100::float)) + 1;
    return v_level;
end;
$$ language plpgsql immutable;

-- 更新用户级别和经验值
create or replace function public.update_user_experience(p_user_id uuid, p_experience_gained integer)
returns void as $$
declare
    v_current_level integer;
    v_new_level integer;
    v_current_experience integer;
    v_new_experience integer;
begin
    -- 获取当前经验和级别
    select experience_points, level into v_current_experience, v_current_level
    from public.profiles
    where id = p_user_id;

    if v_current_experience is not null then
        -- 更新经验值
        v_new_experience := v_current_experience + p_experience_gained;

        -- 计算新级别
        v_new_level := public.calculate_user_level(v_new_experience);

        -- 更新用户资料
        update public.profiles
        set
            experience_points = v_new_experience,
            level = v_new_level
        where id = p_user_id;
    end if;
end;
$$ language plpgsql security definer;

-- 检查并颁发成就
create or replace function public.check_and_award_achievements(p_user_id uuid)
returns void as $$
declare
    v_achievement record;
    v_requirement_met boolean;
    v_current_value integer;
begin
    -- 检查所有活跃成就
    for v_achievement in
        select * from public.achievements
        where is_active = true
        and id not in (
            select achievement_id from public.user_achievements
            where user_id = p_user_id
        )
    loop
        v_requirement_met := false;
        v_current_value := 0;

        -- 根据要求类型检查条件
        case v_achievement.requirement_type
            when 'conversations_count' then
                select count(*) into v_current_value
                from public.conversations
                where user_id = p_user_id;

            when 'assessments_score' then
                select max(overall_score) into v_current_value
                from public.assessments
                where user_id = p_user_id;

            when 'learning_streak' then
                select learning_streak into v_current_value
                from public.profiles
                where id = p_user_id;

            when 'articles_read' then
                select count(*) into v_current_value
                from public.learning_progress lp
                join public.articles a on lp.content_id = a.id
                where lp.user_id = p_user_id
                and lp.content_type = 'article'
                and lp.status = 'completed';
        end case;

        -- 检查是否满足要求
        if v_current_value >= v_achievement.requirement_value then
            -- 颁发成就
            insert into public.user_achievements (user_id, achievement_id)
            values (p_user_id, v_achievement.id_id);

            -- 更新用户经验值
            perform public.update_user_experience(p_user_id, v_achievement.points_value);
        end if;
    end loop;
end;
$$ language plpgsql security definer;

-- 更新每日学习统计
create or replace function public.update_daily_learning_stats(p_user_id uuid, p_content_type text, p_time_spent_seconds integer default 0)
returns void as $$
declare
    v_today date := current_date;
    v_experience_gained integer := 10; -- 默认获得10经验值
begin
    -- 更新或创建今日统计
    insert into public.learning_statistics (
        user_id, date, conversations_completed, messages_sent,
        articles_read, assessments_taken, learning_time_seconds, experience_gained
    )
    values (
        p_user_id, v_today,
        case when p_content_type = 'scenario' then 1 else 0 end,
        case when p_content_type = 'scenario' then 1 else 0 end,
        case when p_content_type = 'article' then 1 else 0 end,
        case when p_content_type = 'assessment' then 1 else 0 end,
        p_time_spent_seconds,
        v_experience_gained
    )
    on conflict (user_id, date)
    do update set
        conversations_completed = learning_statistics.conversations_completed +
            case when p_content_type = 'scenario' then 1 else 0 end,
        messages_sent = learning_statistics.messages_sent +
            case when p_content_type = 'scenario' then 1 else 0 end,
        articles_read = learning_statistics.articles_read +
            case when p_content_type = 'article' then 1 else 0 end,
        assessments_taken = learning_statistics.assessments_taken +
            case when p_content_type = 'assessment' then 1 else 0 end,
        learning_time_seconds = learning_statistics.learning_time_seconds + p_time_spent_seconds,
        experience_gained = learning_statistics.experience_gained + v_experience_gained;

    -- 更新用户经验值
    perform public.update_user_experience(p_user_id, v_experience_gained);

    -- 检查成就
    perform public.check_and_award_achievements(p_user_id);
end;
$$ language plpgsql security definer;

-- ============================================
-- 函数注释
-- ============================================

comment on function public.calculate_user_level(integer) is '根据经验值计算用户级别';
comment on function public.update_user_experience(uuid, integer) is '更新用户的经验值和级别';
comment on function public.check_and_award_achievements(uuid) is '检查并给用户颁发符合条件的成就';
comment on function public.update_daily_learning_stats(uuid, text, integer) is '更新用户每日学习统计数据';

-- ============================================
-- 完成
-- ============================================

-- 创建表结构完成时间
-- 时间: 2025-11-22
-- 版本: v1.0
-- 描述: 沟通大师业务数据库表结构完整创建脚本