import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Types for AI practice components
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
    optimalResponse?: string;
  };
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  scenarioId: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'social' | 'family';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  role: string;
  goal: string;
  initialMessage: string;
  topics: string[];
}

interface SuggestedResponse {
  id: string;
  content: string;
  style: 'direct' | 'indirect' | 'humorous';
  effectiveness: number;
  emotionalTransmission: number;
  informationCompleteness: number;
  reason: string;
}

// 计算总体分析数据的函数
const calculateOverallAnalysis = (messages: Message[]) => {
  // 过滤出用户消息且包含分析的消息
  const analyzedUserMessages = messages.filter(
    msg => msg.sender === 'user' && msg.analysis
  );
  
  if (analyzedUserMessages.length === 0) {
    return {
      languageExpression: 0,
      emotionalManagement: 0,
      logicalStructure: 0,
      communicationEffectiveness: 0,
      hasData: false
    };
  }
  
  // 计算各项的平均值
  const totalScores = analyzedUserMessages.reduce(
    (acc, msg) => {
      if (msg.analysis) {
        acc.languageExpression += msg.analysis.languageExpression;
        acc.emotionalManagement += msg.analysis.emotionalManagement;
        acc.logicalStructure += msg.analysis.logicalStructure;
        acc.communicationEffectiveness += msg.analysis.communicationEffectiveness;
      }
      return acc;
    },
    { languageExpression: 0, emotionalManagement: 0, logicalStructure: 0, communicationEffectiveness: 0 }
  );
  
  const count = analyzedUserMessages.length;
  
  return {
    languageExpression: Math.round(totalScores.languageExpression / count),
    emotionalManagement: Math.round(totalScores.emotionalManagement / count),
    logicalStructure: Math.round(totalScores.logicalStructure / count),
    communicationEffectiveness: Math.round(totalScores.communicationEffectiveness / count),
    hasData: true
  };
};

export default function AIPractice() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState<'scenarios' | 'practice' | 'history'>('scenarios');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock scenarios data
  const scenarios: Scenario[] = [
    {
      id: 'scenario-1',
      title: '工作汇报',
      description: '向你的经理汇报项目进展情况',
      category: 'work',
      difficulty: 'beginner',
      role: '项目经理',
      goal: '清晰传达项目进展，获取反馈和支持',
      initialMessage: '你好，我想了解一下项目的最新进展情况。',
      topics: ['项目进度', '团队协作', '问题解决']
    },
    {
      id: 'scenario-2',
      title: '客户谈判',
      description: '与客户讨论合同条款和价格',
      category: 'work',
      difficulty: 'intermediate',
      role: '销售经理',
      goal: '达成双方满意的协议，维护客户关系',
      initialMessage: '我们对你们的报价有些顾虑，能否再调整一下？',
      topics: ['价格谈判', '需求理解', '价值展示']
    },
    {
      id: 'scenario-3',
      title: '团队冲突',
      description: '解决团队成员之间的分歧和冲突',
      category: 'work',
      difficulty: 'advanced',
      role: '团队领导',
      goal: '调和矛盾，促进团队合作',
      initialMessage: '我觉得你分配的任务不公平，为什么总是让我做这些？',
      topics: ['冲突解决', '情绪管理', '团队建设']
    },
    {
      id: 'scenario-4',
      title: '初次见面',
      description: '在社交场合中与陌生人建立连接',
      category: 'social',
      difficulty: 'beginner',
      role: '新认识的朋友',
      goal: '建立良好第一印象，开启对话',
      initialMessage: '你好，我是新来的，很高兴认识你。',
      topics: ['自我介绍', '兴趣发现', '积极倾听']
    },
    {
      id: 'scenario-5',
      title: '拒绝邀请',
      description: '委婉拒绝他人的邀请而不伤害感情',
      category: 'social',
      difficulty: 'intermediate',
      role: '朋友',
      goal: '清晰表达立场，保持友好关系',
      initialMessage: '周末要不要一起去爬山？',
      topics: ['拒绝技巧', '替代方案', '情感安抚']
    },
    {
      id: 'scenario-6',
      title: '亲子沟通',
      description: '与孩子讨论学习和生活问题',
      category: 'family',
      difficulty: 'beginner',
      role: '家长',
      goal: '建立信任，有效引导',
      initialMessage: '爸爸/妈妈，我不想去上学了。',
      topics: ['倾听理解', '情绪安抚', '问题解决']
    }
  ];
  
  // Mock conversation history
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('conversationHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  // 计算总体分析数据
  const overallAnalysis = calculateOverallAnalysis(messages);
  
  // Save conversations to localStorage
  useEffect(() => {if (conversations.length > 0) {
      localStorage.setItem('conversationHistory', JSON.stringify(conversations));
    }
  }, [conversations]);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Start new conversation with selected scenario
  const startNewConversation = (scenario: Scenario) => {
    // For non-authenticated users, limit to only the first scenario (work report beginner)
    if (!isAuthenticated && scenario.id !== 'scenario-1') {
      toast.info('未登录用户仅可体验"工作汇报"入门级场景');
      return;
    }
    
    setCurrentScenario(scenario);
    setCurrentView('practice');
    setMessages([
      {
        id: `ai-${Date.now()}`,
        content: scenario.initialMessage,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setNewMessage('');
  };
  
  // Load conversation history
  const loadConversation = (conversationId: string) => {
    const savedMessages = localStorage.getItem(`conversation-${conversationId}`);
    if (savedMessages) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        const scenario = scenarios.find(s => s.id === conversation.scenarioId);
        if (scenario) {
          setCurrentScenario(scenario);
          setMessages(JSON.parse(savedMessages));
          setCurrentView('practice');
          setNewMessage('');
        }
      }
    }
  };
  
  // Delete conversation history
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    localStorage.removeItem(`conversation-${conversationId}`);
    toast.success('对话记录已删除');
  };
  
  // Send message to AI
  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading || !currentScenario) return;
    
    // For non-authenticated users, limit to 5 messages
    if (!isAuthenticated && messages.filter(m => m.sender === 'user').length >= 5) {
      toast.info('未登录用户仅可体验5轮对话，登录后可解锁更多');
      return;
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    // Simulate AI thinking and response
    try {
      // First, simulate analysis of user message
      setIsAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate analysis for user message
      const messageAnalysis = {
        languageExpression: Math.floor(Math.random() * 20) + 75, // 75-95
        emotionalManagement: Math.floor(Math.random() * 20) + 75,
        logicalStructure: Math.floor(Math.random() * 20) + 75,
        communicationEffectiveness: Math.floor(Math.random() * 20) + 75,
        suggestions: generateSuggestions(userMessage.content),
        optimalResponse: generateOptimalResponse(userMessage.content, currentScenario)
      };
      
      // Update user message with analysis
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, analysis: messageAnalysis } 
          : msg
      ));
      
      // Generate suggested responses
      generateSuggestedResponses(userMessage.content, currentScenario);
      
      setIsAnalyzing(false);
      
      // Then, simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const aiResponse = generateAIResponse(userMessage.content, currentScenario);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save conversation to history
      if (isAuthenticated) {
        saveConversationToHistory(userMessage.content);
      }
    } catch (error) {
      toast.error('发送消息失败，请稍后再试');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate suggestions for user message
  const generateSuggestions = (message: string): string[] => {
    const suggestionsMap: {[key: string]: string[]} = {
      '项目': [
        '可以更具体地说明项目的关键里程碑和成果',
        '建议加入数据支持你的观点，增强说服力',
        '考虑添加下一步计划和需要的支持'
      ],
      '问题': [
        '尝试提出具体的解决方案，而不只是指出问题',
        '可以分析问题的根本原因，帮助对方理解背景',
        '建议用积极的语言表达，聚焦解决方案'
      ],
      '时间': [
        '可以提供更明确的时间节点和截止日期',
        '考虑加入缓冲时间，以应对可能的延误',
        '建议分阶段说明时间安排，更清晰易懂'
      ]
    };
    
    for (const key in suggestionsMap) {
      if (message.includes(key)) {
        return suggestionsMap[key];
      }
    }
    
    return [
      '表达清晰明确，很好！',
      '语气适当，有助于良好沟通',
      '可以尝试加入更多具体细节增强说服力'
    ];
  };
  
  // Generate optimal response for user message
  const generateOptimalResponse = (message: string, scenario: Scenario): string => {
    // This would be generated by AI in a real application
    // For demo purposes, we'll return a static response based on scenario
    switch(scenario.id) {
      case 'scenario-1':
        return '我们已经完成了项目的第一阶段，关键里程碑都已按时达成。团队协作良好，下阶段我们计划重点解决技术难点，预计需要两周时间。';
      case 'scenario-2':
        return '感谢您的反馈，我们理解您对价格的顾虑。考虑到我们的产品质量和服务保障，这个价格已经非常有竞争力了。不过，为了表示合作诚意，我们可以提供三个月的免费维护服务。';
      case 'scenario-3':
        return '我理解你的感受，让我们一起分析一下任务分配的原则。我们是根据每个人的专长和工作量来分配任务的，目的是让团队效率最大化。如果你对某些任务有疑问，我们可以具体讨论调整方案。';
      case 'scenario-4':
        return '你好！很高兴认识你。我在这里工作了一段时间，如果你有什么需要了解的，我很乐意帮助你。';
      case 'scenario-5':
        return '谢谢你的邀请！这个周末我已经有安排了，不过我们可以改在下周末吗？或者这周四下班后一起喝杯咖啡？';
      case 'scenario-6':
        return '能告诉我为什么不想去上学吗？是遇到了什么困难还是不开心的事情？我们可以一起想办法解决。';
      default:
        return '我理解你的意思，让我们进一步讨论这个问题。';
    }
  };
  
  // Generate AI response based on user message and scenario
  const generateAIResponse = (message: string, scenario: Scenario): string => {
    // This would be generated by AI in a real application
    // For demo purposes, we'll return a dynamic response based on scenario
    switch(scenario.id) {
      case 'scenario-1':
        return message.includes('进展') || message.includes('完成')
          ? '很好！能详细说明一下具体完成了哪些关键任务吗？有没有遇到什么挑战？'
          : message.includes('问题') || message.includes('挑战')
            ? '谢谢你的坦诚。针对这些问题，你们有什么解决方案吗？需要我提供什么支持？'
            : '谢谢你的汇报。总体来看进展不错，不过我想了解更多关于下阶段计划的细节。';
      case 'scenario-2':
        return message.includes('调整') || message.includes('优惠')
          ? '我们已经给出了很有竞争力的价格。考虑到我们的产品质量和服务，这个价格是合理的。不过，我们可以在付款方式上提供一些灵活性。'
          : message.includes('价值') || message.includes('优势')
            ? '我理解你的看法。我们的产品确实比竞争对手略贵，但我们提供更完善的售后服务和技术支持，这将为你节省后续的维护成本。'
            : '我们的报价已经考虑了市场情况和成本因素。如果你对某些具体条款有疑问，我们可以详细讨论。';
      case 'scenario-3':
        return message.includes('不公平') || message.includes('不满')
          ? '我理解你现在的感受。任务分配确实需要考虑多方面因素，包括个人专长、工作量平衡等。让我们具体分析一下你的情况，看看是否有调整的空间。'
          : message.includes('压力') || message.includes('负担')
            ? '感谢你分享真实感受。团队协作中压力管理很重要，我们可以重新评估工作安排，看看如何减轻你的负担，同时不影响整体进度。'
            : '团队合作中出现分歧是正常的。让我们坐下来详细讨论，找到对团队最有利的解决方案。';
      case 'scenario-4':
        return message.includes('新来') || message.includes('介绍')
          ? '欢迎加入！这里的氛围很好，大家都很友好。你之前在哪里工作？对新环境还适应吗？'
          : message.includes('兴趣') || message.includes('爱好')
            ? '真巧！我也对这个很感兴趣。我们有空可以一起交流交流心得。'
            : '很高兴认识你！你觉得这里的工作环境怎么样？有什么需要帮助的吗？';
      case 'scenario-5':
        return message.includes('有事') || message.includes('安排')
          ? '没关系，工作/学习重要。那我们改个时间吧，你看什么时候方便？'
          : message.includes('不舒服') || message.includes('身体')
            ? '身体最重要！好好休息，等你恢复了我们再约。需要帮忙的话随时告诉我。'
            : '没关系，我们以后还有很多机会。下次我提前和你确认时间。';
      case 'scenario-6':return message.includes('作业') || message.includes('学习')
          ? '作业确实有时候会很多，让我们一起看看怎么合理安排时间。你觉得哪部分最困难？'
          : message.includes('同学') || message.includes('朋友')
            ? '和同学相处确实会遇到一些问题。能具体告诉我发生了什么吗？我们一起想办法解决。'
            : '能告诉我具体的原因吗？是不喜欢某个老师，还是和同学相处有问题？我们可以一起解决。';
      default:
        return '感谢你的分享。能进一步说明一下你的想法吗？';
    }
  };
  
  // Generate suggested responses for user message
  const generateSuggestedResponses = (message: string, scenario: Scenario) => {
    const directResponse = generateOptimalResponse(message, scenario);
    
    // Generate variations
    const indirectResponse = directResponse.includes('我们') 
      ? directResponse.replace('我们', '或许我们可以考虑') 
      : `我在想，${directResponse.toLowerCase()}`;
    
    const humorousResponse = directResponse + ' 😊 你觉得这个方案如何？';
    
    const responses: SuggestedResponse[] = [
      {
        id: 'direct',
        content: directResponse,
        style: 'direct',
        effectiveness: 85,
        emotionalTransmission: 75,
        informationCompleteness: 90,
        reason: '直接表达观点，清晰明确，适合需要高效沟通的场景。'
      },
      {
        id: 'indirect',
        content: indirectResponse,
        style: 'indirect',
        effectiveness: 80,
        emotionalTransmission: 85,
        informationCompleteness: 85,
        reason: '委婉表达，更注重对方感受，适合需要维护关系的场景。'
      },
      {
        id: 'humorous',
        content: humorousResponse,
        style: 'humorous',
        effectiveness: 75,
        emotionalTransmission: 90,
        informationCompleteness: 80,
        reason: '幽默表达，缓解紧张氛围，适合较为轻松的沟通场景。'
      }
    ];
    
    setSuggestedResponses(responses);
    setShowSuggestions(true);
  };
  
  // Select a suggested response
  const selectSuggestedResponse = (response: SuggestedResponse) => {
    setNewMessage(response.content);
    setShowSuggestions(false);
    
    // Show reason why this response is suitable
    toast.info(`选择理由: ${response.reason}`, { duration: 5000 });
  };
  
  // Save conversation to history
  const saveConversationToHistory = async (lastMessage: string) => {
    if (!currentScenario || !isAuthenticated || !user) return;
    
    try {
      // 尝试保存到Supabase
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          scenario_id: currentScenario.id,
          title: currentScenario.title,
          last_message: lastMessage.substring(0, 50) + (lastMessage.length > 50 ? '...' : ''),
          messages: messages
        })
        .select();
      
      if (error) {
        console.error('Error saving conversation to Supabase:', error);
        // 如果保存到Supabase失败，回退到localStorage
        saveConversationToLocalStorage(lastMessage);
        return;
      }
      
      if (data && data.length > 0) {
        // 更新本地状态
        const newConversation: Conversation = {
          id: data[0].id,
          title: currentScenario.title,
          lastMessage: lastMessage.substring(0, 50) + (lastMessage.length > 50 ? '...' : ''),
          timestamp: new Date(),
          scenarioId: currentScenario.id
        };
        
        setConversations(prev => [newConversation, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      // 发生异常时，回退到localStorage
      saveConversationToLocalStorage(lastMessage);
    }
  };
  
  // 保存到本地存储的备用函数
  const saveConversationToLocalStorage = (lastMessage: string) => {
    if (!currentScenario) return;
    
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: currentScenario.title,
      lastMessage: lastMessage.substring(0, 50) + (lastMessage.length > 50 ? '...' : ''),
      timestamp: new Date(),
      scenarioId: currentScenario.id
    };
    
    setConversations(prev => [newConversation, ...prev.slice(0, 9)]); // Keep only last 10 conversations
    
    // Save messages to localStorage
    localStorage.setItem(`conversation-${newConversation.id}`, JSON.stringify(messages));
  };
  
  // Copy suggestion to clipboard
  const copySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion).then(() => {
      toast.success('建议已复制到剪贴板');
    });
  };
  
  // Apply optimal response to next message
  const applyOptimalResponse = (response: string) => {
    setNewMessage(response);
    toast.success('已应用优化版本到输入框');
  };
  
  // Render scenario card
  const renderScenarioCard = (scenario: Scenario) => {
    const getCategoryIcon = (category: string) => {
      switch(category) {
        case 'work': return 'fa-briefcase';
        case 'social': return 'fa-users';
        case 'family': return 'fa-house';
        default: return 'fa-comments';
      }
    };
    
    const getDifficultyColor = (difficulty: string) => {
      switch(difficulty) {
        case 'beginner': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
        case 'intermediate': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        case 'advanced': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      }
    };
    
    const getDifficultyText = (difficulty: string) => {
      switch(difficulty) {
        case 'beginner': return '入门';
        case 'intermediate': return '进阶';
        case 'advanced': return '专家';
        default: return '未知';
      }
    };
    
    return (
      <motion.div
        key={scenario.id}
        className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
          isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'
        }`}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        onClick={() => startNewConversation(scenario)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-700 text-white shadow-md`}>
              <i className={`fa-solid ${getCategoryIcon(scenario.category)} text-xl`}></i>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
              {getDifficultyText(scenario.difficulty)}
            </span>
          </div>
          
          <h3 className="text-xl font-bold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
            {scenario.title}
          </h3>
          
          <p className="mb-4" style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
            {scenario.description}
          </p>
          
          <div className="mb-4">
            <p className="text-sm mb-1 flex items-center" style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
              <i className="fa-solid fa-user mr-2"></i> 角色: {scenario.role}
            </p>
            <p className="text-sm flex items-center" style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
              <i className="fa-solid fa-bullseye mr-2"></i> 目标: {scenario.goal}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {scenario.topics.map((topic, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-xs ${
                  isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {topic}
              </span>
            ))}
          </div>
          
          <button 
            className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              startNewConversation(scenario);
            }}
          >
            开始练习
          </button>
        </div>
      </motion.div>
    );
  };

  // 获取最新的用户消息及其分析
  const getLatestUserMessageWithAnalysis = () => {
    return messages
      .filter(msg => msg.sender === 'user' && msg.analysis)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0] || null;
  };

  // 获取最新的用户消息
  const latestUserMessage = getLatestUserMessageWithAnalysis();

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ color: isDark ? '#E5E7EB' : '#1E3A8A' }}
          >
            AI对话练习
          </motion.h1>
          <motion.p 
            className="text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}
          >
            在模拟场景中练习沟通技巧，获取实时反馈和改进建议
          </motion.p>
        </div>

        {/* View selector */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              currentView === 'scenarios'
                ? 'bg-blue-600 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setCurrentView('scenarios')}
          >
            场景选择
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              currentView === 'history'
                ? 'bg-blue-600 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setCurrentView('history')}
            disabled={conversations.length === 0}
          >
            历史记录 ({conversations.length})
          </button>
        </div>

        {/* View content */}
        {currentView === 'scenarios' && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {scenarios.map(renderScenarioCard)}
          </motion.div>
        )}

        {currentView === 'history' && (
          <motion.div 
            className={`rounded-xl overflow-hidden shadow-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {conversations.length > 0 ? (
              <div className="overflow-hidden">
                <div className={`grid grid-cols-12 p-4 font-medium border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="col-span-4">场景</div>
                  <div className="col-span-5 hidden md:block">最后消息</div>
                  <div className="col-span-3 md:col-span-2 text-right">时间</div>
                  <div className="col-span-1 md:hidden"></div>
                </div>
                <div>
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={`grid grid-cols-12 p-4 border-b hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                        isDark ? 'border-slate-700' : 'border-gray-200'
                      }`}
                    >
                      <div className="col-span-4 font-medium" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                        {conversation.title}
                      </div>
                      <div className="col-span-5 hidden md:block" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        {conversation.lastMessage}
                      </div>
                      <div className="col-span-3 md:col-span-2 text-right" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        {new Date(conversation.timestamp).toLocaleString()}
                      </div>
                      <div className="col-span-1 flex justify-end space-x-2">
                        <button 
                          className={`p-1.5 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                          onClick={() => loadConversation(conversation.id)}
                        >
                          <i className="fa-solid fa-arrow-right" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}></i>
                        </button>
                        <button 
                          className={`p-1.5 rounded ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50'}`}
                          onClick={() => deleteConversation(conversation.id)}
                        >
                          <i className="fa-solid fa-trash" style={{ color: isDark ? '#F87171' : '#DC2626' }}></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <i className="fa-solid fa-history text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
                </div>
                <h3 className="text-xl font-medium mb-2" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                  暂无历史记录
                </h3>
                <p className="mb-6" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                  开始练习对话后，历史记录将保存在这里
                </p>
                <button 
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md"
                  onClick={() => setCurrentView('scenarios')}
                >
                  浏览场景
                </button>
              </div>
            )}
          </motion.div>
        )}

        {currentView === 'practice' && currentScenario && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* 总体分析面板 - 左侧 */}
             <div className="lg:col-span-3">
               <div className={`rounded-xl shadow-md overflow-hidden h-[calc(100vh-280px)] flex flex-col ${
                 isDark ? 'bg-slate-800' : 'bg-blue-50'
               }`}>
                 {/* Panel header */}
                 <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-blue-100 bg-blue-50/80'}`}>
                   <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#1E40AF' }}>
                     总体分析
                   </h3>
                 </div>
                 
                 {/* 雷达图分析 */}
                 <div className="p-4">
                   <h4 className="font-medium mb-3" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                     综合评分
                   </h4>
                   
                   {/* Radar Chart */}
                   <div className="h-64 w-full">
                     {overallAnalysis.hasData ? (
                       <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                           { subject: '语言表达', score: overallAnalysis.languageExpression, fullMark: 100 },
                           { subject: '情绪管理', score: overallAnalysis.emotionalManagement, fullMark: 100 },
                           { subject: '逻辑结构', score: overallAnalysis.logicalStructure, fullMark: 100 },
                           { subject: '沟通效果', score: overallAnalysis.communicationEffectiveness, fullMark: 100 },
                         ]}>
                           <PolarGrid stroke={isDark ? '#374151' : '#CBD5E1'} />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94A3B8' : '#64748B' }} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: isDark ? '#94A3B8' : '#64748B' }} />
                           <Radar
                             name="当前评分"
                             dataKey="score"
                             stroke="#3B82F6"
                             fill="#3B82F6"
                             fillOpacity={0.6}
                           />
                           <Tooltip 
                             contentStyle={{ 
                               backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                               borderColor: isDark ? '#334155' : '#E2E8F0',
                               borderRadius: '0.5rem',
                               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                             }}
                           />
                         </RadarChart>
                       </ResponsiveContainer>
                     ) : (
                       <div className="h-full flex items-center justify-center">
                         <div className="text-center">
                           <i className="fa-solid fa-chart-radar text-4xl mb-2" style={{ color: isDark ? '#64748B' : '#94A3B8' }}></i>
                           <p style={{ color: isDark ? '#94A3B8' : '#64748B' }}>发送消息后将显示总体分析</p>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
                 
                 {/* 总体评分详情 */}
                 {overallAnalysis.hasData && (
                   <div className="p-4 border-t" style={{ borderColor: isDark ? '#374151' : '#DBEAFE' }}>
                     <h4 className="font-medium mb-3" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                       评分详情
                     </h4>
                     
                     <div className="space-y-3">
                       <div>
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>语言表达</span>
                           <span className="text-sm font-medium" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>{overallAnalysis.languageExpression}</span>
                         </div>
                         <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}>
                           <div 
                             className="h-full rounded-full bg-blue-600" 
                             style={{ width: `${overallAnalysis.languageExpression}%` }}
                           ></div>
                         </div>
                       </div>
                       
                       <div>
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>情绪管理</span>
                           <span className="text-sm font-medium" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>{overallAnalysis.emotionalManagement}</span>
                         </div>
                         <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}>
                           <div 
                             className="h-full rounded-full bg-blue-600" 
                             style={{ width: `${overallAnalysis.emotionalManagement}%` }}
                           ></div>
                         </div>
                       </div>
                       
                       <div>
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>逻辑结构</span>
                           <span className="text-sm font-medium" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>{overallAnalysis.logicalStructure}</span>
                         </div>
                         <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}>
                           <div 
                             className="h-full rounded-full bg-blue-600" 
                             style={{ width: `${overallAnalysis.logicalStructure}%` }}
                           ></div>
                         </div>
                       </div>
                       
                       <div>
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>沟通效果</span>
                           <span className="text-sm font-medium" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>{overallAnalysis.communicationEffectiveness}</span>
                         </div>
                         <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-blue-100'}`}>
                           <div 
                             className="h-full rounded-full bg-blue-600" 
                             style={{ width: `${overallAnalysis.communicationEffectiveness}%` }}
                           ></div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
                 
                 {/* 对话统计 */}
                 <div className="p-4 border-t mt-auto" style={{ borderColor: isDark ? '#374151' : '#DBEAFE' }}>
                   <div className="flex justify-between text-sm">
                     <div className="text-center">
                       <div className="font-bold text-lg mb-1" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>
                         {messages.filter(m => m.sender === 'user').length}
                       </div>
                       <div style={{ color: isDark ? '#94A3B8' : '#64748B' }}>你的消息</div>
                     </div>
                     <div className="text-center">
                       <div className="font-bold text-lg mb-1" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>
                         {messages.length}
                       </div>
                       <div style={{ color: isDark ? '#94A3B8' : '#64748B' }}>总消息数</div>
                     </div>
                     <div className="text-center">
                       <div className="font-bold text-lg mb-1" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>
                         {messages.filter(m => m.sender === 'user' && m.analysis).length}
                       </div>
                       <div style={{ color: isDark ? '#94A3B8' : '#64748B' }}>已分析</div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* 对话区域 - 中间 */}
             <div className="lg:col-span-6">
               <div className={`rounded-xl shadow-md overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                 {/* Scenario header */}
                 <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
                   <div className="flex justify-between items-center">
                     <div>
                       <h3 className="font-bold text-lg" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                         {currentScenario.title}
                       </h3>
                       <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                         {currentScenario.description}
                       </p>
                     </div>
                     <button 
                       className={`p-2 rounded-full ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
                       onClick={() => setCurrentView('scenarios')}
                     >
                       <i className="fa-solid fa-times" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}></i>
                     </button>
                   </div>
                 </div>
                 
                 {/* Messages container */}
                 <div className="p-4 h-[calc(100vh-360px)] overflow-y-auto">
                   {messages.map((message) => (
                     <motion.div
                       key={message.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.3 }}
                       className={`mb-4 ${message.sender === 'user' ? 'flex justify-end' : 'flex'
                       }`}
                     >
                       <div className={`max-w-[80%] ${
                         message.sender === 'user' 
                           ? 'ml-auto' 
                           : 'mr-auto'
                       }`}>
                         <div className={`p-4 rounded-2xl shadow-sm ${
                           message.sender === 'user'
                             ? 'bg-blue-600 text-white rounded-br-none'
                             : isDark 
                               ? 'bg-slate-700 text-white rounded-bl-none' 
                               : 'bg-gray-100 text-gray-800 rounded-bl-none'
                         }`}>
                           <p>{message.content}</p>
                         </div>
                         <div className="flex justify-end mt-1 text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                           {message.sender === 'user' ? '你' : 'AI'} · {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                       </div>
                     </motion.div>
                   ))}
                   
                   {/* Loading indicator */}
                   {isLoading && (
                     <div className="flex mb-4">
                       <div className="max-w-[80%] mr-auto">
                         <div className={`p-4 rounded-2xl ${
                           isDark ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-800'
                         } rounded-bl-none`}>
                           <div className="flex space-x-2">
                             <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                             <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                             <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                           </div>
                         </div>
                         <div className="flex justify-end mt-1 text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                           AI · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                       </div>
                     </div>
                   )}
                   
                   {/* Analysis in progress */}
                   {isAnalyzing && (
                     <div className="flex justify-end mb-4">
                       <div className="max-w-[80%] ml-auto">
                         <div className={`p-4 rounded-2xl bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-br-none`}>
                           <div className="flex items-center">
                             <i className="fa-solid fa-microscope mr-2"></i>
                             <span>正在分析你的消息...</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   )}
                   
                   <div ref={messagesEndRef} />
                 </div>
                 
                 {/* Message input */}
                 <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                   <div className="flex gap-2">
                     <input
                       type="text"
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder="输入你的回复..."
                       className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                         isDark
                           ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                           : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                       }`}
                       onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                       disabled={isLoading}
                     />
                     <button
                       onClick={sendMessage}
                       disabled={!newMessage.trim() || isLoading}
                       className={`p-3 rounded-lg transition-colors duration-200 ${
                         !newMessage.trim() || isLoading
                           ? 'opacity-50 cursor-not-allowed bg-blue-400'
                           : 'bg-blue-600 hover:bg-blue-700'
                       } text-white`}
                     >
                       <i className="fa-solid fa-paper-plane"></i>
                     </button>
                   </div>
                   
                   {/* Message count limit for free users */}
                   {!isAuthenticated && (
                     <div className="mt-2 text-xs text-right" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                       剩余消息: {5 - messages.filter(m => m.sender === 'user').length}
                     </div>
                   )}
                 </div>
               </div>
               
               {/* Suggested responses */}
               <AnimatePresence>
                 {showSuggestions && suggestedResponses.length > 0 && (
                   <motion.div 
                     className={`rounded-xl shadow-md overflow-hidden mt-6 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.3 }}
                   >
                     <div className="p-4">
                       <div className="flex justify-between items-center mb-3">
                         <h4 className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                           推荐回复:
                         </h4>
                         <button 
                           className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                           onClick={() => setShowSuggestions(false)}
                         >
                           隐藏建议
                         </button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         {suggestedResponses.map((response) => (
                           <motion.div
                             key={response.id}
                             className={`p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm ${
                               isDark 
                                 ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                                 : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                             }`}
                             whileHover={{ y: -2 }}
                             onClick={() => selectSuggestedResponse(response)}
                           >
                             <div className="flex justify-between items-center mb-2">
                               <span className={`text-xs px-2 py-0.5 rounded-full ${
                                 response.style === 'direct'
                                   ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                   : response.style === 'indirect'
                                     ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                     : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                               }`}>
                                 {response.style === 'direct' ? '直接型' : response.style === 'indirect' ? '委婉型' : '幽默型'}
                               </span>
                               <div className="flex items-center">
                                 <i className="fa-solid fa-star text-amber-500 mr-1"></i>
                                 <span className="text-sm font-medium">{response.effectiveness}%</span>
                               </div>
                             </div>
                             <p className="text-sm line-clamp-2" style={{ color: isDark ? '#E5E7EB' : '#4B5563' }}>
                               {response.content}
                             </p>
                           </motion.div>
                         ))}
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
             
             {/* 单条消息分析面板 - 右侧 */}
             <div className="lg:col-span-3">
               <div className={`rounded-xl shadow-md overflow-hidden h-[calc(100vh-280px)] flex flex-col ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                 {/* 分析面板头部 */}
                 <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
                   <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                     消息分析
                   </h3>
                 </div>
                 
                 {/* 消息内容 */}
                 {latestUserMessage && latestUserMessage.analysis ? (
                   <motion.div 
                     className="p-4 flex-1 overflow-y-auto"
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     transition={{ duration: 0.3 }}
                   >
                     {/* 用户消息内容 */}
                     <div className="mb-6">
                       <h4 className="text-sm font-medium mb-2" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                         你的消息
                       </h4>
                       <div className={`p-3 rounded-lg ${
                         isDark ? 'bg-slate-700' : 'bg-gray-50 border border-gray-200'
                       }`}>
                         <p style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                           {latestUserMessage.content}
                         </p>
                       </div>
                     </div>
                     
                     {/* Analysis summary */}
                     <div className="mb-6">
                       <h5 className="text-sm font-medium mb-3" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                         多维度评分
                       </h5>
                       
                       {/* Chart container */}
                       <div className="h-52 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart
                             data={[
                               { name: '语言表达', value: latestUserMessage.analysis.languageExpression },
                               { name: '情绪管理', value: latestUserMessage.analysis.emotionalManagement },
                               { name: '逻辑结构', value: latestUserMessage.analysis.logicalStructure },
                               { name: '沟通效果', value: latestUserMessage.analysis.communicationEffectiveness },
                             ]}
                             layout="vertical"
                             margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                           >
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                             <XAxis type="number" domain={[0, 100]} />
                             <YAxis dataKey="name" type="category" width={60} />
                             <Tooltip />
                             <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     </div>
                     
                     {/* Suggestions */}
                     <div className="mb-6">
                       <h5 className="text-sm font-medium mb-3" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                         改进建议
                       </h5>
                       <ul className="space-y-2">
                         {latestUserMessage.analysis.suggestions.map((suggestion, index) => (
                           <li key={index} className="flex items-start">
                             <i className="fa-solid fa-lightbulb text-amber-500 mt-1 mr-2"></i>
                             <span style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                               {suggestion}
                             </span>
                           </li>
                         ))}
                       </ul>
                       
                       <div className="mt-3 flex flex-wrap gap-2">
                         {latestUserMessage.analysis.suggestions.map((suggestion, index) => (
                           <button
                             key={index}
                             className={`text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 transition-colors duration-200`}
                             onClick={() => copySuggestion(suggestion)}
                           >
                             <i className="fa-solid fa-copy mr-1"></i> 复制建议 {index + 1}
                           </button>
                         ))}
                       </div>
                     </div>
                     
                     {/* Optimal response */}
                     {latestUserMessage.analysis.optimalResponse && (
                       <div className={`p-4 rounded-lg ${
                         isDark ? 'bg-slate-700' : 'bg-gray-50 border border-gray-200'
                       }`}>
                         <h5 className="font-medium mb-3 flex items-center" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                           <i className="fa-solid fa-thumbs-up text-green-500 mr-2"></i>
                           优化回复
                         </h5>
                         <p className="mb-3" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                           {latestUserMessage.analysis.optimalResponse}
                         </p>
                         <div className="flex justify-end space-x-2">
                           <button
                             className={`text-xs px-2 py-1 rounded ${
                               isDark 
                                 ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-900/70' 
                                 : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                             } transition-colors duration-200`}
                             onClick={() => copySuggestion(latestUserMessage.analysis.optimalResponse!)}
                           >
                             <i className="fa-solid fa-copy mr-1"></i> 复制
                           </button>
                           <button
                             className={`text-xs px-2 py-1 rounded ${
                               isDark 
                                 ? 'bg-green-900/50 text-green-300 hover:bg-green-900/70' 
                                 : 'bg-green-100 text-green-800 hover:bg-green-200'
                             } transition-colors duration-200`}
                             onClick={() => applyOptimalResponse(latestUserMessage.analysis.optimalResponse!)}
                           >
                             <i className="fa-solid fa-check mr-1"></i> 应用到下次对话
                           </button>
                         </div>
                       </div>
                     )}
                   </motion.div>
                 ) : (
                   <div className="p-4 flex items-center justify-center flex-1">
                     <div className="text-center">
                       <i className="fa-solid fa-chart-bar text-4xl mb-2" style={{ color: isDark ? '#64748B' : '#94A3B8' }}></i>
                       <p style={{ color: isDark ? '#94A3B8' : '#64748B' }}>发送消息后将显示分析结果</p>
                     </div>
                   </div>
                 )}
               </div>
             </div>
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
              <span>未登录用户仅可体验基础功能。登录后可解锁更多场景、无限对话次数、详细分析报告和个性化学习路径。</span>
            </p>
            <button
              onClick={() => document.getElementById('login-btn')?.click()}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200"
            >
              立即登录
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}