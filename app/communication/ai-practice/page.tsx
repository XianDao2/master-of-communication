'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Star, Clock, Users, TrendingUp, Trophy, CheckCircle, Send, ThumbsUp, Lightbulb, Copy, Check, Lock, X, ArrowRight, ArrowLeft, Trash2, Microscope, History, PieChart, BarChart2, Play } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/hooks/use-user';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { OpenAI } from 'openai';

// 定义消息接口
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

// 定义对话接口
interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  scenarioId: string;
  messages: Message[];
}

// 定义场景接口
interface Scenario {
  id: string;
  title: string;
  description: string;
  role: string;
  goal: string;
  initialMessage: string;
  category: string;
  difficulty: string;
  topics: string[];
}

// 练习记录接口（与进度页面保持一致）
interface PracticeRecord {
  id: string;
  scenarioId: string;
  scenarioName: string;
  messages: Message[];
  score: number;
  timestamp: Date;
}

// 学习统计接口（与进度页面保持一致）
interface LearningStats {
  totalPractices: number;
  averageScore: number;
  badgesEarned: number;
  longestConversation: number;
}

// 徽章接口（与进度页面保持一致）
interface Badge {
  id: number;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

// 定义建议响应接口
interface SuggestedResponse {
  id: string;
  content: string;
  style: 'direct' | 'indirect' | 'humorous';
  effectiveness: number;
  emotionalTransmission: number;
  informationCompleteness: number;
  reason: string;
}

// 定义消息分析接口
interface MessageAnalysis {
  languageExpression: number;
  emotionalManagement: number;
  logicalStructure: number;
  communicationEffectiveness: number;
  empathy: number;
  suggestions: string[];
  improvementSuggestions?: string[];
  feedback?: string; // AI生成的综合反馈
  suggestedResponses?: SuggestedResponse[]; // AI生成的建议响应
}

// 定义对话分析接口
interface ConversationAnalysis {
  overallScore: number;
  goalAchievement: number;
  interactionSmoothness: number;
  emotionalManagement: number;
  empathy: number;
  communicationStrategy: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

// ConversationAnalysisSummary 组件 - 对话分析结果展示
const ConversationAnalysisSummary: React.FC<{ analysis: ConversationAnalysis | null, isAnalyzing: boolean }> = ({ analysis, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">正在分析对话质量，请稍候...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-600 dark:text-gray-300">暂无对话分析结果</p>
      </div>
    );
  }

  // 分析维度配置
  const analysisDimensions = [
    { key: 'goalAchievement', label: '目标达成度', icon: '🎯' },
    { key: 'interactionSmoothness', label: '交互流畅性', icon: '💬' },
    { key: 'emotionalManagement', label: '情绪管理', icon: '😊' },
    { key: 'empathy', label: '共情能力', icon: '🤝' },
    { key: 'communicationStrategy', label: '沟通策略', icon: '📊' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">对话质量分析</h3>
      
      {/* 总体评分卡片 */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">总体评分</h4>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analysis.overallScore}</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">/ 5</span>
          </div>
        </div>
        <div className="mt-2 text-gray-600 dark:text-gray-300">{analysis.summary}</div>
      </div>

      {/* 各维度评分 */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">各维度评分</h4>
        <div className="space-y-4">
          {analysisDimensions.map(dim => (
            <div key={dim.key} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="mr-2">{dim.icon}</span>
                  {dim.label}
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {analysis[dim.key as keyof ConversationAnalysis]}/5
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(analysis[dim.key as keyof ConversationAnalysis] as number / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 优缺点分析 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 优点 */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-200">
            <span className="mr-2">👍</span> 优点
          </h4>
          <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300">
            {analysis.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        {/* 不足 */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 flex items-center text-gray-700 dark:text-gray-200">
            <span className="mr-2">📝</span> 待改进
          </h4>
          <ul className="list-disc pl-6 space-y-1 text-gray-600 dark:text-gray-300">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// AnalysisRadar 组件 - 雷达图分析
const AnalysisRadar: React.FC<{
  languageExpression: number;
  emotionalManagement: number;
  logicalStructure: number;
  communicationEffectiveness: number;
  empathy: number;
  theme: 'light' | 'dark';
}> = ({ 
  languageExpression, 
  emotionalManagement, 
  logicalStructure, 
  communicationEffectiveness, 
  empathy,
  theme
}) => {
  // 简单的雷达图实现，实际项目中可以使用Chart.js等库
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-500';
    if (score >= 3) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center text-center">
        <div className={`text-3xl font-bold ${getScoreColor(languageExpression)}`}>
          {languageExpression}
        </div>
        <p className="text-sm mt-1">语言表达</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className={`text-3xl font-bold ${getScoreColor(emotionalManagement)}`}>
          {emotionalManagement}
        </div>
        <p className="text-sm mt-1">情绪管理</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className={`text-3xl font-bold ${getScoreColor(logicalStructure)}`}>
          {logicalStructure}
        </div>
        <p className="text-sm mt-1">逻辑结构</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className={`text-3xl font-bold ${getScoreColor(communicationEffectiveness)}`}>
          {communicationEffectiveness}
        </div>
        <p className="text-sm mt-1">沟通效果</p>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className={`text-3xl font-bold ${getScoreColor(empathy)}`}>
          {empathy}
        </div>
        <p className="text-sm mt-1">共情能力</p>
      </div>
    </div>
  );
};

// ImprovementSuggestions 组件 - 改进建议列表
const ImprovementSuggestions: React.FC<{
  suggestions: string[];
  theme: 'light' | 'dark';
}> = ({ suggestions, theme }) => {
  return (
    <ul className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className={`p-2 rounded-full mt-0.5 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <Lightbulb className="text-blue-500" />
          </div>
          <div>
            <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{suggestion}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

// OptimalResponsePanel 组件 - 优化回复面板
const OptimalResponsePanel: React.FC<{
  response: string;
  theme: 'light' | 'dark';
  onCopy: () => void;
  onApply: () => void;
}> = ({ response, theme, onCopy, onApply }) => {
  return (
    <div className={cn(
      "space-y-4",
      theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50',
      'p-4 rounded-lg'
    )}>
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">优化后的回复</h4>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className={cn(
              "p-2 rounded-md",
              theme === 'dark' ? 'hover:bg-slate-600' : 'hover:bg-gray-200',
              'transition-colors'
            )}
            title="复制到剪贴板"
          >
            <Copy />
          </button>
        </div>
      </div>
      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{response}</p>
      <div className="pt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          提示：这个回复示例展示了如何更好地表达您的观点，注意语言的清晰度和情感的适当性。
        </p>
      </div>
    </div>
  );
};

// MessageAnalysisPanel 组件 - 消息分析面板
const MessageAnalysisPanel: React.FC<{
  analysis: MessageAnalysis;
  theme: 'light' | 'dark';
}> = ({ analysis, theme }) => {
  const getScoreLabel = (score: number) => {
    if (score >= 4) return '优秀';
    if (score >= 3) return '良好';
    if (score >= 2) return '一般';
    return '待提升';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-yellow-500';
    if (score >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
      {analysis.feedback && (
        <div className={`mb-6 p-4 rounded-lg border ${theme === 'dark' ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
          <p className="italic">{analysis.feedback}</p>
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3">语言表达</h4>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getScoreColor(analysis.languageExpression)}`}
                style={{ width: `${(analysis.languageExpression / 5) * 100}%` }}
              ></div>
            </div>
            <span className="font-medium w-16 text-center">{getScoreLabel(analysis.languageExpression)}</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">情绪管理</h4>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getScoreColor(analysis.emotionalManagement)}`}
                style={{ width: `${(analysis.emotionalManagement / 5) * 100}%` }}
              ></div>
            </div>
            <span className="font-medium w-16 text-center">{getScoreLabel(analysis.emotionalManagement)}</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">逻辑结构</h4>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getScoreColor(analysis.logicalStructure)}`}
                style={{ width: `${(analysis.logicalStructure / 5) * 100}%` }}
              ></div>
            </div>
            <span className="font-medium w-16 text-center">{getScoreLabel(analysis.logicalStructure)}</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">共情能力</h4>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${getScoreColor(analysis.empathy)}`}
                style={{ width: `${(analysis.empathy / 5) * 100}%` }}
              ></div>
            </div>
            <span className="font-medium w-16 text-center">{getScoreLabel(analysis.empathy)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// SuggestionCard 组件 - 建议回复卡片
const SuggestionCard: React.FC<{
  suggestion: SuggestedResponse;
  theme: 'light' | 'dark';
  onSelect: () => void;
}> = ({ suggestion, theme, onSelect }) => {
  const getStyleLabel = (style: string) => {
    switch (style) {
      case 'direct': return '直接表达';
      case 'indirect': return '委婉表达';
      case 'humorous': return '幽默表达';
      default: return style;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 hover:border-blue-500' : 'border-gray-200 hover:border-blue-400'} transition-all`}
      onClick={onSelect}
    >
      <p className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{suggestion.content}</p>
      <div className="flex justify-between items-center">
        <div className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
          {getStyleLabel(suggestion.style)}
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="text-green-500 text-xs" />
          <span className="text-xs text-gray-500">{suggestion.effectiveness}/5</span>
        </div>
      </div>
    </motion.div>
  );
};

// 模拟数据（与进度页面保持一致）
const mockPracticeRecords: PracticeRecord[] = [
  {
    id: '1',
    date: '2024-03-10',
    scenario: '职场冲突解决',
    duration: 15,
    score: 82,
    improvement: ['情绪控制', '倾听技巧']
  },
  {
    id: '2',
    date: '2024-03-12',
    scenario: '客户沟通',
    duration: 20,
    score: 86,
    improvement: ['问题澄清', '同理心表达']
  },
  {
    id: '3',
    date: '2024-03-15',
    scenario: '团队会议发言',
    duration: 18,
    score: 90,
    improvement: ['逻辑表达', '说服力']
  },
  {
    id: '4',
    date: '2024-03-18',
    scenario: '跨部门协作',
    duration: 22,
    score: 88,
    improvement: ['合作意识', '信息分享']
  }
];

const mockLearningStats: LearningStats = {
  totalPracticeTime: 420,
  completedScenarios: 12,
  articlesRead: 8,
  badgesEarned: 5,
  currentStreak: 7,
  longestStreak: 15,
  improvementRate: 10.7
};

const mockBadges: Badge[] = [
  {
    id: '1',
    name: '沟通新手',
    description: '完成第一次沟通评估',
    icon: 'fa-user-plus',
    date: '2024-01-15',
    isLocked: false
  },
  {
    id: '2',
    name: '坚持不懈',
    description: '连续7天完成练习',
    icon: 'fa-fire',
    date: '',
    isLocked: true
  },
  {
    id: '3',
    name: '学习达人',
    description: '阅读10篇沟通技巧文章',
    icon: 'fa-book',
    date: '',
    isLocked: true
  },
  {
    id: '4',
    name: '全能沟通者',
    description: '所有沟通维度评分达到85分以上',
    icon: 'fa-trophy',
    date: '',
    isLocked: true
  },
  {
    id: '5',
    name: '团队之星',
    description: '完成5次团队沟通场景练习',
    icon: 'fa-users',
    date: '',
    isLocked: true
  }
];

// 评分组件
interface ScoreProps {
  score: number;
  maxScore?: number;
  size?: 'small' | 'medium' | 'large';
}

const Score: React.FC<ScoreProps> = ({ score, maxScore = 5, size = 'medium' }) => {
  const { theme } = useTheme();
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(maxScore)].map((_, i) => (
        <i 
          key={i} 
          className={`fa-solid fa-star ${sizeClasses[size]} ${i < score ? 'text-yellow-400' : 'text-gray-300'}`}
        ></i>
      ))}
      <span className={cn(
        `${sizeClasses[size]} font-semibold ml-1`,
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        {score}/{maxScore}
      </span>
    </div>
  );
};

// 定义消息分析接口
interface MessageAnalysis {
  languageExpression: number;
  emotionalManagement: number;
  logicalStructure: number;
  empathy: number;
  feedback?: string;
}

// AnalysisRadar组件已在文件顶部定义，这里不再重复定义

// 评分详情组件
const ScoreDetails = ({ analysis }: { analysis: MessageAnalysis }) => {
  const categories = [
    { label: '语言表达', score: analysis.languageExpression, color: 'blue' },
    { label: '情绪管理', score: analysis.emotionalManagement, color: 'purple' },
    { label: '逻辑结构', score: analysis.logicalStructure, color: 'green' },
    { label: '同理心', score: analysis.empathy, color: 'orange' },
  ];

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.label}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{category.label}</span>
            <span className="text-sm font-bold">{category.score}/5</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-${category.color}-500`}
              style={{ width: `${(category.score / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// MessageAnalysisPanel组件已在文件顶部定义，这里不再重复定义

// 组件已在文件顶部定义，这里不再重复定义

// ImprovementSuggestions组件已在文件顶部定义，这里不再重复定义

// 模拟AI响应函数
const simulateAIResponse = (message: string, scenario: Scenario): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 基于场景的简单响应逻辑
      if (scenario.id === '1') {
        // 工作汇报场景
        if (message.includes('完成') || message.includes('进度')) {
          resolve('很好，你清晰地描述了项目进展。接下来，请具体说明你遇到的挑战和解决方案。');
        } else if (message.includes('挑战') || message.includes('困难')) {
          resolve('感谢你坦诚分享遇到的挑战。你是如何克服这些困难的？能否提供一些具体的例子？');
        } else {
          resolve('请继续详细说明你的工作内容，特别是关键成果和下一步计划。');
        }
      } else if (scenario.id === '2') {
        // 客户谈判场景
        if (message.includes('价格') || message.includes('优惠')) {
          resolve('我们理解您对价格的关注。能否分享一下您的预算范围，这样我们可以提供更符合您需求的方案？');
        } else if (message.includes('需求') || message.includes('要求')) {
          resolve('您提出的需求非常明确。我们可以针对这些需求定制解决方案，同时兼顾成本效益。');
        } else {
          resolve('作为客户，您最关心的是产品的哪些方面？质量、价格还是售后服务？');
        }
      } else {
        // 通用响应
        resolve(`基于${scenario.title}场景，我觉得您的回答可以更加具体一些。请尝试提供更多细节。`);
      }
    }, 1000 + Math.random() * 1000); // 模拟思考时间
  });
};

// 计算总体分析
const calculateOverallAnalysis = (messages: Message[]) => {
  const userMessagesWithAnalysis = messages.filter(msg => msg.sender === 'user' && msg.analysis);
  
  if (userMessagesWithAnalysis.length === 0) {
    return {
      hasData: false,
      languageExpression: 0,
      emotionalManagement: 0,
      logicalStructure: 0,
      communicationEffectiveness: 0
    };
  }
  
  // 计算平均分
  const avgLanguageExpression = Math.round(
    userMessagesWithAnalysis.reduce((sum, msg) => sum + msg.analysis!.languageExpression, 0) / userMessagesWithAnalysis.length
  );
  const avgEmotionalManagement = Math.round(
    userMessagesWithAnalysis.reduce((sum, msg) => sum + msg.analysis!.emotionalManagement, 0) / userMessagesWithAnalysis.length
  );
  const avgLogicalStructure = Math.round(
    userMessagesWithAnalysis.reduce((sum, msg) => sum + msg.analysis!.logicalStructure, 0) / userMessagesWithAnalysis.length
  );
  const avgCommunicationEffectiveness = Math.round(
    userMessagesWithAnalysis.reduce((sum, msg) => sum + msg.analysis!.communicationEffectiveness, 0) / userMessagesWithAnalysis.length
  );
  
  return {
    hasData: true,
    languageExpression: avgLanguageExpression,
    emotionalManagement: avgEmotionalManagement,
    logicalStructure: avgLogicalStructure,
    communicationEffectiveness: avgCommunicationEffectiveness
  };
};

// 为用户消息生成建议
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

// 为用户消息生成优化回复
const generateOptimalResponse = (message: string, scenario: Scenario): string => {
  // 这在实际应用中会由AI生成
  // 为演示目的，我们根据场景返回静态响应
  switch(scenario.id) {
    case '1':
      return '我们已经完成了项目的第一阶段，关键里程碑都已按时达成。团队协作良好，下阶段我们计划重点解决技术难点，预计需要两周时间。';
    case '2':
      return '感谢您的反馈，我们理解您对价格的顾虑。考虑到我们的产品质量和服务保障，这个价格已经非常有竞争力了。不过，为了表示合作诚意，我们可以提供三个月的免费维护服务。';
    case '3':
      return '我理解你的感受，让我们一起分析一下任务分配的原则。我们是根据每个人的专长和工作量来分配任务的，目的是让团队效率最大化。如果你对某些任务有疑问，我们可以具体讨论调整方案。';
    case '4':
      return '感谢你的坦诚反馈。我们确实在某些方面还有改进空间，这对我们很有帮助。我们会认真考虑你的建议，并在下周团队会议上讨论具体的改进措施。';
    case '5':
      return '我理解这种情况确实会造成困扰。让我们坐下来详细沟通一下，找出问题的根源，共同寻找解决方案。冲突的存在其实是一个机会，让我们更好地理解彼此的需求和期望。';
    case '6':
      return '今天我要向大家展示我们项目的核心价值和创新点。首先，让我们回顾一下市场需求...';
    default:
      return '我理解你的意思，让我们进一步讨论这个问题。';
  }
};

// 基于用户消息和场景生成AI响应
const generateAIResponse = (message: string, scenario: Scenario): string => {
  // 这在实际应用中会由AI生成
  // 为演示目的，我们根据场景返回动态响应
  switch(scenario.id) {
    case '1':
      return message.includes('进展') || message.includes('完成')
        ? '很好！能详细说明一下具体完成了哪些关键任务吗？有没有遇到什么挑战？'
        : message.includes('问题') || message.includes('挑战')
          ? '谢谢你的坦诚。针对这些问题，你们有什么解决方案吗？需要我提供什么支持？'
          : '谢谢你的汇报。总体来看进展不错，不过我想了解更多关于下阶段计划的细节。';
    case '2':
      return message.includes('调整') || message.includes('优惠')
        ? '我们已经给出了很有竞争力的价格。考虑到我们的产品质量和服务，这个价格是合理的。不过，我们可以在付款方式上提供一些灵活性。'
        : message.includes('价值') || message.includes('优势')
          ? '我理解你的看法。我们的产品确实比竞争对手略贵，但我们提供更完善的售后服务和技术支持，这将为你节省后续的维护成本。'
          : '我们的报价已经考虑了市场情况和成本因素。如果你对某些具体条款有疑问，我们可以详细讨论。';
    case '3':
      return message.includes('想法') || message.includes('建议')
        ? '你的想法很有价值！能再详细阐述一下吗？我想确保我完全理解了你的观点。'
        : message.includes('问题') || message.includes('疑问')
          ? '这是个很好的问题。让我们一起探讨一下可能的解决方案。'
          : '感谢你的参与和积极贡献。我们继续讨论下一个议题，看看还有什么需要改进的地方。';
    default:
      return '感谢你的分享。能进一步说明一下你的想法吗？';
  }
};

export default function AIPracticePage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<'scenarios' | 'conversation' | 'analysis'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [conversationStartTime, setConversationStartTime] = useState<number>(Date.now());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedResponses, setSuggestedResponses] = useState<SuggestedResponse[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [conversationAnalysis, setConversationAnalysis] = useState<ConversationAnalysis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  
  // 组件卸载时设置标记
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // 模拟对话场景数据
  const scenarios: Scenario[] = [
    {
      id: 'scenario-1',
      title: '项目汇报',
      description: '向你的经理汇报项目进展，包括已完成工作、遇到的挑战和下一步计划。',
      category: '工作场景',
      difficulty: 'medium',
      initialMessage: '请向我汇报一下最近的项目进展情况。',
      icon: 'fa-briefcase'
    },
    {
      id: 'scenario-2',
      title: '商务谈判',
      description: '与客户进行价格谈判，在保持利润的同时争取成交。',
      category: '商务场景',
      difficulty: 'high',
      initialMessage: '你们的报价比竞争对手高了不少，能否给我们一些优惠？',
      icon: 'fa-handshake'
    },
    {
      id: 'scenario-3',
      title: '团队协作',
      description: '与团队成员讨论任务分配，处理分歧并达成共识。',
      category: '工作场景',
      difficulty: 'medium',
      initialMessage: '我觉得这次的任务分配不太公平，为什么我总是分到最复杂的任务？',
      icon: 'fa-users'
    },
    {
      id: 'scenario-4',
      title: '社交场合',
      description: '在社交场合与陌生人进行自然流畅的交流，建立初步关系。',
      category: '社交场景',
      difficulty: 'easy',
      initialMessage: '你好，我是第一次参加这种活动，很高兴认识你。',
      icon: 'fa-glass-cheers'
    },
    {
      id: 'scenario-5',
      title: '婉拒邀请',
      description: '礼貌地拒绝他人的邀请，同时保持良好关系。',
      category: '社交场景',
      difficulty: 'easy',
      initialMessage: '周末有空一起去爬山吗？我们几个人一起。',
      icon: 'fa-calendar-times'
    },
    {
      id: 'scenario-6',
      title: '公开演讲',
      description: '在团队或会议中进行简短但有力的演讲，清晰表达观点。',
      category: '工作场景',
      difficulty: 'high',
      initialMessage: '大家好，请简单介绍一下你的想法。',
      icon: 'fa-bullhorn'
    }
  ];
  
  // 从本地存储加载对话历史
  useEffect(() => {
    const savedConversations = localStorage.getItem('ai_practice_conversations');
    if (savedConversations) {
      try {
        const parsedConversations = JSON.parse(savedConversations);
        if (isMountedRef.current) {
          setConversations(parsedConversations);
        }
      } catch (error) {
        console.error('Failed to parse conversation history:', error);
      }
    }
  }, []);
  
  // 保存对话历史到本地存储
  useEffect(() => {
    if (isMountedRef.current && conversations.length > 0) {
      localStorage.setItem('ai_practice_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);
  
  // 滚动到底部
  const scrollToBottom = () => {
    if (isMountedRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 生成建议回复
  const generateSuggestedResponses = (message: string, scenario: Scenario): SuggestedResponse[] => {
    // 这在实际应用中会由AI生成
    // 为演示目的，我们返回三种类型的建议回复
    const directResponse: SuggestedResponse = {
      id: 'direct',
      content: `关于这个问题，我的直接回答是：${message.length > 20 ? message.substring(0, 20) + '...' : message}，我认为我们需要立即采取行动。`,
      style: 'direct',
      effectiveness: 4,
      emotionalTransmission: 3,
      informationCompleteness: 4,
      reason: '直接表达清晰明了，能够高效传达意图'
    };

    const indirectResponse: SuggestedResponse = {
      id: 'indirect',
      content: `我理解你的观点，在我们考虑这个问题时，也许我们可以从另一个角度来看待：${message.length > 20 ? message.substring(0, 20) + '...' : message}，这样可能会有更好的解决方案。`,
      style: 'indirect',
      effectiveness: 3,
      emotionalTransmission: 4,
      informationCompleteness: 3,
      reason: '委婉表达能够照顾对方情绪，建立良好沟通氛围'
    };

    const humorousResponse: SuggestedResponse = {
      id: 'humorous',
      content: `哈哈，这个问题很有趣！如果我们用轻松一点的方式来看：${message.length > 20 ? message.substring(0, 20) + '...' : message}，也许会发现其实没那么复杂。`,
      style: 'humorous',
      effectiveness: 3,
      emotionalTransmission: 5,
      informationCompleteness: 2,
      reason: '幽默表达能够缓和气氛，使沟通更加轻松'
    };
    
    return [directResponse, indirectResponse, humorousResponse];
  };
  
  // 生成改进建议函数已在下方定义，这里不再重复定义
  
  // 生成优化回复
  const generateOptimalResponse = (message: string, scenario: Scenario): string => {
    // 这在实际应用中会由AI生成
    // 为演示目的，我们根据场景返回静态响应
    switch(scenario.id) {
      case 'scenario-1':
        return '感谢您的汇报。总体来看进展不错，不过我想了解更多关于下阶段计划的细节。';
      case 'scenario-2':
        return '我们已经给出了很有竞争力的价格。考虑到我们的产品质量和服务，这个价格是合理的。不过，我们可以在付款方式上提供一些灵活性。';
      case 'scenario-3':
        return '我理解你的感受，让我们一起分析一下任务分配的原则。我们是根据每个人的专长和工作量来分配任务的，目的是让团队效率最大化。如果你对某些任务有疑问，我们可以具体讨论调整方案。';
      case 'scenario-4':
        return '很高兴认识你！这是个很棒的活动，有很多有趣的人。你平时有什么兴趣爱好吗？';
      case 'scenario-5':
        return '谢谢你的邀请！周末我已经有安排了，不过我很期待下次能有机会一起爬山。';
      case 'scenario-6':
        return '今天我要向大家展示我们项目的核心价值和创新点。首先，让我们回顾一下市场需求...';
      default:
        return '我理解你的意思，让我们进一步讨论这个问题。';
    }
  };

  // 创建OpenAI客户端实例 - 参考pronunciation-generator.tsx的配置
  const getOpenAIClient = () => {
    return new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL || "https://api.siliconflow.cn/v1",
      apiKey:
        process.env.OPENROUTER_API_KEY ||
        process.env.OPENAI_API_KEY ||
        "sk-tvcwevarnuxopipulvzsqilteuwbrivzihandabyzprbijhl",
      dangerouslyAllowBrowser: true,
    });
  };

  // 使用大模型分析消息的沟通评价
  const analyzeMessage = async (message: string, scenario: Scenario, history: Message[]): Promise<any> => {
    try {
      const client = getOpenAIClient();
      
      // 格式化历史对话
      const formattedHistory = history.map((msg, index) => {
        const role = msg.sender === 'user' ? '用户' : 'AI';
        return `${index + 1}. ${role}：${msg.content}`;
      }).join('\n');
      
      const prompt = `
        分析以下用户消息的沟通质量，从以下五个维度进行评分（1-5分，1分最差，5分最好）：
        1. 语言表达：评估语言的清晰度、准确性和专业性
        2. 情绪管理：评估情绪表达的适当性和控制能力
        3. 逻辑结构：评估内容的组织和逻辑连贯性
        4. 共情能力：评估对对方立场的理解和认同
        5. 沟通效果：综合评估消息达成预期目标的有效性
        
        沟通场景：${scenario.title}
        场景描述：${scenario.description}
        
        历史对话：
        ${formattedHistory}
        
        当前消息："${message}"
        
        请以JSON格式返回分析结果，包含以下字段：
        - languageExpression: 语言表达评分（1-5）
        - emotionalManagement: 情绪管理评分（1-5）
        - logicalStructure: 逻辑结构评分（1-5）
        - empathy: 共情能力评分（1-5）
        - communicationEffectiveness: 沟通效果评分（1-5）
        - feedback: 对消息的简短评价（100字以内）
        - suggestions: 2-3条改进建议
        - suggestedResponses: 3条建议的响应，每条包含以下字段：
          - id: 唯一标识符（字符串）
          - content: 建议的响应内容
          - style: 响应风格（direct/indirect/humorous）
          - effectiveness: 预期效果评分（1-5）
          - emotionalTransmission: 情绪传递评分（1-5）
          - informationCompleteness: 信息完整性评分（1-5）
          - reason: 推荐理由
      `;

      const response = await client.chat.completions.create({
        model: "THUDM/GLM-Z1-9B-0414",
        messages: [{ role: "system", content: "你是一位专业的沟通顾问，擅长分析和评价沟通质量。" },
                  { role: "user", content: prompt }],
        temperature: 0.3,
      });

      // 解析AI的JSON响应
      const analysisContent = response.choices[0].message.content;
      const cleanContent = analysisContent.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanContent);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing message:', error);
      // 返回默认分析结果作为后备
      return {
        languageExpression: Math.floor(Math.random() * 3) + 3,
        emotionalManagement: Math.floor(Math.random() * 3) + 3,
        logicalStructure: Math.floor(Math.random() * 3) + 3,
        empathy: Math.floor(Math.random() * 3) + 3,
        communicationEffectiveness: Math.floor(Math.random() * 3) + 3,
        feedback: "分析过程中出现错误，使用默认评价。",
        suggestions: ["继续保持良好的沟通风格", "尝试在适当的场合使用更丰富的表达方式"],
        suggestedResponses: [
          {
            id: "default-1",
            content: "这是一个默认的直接响应示例。",
            style: "direct",
            effectiveness: 4,
            emotionalTransmission: 3,
            informationCompleteness: 4,
            reason: "默认直接响应，清晰明了"
          },
          {
            id: "default-2",
            content: "或许我们可以考虑一下这个问题的其他方面。",
            style: "indirect",
            effectiveness: 3,
            emotionalTransmission: 4,
            informationCompleteness: 3,
            reason: "默认间接响应，委婉表达"
          },
          {
            id: "default-3",
            content: "哈哈，这个问题很有趣，让我来想想！",
            style: "humorous",
            effectiveness: 3,
            emotionalTransmission: 5,
            informationCompleteness: 3,
            reason: "默认幽默响应，活跃气氛"
          }
        ]
      };
    }
  };

  // 生成改进建议
  const generateImprovementSuggestions = (analysis: MessageAnalysis): string[] => {
    const suggestions: string[] = [];
    
    // 根据不同维度的评分生成相应的建议
    if (analysis.languageExpression < 3) {
      suggestions.push('建议使用更清晰、简洁的语言表达，避免冗长和模糊的表述。');
    }
    
    if (analysis.emotionalManagement < 3) {
      suggestions.push('可以尝试更恰当地表达情绪，使用积极的语气增强沟通效果。');
    }
    
    if (analysis.logicalStructure < 3) {
      suggestions.push('建议先明确核心观点，再有条理地展开论述，使用结构化的表达方式。');
    }
    
    if (analysis.empathy < 3) {
      suggestions.push('尝试从对方的角度思考问题，表达理解和支持，增强共情能力。');
    }
    
    // 如果没有低分项目，添加一些通用的改进建议
    if (suggestions.length === 0) {
      suggestions.push('继续保持良好的沟通风格，尝试在适当的场合使用更丰富的表达方式。');
      suggestions.push('可以学习更多专业术语和表达方式，提升沟通的专业度。');
    }
    
    // 确保至少有一条建议
    if (suggestions.length === 0) {
      suggestions.push('继续保持良好的沟通习惯，定期练习可以进一步提升沟通技巧。');
    }
    
    return suggestions;
  };
  
  // 开始新对话
  const startNewConversation = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setConversationStartTime(Date.now()); // 记录对话开始时间
    const initialMessage: Message = {
      id: Date.now().toString(),
      content: scenario.initialMessage,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    setCurrentView('conversation');
    setSuggestedResponses([]);
    setCurrentAnalysis(null);
    
    // 创建新对话记录
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: scenario.title,
      lastMessage: scenario.initialMessage,
      timestamp: new Date(),
      scenarioId: scenario.id
    };
    setConversations([...conversations, newConversation]);
  };
  
  // 加载对话历史
  const loadConversationFromHistory = (conversation: Conversation) => {
    // 这里应该从存储中加载完整的对话消息
    // 为简化示例，我们假设这里可以获取到完整消息
    setSelectedScenario(scenarios.find(s => s.id === conversation.scenarioId) || null);
    // 在实际应用中，这里应该加载完整的消息历史
    setCurrentView('conversation');
    setSuggestedResponses([]);
    setCurrentAnalysis(null);
  };
  
  // 删除对话历史
  const deleteConversationFromHistory = (conversationId: string) => {
    const updatedHistory = conversations.filter(conv => conv.id !== conversationId);
    setConversations(updatedHistory);
  };
  
  // 发送消息
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedScenario || isTyping) return;
    
    // 非登录用户限制消息数量
    if (!user && messages.filter(msg => msg.sender === 'user').length >= 5) {
      toast({ title: '提示', description: '非登录用户最多只能发送5条消息，请登录后继续使用。' });
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    // 保存当前消息列表作为历史对话（在添加新消息之前）
    const currentHistory = [...messages];
    
    // 清空输入框并添加用户消息
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // 更新当前对话记录
    setConversations(prev => prev.map(conv => 
      conv.id === conversations[conversations.length - 1]?.id
        ? { ...conv, messages: [...(conv.messages || []), userMessage], updatedAt: new Date() }
        : conv
    ));
    
    try {
      // 生成消息分析 - 使用大模型进行实时分析
      setIsAnalyzing(true);
      
      // 调用大模型分析消息，传入历史对话
      const aiAnalysis = await analyzeMessage(newMessage, selectedScenario, currentHistory);
      
      // 为用户消息生成分析数据
      const analysis: MessageAnalysis = {
        languageExpression: aiAnalysis.languageExpression || Math.floor(Math.random() * 3) + 3,
        emotionalManagement: aiAnalysis.emotionalManagement || Math.floor(Math.random() * 3) + 3,
        logicalStructure: aiAnalysis.logicalStructure || Math.floor(Math.random() * 3) + 3,
        communicationEffectiveness: aiAnalysis.communicationEffectiveness || Math.floor(Math.random() * 3) + 3,
        empathy: aiAnalysis.empathy || Math.floor(Math.random() * 3) + 3,
        suggestions: aiAnalysis.suggestions || generateSuggestions(newMessage),
        improvementSuggestions: aiAnalysis.suggestions || generateImprovementSuggestions({
          languageExpression: aiAnalysis.languageExpression || Math.floor(Math.random() * 3) + 3,
          emotionalManagement: aiAnalysis.emotionalManagement || Math.floor(Math.random() * 3) + 3,
          logicalStructure: aiAnalysis.logicalStructure || Math.floor(Math.random() * 3) + 3,
          communicationEffectiveness: aiAnalysis.communicationEffectiveness || Math.floor(Math.random() * 3) + 3,
          empathy: aiAnalysis.empathy || Math.floor(Math.random() * 3) + 3
        }),
        optimalResponse: generateOptimalResponse(newMessage, selectedScenario),
        feedback: aiAnalysis.feedback,
        suggestedResponses: aiAnalysis.suggestedResponses
      };
      
      // 更新用户消息，添加分析数据
      if (isMountedRef.current) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, analysis }
              : msg
          )
        );
        setCurrentAnalysis(analysis);
        setIsAnalyzing(false);
      }

      // 使用大模型返回的建议回复
      if (isMountedRef.current && aiAnalysis.suggestedResponses) {
        setSuggestedResponses(aiAnalysis.suggestedResponses);
      } else {
        // 如果大模型没有返回建议回复，则使用默认生成的
        setSuggestedResponses(generateSuggestedResponses(newMessage, selectedScenario));
      }

      // 获取AI响应
      const aiResponse = await simulateAIResponse(newMessage, selectedScenario);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      if (isMountedRef.current) {
        setMessages(prev => [...prev, aiMessage]);
      }
      
      // 更新当前对话记录
      if (isMountedRef.current) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversations[conversations.length - 1]?.id
            ? { ...conv, messages: [...(conv.messages || []), aiMessage], updatedAt: new Date() }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (isMountedRef.current) {
        toast({ title: '错误', description: '发送消息失败，请重试。' });
      }
    } finally {
      if (isMountedRef.current) {
        setIsTyping(false);
      }
    }
  };

  // 复制建议回复到剪贴板
  const copySuggestionToClipboard = (suggestion: SuggestedResponse) => {
    navigator.clipboard.writeText(suggestion.content)
      .then(() => {
        toast({ title: '成功', description: '建议回复已复制到剪贴板' });
        setNewMessage(suggestion.content);
      })
      .catch(() => {
        toast({ title: '错误', description: '复制失败，请手动复制' });
      });
  };

  // 应用优化回复
  const applyOptimalResponse = () => {
    if (currentAnalysis?.optimalResponse) {
      setNewMessage(currentAnalysis.optimalResponse);
    }
  };
  
  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // 分析整个对话的沟通评价
  const analyzeConversation = async (messages: Message[], scenario: Scenario): Promise<any> => {
    try {
      const client = getOpenAIClient();
      
      // 构建对话历史文本
      const conversationText = messages.map(msg => 
        `${msg.sender === 'user' ? '用户' : 'AI'}: ${msg.content}`
      ).join('\n');
      
      const prompt = `
        分析以下完整对话的整体沟通质量，从以下几个维度进行评价：
        1. 沟通目标达成度：评估对话是否有效地达成了预期目标
        2. 互动流畅性：评估对话的连贯性和流畅程度
        3. 情绪管理：评估双方情绪表达的适当性和控制能力
        4. 共情能力：评估用户对AI立场的理解和认同程度
        5. 沟通策略：评估用户采用的沟通策略是否适合该场景
        
        沟通场景：${scenario.title}
        场景描述：${scenario.description}
        对话历史：
        ${conversationText}
        
        请以JSON格式返回分析结果，包含以下字段：
        - overallScore: 整体评分（1-5分，1分最差，5分最好）
        - goalAchievement: 沟通目标达成度评分（1-5）
        - interactionSmoothness: 互动流畅性评分（1-5）
        - emotionalManagement: 情绪管理评分（1-5）
        - empathy: 共情能力评分（1-5）
        - communicationStrategy: 沟通策略评分（1-5）
        - strengths: 对话中的优点（2-3点）
        - weaknesses: 需要改进的地方（2-3点）
        - summary: 整体评价和建议（200字以内）
        - suggestions: 建议的改进方向（3-4点）
      `;

      const response = await client.chat.completions.create({
        model: "THUDM/GLM-Z1-9B-0414",
        messages: [{ role: "system", content: "你是一位专业的沟通顾问，擅长分析完整对话的沟通质量。" },
                  { role: "user", content: prompt }],
        temperature: 0.3,
      });

      // 解析AI的JSON响应
      const analysisContent = response.choices[0].message.content;
      const cleanContent = analysisContent.replace(/```json|```/g, '').trim();
      const analysis = JSON.parse(cleanContent);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      // 返回默认分析结果作为后备
      return {
        overallScore: Math.floor(Math.random() * 2) + 3,
        goalAchievement: Math.floor(Math.random() * 2) + 3,
        interactionSmoothness: Math.floor(Math.random() * 2) + 3,
        emotionalManagement: Math.floor(Math.random() * 2) + 3,
        empathy: Math.floor(Math.random() * 2) + 3,
        communicationStrategy: Math.floor(Math.random() * 2) + 3,
        strengths: [],
        weaknesses: [],
        summary: ""
      };
    }
  };

  // 结束对话，查看分析
  const endConversation = async () => {
    let conversationAnalysis = null;
    
    // 如果有对话内容和选定的场景，分析整个对话
    if (messages.length > 0 && selectedScenario) {
      setIsAnalyzing(true);
      conversationAnalysis = await analyzeConversation(messages, selectedScenario);
      setConversationAnalysis(conversationAnalysis);
      setIsAnalyzing(false);
    }
    
    // 保存练习记录到进度系统，传入大模型分析结果
    savePracticeRecord(conversationAnalysis);
    
    setCurrentView('analysis');
  };
  
  // 保存练习记录到进度系统
  const savePracticeRecord = (conversationAnalysis: any) => {
    if (!selectedScenario) return;
    
    // 计算练习时长（分钟）
    const duration = Math.round((Date.now() - conversationStartTime) / (1000 * 60));
    
    // 使用大模型返回的结果作为改进建议和分数
    const improvementSuggestions = conversationAnalysis?.weaknesses || [];
    const score = conversationAnalysis?.overallScore ? Math.round(conversationAnalysis.overallScore * 20) : Math.round(overallScore * 20);
    
    // 创建练习记录
    const practiceRecord: PracticeRecord = {
      id: `practice_${Date.now()}`,
      date: new Date().toISOString(),
      scenario: selectedScenario.title,
      duration,
      score: score, // 转换为100分制
      improvement: improvementSuggestions
    };
    
    // 保存练习记录到本地存储
    const practiceRecords = JSON.parse(localStorage.getItem('practice_records') || JSON.stringify(mockPracticeRecords));
    practiceRecords.unshift(practiceRecord);
    localStorage.setItem('practice_records', JSON.stringify(practiceRecords));
    
    // 更新学习统计
    updateLearningStats(duration);
    
    // 检查并授予徽章
    checkAndAwardBadges(practiceRecord);
  };
  
  // 更新学习统计
  const updateLearningStats = (duration: number) => {
    const stats = JSON.parse(localStorage.getItem('learning_stats') || JSON.stringify(mockLearningStats));
    stats.totalPracticeTime += duration;
    stats.completedScenarios += 1;
    
    // 更新连续学习天数
    const lastPracticeDate = localStorage.getItem('last_practice_date');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (lastPracticeDate === yesterday) {
      stats.currentStreak += 1;
      stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
    } else if (lastPracticeDate !== today) {
      stats.currentStreak = 1;
    }
    
    localStorage.setItem('last_practice_date', today);
    localStorage.setItem('learning_stats', JSON.stringify(stats));
  };
  
  // 检查并授予徽章
  const checkAndAwardBadges = (record: PracticeRecord) => {
    const badges = JSON.parse(localStorage.getItem('user_badges') || JSON.stringify(mockBadges));
    const stats = JSON.parse(localStorage.getItem('learning_stats') || JSON.stringify(mockLearningStats));
    
    // 检查连续学习徽章
    if (stats.currentStreak >= 7 && badges.find((b: Badge) => b.id === '2')?.isLocked) {
      const badgeIndex = badges.findIndex((b: Badge) => b.id === '2');
      if (badgeIndex !== -1) {
        badges[badgeIndex].isLocked = false;
        badges[badgeIndex].date = new Date().toISOString();
        setShowBadgeNotification(true);
        setNewBadge(badges[badgeIndex]);
      }
    }
    
    // 检查团队沟通场景徽章
    if (record.scenario.includes('团队') && badges.find((b: Badge) => b.id === '5')?.isLocked) {
      const teamScenariosCount = JSON.parse(localStorage.getItem('practice_records') || '[]')
        .filter((r: PracticeRecord) => r.scenario.includes('团队')).length;
      
      if (teamScenariosCount >= 5) {
        const badgeIndex = badges.findIndex((b: Badge) => b.id === '5');
        if (badgeIndex !== -1) {
          badges[badgeIndex].isLocked = false;
          badges[badgeIndex].date = new Date().toISOString();
          setShowBadgeNotification(true);
          setNewBadge(badges[badgeIndex]);
        }
      }
    }
    
    localStorage.setItem('user_badges', JSON.stringify(badges));
  };
  
  // 获取总体分析
  const { score: overallScore, feedback: overallFeedback } = calculateOverallAnalysis(messages);
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === 'dark' ? 'bg-slate-900 text-gray-100' : 'bg-white text-gray-800'
    )}>
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-300">
                AI对话练习
              </h1>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                选择一个场景，开始与AI进行模拟对话练习，提升你的沟通能力。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ y: -5 }}
                    className={cn(
                      "p-6 rounded-xl cursor-pointer transition-all duration-300",
                      theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-gray-50',
                      'shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700'
                    )}
                    onClick={() => startNewConversation(scenario)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      )}>
                        {scenario.difficulty === 'beginner' ? '初级' :
                         scenario.difficulty === 'intermediate' ? '中级' : '高级'}
                      </span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                      )}>
                        {scenario.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{scenario.title}</h3>
                    <p className={cn(
                      "mb-4",
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {scenario.description}
                    </p>
                    <button className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                      theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    )}>
                      开始练习
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {currentView === 'conversation' && selectedScenario && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <button 
                  onClick={() => setCurrentView('scenarios')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg mb-4",
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>返回场景选择</span>
                </button>
                
                <div className={cn(
                  "p-4 rounded-xl",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-blue-50'
                )}>
                  <h2 className="text-2xl font-bold mb-2">{selectedScenario.title}</h2>
                  <p className={cn(
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {selectedScenario.description}
                  </p>
                </div>
              </div>
              
              {/* 主对话区域 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* 左侧分析面板 */}
                <div className={cn(
                  "lg:col-span-1",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'
                )}>
                  <h3 className="text-lg font-bold mb-4">消息分析</h3>
                  
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-500 dark:text-gray-400">分析中...</p>
                    </div>
                  ) : currentAnalysis ? (
                    <MessageAnalysisPanel 
                      analysis={currentAnalysis} 
                      theme={theme} 
                      onCopySuggestion={copySuggestionToClipboard}
                      onApplyOptimalResponse={applyOptimalResponse}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">发送消息后查看分析结果</p>
                    </div>
                  )}
                </div>
                
                {/* 右侧对话和输入区域 */}
                <div className="lg:col-span-2 flex flex-col h-[calc(100vh-300px)]">
                  {/* 消息列表 */}
                  <div className={cn(
                    "flex-1 overflow-y-auto mb-4 p-4 rounded-xl",
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                  )}>
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={cn(
                            "max-w-[80%] p-4 rounded-xl",
                            message.sender === 'user'
                              ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                              : theme === 'dark' ? 'bg-slate-700 text-gray-200' : 'bg-white text-gray-800'
                          )}
                        >
                          <p className="mb-2">{message.content}</p>
                          <div className="text-xs opacity-70 text-right">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start mb-6">
                        <div className={cn(
                          "max-w-[80%] p-4 rounded-xl",
                          theme === 'dark' ? 'bg-slate-700 text-gray-200' : 'bg-white text-gray-800'
                        )}>
                          <div className="flex space-x-1">
                            <div className="animate-bounce w-2 h-2 rounded-full bg-gray-400"></div>
                            <div className="animate-bounce w-2 h-2 rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                            <div className="animate-bounce w-2 h-2 rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* 建议回复区域 */}
                  {suggestedResponses.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">建议回复：</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {suggestedResponses.map((suggestion, index) => (
                          <SuggestionCard 
                            key={suggestion.id || index}
                            suggestion={suggestion}
                            theme={theme}
                            onCopy={() => copySuggestionToClipboard(suggestion)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 输入区域 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入你的回复..."
                      className={cn(
                        "flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2",
                        theme === 'dark'
                          ? 'bg-slate-800 border-gray-700 focus:ring-blue-500'
                          : 'bg-white border-gray-300 focus:ring-blue-500'
                      )}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className={cn(
                        "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
                        (!newMessage.trim() || isTyping)
                          ? 'opacity-50 cursor-not-allowed'
                          : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                      )}
                    >
                      发送
                    </button>
                  </div>
                  
                  {/* 非登录用户提示 */}
                  {!user && (
                    <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                      非登录用户最多可发送5条消息，已发送 {messages.filter(msg => msg.sender === 'user').length}/5
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={endConversation}
                  className={cn(
                    "px-6 py-2 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                  )}
                >
                  结束对话，查看分析
                </button>
              </div>
            </motion.div>
          )}
          
          {currentView === 'analysis' && selectedScenario && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <button 
                  onClick={() => setCurrentView('conversation')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg mb-4",
                    theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>返回对话</span>
                </button>
                
                {/* 徽章获得通知 */}
                {showBadgeNotification && newBadge && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50'} border border-amber-500/30 flex items-center gap-3`}
                  >
                    <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <div>
                      <h3 className="font-bold">恭喜获得新徽章！</h3>
                      <p>{newBadge.name}: {newBadge.description}</p>
                    </div>
                    <button 
                      onClick={() => setShowBadgeNotification(false)}
                      className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </motion.div>
                )}
                
                <h1 className="text-3xl font-bold mb-4 text-blue-900 dark:text-blue-300">
                  沟通分析报告
                </h1>
                
                <div className={cn(
                  "p-4 rounded-xl mb-6",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-blue-50'
                )}>
                  <h2 className="text-xl font-bold mb-2">{selectedScenario.title}</h2>
                  <p className={cn(
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    练习时长: {Math.round((Date.now() - conversationStartTime) / 60000)} 分钟
                  </p>
                </div>
              </div>
              
              {/* 总体评分和分析 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* 总体评分 */}
                <div className={cn(
                  "p-6 rounded-xl text-center",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'shadow-lg border border-gray-200 dark:border-gray-700'
                )}>
                  <Score score={overallScore} size={120} />
                  <p className="mt-4 text-lg font-medium">{overallFeedback}</p>
                </div>
                
                {/* 雷达图分析 */}
                <div className={cn(
                  "p-6 rounded-xl",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'shadow-lg border border-gray-200 dark:border-gray-700'
                )}>
                  <h3 className="text-xl font-bold mb-4 text-center">沟通维度分析</h3>
                  <AnalysisRadar 
                    languageExpression={Math.floor(Math.random() * 3) + 3} 
                    emotionalManagement={Math.floor(Math.random() * 3) + 3}
                    logicalStructure={Math.floor(Math.random() * 3) + 3}
                    communicationEffectiveness={Math.floor(Math.random() * 3) + 3}
                    empathy={Math.floor(Math.random() * 3) + 3}
                    theme={theme}
                  />
                </div>
              </div>
              
              {/* 详细指标卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={cn(
                  "p-4 rounded-xl flex flex-col items-center text-center",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'shadow-md border border-gray-200 dark:border-gray-700'
                )}>
                  <h3 className="font-medium mb-2">对话长度</h3>
                  <div className="text-3xl font-bold mb-2">{messages.length}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">轮对话</p>
                  <div className="mt-2">
                    {messages.length >= 5 ? 
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">良好</span> : 
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">可改进</span>
                    }
                  </div>
                </div>
                
                <div className={cn(
                  "p-4 rounded-xl flex flex-col items-center text-center",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'shadow-md border border-gray-200 dark:border-gray-700'
                )}>
                  <h3 className="font-medium mb-2">平均回复速度</h3>
                  <div className="text-3xl font-bold mb-2">{Math.floor(Math.random() * 30) + 10}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">秒/条</p>
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">及时</span>
                  </div>
                </div>
                
                <div className={cn(
                  "p-4 rounded-xl flex flex-col items-center text-center",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'shadow-md border border-gray-200 dark:border-gray-700'
                )}>
                  <h3 className="font-medium mb-2">表达清晰度</h3>
                  <div className="text-3xl font-bold mb-2">{Math.floor(Math.random() * 3) + 3}/5</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">评分</p>
                  <div className="mt-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">清晰</span>
                  </div>
                </div>
              </div>
              
              {/* 对话质量分析区域 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">对话质量分析</h2>
                <ConversationAnalysisSummary 
                  analysis={conversationAnalysis} 
                  isAnalyzing={isAnalyzing} 
                />
              </div>

              {/* 改进建议区域 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">总体改进建议</h2>
                <div className={cn(
                  "p-6 rounded-xl",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'shadow-lg border border-gray-200 dark:border-gray-700'
                )}>
                  <ImprovementSuggestions 
                    suggestions={[
                      '尝试使用更明确的语言表达您的观点',
                      '注意控制情绪，避免使用过于强烈的表达方式',
                      '组织您的思路，使其更有条理和逻辑性',
                      '多倾听对方的观点，尝试理解对方的立场'
                    ]} 
                    theme={theme} 
                  />
                </div>
              </div>
              
              {/* 优化回复区域 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">优化回复示例</h2>
                <div className={cn(
                  "p-6 rounded-xl",
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white',
                  'shadow-lg border border-gray-200 dark:border-gray-700'
                )}>
                  <OptimalResponsePanel 
                    response="根据您的沟通场景，这里提供一个优化后的回复示例。优化后的回复更加清晰、有条理，并且更好地考虑了对方的感受。您可以参考这种表达方式在类似场景中应用。" 
                    theme={theme}
                    onCopy={() => navigator.clipboard.writeText("根据您的沟通场景，这里提供一个优化后的回复示例。")}
                    onApply={() => console.log("Apply optimal response")}
                  />
                </div>
              </div>
              
              {/* 未登录用户提示 */}
              {!user && (
                <div className={cn(
                  "p-4 rounded-xl mb-6 text-center",
                  theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-50',
                  'border border-amber-500/30'
                )}>
                  <p className="mb-3">登录后可以保存练习记录，查看历史成绩和进步趋势</p>
                  <button className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                  )}>
                    立即登录
                  </button>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={() => startNewConversation(selectedScenario)}
                  className={cn(
                    "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  )}
                >
                  重新练习
                </button>
                <button
                  onClick={() => setCurrentView('scenarios')}
                  className={cn(
                    "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  )}
                >
                  选择其他场景
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}