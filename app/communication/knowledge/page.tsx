'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

// 扩展的文章接口，整合ref-project的丰富内容
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory?: string;
  tags: string[];
  readTime: string;
  date: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  featuredImage: string;
  isFeatured: boolean;
  author?: {
    name: string;
    avatar: string;
    role: string;
  };
}

// 扩展的文章数据，整合ref-project的丰富内容
const articles: Article[] = [
  {
    id: 'article-1',
    title: "非暴力沟通的4个关键步骤",
    excerpt: "学习如何通过观察、感受、需要和请求四个步骤，建立更健康的沟通方式...",
    content: `非暴力沟通（Nonviolent Communication, NVC）是一种由马歇尔·卢森堡博士创立的沟通方法，旨在通过同理心和尊重建立更深入的连接。它包含四个核心步骤：

### 1. 观察（Observation）
观察是指客观地描述我们所看到、听到或感知到的事实，而不添加评判、解读或指责。

**关键要点：**
- 区分观察与评判：避免使用"总是"、"从不"等绝对化词语
- 具体而非笼统：描述具体的行为和事件
- 基于事实而非假设：只说确定的事情

**示例：**
- ❌ 评判："你总是迟到"
- ✅ 观察："这周你有三次会议迟到了15分钟"

### 2. 感受（Feeling）
感受是表达我们内心的情绪状态，帮助我们与他人建立情感连接。

**关键要点：**
- 区分感受与想法：感受是情绪，想法是对事物的判断
- 丰富情绪词汇：超越"好"、"坏"等简单表达
- 真诚表达：不隐藏或夸大情绪

**常见感受词汇：**
- 正面感受：开心、兴奋、满足、感激、平静、自信
- 负面感受：失望、焦虑、沮丧、困惑、担忧、疲惫

### 3. 需要（Needs）
需要是指我们内心深处的价值、愿望和期望，这些是所有人共通的基本需求。

**基本人类需要：**
- 生理需要：食物、住所、休息、健康
- 安全需要：稳定、保护、秩序、自由
- 社交需要：归属、连接、理解、支持
- 尊重需要：认可、价值、能力、自主
- 成长需要：学习、创造、意义、贡献

**表达方式：**
- ❌ 指责："你让我很生气"
- ✅ 表达需要："我需要尊重和理解"

### 4. 请求（Request）
请求是明确、具体地提出我们希望他人采取的行动，同时尊重对方的自主权。

**有效请求的特点：**
- 积极具体：说明想要什么，而不是不要什么
- 可行操作：对方能够实际执行的行动
- 当前行动：关注现在可以做的事情
- 尊重选择：给对方说"不"的权利

**示例：**
- ❌ 模糊请求："我希望你更负责任"
- ✅ 具体请求："你愿意在下班前给我发一份项目进展报告吗？"

### 实践技巧

1. **自我对话练习**：每天花时间用NVC框架与自己对话
2. **角色扮演**：与朋友或家人练习NVC沟通
3. **记录反思**：写下沟通经历，分析如何改进
4. **耐心培养**：NVC需要时间掌握，对自己和他人都要有耐心

通过持续练习非暴力沟通，我们可以建立更真实、更有连接的人际关系，创造更和谐的生活和工作环境。`,
    category: "沟通技巧",
    subcategory: "非暴力沟通",
    tags: ["非暴力沟通", "情绪管理", "冲突解决", "同理心"],
    readTime: "15分钟",
    date: "2023-11-01",
    level: "intermediate",
    isPremium: false,
    featuredImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=nonviolent%20communication%20model%20chart%2C%20psychology%20infographic&sign=e31dde8bf0006a657874164bd8454646",
    isFeatured: true,
    author: {
      name: '张心理',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20psychologist%20avatar&sign=f1b257cbbbf3fe8f5ff9b57badcbab20',
      role: '心理学专家'
    }
  },
  {
    id: 'article-2',
    title: '情绪智能在沟通中的应用',
    excerpt: '了解如何识别和管理自己的情绪，同时理解他人的情绪，提升沟通效果...',
    content: `情绪智能（Emotional Intelligence, EI）是指识别、理解和管理自己的情绪，以及识别、理解和影响他人情绪的能力。在沟通中，情绪智能起着至关重要的作用，它能够帮助我们建立更好的人际关系，解决冲突，并更有效地传达信息。

### 情绪智能的四个核心要素

#### 1. 自我意识（Self-Awareness）
自我意识是指识别和理解自己的情绪、优势、劣势、价值观和动机的能力。在沟通中，自我意识帮助我们了解自己的情绪如何影响我们的沟通方式和决策。

**提升自我意识的方法：**
- 每天花几分钟时间反思自己的情绪和反应
- 记录情绪日记，跟踪情绪变化及其触发因素
- 寻求他人的反馈，了解自己的沟通风格
- 练习正念冥想，增强对当下情绪的觉察

**实际应用：**
- 在重要对话前，检查自己的情绪状态
- 识别自己的情绪触发点，提前准备应对策略
- 了解自己的沟通习惯和盲点

#### 2. 自我管理（Self-Management）
自我管理是指控制或调节自己的情绪，适应变化，以及在面对挑战时保持积极态度的能力。在沟通中，自我管理帮助我们在压力情境下保持冷静和专业。

**提升自我管理的方法：**
- 学习深呼吸和放松技巧，帮助缓解压力
- 设定明确的目标和计划，减少不确定性带来的焦虑
- 培养积极的思维模式，关注解决方案而非问题
- 练习延迟满足，控制冲动反应

**实际应用：**
- 在收到负面反馈时，先深呼吸再回应
- 在冲突中保持冷静，避免情绪化决策
- 调整自己的情绪状态以适应不同的沟通场景

#### 3. 社交意识（Social Awareness）
社交意识是指理解他人的情绪、需求和关注点，以及理解组织和社会环境的能力。在沟通中，社交意识帮助我们更好地理解他人的观点和感受。

**提升社交意识的方法：**
- 练习积极倾听，关注对方的言语和非言语线索
- 尝试从他人的角度思考问题，培养同理心
- 观察和学习有效的沟通者如何与他人互动
- 注意群体动态和文化差异

**实际应用：**
- 察觉他人的情绪变化，及时调整沟通方式
- 理解非言语信号，如肢体语言和面部表情
- 在团队中识别潜在的情绪和冲突

#### 4. 关系管理（Relationship Management）
关系管理是指建立和维护健康的关系，有效地沟通和解决冲突，以及激励和影响他人的能力。在沟通中，关系管理帮助我们建立信任和合作。

**提升关系管理的方法：**
- 学习有效的反馈技巧，既表达欣赏也提供建设性批评
- 练习冲突解决策略，寻求双赢的解决方案
- 培养团队合作和领导能力，建立积极的工作关系
- 发展影响力和说服技巧

**实际应用：**
- 在困难对话中保持关系的完整性
- 激励团队成员达成共同目标
- 建立和维护专业网络

### 情绪智能在沟通中的实际应用

#### 1. 在压力情境中保持冷静
通过自我意识和自我管理，识别压力信号并采取措施缓解：
- 认识到身体反应：心跳加速、呼吸急促、肌肉紧张
- 使用4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒
- 暂停反应，给自己思考的时间

#### 2. 理解他人的观点
通过社交意识，尝试从对方的角度理解问题：
- 提问以深入了解对方的想法和感受
- 反馈确认理解："我听到你说的是..."
- 避免过早评判或给出建议

#### 3. 有效地处理冲突
结合所有情绪智能技能来处理冲突：
- 保持冷静，控制情绪反应
- 理解各方的需求和担忧
- 寻找满足所有人核心需求的解决方案
- 维护关系，即使存在分歧

#### 4. 提供和接收反馈
运用情绪智能来处理反馈：
- 提供反馈时：选择合适的时机和方式，关注具体行为
- 接收反馈时：保持开放心态，避免防御性反应
- 将反馈视为成长的机会而非批评

### 情绪智能的发展策略

#### 短期策略（1-3个月）
1. **情绪日记**：每天记录主要情绪及其触发因素
2. **正念练习**：每天10分钟的正念冥想
3. **寻求反馈**：向信任的人寻求关于自己沟通风格的反馈

#### 中期策略（3-6个月）
1. **情绪词汇扩展**：学习更丰富的情绪描述词汇
2. **冲突角色扮演**：在安全环境中练习处理困难对话
3. **观察学习**：观察高情绪智能人士的沟通方式

#### 长期策略（6个月以上）
1. **持续反思**：定期反思自己的沟通经历和成长
2. **指导他人**：帮助他人发展情绪智能
3. **复杂情境练习**：在越来越复杂的情境中应用情绪智能

### 情绪智能的测量工具

1. **自我评估问卷**：如MSCEIT（Mayer-Salovey-Caruso Emotional Intelligence Test）
2. **360度反馈**：从同事、朋友、家人处获得多角度反馈
3. **行为观察**：通过实际行为表现评估情绪智能水平

### 案例分析

#### 案例1：职场冲突解决
**情境**：团队成员因项目方向产生激烈争执
**应用EI**：
- 团队领导运用自我意识，认识到自己的焦虑
- 通过社交意识，察觉团队成员的担忧和需求
- 使用关系管理技能，引导建设性对话
- 结果：达成共识，团队凝聚力增强

#### 案例2：客户服务
**情境**：面对愤怒的客户投诉
**应用EI**：
- 客服代表保持自我管理，不因客户情绪而激动
- 展示社交意识，理解客户的失望和需求
- 运用关系管理，将负面体验转为正面关系
- 结果：客户满意，忠诚度提升

通过系统性地发展和应用情绪智能，我们可以显著提升沟通效果，建立更健康的人际关系，并在个人和职业生活中取得更大的成功。`,
    category: "情绪管理",
    subcategory: "情绪智能",
    tags: ["情绪智能", "自我意识", "社交意识", "沟通技巧"],
    readTime: "20分钟",
    date: "2023-11-15",
    level: "advanced",
    isPremium: true,
    featuredImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=emotional%20intelligence%20brain%20psychology%20infographic&sign=98a4f1aed5b7bdd5d44e7534ba2b6a01",
    isFeatured: true,
    author: {
      name: '李情商',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=emotional%20intelligence%20expert%20avatar&sign=f2c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7',
      role: '情商培训师'
    }
  },
  {
    id: 'article-3',
    title: '职场冲突解决的心理学策略',
    excerpt: '掌握基于心理学的冲突解决技巧，将职场矛盾转化为合作机会...',
    content: `职场冲突是不可避免的，但冲突本身并非坏事。关键在于我们如何处理这些冲突。基于心理学的冲突解决策略可以帮助我们将潜在的破坏性局面转化为建设性的对话和合作机会。

### 冲突的心理学基础

#### 1. 冲突的根源
职场冲突通常源于以下几个方面：

**认知差异**
- 不同的信息处理方式
- 价值观和信念的差异
- 对事实的不同解读

**利益冲突**
- 资源分配竞争
- 目标优先级不同
- 职责边界不清

**情感因素**
- 个人情绪状态
- 过去的负面经历
- 自尊和身份威胁

**沟通障碍**
- 信息传递不畅
- 语言表达差异
- 非言语信号误解

#### 2. 冲突的发展阶段
冲突通常遵循以下发展阶段：

**潜伏期**：潜在差异存在，但尚未显现
- 不同的工作风格或价值观
- 资源或认可竞争
- 沟通渠道不畅

**感知期**：一方开始意识到差异或问题
- 认识到利益或观点不同
- 开始产生负面情绪
- 寻求确认和支持

**显现期**：冲突变得明显和公开
- 直接或间接的对抗
- 情绪化反应增加
- 形成对立阵营

**升级期**：冲突强度和范围扩大
- 涉及更多人员或问题
- 采取破坏性行为
- 关系严重受损

**僵持期**：冲突陷入僵局
- 沟通完全中断
- 拒绝妥协或合作
- 可能寻求外部干预

### 心理学冲突解决模型

#### 1. Thomas-Kilmann冲突处理模式
这个模型描述了五种主要的冲突处理风格：

**竞争（Competing）**
- 特点：高坚持性，低合作性
- 适用场景：紧急决策、重要原则问题
- 优势：快速决策，维护立场
- 风险：损害关系，可能输赢皆输

**合作（Collaborating）**
- 特点：高坚持性，高合作性
- 适用场景：复杂问题，长期关系
- 优势：双赢解决方案，深度理解
- 风险：耗时较长，需要双方投入

**妥协（Compromising）**
- 特点：中等坚持性，中等合作性
- 适用场景：时间压力，平等关系
- 优势：快速解决方案，双方都能接受
- 风险：可能不是最优解

**回避（Avoiding）**
- 特点：低坚持性，低合作性
- 适用场景：问题不重要，情绪激动时
- 优势：避免升级，争取时间
- 风险：问题未解决，可能积累

**迁就（Accommodating）**
- 特点：低坚持性，高合作性
- 适用场景：对方更重要，维护关系
- 优势：保持和谐，快速解决
- 风险：可能被利用，需求未满足

#### 2. 利益为本的谈判（Interest-Based Relational Approach）
这种方法关注核心利益而非立场：

**原则**
- 分离人与问题
- 关注利益而非立场
- 创造互利选项
- 使用客观标准

**实施步骤**
1. **分析利益**：识别各方的核心需求和关切
2. **生成选项**：头脑风暴可能的解决方案
3. **评估标准**：建立公平的评估标准
4. **达成协议**：选择最佳方案并制定实施计划

### 实用的冲突解决技巧

#### 1. 积极倾听技巧
**全神贯注**
- 保持眼神接触，展示专注
- 避免打断，让对方完整表达
- 使用点头等非语言反馈

**理解确认**
- 复述关键点："我听到你说的是..."
- 询问澄清问题："你能详细说明一下吗？"
- 总结理解："所以你的主要关切是..."

**情感确认**
- 承认情绪："我能理解你感到沮丧"
- 正常化感受："在这种情况下，有这种反应很正常"
- 避免评判："这不是对错问题"

#### 2. 情绪管理策略
**自我调节**
- 深呼吸练习：4-7-8呼吸法
- 暂停技巧：请求短暂休息
- 认知重构：重新框架问题

**情绪调节**
- 识别触发点：了解自己的情绪按钮
- 选择回应：有意识地选择反应方式
- 寻求支持：在需要时寻求帮助

#### 3. 问题解决方法
**定义问题**
- 具体描述：明确问题的具体表现
- 区分症状：识别表面问题和深层原因
- 共识确认：确保对问题有共同理解

**生成方案**
- 头脑风暴：鼓励创造性思维
- 数量优先：先产生多个选项
- 暂缓评判：避免过早否定想法

**评估选择**
- 标准建立：确定评估标准
- 利弊分析：分析每个选项的优缺点
- 影响评估：考虑对各方的潜在影响

#### 4. 沟通策略
**我-语句**
使用"我"开头表达自己的感受和需求：
- "我感到担忧当项目延期时"
- "我需要更频繁的进展更新"
- "我希望我们能一起找到解决方案"

**避免指责**
- 不使用"你总是"等绝对化语言
- 聚焦行为而非人格
- 避免过去错误的重提

**建设性反馈**
- 具体而非笼统
- 描述行为而非意图
- 提供改进建议

### 不同类型冲突的处理策略

#### 1. 任务冲突
**特点**：关于工作内容、目标或方法的分歧
**策略**：
- 聚焦事实和数据
- 使用客观标准评估
- 寻求专家意见或最佳实践

#### 2. 关系冲突
**特点**：人际关系中的紧张和矛盾
**策略**：
- 优先处理情感问题
- 建立信任和尊重
- 使用第三方调解

#### 3. 过程冲突
**特点**：关于如何完成任务的方法分歧
**策略**：
- 明确角色和职责
- 建立清晰的流程
- 定期检查和调整

#### 4. 地位冲突
**特点**：关于权力、权威或认可的竞争
**策略**：
- 重新定义成功标准
- 建立公平的评估机制
- 关注团队整体目标

### 预防冲突的策略

#### 1. 建立清晰的期望
- 明确角色和职责
- 设定具体的目标和标准
- 建立有效的沟通渠道

#### 2. 促进积极文化
- 鼓励开放和诚实的沟通
- 庆祝多样性和不同观点
- 建立心理安全的环境

#### 3. 定期检查和调整
- 定期团队会议和反馈
- 及时解决小问题
- 持续改进工作流程

#### 4. 培训和发展
- 提供冲突解决培训
- 发展沟通和情商技能
- 建立指导和支持系统

### 冲突后的恢复和成长

#### 1. 关系修复
- 诚恳道歉和原谅
- 重建信任和尊重
- 制定未来的合作计划

#### 2. 学习和反思
- 分析冲突的根本原因
- 总结经验教训
- 改进系统和流程

#### 3. 个人成长
- 发展新的技能和能力
- 增强自我意识
- 建立韧性

通过系统性地应用这些基于心理学的冲突解决策略，我们可以将职场冲突转化为个人和组织成长的机会，建立更健康、更高效的工作环境。`,
    category: "职场沟通",
    subcategory: "冲突解决",
    tags: ["冲突解决", "职场沟通", "心理学", "谈判技巧"],
    readTime: "25分钟",
    date: "2023-12-01",
    level: "advanced",
    isPremium: true,
    featuredImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=workplace%20conflict%20resolution%20people%20problem%20solving&sign=f51f25feeca340ab0678748075a0b759",
    isFeatured: true,
    author: {
      name: '王组织',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=organizational%20psychologist%20professional%20avatar&sign=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      role: '组织心理学专家'
    }
  },
  {
    id: 'article-4',
    title: '有效倾听：成为更好的沟通者的第一步',
    excerpt: "倾听不仅是听见，更是理解和共情。本文将教你如何成为一个更好的倾听者，建立更深层次的沟通。",
    content: "倾听是沟通的基础，但很多人并不擅长倾听。有效的倾听需要专注、共情和理解。\n\n首先，保持眼神接触表明你在认真关注对方。其次，避免打断对方说话，这不仅不礼貌，还会打断对方的思路。第三，使用非语言反馈，如点头或微笑，表示你在认真听。最后，提出开放式问题，鼓励对方进一步表达。\n\n通过实践这些技巧，你会发现你的人际关系和沟通效果都会显著提升。",
    category: "倾听技巧",
    tags: ["倾听", "沟通基础", "人际关系"],
    readTime: "5分钟",
    date: "2023-11-01",
    level: "beginner",
    isPremium: false,
    featuredImage: "/images/effective-listening.jpg",
    isFeatured: false
  },
  {
    id: 'article-5',
    title: '肢体语言：无声的沟通力量',
    excerpt: '了解肢体语言的重要性，以及如何使用它来增强你的口头沟通。',
    content: "研究表明，我们的沟通中约有55%是非语言的。肢体语言可以传达丰富的信息，有时甚至比言语更有力量。\n\n有效的肢体语言包括：开放的姿态（避免交叉双臂）、保持适当的个人空间、使用手势强调重点、保持良好的姿势等。\n\n同时，注意观察他人的肢体语言，这可以帮助你更好地理解对方的真实感受和想法。",
    category: "非语言沟通",
    tags: ["肢体语言", "非语言沟通", "自信表达"],
    readTime: "6分钟",
    date: "2023-12-02",
    level: "beginner",
    isPremium: false,
    featuredImage: "/images/body-language.jpg",
    isFeatured: false
  },
  {
    id: 'article-6',
    title: '跨文化沟通：如何与不同背景的人有效交流',
    excerpt: '在全球化的世界中，跨文化沟通技能变得越来越重要。本文提供实用的跨文化沟通指南。',
    content: "跨文化沟通需要意识、开放心态和适应能力。关键技巧包括：\n\n- 了解基本的文化差异（如高语境vs低语境文化）\n- 避免刻板印象，但注意文化倾向\n- 学习基本的礼仪和禁忌\n- 使用简单、清晰的语言\n- 提问以澄清理解\n\n最重要的是保持尊重和好奇心，将差异视为学习和成长的机会。",
    category: "跨文化沟通",
    tags: ["文化差异", "全球化", "适应性"],
    readTime: "7分钟",
    date: "2024-01-20",
    level: "intermediate",
    isPremium: false,
    featuredImage: "/images/cross-cultural.jpg",
    isFeatured: false
  }
];

// 分类接口
interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
  color: string;
}

// 分类数据
const categories: Category[] = [
  {
    id: 'communication-skills',
    name: '沟通技巧',
    icon: '💬',
    count: 1,
    description: '掌握核心沟通技能，提升表达效果',
    color: 'blue'
  },
  {
    id: 'emotional-management',
    name: '情绪管理',
    icon: '💝',
    count: 1,
    description: '学习情绪智能，建立健康沟通模式',
    color: 'purple'
  },
  {
    id: 'workplace-communication',
    name: '职场沟通',
    icon: '💼',
    count: 1,
    description: '职场中的有效沟通策略和技巧',
    color: 'green'
  },
  {
    id: 'listening-skills',
    name: '倾听技巧',
    icon: '👂',
    count: 1,
    description: '成为更好的倾听者，建立深层连接',
    color: 'orange'
  },
  {
    id: 'nonverbal-communication',
    name: '非语言沟通',
    icon: '🎭',
    count: 1,
    description: '理解肢体语言和非言语信号',
    color: 'red'
  },
  {
    id: 'cross-cultural',
    name: '跨文化沟通',
    icon: '🌍',
    count: 1,
    description: '在全球化环境中有效沟通',
    color: 'indigo'
  }
];

// 获取所有分类
const categoryList = [...new Set(articles.map(article => article.category))];

// 获取所有标签
const allTags = [...new Set(articles.flatMap(article => article.tags))];

// 文章卡片组件
const ArticleCard: React.FC<{ article: Article; theme: string }> = ({ article, theme }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "overflow-hidden rounded-xl",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={article.featuredImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/default-article.jpg';
          }}
        />
        {article.isPremium && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ 高级内容
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
          )}>
            {article.category}
          </span>
          <div className="flex gap-2">
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getLevelColor(article.level)
            )}>
              {getLevelText(article.level)}
            </span>
            <span className={cn(
              "text-sm",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {article.readTime}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className={cn(
          "mb-4 line-clamp-3",
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          {article.excerpt}
        </p>
        {article.author && (
          <div className="flex items-center gap-2 mb-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/default-avatar.jpg';
              }}
            />
            <div className="text-sm">
              <div className={cn(
                "font-medium",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {article.author.name}
              </div>
              <div className={cn(
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {article.author.role}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={cn(
              "px-2 py-1 rounded-md text-xs",
              theme === 'dark' ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            )}>
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className={cn(
              "px-2 py-1 rounded-md text-xs",
              theme === 'dark' ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-500'
            )}>
              +{article.tags.length - 3}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            {article.date}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
              theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            阅读全文
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// 特色文章组件
const FeaturedArticle: React.FC<{ article: Article; theme: string }> = ({ article, theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-xl border border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
      <img
        src={article.featuredImage}
        alt={article.title}
        className="w-full h-80 md:h-96 object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/default-article.jpg';
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            'bg-blue-600 text-white'
          )}>
            {article.category}
          </span>
          {article.isPremium && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ 高级内容
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          {article.title}
        </h2>
        <p className="text-sm md:text-base opacity-90 mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs">
              {tag}
            </span>
          ))}
        </div>
        {article.author && (
          <div className="flex items-center gap-2 mb-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-8 h-8 rounded-full border-2 border-white/20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/default-avatar.jpg';
              }}
            />
            <div className="text-sm">
              <div className="font-medium opacity-90">
                {article.author.name}
              </div>
              <div className="opacity-70">
                {article.author.role}
              </div>
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 bg-white text-blue-600 rounded-lg font-medium transition-colors duration-200 hover:bg-gray-100"
        >
          阅读全文
        </motion.button>
      </div>
    </motion.div>
  );
};

// 分类卡片组件
const CategoryCard: React.FC<{ category: Category; theme: string; onClick: () => void }> = ({ category, theme, onClick }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return {
        bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
        border: theme === 'dark' ? 'border-blue-700' : 'border-blue-200',
        text: theme === 'dark' ? 'text-blue-300' : 'text-blue-700',
        hover: theme === 'dark' ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100'
      };
      case 'purple': return {
        bg: theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50',
        border: theme === 'dark' ? 'border-purple-700' : 'border-purple-200',
        text: theme === 'dark' ? 'text-purple-300' : 'text-purple-700',
        hover: theme === 'dark' ? 'hover:bg-purple-900/30' : 'hover:bg-purple-100'
      };
      case 'green': return {
        bg: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
        border: theme === 'dark' ? 'border-green-700' : 'border-green-200',
        text: theme === 'dark' ? 'text-green-300' : 'text-green-700',
        hover: theme === 'dark' ? 'hover:bg-green-900/30' : 'hover:bg-green-100'
      };
      case 'orange': return {
        bg: theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50',
        border: theme === 'dark' ? 'border-orange-700' : 'border-orange-200',
        text: theme === 'dark' ? 'text-orange-300' : 'text-orange-700',
        hover: theme === 'dark' ? 'hover:bg-orange-900/30' : 'hover:bg-orange-100'
      };
      case 'red': return {
        bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
        border: theme === 'dark' ? 'border-red-700' : 'border-red-200',
        text: theme === 'dark' ? 'text-red-300' : 'text-red-700',
        hover: theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-100'
      };
      case 'indigo': return {
        bg: theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-50',
        border: theme === 'dark' ? 'border-indigo-700' : 'border-indigo-200',
        text: theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700',
        hover: theme === 'dark' ? 'hover:bg-indigo-900/30' : 'hover:bg-indigo-100'
      };
      default: return {
        bg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
        border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
        text: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
        hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      };
    }
  };

  const colors = getColorClasses(category.color);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "p-6 rounded-xl border cursor-pointer transition-all duration-200",
        colors.bg, colors.border, colors.hover
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{category.icon}</div>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          colors.text
        )}>
          {category.count} 篇
        </span>
      </div>
      <h3 className={cn(
        "text-lg font-bold mb-2",
        colors.text
      )}>
        {category.name}
      </h3>
      <p className={cn(
        "text-sm",
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {category.description}
      </p>
    </motion.div>
  );
};

export default function KnowledgePage() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // 过滤文章
  useEffect(() => {
    let filtered = articles;

    // 按分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // 按标签过滤
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article =>
        selectedTags.every(tag => article.tags.includes(tag))
      );
    }

    // 按搜索查询过滤
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 按级别过滤
    if (levelFilter !== 'all') {
      filtered = filtered.filter(article => article.level === levelFilter);
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, selectedTags, searchQuery, levelFilter]);

  // 切换标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 清除所有筛选
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
    setSearchQuery('');
    setLevelFilter('all');
  };

  // 获取特色文章
  const featuredArticles = articles.filter(article => article.isFeatured);
  const mainFeaturedArticle = featuredArticles[0];
  const otherFeaturedArticles = featuredArticles.slice(1);

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === 'dark' ? 'bg-slate-900 text-gray-100' : 'bg-white text-gray-800'
    )}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-blue-900 dark:text-blue-300">
              沟通技巧知识库
            </h1>
            <p className={cn(
              "text-lg",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              探索专业的沟通技巧文章，提升你的沟通能力
            </p>
          </div>
        </div>

        {/* 主要特色文章 */}
        {mainFeaturedArticle && (
          <div className="mb-12">
            <FeaturedArticle article={mainFeaturedArticle} theme={theme} />
          </div>
        )}

        {/* 标签切换 */}
        <div className={cn(
          "flex gap-2 mb-8 p-1 rounded-lg",
          theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
        )}>
          <button
            onClick={() => setActiveTab('articles')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200",
              activeTab === 'articles'
                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-sm'
                : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            )}
          >
            文章浏览
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200",
              activeTab === 'categories'
                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-sm'
                : theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            )}
          >
            分类浏览
          </button>
        </div>

        {activeTab === 'articles' ? (
          <>
            {/* 搜索和筛选区域 */}
            <div className={cn(
              "p-6 rounded-xl mb-8",
              theme === 'dark' ? 'bg-slate-800' : 'bg-white',
              'shadow-md border border-gray-200 dark:border-gray-700'
            )}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                      theme === 'dark'
                        ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 focus:border-blue-500 placeholder-gray-500'
                    )}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn("text-sm whitespace-nowrap", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>难度级别:</span>
                  <div className="flex gap-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setLevelFilter(level)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200",
                          levelFilter === level
                            ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        )}
                      >
                        {level === 'all' ? '全部' : level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn("text-sm", theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>视图模式:</span>
                  <div className="flex rounded-lg overflow-hidden border">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2",
                        viewMode === 'grid'
                          ? theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-500'
                      )}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2",
                        viewMode === 'list'
                          ? theme === 'dark' ? 'bg-slate-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-500'
                      )}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  {(selectedCategory !== 'all' || selectedTags.length > 0 || searchQuery !== '' || levelFilter !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-colors duration-200",
                        theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      )}
                    >
                      清除筛选
                    </button>
                  )}
                </div>
              </div>

              {/* 分类筛选 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">按分类筛选</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                      selectedCategory === 'all'
                        ? theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    )}
                  >
                    全部
                  </button>
                  {categoryList.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                        selectedCategory === category
                          ? theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                          : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 标签筛选 */}
              <div>
                <h3 className="text-lg font-medium mb-3">按标签筛选</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-colors duration-200",
                        selectedTags.includes(tag)
                          ? theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                          : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      )}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <span className="ml-1">×</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 文章列表 */}
            {filteredArticles.length > 0 ? (
              <motion.div
                layout
                className={viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
                }
              >
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArticleCard article={article} theme={theme} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className={cn(
                "p-12 rounded-xl text-center",
                theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                'shadow-md border border-gray-200 dark:border-gray-700'
              )}>
                <div className="inline-block p-4 rounded-full mb-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">未找到相关文章</h3>
                <p className={cn(
                  "mb-4",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  尝试更改筛选条件或搜索查询
                </p>
                <button
                  onClick={clearFilters}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  )}
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 分类浏览 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  theme={theme}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setActiveTab('articles');
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* 其他特色文章 */}
        {otherFeaturedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">更多精选文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherFeaturedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} theme={theme} />
              ))}
            </div>
          </div>
        )}

        {/* 知识挑战部分 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className={cn(
            "mt-16 p-8 rounded-2xl relative overflow-hidden",
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50'
              : 'bg-gradient-to-br from-blue-50 to-indigo-50',
            'shadow-lg border border-gray-200 dark:border-gray-700'
          )}
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">知识挑战</h2>
            <p className={cn(
              "mb-6 max-w-2xl",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              测试你的沟通知识，通过互动式测验巩固所学技能。每完成一个挑战，获取积分和徽章！
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                )}
              >
                开始挑战
                <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
                  theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 dark:border-gray-600'
                )}
              >
                查看排行榜
              </motion.button>
            </div>
          </div>

          {/* 装饰元素 */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute -left-12 -top-12 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl"></div>
        </motion.div>
      </div>
    </div>
  );
}