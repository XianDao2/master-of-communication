"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
// Lucide icons
import { Star, Clock, Flame, Trophy, PieChart, LineChart, 
  Bot, Lightbulb, Circle, Lock, Users, Book, UserPlus,
  BarChart, ArrowUp, ArrowDown } from 'lucide-react';

// 定义评估历史接口
interface AssessmentRecord {
  id: string;
  date: string;
  overallScore: number;
  categoryScores: {
    [key: string]: number;
  };
}

// 定义练习记录接口
interface PracticeRecord {
  id: string;
  date: string;
  scenario: string;
  duration: number;
  score: number;
  improvement: string[];
}

// 定义学习统计接口
interface LearningStats {
  totalPracticeTime: number;
  completedScenarios: number;
  articlesRead: number;
  badgesEarned: number;
  currentStreak: number;
  longestStreak: number;
  improvementRate: number;
}

// 模拟评估历史数据
const mockAssessmentHistory: AssessmentRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    overallScore: 75,
    categoryScores: {
      '表达能力': 70,
      '倾听能力': 85,
      '情绪管理': 72,
      '冲突处理': 68,
      '非语言沟通': 80,
      '团队沟通': 76
    }
  },
  {
    id: '2',
    date: '2024-02-10',
    overallScore: 79,
    categoryScores: {
      '表达能力': 75,
      '倾听能力': 86,
      '情绪管理': 78,
      '冲突处理': 74,
      '非语言沟通': 81,
      '团队沟通': 78
    }
  },
  {
    id: '3',
    date: '2024-03-05',
    overallScore: 83,
    categoryScores: {
      '表达能力': 82,
      '倾听能力': 88,
      '情绪管理': 80,
      '冲突处理': 79,
      '非语言沟通': 83,
      '团队沟通': 84
    }
  }
];

// 模拟练习记录数据
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

// 模拟学习统计数据
const mockLearningStats: LearningStats = {
  totalPracticeTime: 420, // 分钟
  completedScenarios: 12,
  articlesRead: 8,
  badgesEarned: 5,
  currentStreak: 7,
  longestStreak: 15,
  improvementRate: 10.7
};

// 定义徽章接口
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  date: string;
  isLocked: boolean;
}

// 模拟徽章数据
const mockBadges: Badge[] = [
  {
    id: '1',
    name: '沟通新手',
    description: '完成第一次沟通评估',
    icon: 'users',
    date: '2024-01-15',
    isLocked: false
  },
  {
    id: '2',
    name: '坚持不懈',
    description: '连续7天完成练习',
    icon: 'flame',
    date: '2024-03-16',
    isLocked: false
  },
  {
    id: '3',
    name: '学习达人',
    description: '阅读10篇沟通技巧文章',
    icon: 'book',
    date: '',
    isLocked: true
  },
  {
    id: '4',
    name: '全能沟通者',
    description: '所有沟通维度评分达到85分以上',
    icon: 'trophy',
    date: '',
    isLocked: true
  },
  {
    id: '5',
    name: '团队之星',
    description: '完成5次团队沟通场景练习',
    icon: 'users',
    date: '2024-03-18',
    isLocked: false
  }
];

// 进度卡片组件
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
  theme: string;
  subtext?: string;
}> = ({ title, value, icon, color, theme, subtext }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 rounded-xl",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600 dark:bg-${color}-900/30 dark:text-${color}-400`}>
          {icon === 'star' ? <Star size={20} /> : icon === 'clock' ? <Clock size={20} /> : icon === 'flame' ? <Flame size={20} /> : <Trophy size={20} />}
        </div>
        {subtext && (
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
          )}>
            {subtext}
          </span>
        )}
      </div>
      <h3 className={cn(
        "text-2xl md:text-3xl font-bold mb-1",
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      )}>
        {value}
      </h3>
      <p className={cn(
        "text-sm",
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      )}>
        {title}
      </p>
    </motion.div>
  );
};

// 评估历史图表组件
const AssessmentHistoryChart: React.FC<{
  data: AssessmentRecord[];
  theme: string;
}> = ({ data, theme }) => {
  const maxScore = 100;
  const chartHeight = 200;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">评估历史趋势</h3>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500"></span>
          <span className="text-sm">总体评分</span>
        </div>
      </div>
      
      <div className={`h-[${chartHeight}px] relative`}>
        {/* Y轴刻度 */}
        <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-xs text-gray-500">
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        
        {/* 图表网格线 */}
        {[0, 20, 40, 60, 80, 100].map((value) => (
          <div
            key={value}
            className={cn(
              "absolute left-10 right-0 h-px",
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            )}
            style={{ top: `${(1 - value / maxScore) * chartHeight}px` }}
          ></div>
        ))}
        
        {/* 数据线 */}
        {data.length > 1 && (
          <svg
            className="absolute left-10 top-0 w-full h-full"
            viewBox={`0 0 ${data.length * 60 - 20} ${chartHeight}`}
          >
            <polyline
              points={data.map((item, index) => {
                const x = index * 60 + 20;
                const y = (1 - item.overallScore / maxScore) * chartHeight;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            
            {/* 数据点 */}
            {data.map((item, index) => {
              const x = index * 60 + 20;
              const y = (1 - item.overallScore / maxScore) * chartHeight;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3b82f6"
                />
              );
            })}
          </svg>
        )}
        
        {/* X轴日期 */}
        <div className="absolute left-10 bottom-0 w-full flex justify-between text-xs text-gray-500">
          {data.map((item, index) => (
            <div key={index} className="text-center" style={{ width: '60px' }}>
              {new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 练习记录表格组件
const PracticeRecordsTable: React.FC<{
  records: PracticeRecord[];
  theme: string;
}> = ({ records, theme }) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn(
        "w-full border-collapse",
        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
      )}>
        <thead>
          <tr className={cn(
            "border-b",
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          )}>
            <th className="py-3 text-left font-medium">日期</th>
            <th className="py-3 text-left font-medium">场景</th>
            <th className="py-3 text-left font-medium">时长</th>
            <th className="py-3 text-left font-medium">得分</th>
            <th className="py-3 text-left font-medium">提升点</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr 
              key={record.id}
              className={cn(
                "border-b hover:bg-opacity-5 transition-colors",
                theme === 'dark' 
                  ? 'border-gray-700 hover:bg-white' 
                  : 'border-gray-200 hover:bg-gray-50'
              )}
            >
              <td className="py-3">
                {new Date(record.date).toLocaleDateString('zh-CN')}
              </td>
              <td className="py-3">{record.scenario}</td>
              <td className="py-3">{record.duration}分钟</td>
              <td className="py-3">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  record.score >= 90
                    ? theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
                    : record.score >= 70
                    ? theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
                    : theme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                )}>
                  {record.score}/100
                </span>
              </td>
              <td className="py-3">
                <div className="flex flex-wrap gap-1">
                  {record.improvement.map((item, index) => (
                    <span 
                      key={index}
                      className={cn(
                        "px-2 py-1 rounded-md text-xs",
                        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                      )}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 徽章组件
const BadgeCard: React.FC<{ badge: Badge; theme: string }> = ({ badge, theme }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "p-4 rounded-xl text-center relative",
        badge.isLocked
          ? theme === 'dark' ? 'bg-slate-700/50 opacity-70' : 'bg-gray-100 opacity-70'
          : theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700'
      )}
    >
      {badge.isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl z-10">
          <Lock size={24} />
        </div>
      )}
      
      <div className={`p-4 rounded-full mb-3 inline-block bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400`}>
        {badge.icon === 'users' ? <Users size={24} /> : badge.icon === 'flame' ? <Flame size={24} /> : badge.icon === 'book' ? <Book size={24} /> : badge.icon === 'trophy' ? <Trophy size={24} /> : <Users size={24} />}
      </div>
      
      <h3 className="text-lg font-bold mb-1">{badge.name}</h3>
      <p className={cn(
        "text-sm mb-2",
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {badge.description}
      </p>
      
      {!badge.isLocked && badge.date && (
        <p className={cn(
          "text-xs",
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          {new Date(badge.date).toLocaleDateString('zh-CN')}
        </p>
      )}
    </motion.div>
  );
};

export default function ProgressPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentRecord[]>(mockAssessmentHistory);
  const [practiceRecords, setPracticeRecords] = useState<PracticeRecord[]>(mockPracticeRecords);
  const [learningStats, setLearningStats] = useState<LearningStats>(mockLearningStats);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [loading, setLoading] = useState(true);
  
  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 计算最近评估得分和上次相比的变化
  const getLatestScoreChange = () => {
    if (assessmentHistory.length < 2) return { change: 0, direction: 'neutral' };
    
    const latest = assessmentHistory[assessmentHistory.length - 1];
    const previous = assessmentHistory[assessmentHistory.length - 2];
    const change = latest.overallScore - previous.overallScore;
    
    let direction: 'up' | 'down' | 'neutral' = 'neutral';
    if (change > 0) direction = 'up';
    else if (change < 0) direction = 'down';
    
    return { change: Math.abs(change), direction };
  };
  
  const scoreChange = getLatestScoreChange();
  
  // 渲染加载状态
  if (loading) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      )}>
        <div className="text-center">
          <div className="inline-block p-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <PieChart size={30} className="animate-spin" />
        </div>
          <h2 className="mt-4 text-xl font-bold">加载进度数据中...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === 'dark' ? 'bg-slate-900 text-gray-100' : 'bg-white text-gray-800'
    )}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-900 dark:text-blue-300">
          学习进度
        </h1>
        <p className={cn(
          "mb-8 text-lg",
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          跟踪你的沟通能力提升和学习成果
        </p>
        
        {/* 时间范围选择器 */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => setSelectedTimeRange('week')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                selectedTimeRange === 'week'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-sm'
                  : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
              )}
            >
              最近一周
            </button>
            <button
              onClick={() => setSelectedTimeRange('month')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                selectedTimeRange === 'month'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-sm'
                  : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
              )}
            >
              最近一月
            </button>
            <button
              onClick={() => setSelectedTimeRange('all')}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                selectedTimeRange === 'all'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 shadow-sm'
                  : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
              )}
            >
              全部
            </button>
          </div>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="总体评分"
            value={assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1].overallScore : '--'}
            icon="star"
            color="blue"
            theme={theme}
            subtext={scoreChange.direction === 'up' ? '+' + scoreChange.change : scoreChange.direction === 'down' ? '-' + scoreChange.change : undefined}
          />
          <StatsCard
            title="学习时长"
            value={`${Math.floor(learningStats.totalPracticeTime / 60)}小时${learningStats.totalPracticeTime % 60}分钟`}
            icon="clock"
            color="purple"
            theme={theme}
          />
          <StatsCard
            title="连续学习"
            value={`${learningStats.currentStreak}天`}
            icon="flame"
            color="red"
            theme={theme}
          />
          <StatsCard
            title="获得徽章"
            value={badges.filter(b => !b.isLocked).length}
            icon="trophy"
            color="amber"
            theme={theme}
          />
        </div>
        
        {/* 评估历史和最近练习记录 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 评估历史 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? 'bg-slate-800' : 'bg-white',
              'shadow-lg border border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">评估历史</h2>
              <button className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              )}>
                查看全部
              </button>
            </div>
            
            {assessmentHistory.length > 0 ? (
              <>
                <AssessmentHistoryChart data={assessmentHistory} theme={theme} />
                
                {/* 最新评估结果详情 */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">最新评估维度得分</h3>
                  <div className="space-y-4">
                    {Object.entries(assessmentHistory[assessmentHistory.length - 1].categoryScores).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm">{score}</span>
                        </div>
                        <div className={cn(
                          "w-full h-2 rounded-full overflow-hidden",
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        )}>
                          <motion.div
                            className={`h-full ${score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-4 rounded-full mb-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <LineChart size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">暂无评估记录</h3>
                <p className={cn(
                  "mb-4",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  完成一次沟通评估，开始跟踪你的进步
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  )}
                >
                  开始评估
                </motion.button>
              </div>
            )}
          </motion.div>
          
          {/* 最近练习记录 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? 'bg-slate-800' : 'bg-white',
              'shadow-lg border border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">最近练习记录</h2>
              <button className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              )}>
                查看全部
              </button>
            </div>
            
            {practiceRecords.length > 0 ? (
              <PracticeRecordsTable records={practiceRecords} theme={theme} />
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-4 rounded-full mb-4 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <Bot size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">暂无练习记录</h3>
                <p className={cn(
                  "mb-4",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  开始AI对话练习，提升你的沟通技巧
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                  )}
                >
                  开始练习
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* 徽章展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">我的徽章</h2>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
            )}>
              {badges.filter(b => !b.isLocked).length}/{badges.length} 已获得
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} theme={theme} />
            ))}
          </div>
        </motion.div>
        
        {/* 学习建议 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={cn(
            "p-6 rounded-xl relative overflow-hidden",
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50',
            'shadow-lg border border-gray-200 dark:border-gray-700'
          )}
        >
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex-shrink-0">
                <Lightbulb size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">个性化学习建议</h2>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <Circle size={12} className="mt-1.5 text-blue-500 fill-current" />
                    <span>根据你的评估结果，建议加强冲突处理技巧的练习</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle size={12} className="mt-1.5 text-blue-500 fill-current" />
                    <span>尝试阅读《非暴力沟通》文章，学习如何更有效地表达和倾听</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle size={12} className="mt-1.5 text-blue-500 fill-current" />
                    <span>保持当前的学习势头，距离你的下一个徽章只差3天连续学习</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-5 py-2.5 rounded-lg font-medium transition-colors duration-200",
                    theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  )}
                >
                  查看完整学习计划
                </motion.button>
              </div>
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