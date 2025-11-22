import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// Types for progress tracking components
interface ProgressData {
  date: string;
  score: number;
  practiceCount: number;
  knowledgeCount: number;
}

interface SkillMetric {
  name: string;
  score: number;
  target: number;
}

interface PracticeHistory {
  id: string;
  date: string;
  scenario: string;
  duration: string;
  score: number;
  improvement: number | null;
}

export default function ProgressTracking() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [skillMetrics, setSkillMetrics] = useState<SkillMetric[]>([]);
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock progress data based on time range
  const generateProgressData = (range: 'week' | 'month' | 'year') => {
    const data: ProgressData[] = [];
    const now = new Date();
    
    if (range === 'week') {
      // Generate data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
          score: Math.floor(Math.random() * 20) + 75, // 75-95
          practiceCount: Math.floor(Math.random() * 3) + 1, // 1-3
          knowledgeCount: Math.floor(Math.random() * 2) // 0-1
        });
      }
    } else if (range === 'month') {
      // Generate data for the last 30 days (sampled every 3 days)
      for (let i = 9; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 3));
        
        data.push({
          date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
          score: Math.floor(Math.random() * 20) + 70, // 70-90
          practiceCount: Math.floor(Math.random() * 5) + 2, // 2-6
          knowledgeCount: Math.floor(Math.random() * 3) + 1 // 1-3
        });
      }
    } else if (range === 'year') {
      // Generate data for the last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        
        data.push({
          date: date.toLocaleDateString('zh-CN', { month: 'short' }),
          score: Math.floor(Math.random() * 15) + 75, // 75-90
          practiceCount: Math.floor(Math.random() * 10) + 5, // 5-15
          knowledgeCount: Math.floor(Math.random() * 5) + 2 // 2-6
        });
      }
    }
    
    return data;
  };

  // Generate mock skill metrics
  const generateSkillMetrics = () => {
    return [
      { name: '语言表达', score: 85, target: 90 },
      { name: '情绪管理', score: 78, target: 85 },
      { name: '逻辑结构', score: 88, target: 90 },
      { name: '沟通效果', score: 82, target: 88 }
    ];
  };

  // Generate mock practice history
  const generatePracticeHistory = () => {
    const scenarios = ['工作汇报', '客户谈判', '团队冲突', '初次见面', '拒绝邀请', '亲子沟通'];
    const history: PracticeHistory[] = [];
    const now = new Date();
    
    // Generate 10 practice sessions
    for (let i = 0; i < 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * Math.floor(Math.random() * 3) - 1);
      
      // Random score between 75-95
      const score = Math.floor(Math.random() * 20) + 75;
      
      // Calculate improvement (50% chance of improvement, 50% chance of no improvement)
      let improvement: number | null = null;
      if (i > 0) {
        improvement = Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : null;
      }
      
      history.push({
        id: `practice-${i}`,
        date: date.toLocaleDateString('zh-CN'),
        scenario: scenarios[Math.floor(Math.random() * scenarios.length)],
        duration: `${Math.floor(Math.random() * 15) + 15}分钟`,
        score,
        improvement
      });
    }
    
    return history;
  };

  // Load progress data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        setProgressData(generateProgressData(timeRange));
        setSkillMetrics(generateSkillMetrics());
        setPracticeHistory(generatePracticeHistory());
      } catch (error) {
        toast.error('加载进度数据失败，请稍后再试');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [timeRange, isAuthenticated]);

  // Calculate overall progress stats
  const calculateStats = () => {
    if (progressData.length === 0) return { averageScore: 0, totalPractice: 0, totalKnowledge: 0 };
    
    const totalScore = progressData.reduce((sum, item) => sum + item.score, 0);
    const averageScore = Math.round(totalScore / progressData.length);
    
    const totalPractice = progressData.reduce((sum, item) => sum + item.practiceCount, 0);
    const totalKnowledge = progressData.reduce((sum, item) => sum + item.knowledgeCount, 0);
    
    return { averageScore, totalPractice, totalKnowledge };
  };

  const stats = calculateStats();

  // Render progress badge
  const renderProgressBadge = (improvement: number | null) => {
    if (improvement === null) {
      return null;
    }
    
    return (
      <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
        <i className="fa-solid fa-arrow-up mr-1"></i>
        {improvement}%
      </span>
    );
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('请先登录以查看你的学习进度');
      // In a real app, we would redirect to the login page
      // For demo purposes, we'll just show a message
    }
  }, [isAuthenticated]);

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
            进度追踪
          </h1>
          <p className="text-lg" style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
            跟踪你的学习历程和技能提升数据
          </p>
        </motion.div>

        {/* Time range selector */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              timeRange === 'week'
                ? 'bg-orange-500 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setTimeRange('week')}
          >
            最近一周
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              timeRange === 'month'
                ? 'bg-orange-500 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setTimeRange('month')}
          >
            最近一月
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              timeRange === 'year'
                ? 'bg-orange-500 text-white shadow-md'
                : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            onClick={() => setTimeRange('year')}
          >
            最近一年
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-600 text-white`}>
                  <i className="fa-solid fa-chart-line text-xl"></i>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  平均分
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                {stats.averageScore}
              </h3>
              <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                所有练习的平均得分
              </p>
            </div>
          </motion.div>
          
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-green-600 text-white`}>
                  <i className="fa-solid fa-comments text-xl"></i>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                }`}>
                  练习次数
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                {stats.totalPractice}
              </h3>
              <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                完成的AI对话练习
              </p>
            </div>
          </motion.div>
          
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-purple-600 text-white`}>
                  <i className="fa-solid fa-book-open text-xl"></i>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                }`}>
                  学习时长
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                {Math.round(stats.totalPractice * 20 / 60)}h
              </h3>
              <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                累计学习时间
              </p>
            </div>
          </motion.div>
          
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-orange-600 text-white`}>
                  <i className="fa-solid fa-file-lines text-xl"></i>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800'
                }`}>
                  知识库
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                {stats.totalKnowledge}
              </h3>
              <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                阅读的文章数量
              </p>
            </div>
          </motion.div>
        </div>

        {/* Progress charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Score trend chart */}
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden col-span-1 lg:col-span-2 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                得分趋势
              </h3>
            </div>
            <div className="p-4 h-80">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch fa-spin text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                      tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
                    />
                    <YAxis 
                      stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                      domain={[60, 100]}
                      tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        borderColor: isDark ? '#374151' : '#E5E7EB',
                        color: isDark ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      name="平均得分" 
                      stroke="#F97316" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
          
          {/* Activity chart */}
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                活动分布
              </h3>
            </div>
            <div className="p-4 h-80">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch fa-spin text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={progressData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                      tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
                    />
                    <YAxis 
                      stroke={isDark ? '#9CA3AF' : '#6B7280'} 
                      tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        borderColor: isDark ? '#374151' : '#E5E7EB',
                        color: isDark ? '#F9FAFB' : '#111827'
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="practiceCount" name="练习次数" fill="#3B82F6" />
                    <Bar dataKey="knowledgeCount" name="学习次数" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>

        {/* Skills radar chart and metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Skills radar chart */}
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                技能雷达图
              </h3>
            </div>
            <div className="p-4 h-80">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch fa-spin text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillMetrics}>
                    <PolarGrid stroke={isDark ? '#374151' : '#E5E7EB'} />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]}
                      tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
                    />
                    <Radar
                      name="当前水平"
                      dataKey="score"
                      stroke="#F97316"
                      fill="#F97316"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="目标水平"
                      dataKey="target"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        borderColor: isDark ? '#374151' : '#E5E7EB',
                        color: isDark ? '#F9FAFB' : '#111827'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
          
          {/* Skill metrics */}
          <motion.div
            className={`rounded-xl shadow-lg overflow-hidden col-span-1 lg:col-span-2 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                技能指标
              </h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <i className="fa-solid fa-circle-notch fa-spin text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
                </div>
              ) : (
                <div className="space-y-6">
                  {skillMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                          {metric.name}
                        </h4>
                        <div className="flex items-center">
                          <span className="font-bold mr-2" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                            {metric.score}
                          </span>
                          <span className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                            / {metric.target} 目标
                          </span>
                        </div>
                      </div>
                      <div className={`w-full h-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <motion.div 
                          className="h-full rounded-full bg-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.score}%` }}
                          transition={{ duration: 1, delay: 0.2 * index }}
                        />
                      </div>
                      <div className="mt-1 flex justify-end">
                        {metric.score >= metric.target ? (
                          <span className="text-xs text-green-500 flex items-center">
                            <i className="fa-solid fa-check-circle mr-1"></i>
                            已达成目标
                          </span>
                        ) : (
                          <span className="text-xs text-blue-500 flex items-center">
                            <i className="fa-solid fa-arrow-up-circle mr-1"></i>
                            还需提升 {metric.target - metric.score} 分
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Practice history */}
        <motion.div
          className={`rounded-xl shadow-lg overflow-hidden mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
              练习历史
            </h3>
          </div>
          <div>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
              </div>
            ) : practiceHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className={isDark ? 'bg-slate-700' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                        日期
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                        场景
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                        时长
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                        得分
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                        进步
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className={isDark ? 'bg-slate-800 divide-y divide-slate-700' : 'bg-white divide-y divide-gray-200'}>
                    {practiceHistory.map((practice, index) => (
                      <tr key={practice.id} className={index % 2 === 0 ? isDark ? 'bg-slate-800' : 'bg-white' : isDark ? 'bg-slate-800/80' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                          {practice.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                          {practice.scenario}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                          {practice.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2" 
                              style={{ 
                                backgroundColor: practice.score >= 90 
                                  ? 'rgba(16, 185, 129, 0.2)' 
                                  : practice.score >= 80 
                                    ? 'rgba(59, 130, 246, 0.2)' 
                                    : 'rgba(245, 158, 11, 0.2)',
                                color: practice.score >= 90 
                                  ? '#10B981' 
                                  : practice.score >= 80 
                                    ? '#3B82F6' 
                                    : '#F59E0B'
                              }}>
                              {practice.score}
                            </div>
                            <span style={{ 
                              color: practice.score >= 90 
                                ? '#10B981' 
                                : practice.score >= 80 
                                  ? '#3B82F6' 
                                  : '#F59E0B'
                            }}>
                              {practice.score >= 90 ? '优秀' : practice.score >= 80 ? '良好' : '良好'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {renderProgressBadge(practice.improvement)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className={`px-3 py-1 rounded ${
                            isDark 
                              ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } transition-colors duration-200`}>
                            <i className="fa-solid fa-eye mr-1"></i> 查看详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-slate-700' : 'bg-gray-100'
                }`}>
                  <i className="fa-solid fa-history text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
                </div>
                <h3 className="text-xl font-medium mb-2" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                  暂无练习记录
                </h3>
                <p className="mb-6" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                  开始AI对话练习，记录将保存在这里
                </p>
                <a 
                  href="/ai-practice" 
                  className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                >
                  开始练习
                </a>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Personalized recommendations */}
        <motion.div
          className={`rounded-xl shadow-lg overflow-hidden mb-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className={`p-4 border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'}`}>
            <h3 className="font-bold" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
              个性化推荐
            </h3>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="h-40 flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl" style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}></i>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Recommendation 1 */}
                <div className={`p-4 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white mr-3 flex-shrink-0`}>
                      <i className="fa-solid fa-book"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                        推荐学习
                      </h4>
                      <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        情绪管理技巧提升
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    基于你的练习数据，我们推荐你学习情绪管理相关的文章和技巧。
                  </p>
                  <a 
                    href="/knowledge" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    查看推荐 <i className="fa-solid fa-arrow-right ml-1"></i>
                  </a>
                </div>
                
                {/* Recommendation 2 */}
                <div className={`p-4 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-orange-600 text-white mr-3 flex-shrink-0`}>
                      <i className="fa-solid fa-comments"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                        推荐练习
                      </h4>
                      <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        团队冲突场景
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    这个场景可以帮助你提升情绪管理和冲突解决能力，与你的学习目标匹配度较高。
                  </p>
                  <a 
                    href="/ai-practice" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    开始练习 <i className="fa-solid fa-arrow-right ml-1"></i>
                  </a>
                </div>
                
                {/* Recommendation 3 */}
                <div className={`p-4 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-green-600 text-white mr-3 flex-shrink-0`}>
                      <i className="fa-solid fa-calendar"></i>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1" style={{ color: isDark ? '#D1D5DB' : '#111827' }}>
                        学习计划
                      </h4>
                      <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        每周2次练习
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                      为了达到你的目标水平，建议每周进行2次AI对话练习，每次20-30分钟。
                  </p>
                  <a 
                    href="#" 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('学习计划功能即将上线');
                    }}
                  >
                    设置提醒 <i className="fa-solid fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Locked features notice for free users */}
        {!isAuthenticated && (
          <motion.div 
            className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <p className="text-blue-800 dark:text-blue-300 flex items-start">
              <i className="fa-solid fa-lock mt-1 mr-2"></i>
              <span>登录后可查看你的详细学习进度、技能提升数据和个性化学习计划。</span>
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