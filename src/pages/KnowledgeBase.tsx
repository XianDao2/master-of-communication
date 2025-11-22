import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';

// Types for knowledge base components
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory: string;
  tags: string[];
  readTime: string;
  date: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  imageUrl: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  usage: string;
  isPremium: boolean;
  imageUrl: string;
}

export default function KnowledgeBase() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const [selectedView, setSelectedView] = useState<'articles' | 'tools' | 'categories'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Mock data for categories
  const categories: Category[] = [
    { id: 'all', name: '全部', icon: 'fa-th-large', count: 30, imageUrl: '' },
    { 
      id: 'basic', 
      name: '基础技巧', 
      icon: 'fa-graduation-cap', 
      count: 10,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=basic%20communication%20skills%20psychology%20concept&sign=9e3548d303ebb04f5002b879ec238986"
    },
    { 
      id: 'emotion', 
      name: '情绪管理', 
      icon: 'fa-heart', 
      count: 8,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=emotion%20management%20psychology%20concept%20mindfulness&sign=547ac421bca0526af4fb08993b92e6f7"
    },
    { 
      id: 'work', 
      name: '职场沟通', 
      icon: 'fa-briefcase', 
      count: 6,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=workplace%20communication%20team%20collaboration%20business%20concept&sign=f05936ea832635f632994537edb47193"
    },
    { 
      id: 'social', 
      name: '社交互动', 
      icon: 'fa-users', 
      count: 4,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=social%20interaction%20people%20communication%20psychology%20concept&sign=eafd64ce6ac52c58b3f3bc4ce1a393c7"
    },
    { 
      id: 'family', 
      name: '家庭关系', 
      icon: 'fa-house', 
      count: 2,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=parent%20child%20communication%20family%20psychology%20concept&sign=411b034923482dd8e94e44d90b97903e"
    }
  ];

  // Mock data for articles
  const articles: Article[] = [
    {
      id: 'article-1',
      title: '非暴力沟通的4个关键步骤',
      excerpt: '学习如何通过观察、感受、需要和请求四个步骤，建立更健康的沟通方式...',
      content: `非暴力沟通（Nonviolent Communication, NVC）是一种建立在同理心基础上的沟通方式，由马歇尔·卢森堡博士（Marshall Rosenberg）提出。它帮助我们专注于自己和他人的感受与需要，从而以更平和、更有效的方式进行沟通。

### 非暴力沟通的四个关键步骤

#### 1. 观察（Observation）
观察是指客观地描述你所看到的、听到的或注意到的具体行为，而不进行评价或判断。观察的关键是区分事实和观点。

**例如：**
- 评价："你总是迟到。"
- 观察："你这一周有三次会议迟到了10分钟以上。"

#### 2. 感受（Feeling）
感受是指表达你对上述观察的情感反应，而不是想法或判断。使用具体的情感词汇可以帮助对方更好地理解你的状态。

**例如：**
- 想法："你不重视我们的约定。"
- 感受："当你迟到时，我感到失望和担心。"

#### 3. 需要（Need）
需要是指导致你产生上述感受的深层需求或价值。所有的感受都源于我们的需要是否得到满足。

**例如：**
- 表面表达："你应该更守时。"
- 需要表达："我需要可靠和尊重，这样我们才能更有效地合作。"

#### 4. 请求（Request）
请求是指具体、明确地提出你希望对方采取的行动，而不是命令。请求应该是正向的、具体的和可行的。

**例如：**
- 命令："下次必须准时！"
- 请求："下次会议前，如果你预计会迟到，请提前10分钟告诉我，好吗？"

### 非暴力沟通的实践技巧

1. **专注于当下**：避免翻旧账，专注于当前的情况和感受。
2. **使用"我"语句**：以"我"开头表达感受和需要，减少对方的防御心理。
3. **倾听他人**：不仅表达自己，也要用心倾听对方的观察、感受、需要和请求。
4. **接纳差异**：尊重他人的感受和需要，即使与自己不同。

通过持续练习这四个步骤，你可以逐渐培养非暴力沟通的能力，建立更健康、更和谐的人际关系。`,
      category: '基础技巧',
      subcategory: '沟通基础',
      tags: ['非暴力沟通', '同理心', '情绪管理'],
      readTime: '8分钟',
      date: '2025-11-01',
      level: 'beginner',
      isPremium: false,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=nonviolent%20communication%20model%20chart%2C%20psychology%20infographic&sign=e31dde8bf0006a657874164bd8454646",
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

#### 2. 自我管理（Self-Management）
自我管理是指控制或调节自己的情绪，适应变化，以及在面对挑战时保持积极态度的能力。在沟通中，自我管理帮助我们在压力情境下保持冷静和专业。

**提升自我管理的方法：**
- 学习深呼吸和放松技巧，帮助缓解压力
- 设定明确的目标和计划，减少不确定性带来的焦虑
- 培养积极的思维模式，关注解决方案而非问题

#### 3. 社交意识（Social Awareness）
社交意识是指理解他人的情绪、需求和关注点，以及理解组织和社会环境的能力。在沟通中，社交意识帮助我们更好地理解他人的观点和感受。

**提升社交意识的方法：**
- 练习积极倾听，关注对方的言语和非言语线索
- 尝试从他人的角度思考问题，培养同理心
- 观察和学习有效的沟通者如何与他人互动

#### 4. 关系管理（Relationship Management）
关系管理是指建立和维护健康的关系，有效地沟通和解决冲突，以及激励和影响他人的能力。在沟通中，关系管理帮助我们建立信任和合作。

**提升关系管理的方法：**
- 学习有效的反馈技巧，既表达欣赏也提供建设性批评
- 练习冲突解决策略，寻求双赢的解决方案
- 培养团队合作和领导能力，建立积极的工作关系

### 情绪智能在沟通中的实际应用

1. **在压力情境中保持冷静**：通过自我意识和自我管理，识别压力信号并采取措施缓解。
2. **理解他人的观点**：通过社交意识，尝试从对方的角度理解问题，避免误解。
3. **建立信任和尊重**：通过一致的行为和真诚的沟通，建立和维护信任关系。
4. **有效解决冲突**：通过情绪智能的四个要素，识别冲突的根源并寻求建设性的解决方案。

通过提升情绪智能，你可以成为更有效的沟通者，建立更健康、更有成效的人际关系。`,
      category: '情绪管理',
      subcategory: '情绪智能',
      tags: ['情绪智能', '自我管理', '人际关系'],
      readTime: '10分钟',
      date: '2025-10-25',
      level: 'intermediate',
      isPremium: false,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=emotional%20intelligence%20model%20psychology%20concept&sign=00e07b11358f98e32f937e56034e337c",
      author: {
        name: '李情绪',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20emotional%20coach%20avatar&sign=91fe5c771a5723d8eb85b79f21d0e3b5',
        role: '情绪教练'
      }
    },
    {
      id: 'article-3',
      title: '职场冲突解决的心理学策略',
      excerpt: '掌握基于心理学的冲突解决技巧，将职场矛盾转化为合作机会...',
      content: `在职场中，冲突是不可避免的。不同的价值观、目标、工作风格和沟通方式都可能导致冲突。然而，冲突本身并不是问题，关键在于如何有效地解决冲突。以下是一些基于心理学的冲突解决策略，可以帮助你将职场矛盾转化为合作机会。

### 理解冲突的本质

冲突是指两个或更多人之间的观点、需求或目标不一致的状态。冲突本身并不一定是负面的，它可以激发创造力，促进问题解决，以及帮助团队成员更好地理解彼此。

根据心理学家肯·托马斯（Ken Thomas）和拉尔夫·基尔曼（Ralph Kilmann）的理论，人们在冲突中的行为模式可以分为五种类型：

1. **竞争型（Competing）**：追求自己的目标，不考虑他人的需求
2. **协作型（Collaborating）**：寻求双赢的解决方案，考虑双方的需求
3. **妥协型（Compromising）**：双方各让一步，达成部分满足
4. **回避型（Avoiding）**：避免冲突，不采取行动
5. **迁就型（Accommodating）**：优先考虑他人的需求，牺牲自己的利益

### 冲突解决的心理学策略

#### 1. 情绪调节
在冲突中，情绪往往会高涨，这可能导致非理性的行为和决策。情绪调节技巧可以帮助你在冲突中保持冷静和理性。

**具体方法：**
- 深呼吸：缓慢地吸气和呼气，帮助缓解紧张情绪
- 暂停：如果情绪过于激动，可以暂时离开现场，给自己时间冷静
- 认知重构：尝试从不同的角度看待问题，避免负面思维

#### 2. 同理心倾听
同理心倾听是指理解并认同对方的感受和观点，而不进行评价或判断。这有助于建立信任，减少防御心理。

**具体方法：**
- 专注于对方的言语和非言语线索
- 用自己的话复述对方的观点，确保理解正确
- 表达对对方感受的理解，例如："我能理解你为什么会感到沮丧"

#### 3. 问题聚焦
将注意力集中在问题本身，而不是个人攻击或指责。这有助于双方共同寻找解决方案。

**具体方法：**
- 使用"我"语句表达感受和需求，避免"你"语句带来的指责感
- 明确界定问题，确保双方对问题的理解一致
- 共同设定目标，确保双方都致力于解决问题

#### 4. 创造性解决问题
鼓励双方提出多种解决方案，然后共同评估这些方案的优缺点，选择最适合的解决方案。

**具体方法：**
- 头脑风暴：鼓励双方提出尽可能多的解决方案，不进行评价
- 评估方案：共同评估每个方案的可行性、优缺点和可能的结果
- 选择方案：选择双方都能接受的方案，并制定具体的实施计划

### 冲突解决的步骤

1. **准备阶段**：冷静下来，明确自己的需求和目标，尝试理解对方的立场
2. **开场阶段**：选择合适的时间和地点，建立积极的沟通氛围
3. **问题定义阶段**：共同界定问题，确保双方对问题的理解一致
4. **解决方案阶段**：共同提出和评估解决方案，选择最适合的方案
5. **实施阶段**：制定具体的实施计划，明确责任和时间线
6. **跟进阶段**：定期检查进展，必要时调整方案

通过这些心理学策略和步骤，你可以更有效地解决职场冲突，建立更健康、更有成效的工作关系。记住，冲突解决的关键是建立信任，促进理解，以及寻求双赢的解决方案。`,
      category: '职场沟通',
      subcategory: '冲突解决',
      tags: ['冲突解决', '职场关系', '问题解决'],
      readTime: '12分钟',
      date: '2025-10-20',
      level: 'advanced',
      isPremium: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=workplace%20conflict%20resolution%20people%20problem%20solving&sign=f51f25feeca340ab0678748075a0b759",
      author: {
        name: '王职场',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20career%20coach%20avatar&sign=40d77b86b93242175ae7338ff9a88ca4',
        role: '职场教练'
      }
    },
    {
      id: 'article-4',
      title: '积极倾听：沟通的关键技巧',
      excerpt: '学习如何真正倾听他人，建立更深层次的连接和理解...',
      content: `积极倾听（Active Listening）是一种主动、专注地倾听他人的沟通技巧。它不仅涉及听到对方的言语，还包括理解对方的情感、需求和意图。积极倾听是建立良好人际关系的基础，也是有效沟通的关键技巧。

### 积极倾听的重要性

在当今快节奏的社会中，我们常常忙于表达自己的观点，而忽略了倾听他人。然而，倾听是沟通的重要组成部分，它具有以下重要作用：

1. **建立信任**：当人们感到被真正倾听时，他们会感到被尊重和理解，从而建立信任
2. **减少误解**：积极倾听可以帮助我们更准确地理解对方的意图，减少误解和冲突
3. **促进合作**：通过倾听，我们可以更好地理解他人的需求和观点，促进合作和团队精神
4. **解决问题**：积极倾听有助于识别问题的根源，找到更有效的解决方案

### 积极倾听的技巧

#### 1. 专注
在倾听时，给予对方全部的注意力，避免分心。这意味着关闭手机，停止思考其他事情，专注于对方的言语和非言语线索。

**具体方法：**
- 保持眼神接触，但不要盯视
- 面对对方，保持开放的身体姿势
- 避免打断对方，让对方完整地表达自己的观点

#### 2. 理解
努力理解对方的言语和情感，而不进行评价或判断。这需要我们暂时放下自己的观点和偏见，尝试从对方的角度看问题。

**具体方法：**
- 注意对方的非言语线索，如面部表情、手势和语调
- 提问以澄清不确定的信息，例如："你是说...吗？"
- 用自己的话复述对方的观点，确保理解正确

#### 3. 回应
给予对方适当的回应，表明你在认真倾听并理解他们的观点。回应应该是支持性的，而不是评价性的。

**具体方法：**
- 使用简短的语言表达理解，例如："我明白"、"这很有道理"
- 使用非言语回应，如点头、微笑或皱眉
- 表达对对方情感的理解，例如："那一定很困难"、"我能理解你为什么会感到兴奋"

#### 4. 记忆
努力记住对方的关键信息，如名字、兴趣、需求和目标。这表明你重视对方，并有助于建立更深层次的连接。

**具体方法：**
- 做笔记（如果合适）
- 重复对方的名字和关键信息
- 关注细节，记住对方提到的重要事件或经历

### 积极倾听的障碍

在实践积极倾听时，我们可能会遇到一些障碍，包括：

1. **分心**：外部干扰（如噪音、手机）或内部干扰（如思考其他事情）
2. **偏见**：先入为主的观念或刻板印象影响我们对信息的理解
3. **急于回应**：我们可能会急于表达自己的观点，而忽略了对方的信息
4. **评价倾向**：我们可能会过早地评价或判断对方的观点

### 实践积极倾听的步骤

1. **准备倾听**：清除干扰，调整心态，准备好专注于对方
2. **倾听内容**：注意对方的言语信息，包括事实、观点和需求
3. **倾听情感**：注意对方的情感表达，理解他们的感受
4. **给予回应**：使用言语和非言语线索表明你在倾听
5. **确认理解**：通过提问或复述确认你理解了对方的信息
6. **保持开放**：避免评价或判断，保持开放的心态

通过实践这些技巧，你可以成为更好的倾听者，建立更深层次的人际关系，提升沟通效果。记住，积极倾听是一种技能，需要持续的练习和努力。`,
      category: '基础技巧',
      subcategory: '倾听技巧',
      tags: ['积极倾听', '沟通技巧', '人际关系'],
      readTime: '9分钟',
      date: '2025-10-15',
      level: 'beginner',
      isPremium: false,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=active%20listening%20skills%20people%20conversation%20psychology&sign=8a9fe45d4e5ea5b61a18fd99ffc071bb",
      author: {
        name: '陈倾听',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20communication%20trainer%20avatar&sign=33ed59995f5776a3bcc2796157ae48e1',
        role: '沟通培训师'
      }
    },
    {
      id: 'article-5',
      title: '如何给予和接受建设性反馈',
      excerpt: '掌握反馈的艺术，帮助他人成长，同时提升自己的能力...',
      content: `反馈是沟通中不可或缺的一部分，它可以帮助我们了解自己的表现，识别改进的机会，以及促进个人和团队的成长。然而，给予和接受反馈并不总是容易的，它需要技巧和敏感性。以下是一些关于如何给予和接受建设性反馈的建议。

### 建设性反馈的特点

建设性反馈（Constructive Feedback）是指旨在帮助他人改进和成长的反馈，它具有以下特点：

1. **具体**：针对具体的行为或事件，而不是笼统的评价
2. **及时**：在行为发生后尽快给予反馈，以便记忆犹新
3. **平衡**：既指出优点，也指出可以改进的地方
4. **尊重**：以尊重和专业的方式表达，避免个人攻击
5. **可行**：提供具体的改进建议，帮助对方采取行动

### 如何给予建设性反馈

#### 1. 准备反馈
在给予反馈之前，花时间准备，确保你的反馈是具体、客观和有帮助的。

**具体方法：**
- 收集具体的例子，支持你的反馈
- 明确你希望通过反馈达到的目标
- 选择合适的时间和地点，确保隐私和不受干扰

#### 2. 使用"SBI"模型
SBI（Situation-Behavior-Impact）模型是一种有效的反馈结构，它包括以下三个部分：

- **情境（Situation）**：描述反馈发生的具体情境
- **行为（Behavior）**：描述你观察到的具体行为
- **影响（Impact）**：描述该行为对你、团队或组织的影响

**例如：**
"在昨天的团队会议上（情境），当我提出不同意见时，你打断了我三次（行为），这让我感到不被尊重，也影响了我们的讨论效率（影响）。"

#### 3. 平衡正面和负面反馈
尽管我们通常关注需要改进的地方，但正面反馈也很重要，它可以强化积极的行为，增强对方的自信心和动力。

**具体方法：**
- 使用"三明治"技巧：先给予正面反馈，然后提出需要改进的地方，最后以正面反馈结束
- 确保负面反馈是建设性的，而不是批评性的
- 强调对方的潜力和可以改进的空间

#### 4. 倾听对方的回应
给予反馈后，给对方机会回应，倾听他们的观点和感受。这可以帮助你更好地理解对方的立场，也表明你尊重他们的意见。

**具体方法：**
- 邀请对方分享他们的看法，例如："你对我的反馈有什么看法？"
- 认真倾听，避免打断或辩解
- 表现出同理心，理解对方的感受

### 如何接受建设性反馈

接受反馈同样需要技巧和开放的心态。以下是一些关于如何有效地接受反馈的建议：

#### 1. 保持开放的心态
将反馈视为学习和成长的机会，而不是批评或攻击。记住，反馈反映的是他人对你行为的看法，而不是对你个人价值的评价。

**具体方法：**
- 深呼吸，保持冷静，避免防御性反应
- 提醒自己，反馈是帮助你改进的工具
- 尝试从反馈中寻找有价值的信息

#### 2. 积极倾听
认真倾听反馈，不打断，也不急于辩解。这表明你尊重对方的意见，也有助于你更准确地理解反馈的内容。

**具体方法：**
- 保持眼神接触，表现出你在认真倾听
- 避免分心，专注于对方的言语和非言语线索
- 用点头或简短的回应表明你在倾听，例如："我理解"

#### 3. 寻求澄清
如果你对反馈有疑问或不理解，请求对方提供具体的例子或解释。这可以帮助你更准确地理解反馈，也表明你重视对方的意见。

**具体方法：**
- 提出具体的问题，例如："你能举个例子说明我的哪些行为需要改进吗？"
- 请求对方提供具体的改进建议，例如："你有什么建议可以帮助我改进吗？"
- 用自己的话复述反馈，确保理解正确

#### 4. 表达感谢
无论反馈是正面的还是负面的，都要表达感谢。这表明你重视对方的意见，也有助于建立良好的沟通氛围。

**具体方法：**
- 简单地说："谢谢你的反馈，我会认真考虑的"
- 避免过度辩解或解释，保持简洁和真诚
- 表明你愿意采取行动改进，例如："我会努力改进这一点的"

### 实践建设性反馈的技巧

1. **关注行为，而不是人**：反馈应该针对具体的行为，而不是个人特质或性格
2. **使用"我"语句**：以"我"开头表达你的观察和感受，减少对方的防御心理
3. **保持尊重和专业**：无论反馈的内容如何，都要以尊重和专业的方式表达
4. **提供具体的改进建议**：不仅指出问题，还要提供具体的改进建议
5. **定期给予反馈**：反馈不应该是一次性的，而应该是持续的沟通过程

通过实践这些技巧，你可以更有效地给予和接受建设性反馈，促进个人和团队的成长和发展。记住，反馈是一种技能，需要持续的练习和努力。`,
      category: '职场沟通',
      subcategory: '反馈技巧',
      tags: ['反馈技巧', '职场成长', '团队合作'],
      readTime: '11分钟',
      date: '2025-10-10',
      level: 'intermediate',
      isPremium: false,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=effective%20communication%20skills%20people%20talking%20respectfully&sign=e20b54d99c4c846b36d8fe62ca3a84f0",
      author: {
        name: '刘反馈',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20manager%20avatar&sign=d099fd71262a58f72e57f7a149fb8c6f',
        role: '企业管理顾问'
      }
    },
    {
      id: 'article-6',
      title: '亲子沟通中的心理学技巧',
      excerpt: '了解孩子的心理发展阶段，掌握有效的亲子沟通方法...',
      content: `亲子沟通是父母与孩子之间建立良好关系的基础，也是孩子健康成长的重要保障。然而，由于年龄、经历和视角的差异，亲子沟通往往面临各种挑战。以下是一些基于心理学的亲子沟通技巧，可以帮助父母更好地理解孩子，建立更健康、更有成效的亲子关系。

### 理解孩子的心理发展阶段

不同年龄阶段的孩子有不同的认知能力、情感需求和沟通方式。理解孩子的心理发展阶段，可以帮助父母更好地适应孩子的需求，调整沟通方式。

#### 1. 幼儿期（1-3岁）
这一阶段的孩子开始发展语言能力，但表达能力有限，情绪波动大，自我意识开始形成。

**沟通特点：**
- 以简单的语言和非言语沟通为主
- 注意力时间短，容易分心
- 情绪表达直接，可能通过哭闹表达需求

**沟通技巧：**
- 使用简单、明确的语言
- 给予孩子足够的关注和回应
- 用游戏和互动的方式沟通
- 帮助孩子识别和表达情绪

#### 2. 学龄前期（3-6岁）
这一阶段的孩子语言能力迅速发展，想象力丰富，开始形成道德观念，但逻辑思维能力有限。

**沟通特点：**
- 语言表达能力提高，但可能仍有语法错误
- 好奇心强，喜欢问问题
- 开始理解规则，但可能难以遵守
- 想象力丰富，可能混淆现实和想象

**沟通技巧：**
- 耐心回答孩子的问题，鼓励好奇心
- 用故事和比喻的方式解释复杂概念
- 设定明确、简单的规则，并给予积极的反馈
- 尊重孩子的想象力和创造力

#### 3. 学龄期（6-12岁）
这一阶段的孩子逻辑思维能力发展，开始形成自我概念，同伴关系变得重要，学习压力增加。

**沟通特点：**
- 逻辑思维能力提高，能够理解更复杂的概念
- 自我意识增强，开始关注他人的评价
- 同伴影响力增加，可能模仿同伴的行为和语言
- 学习成为主要任务，可能面临学习压力

**沟通技巧：**
- 给予孩子更多的自主权和选择空间
- 倾听孩子的想法和感受，尊重他们的意见
- 帮助孩子建立健康的同伴关系
- 关注孩子的学习压力，提供支持和鼓励

#### 4. 青少年期（12-18岁）
这一阶段的孩子自我意识强烈，寻求独立，情绪波动大，开始思考人生和价值观。

**沟通特点：**
- 自我意识强烈，渴望独立和自主
- 情绪波动大，可能表现出叛逆行为
- 开始思考人生、价值观和未来
- 同伴关系对情绪和行为影响大

**沟通技巧：**
- 给予孩子适当的空间和隐私
- 尊重孩子的独立性，避免过度控制
- 倾听孩子的观点，即使不同意也保持尊重
- 帮助孩子处理情绪和压力，提供支持和指导

### 有效的亲子沟通技巧

#### 1. 积极倾听
积极倾听是建立良好亲子关系的基础，它可以帮助孩子感到被理解和尊重。

**具体方法：**
- 放下手中的事情，给予孩子全部的注意力
- 用点头、微笑等非言语信号表明你在倾听
- 用简单的语言回应，如"嗯"、"我明白"
- 避免打断孩子，让他们完整地表达自己的想法和感受

#### 2. 使用"我"语句
使用"我"语句表达感受和需求，而不是"你"语句，可以减少孩子的防御心理，促进更有效的沟通。

**例如：**
- 避免："你总是这么粗心！"（指责）
- 改为："当我看到你忘记带作业时，我感到担心，因为这可能会影响你的学习。"（表达感受和担忧）

#### 3. 设定明确的界限
设定明确的界限和规则，可以帮助孩子建立安全感和责任感，同时减少冲突。

**具体方法：**
- 规则要明确、具体、合理，适合孩子的年龄和发展阶段
- 与孩子一起制定规则，增加他们的参与感和责任感
- 规则要一致执行，避免朝令夕改
- 对于违反规则的行为，给予适当的后果，而不是惩罚

#### 4. 鼓励和肯定
鼓励和肯定可以增强孩子的自信心和动力，促进积极的行为和态度。

**具体方法：**
- 具体、真诚地表扬孩子的努力和进步，而不是笼统的评价
- 关注孩子的优点和长处，而不是只关注缺点
- 鼓励孩子尝试新事物，接受失败和挫折
- 用积极的语言表达期望，如"我相信你可以做到"

#### 5. 共情和理解
共情是指理解和认同孩子的感受，而不进行评价或判断。这可以帮助孩子感到被理解和支持，建立更紧密的亲子关系。

**具体方法：**
- 尝试从孩子的角度看问题，理解他们的感受和需求
- 用语言表达对孩子感受的理解，如"我能理解你为什么会感到难过"
- 避免否定孩子的感受，如"这没什么好哭的"
- 提供情感支持，而不是急于解决问题

### 常见的亲子沟通障碍及解决方法

1. **缺乏时间和耐心**
   - 解决方法：设定专门的亲子时间，即使每天只有15分钟，也要全神贯注地陪伴孩子

2. **过度控制和指责**
   - 解决方法：给予孩子适当的自主权，用建议代替命令，用鼓励代替批评

3. **忽视孩子的感受**
   - 解决方法：学习共情技巧，认真倾听孩子的感受，尊重他们的情绪表达

4. **沟通方式不适合孩子的年龄**
   - 解决方法：了解孩子的心理发展阶段，调整沟通方式，使用适合孩子年龄的语言和方法

通过实践这些心理学技巧，父母可以更有效地与孩子沟通，建立更健康、更有成效的亲子关系。记住，亲子沟通是一个持续的过程，需要耐心、理解和持续的努力。`,
      category: '家庭关系',
      subcategory: '亲子沟通',
      tags: ['亲子沟通', '儿童心理', '家庭教育'],
      readTime: '15分钟',
      date: '2025-10-05',
      level: 'advanced',
      isPremium: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=parent%20child%20communication%20family%20psychology%20concept&sign=411b034923482dd8e94e44d90b97903e",
      author: {
        name: '杨亲子',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20child%20psychologist%20avatar&sign=d809e1bef7d8e798ecb3c5d0765c3a96',
        role: '儿童心理学专家'
      }
    }
  ];

  // Mock data for tools
  const tools: Tool[] = [
    {
      id: 'tool-1',
      name: '非暴力沟通卡片',
      description: '帮助你练习非暴力沟通的四个步骤：观察、感受、需要和请求。',
      usage: `1. 观察卡片：写下你观察到的具体行为，而不是评价
2. 感受卡片：写下你对这些行为的感受
3. 需要卡片：写下导致这些感受的深层需要
4. 请求卡片：写下具体、明确的请求`,
      isPremium: false,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=nonviolent%20communication%20cards%20psychology%20tool&sign=499db39a45a9efabd53ed95ef00522c6"
    },
    {
      id: 'tool-2',
      name: '情绪识别工具',
      description: '帮助你识别和命名自己的情绪，增强情绪意识。',
      usage: `1. 每天花5分钟时间，记录你的情绪
2. 使用情绪词汇表，尝试用更具体的词汇描述你的情绪
3. 分析情绪的触发因素和影响
4. 思考如何更有效地管理这些情绪`,
      isPremium: false,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=emotion%20wheel%20psychology%20tool%20colorful&sign=4ed3c028c44ddc33360469d6e83f5143"
    },
    {
      id: 'tool-3',name: '冲突解决工作表',
      description: '引导你通过结构化的步骤解决冲突，寻求双赢的解决方案。',
      usage: `1. 明确冲突的具体问题
2. 写下双方的需求和利益
3. 共同 brainstorm 可能的解决方案
4. 评估每个解决方案的优缺点
5. 选择并实施最适合的解决方案
6. 跟进评估解决方案的效果`,
      isPremium: true,
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=conflict%20resolution%20worksheet%20psychology%20tool&sign=5052f03d5ecc7947e8e8db35b3f2ad23"
    }
  ];

  // Filter articles based on search query and selected category
  useEffect(() => {
    let result = [...articles];
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(article => article.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply access filter (free users can only access non-premium articles)
    if (!isAuthenticated) {
      result = result.filter(article => !article.isPremium);
    }
    
    setFilteredArticles(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, isAuthenticated]);

  // Get current articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Handle article selection
  const handleArticleSelect = (article: Article) => {
    // For free users, restrict access to premium articles
    if (article.isPremium && !isAuthenticated) {
      toast.info('此内容为高级会员专享，请登录后查看');
      return;
    }
    
    setSelectedArticle(article);
  };

  // Close article view
  const closeArticleView = () => {
    setSelectedArticle(null);
  };

  // Render level badge
  const renderLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-xs">入门</span>;
      case 'intermediate':
        return <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs">进阶</span>;
      case 'advanced':
        return <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full text-xs">专家</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: isDark ? '#E5E7EB' : '#1E3A8A' }}>
            心理学知识库
          </h1>
          <p className="text-lg" style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
            探索专业的沟通心理学知识，提升你的沟通能力
          </p>
        </motion.div>

        {/* View selector */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              selectedView === 'articles'
                ? 'bg-orange-500 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setSelectedView('articles')}
          >
            <i className="fa-solid fa-book mr-2"></i> 文章
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              selectedView === 'tools'
                ? 'bg-orange-500 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setSelectedView('tools')}
          >
            <i className="fa-solid fa-toolbox mr-2"></i> 工具
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              selectedView === 'categories'
                ? 'bg-orange-500 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setSelectedView('categories')}
          >
            <i className="fa-solid fa-th-large mr-2"></i> 分类
          </button>
        </div>

        {/* Articles view */}
        {selectedView === 'articles' && !selectedArticle && (
          <>
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <i className={`fa-solid ${category.icon} mr-1.5`}></i>
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Articles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentArticles.map(article => (
                <motion.div
                  key={article.id}
                  className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                  } ${article.isPremium && !isAuthenticated ? 'opacity-80' : ''}`}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => handleArticleSelect(article)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {article.category}
                      </span>
                      {renderLevelBadge(article.level)}
                    </div>
                    
                  {/* 文章封面图 */}
                  <div className="h-40 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                    {article.title}
                  </h3>
                  
                  <p className={`mb-4 line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <img 
                        src={article.author.avatar} 
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full mr-2 object-cover"
                      />
                      <span style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        {article.author.name}
                      </span>
                    </div>
                    <div className="flex items-center" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                      <i className="fa-regular fa-clock mr-1"></i>
                      {article.readTime}
                    </div>
                  </div>
                  
                  {article.isPremium && (
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-yellow-500 flex items-center">
                        <i className="fa-solid fa-crown mr-1"></i> 高级内容
                      </span>
                    </div>
                  )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : isDark
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            )}

            {/* Empty state */}
            {filteredArticles.length === 0 && (
              <div className={`rounded-xl p-12 text-center ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <i className="fa-solid fa-search text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
                </div>
                <h3 className="text-xl font-medium mb-2" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                  没有找到匹配的文章
                </h3>
                <p className="mb-6" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                  尝试使用不同的关键词或浏览其他分类
                </p>
                <button 
                  className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  查看所有文章
                </button>
              </div>
            )}
          </>
        )}

        {/* Article detail view */}
        {selectedArticle && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className={`flex items-center mb-6 ${isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={closeArticleView}
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              返回文章列表
            </button>
            
            <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              {/* Article header */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedArticle.category}
                  </span>
                  {renderLevelBadge(selectedArticle.level)}
                  {selectedArticle.isPremium && (
                    <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <i className="fa-solid fa-crown mr-1"></i> 高级内容
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                  {selectedArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <img 
                      src={selectedArticle.author.avatar} 
                      alt={selectedArticle.author.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <p className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                        {selectedArticle.author.name}
                      </p>
                      <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        {selectedArticle.author.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    <i className="fa-regular fa-calendar mr-1.5"></i>
                    {new Date(selectedArticle.date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    <i className="fa-regular fa-clock mr-1.5"></i>
                    {selectedArticle.readTime}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedArticle.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Article content */}
              <div className="prose dark:prose-invert max-w-none" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                {/* Convert markdown-like content to HTML elements */}
                {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                  // Handle headings
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl font-bold mt-6 mb-3" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>{paragraph.substring(4)}
                      </h3>
                    );
                  } else if (paragraph.startsWith('#### ')) {
                    return (
                      <h4 key={index} className="text-lg font-bold mt-4 mb-2" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                        {paragraph.substring(5)}
                      </h4>
                    );
                  }
                  
                  // Handle lists
                  if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n');
                    if (items[0].startsWith('1. ')) {
                      // Ordered list
                      return (
                        <ol key={index} className="list-decimal pl-6 my-4 space-y-2">
                          {items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item.substring(item.indexOf(' ') + 1)}</li>
                          ))}
                        </ol>
                      );
                    } else {
                      // Unordered list
                      return (
                        <ul key={index} className="list-disc pl-6 my-4 space-y-2">
                          {items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item.substring(item.indexOf(' ') + 1)}</li>
                          ))}
                        </ul>
                      );
                    }
                  }
                  
                  // Regular paragraph
                  return <p key={index} className="my-4">{paragraph}</p>;
                })}
              </div>
              
              {/* Action buttons */}
              <div className="mt-10 pt-6 border-t flex justify-between" style={{ borderColor: isDark ? '#374151' : '#E5E7EB' }}>
                <button className={`px-4 py-2 rounded-lg flex items-center ${
                  isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                } transition-colors duration-200`}>
                  <i className="fa-solid fa-bookmark mr-2"></i>
                  收藏
                </button>
                <div className="flex space-x-2">
                  <button className={`p-2 rounded-full ${
                    isDark 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                  } transition-colors duration-200`}>
                    <i className="fa-solid fa-share-nodes"></i>
                  </button>
                  <button className={`p-2 rounded-full ${
                    isDark 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                  } transition-colors duration-200`}>
                    <i className="fa-solid fa-thumbs-up"></i>
                  </button>
                </div>
              </div>
              
              {/* Related articles */}
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                  相关文章
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {articles
                    .filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category)
                    .slice(0, 3)
                    .map(article => (
                      <motion.div
                        key={article.id}
                        className={`rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 p-4 cursor-pointer ${
                          isDark ? 'bg-slate-700 hover:bg-slate-650' : 'bg-white hover:bg-gray-50 border border-gray-100'
                        }`}
                        whileHover={{ y: -3 }}
                        onClick={() => {
                          setSelectedArticle(article);
                        }}
                      >
                        <h4 className="font-bold mb-2 line-clamp-2" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                          {article.title}
                        </h4>
                        <p className="text-sm line-clamp-2" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                          {article.excerpt}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tools view */}
        {selectedView === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tools.map(tool => (
              <motion.div
                key={tool.id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                } ${tool.isPremium && !isAuthenticated ? 'opacity-80' : ''}`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => {
                  if (tool.isPremium && !isAuthenticated) {
                    toast.info('此工具为高级会员专享，请登录后使用');
                  } else {
                    // In a real app, this would open the tool
                    toast.info(`已打开工具：${tool.name}`);
                  }
                }}
              >
                {/* 工具图片 */}
                <div className="h-40 overflow-hidden">
                  <img 
                    src={tool.imageUrl} 
                    alt={tool.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500 text-white`}>
                      <i className="fa-solid fa-toolbox text-xl"></i>
                    </div>
                    {tool.isPremium && (
                      <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                        <i className="fa-solid fa-crown mr-1"></i> 高级
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                    {tool.name}
                  </h3>
                  
                  <p className="mb-4" style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
                    {tool.description}
                  </p>
                  
                  <div className={`p-4 rounded-lg mb-4 text-sm ${
                    isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-50 text-gray-700'
                  }`}>
                    <h4 className="font-medium mb-2">使用方法：</h4>
                    <p className="whitespace-pre-line">{tool.usage}</p>
                  </div>
                  
                  <button 
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tool.isPremium && !isAuthenticated) {
                        toast.info('此工具为高级会员专享，请登录后使用');
                      } else {
                        // In a real app, this would open the tool
                        toast.info(`已打开工具：${tool.name}`);
                      }
                    }}
                  >
                    {tool.isPremium ? '高级工具' : '使用工具'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Categories view */}
        {selectedView === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.filter(cat => cat.id !== 'all').map(category => (
              <motion.div
                key={category.id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
                }`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => {
                  setSelectedView('articles');
                  setSelectedCategory(category.id);
                }}
              >
                {/* 分类图片 */}
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 text-white mr-3`}>
                      <i className={`fa-solid ${category.icon} text-xl`}></i>
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                        {category.count} 篇专业文章
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full py-2 rounded-lg border transition-colors duration-200 flex items-center justify-center gap-2"
                    style={{ 
                      borderColor: isDark ? '#374151' : '#E5E7EB',
                      color: isDark ? '#D1D5DB' : '#4B5563'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedView('articles');
                      setSelectedCategory(category.id);
                    }}
                  >
                    浏览文章 <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Locked features notice for free users */}
        {!isAuthenticated && (
          <motion.div 
            className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-blue-800 dark:text-blue-300 flex items-start">
              <i className="fa-solid fa-lock mt-1 mr-2"></i>
              <span>未登录用户仅可访问部分内容。登录后可解锁全部文章、高级工具和个性化学习路径。</span>
            </p>
            <button
              onClick={() => document.getElementById('login-btn')?.click()}
              className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200"
            >
              立即登录
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}