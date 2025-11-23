"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

// 定义问题接口
interface Question {
  id: number;
  text: string;
  options: {
    value: number;
    text: string;
  }[];
  category: string;
}

// 定义评估结果接口
interface AssessmentResult {
  overallScore: number;
  categoryScores: {
    [key: string]: number;
  };
  feedback: string;
  improvementAreas: string[];
  strengths: string[];
}

// 基础评估问题数组
const questions: Question[] = [
  {
    id: 1,
    text: "在会议中，我能够清晰地表达自己的想法和观点",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "表达能力"
  },
  {
    id: 2,
    text: "当与他人意见不同时，我能够尊重对方的观点并进行建设性沟通",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "冲突处理"
  },
  {
    id: 3,
    text: "我能够很好地倾听他人说话，不打断或急于表达自己的看法",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "倾听能力"
  },
  {
    id: 4,
    text: "在面对压力时，我能够保持冷静并有效沟通",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "情绪管理"
  },
  {
    id: 5,
    text: "我能够清晰地理解他人的非语言沟通（如肢体语言、表情等）",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "非语言沟通"
  },
  {
    id: 6,
    text: "在与不同文化背景的人交流时，我能够尊重文化差异并调整沟通方式",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "跨文化沟通"
  },
  {
    id: 7,
    text: "我能够有效地使用书面沟通（如邮件、报告等）表达复杂想法",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "书面表达"
  },
  {
    id: 8,
    text: "当需要向他人提供反馈时，我能够既诚实又委婉地表达",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "反馈能力"
  },
  {
    id: 9,
    text: "在团队合作中，我能够促进有效的信息共享和协作",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "团队沟通"
  },
  {
    id: 10,
    text: "我能够根据不同的沟通对象和场合调整自己的沟通风格",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" }
    ],
    category: "沟通适应性"
  }
];

// 评分组件
const ScoreDisplay: React.FC<{ score: number; maxScore?: number }> = ({ score, maxScore = 5 }) => {
  const { theme } = useTheme();
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{score}/{maxScore}</span>
        <span className="text-sm">{percentage}%</span>
      </div>
      <div className={cn(
        "w-full h-2 rounded-full overflow-hidden",
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      )}>
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// 计算评估结果
const calculateResult = (answers: Record<number, number>): AssessmentResult => {
  // 计算总分
  let totalScore = 0;
  const categoryScores: Record<string, { score: number; count: number }> = {};
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    if (question) {
      totalScore += answer;
      
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, count: 0 };
      }
      categoryScores[question.category].score += answer;
      categoryScores[question.category].count += 1;
    }
  });
  
  const overallScore = Math.round((totalScore / (questions.length * 5)) * 100);
  
  // 计算各维度平均分
  const avgCategoryScores: Record<string, number> = {};
  Object.entries(categoryScores).forEach(([category, { score, count }]) => {
    avgCategoryScores[category] = Math.round((score / (count * 5)) * 100);
  });
  
  // 生成反馈和改进建议
  let feedback = '';
  const improvementAreas: string[] = [];
  const strengths: string[] = [];
  
  if (overallScore >= 80) {
    feedback = "恭喜！你的沟通能力非常优秀。你善于表达、倾听和处理各种沟通场景。继续保持并寻求更高的突破。";
  } else if (overallScore >= 60) {
    feedback = "你的沟通能力良好。你已经掌握了基本的沟通技巧，但仍有提升空间。关注那些得分较低的维度进行针对性练习。";
  } else {
    feedback = "你的沟通能力有待提升。建议从基础开始，系统学习沟通技巧，并在日常中不断练习。";
  }
  
  // 找出强项和弱项
  Object.entries(avgCategoryScores).forEach(([category, score]) => {
    if (score >= 80) {
      strengths.push(category);
    } else if (score < 60) {
      improvementAreas.push(category);
    }
  });
  
  // 如果没有明显的强项，就将得分最高的作为强项
  if (strengths.length === 0 && Object.keys(avgCategoryScores).length > 0) {
    const maxCategory = Object.entries(avgCategoryScores)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];
    strengths.push(maxCategory);
  }
  
  return {
    overallScore,
    categoryScores: avgCategoryScores,
    feedback,
    improvementAreas,
    strengths
  };
};

export default function AssessmentPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理选项选择
  const handleOptionSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // 下一步
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  // 上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // 提交评估
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      const assessmentResult = calculateResult(answers);
      setResult(assessmentResult);
      setIsSubmitting(false);
      
      // 保存到本地存储（在实际应用中，这里应该调用API保存到服务器）
      const savedResults = localStorage.getItem('communication_assessments') || '[]';
      const results = JSON.parse(savedResults);
      results.push({
        timestamp: new Date().toISOString(),
        result: assessmentResult
      });
      localStorage.setItem('communication_assessments', JSON.stringify(results));
    }, 1000);
  };
  
  // 重新开始
  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };
  
  // 当前问题
  const currentQuestion = questions[currentStep];
  
  // 检查当前问题是否已回答
  const isCurrentQuestionAnswered = !!answers[currentQuestion.id];
  
  // 渲染问卷部分
  const renderQuestionnaire = () => (
    <div>
      {/* 进度条 */}
      <div className="mb-8">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">问题 {currentStep + 1} / {questions.length}</span>
          <span className="text-sm">
            {Math.round(((currentStep + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className={cn(
          "w-full h-2 rounded-full overflow-hidden",
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        )}>
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* 问题内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "p-6 rounded-xl mb-8",
          theme === 'dark' ? 'bg-slate-800' : 'bg-white',
          'shadow-lg border border-gray-200 dark:border-gray-700'
        )}
      >
        <div className="flex items-start gap-3 mb-6">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
          )}>
            {currentQuestion.id}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentQuestion.text}</h2>
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-medium",
              theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'
            )}>
              {currentQuestion.category}
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleOptionSelect(currentQuestion.id, option.value)}
                className={cn(
                  "w-full p-4 rounded-lg text-left transition-colors duration-200 flex items-center gap-3",
                  answers[currentQuestion.id] === option.value
                    ? theme === 'dark' ? 'bg-blue-900/30 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-800'
                    : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-650' : 'bg-gray-50 hover:bg-gray-100',
                  'border-2'
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border",
                  answers[currentQuestion.id] === option.value
                    ? theme === 'dark' ? 'border-blue-400 bg-blue-400' : 'border-blue-500 bg-blue-500'
                    : theme === 'dark' ? 'border-gray-500' : 'border-gray-300'
                )}>
                  {answers[currentQuestion.id] === option.value && (
                    <i className="fa-solid fa-check text-white text-xs" />
                  )}
                </div>
                <span className="font-medium">{option.text}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* 导航按钮 */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
            currentStep === 0
              ? 'opacity-50 cursor-not-allowed'
              : theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          )}
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>
          上一题
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isCurrentQuestionAnswered || isSubmitting}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
            (!isCurrentQuestionAnswered || isSubmitting)
              ? 'opacity-50 cursor-not-allowed'
              : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          )}
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              提交中...
            </>
          ) : currentStep === questions.length - 1 ? (
            <>
              提交评估
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </>
          ) : (
            <>
              下一题
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
  
  // 渲染结果部分
  const renderResult = () => {
    if (!result) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-300">
          你的沟通能力评估结果
        </h1>
        
        {/* 总体评分卡片 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "p-6 rounded-xl mb-8 text-center",
            theme === 'dark' ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50',
            'shadow-lg'
          )}
        >
          <div className="inline-block p-4 rounded-full mb-4">
            <i className="fa-solid fa-chart-line text-4xl text-blue-600 dark:text-blue-400"></i>
          </div>
          <h2 className="text-4xl font-bold mb-2">{result.overallScore}</h2>
          <p className="text-lg mb-4">总体得分 (满分100)</p>
          <div className="max-w-md mx-auto">
            <ScoreDisplay score={result.overallScore} maxScore={100} />
          </div>
          <p className={cn(
            "mt-6 text-lg",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {result.feedback}
          </p>
        </motion.div>
        
        {/* 各维度得分 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "p-6 rounded-xl mb-8",
            theme === 'dark' ? 'bg-slate-800' : 'bg-white',
            'shadow-lg border border-gray-200 dark:border-gray-700'
          )}
        >
          <h2 className="text-2xl font-bold mb-6">各维度得分</h2>
          <div className="space-y-6">
            {Object.entries(result.categoryScores).map(([category, score]) => (
              <div key={category}>
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{category}</h3>
                </div>
                <ScoreDisplay score={score} maxScore={100} />
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* 改进建议 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? 'bg-slate-800' : 'bg-white',
              'shadow-lg border border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "p-2 rounded-lg",
                theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
              )}>
                <i className="fa-solid fa-arrow-up-right text-xl"></i>
              </div>
              <h2 className="text-xl font-bold">改进方向</h2>
            </div>
            <ul className="space-y-3">
              {result.improvementAreas.length > 0 ? (
                result.improvementAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <i className="fa-solid fa-circle text-xs mt-1.5 text-yellow-500"></i>
                    <span>{area}</span>
                  </li>
                ))
              ) : (
                <li className="text-center italic">你在所有维度都表现良好！</li>
              )}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={cn(
              "p-6 rounded-xl",
              theme === 'dark' ? 'bg-slate-800' : 'bg-white',
              'shadow-lg border border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "p-2 rounded-lg",
                theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
              )}>
                <i className="fa-solid fa-check-circle text-xl"></i>
              </div>
              <h2 className="text-xl font-bold">你的优势</h2>
            </div>
            <ul className="space-y-3">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <i className="fa-solid fa-circle text-xs mt-1.5 text-green-500"></i>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* 行动建议 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold mb-4">下一步行动建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="/communication/ai-practice"
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-xl text-center transition-all duration-300",
                theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-gray-50',
                'shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700'
              )}
            >
              <div className="inline-block p-3 rounded-full mb-4 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <i className="fa-solid fa-robot text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">AI对话练习</h3>
              <p className={cn(
                "mb-4",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                在模拟场景中练习和提升你的沟通技巧
              </p>
              <button className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                theme === 'dark' ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
              )}>
                开始练习
              </button>
            </motion.a>
            
            <motion.a
              href="/communication/knowledge"
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-xl text-center transition-all duration-300",
                theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-gray-50',
                'shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700'
              )}
            >
              <div className="inline-block p-3 rounded-full mb-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <i className="fa-solid fa-book text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">学习知识库</h3>
              <p className={cn(
                "mb-4",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                阅读专业的沟通技巧文章，深入学习
              </p>
              <button className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              )}>
                浏览文章
              </button>
            </motion.a>
            
            <motion.a
              href="/communication/progress"
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-xl text-center transition-all duration-300",
                theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-gray-50',
                'shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700'
              )}
            >
              <div className="inline-block p-3 rounded-full mb-4 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <i className="fa-solid fa-chart-line text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">跟踪进度</h3>
              <p className={cn(
                "mb-4",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}
>              查看你的学习进度和能力提升情况
              </p>
              <button className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                theme === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              )}>
                查看进度
              </button>
            </motion.a>
          </div>
        </motion.div>
        
        {/* 底部按钮 */}
        <div className="mt-12 text-center">
          <button
            onClick={handleRestart}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-colors duration-200",
              theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            )}
          >
            <i className="fa-solid fa-refresh mr-2"></i>
            重新评估
          </button>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === 'dark' ? 'bg-slate-900 text-gray-100' : 'bg-white text-gray-800'
    )}>
      <div className="container mx-auto px-4 py-8">
        {!result ? (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-300">
              沟通能力评估
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              请回答以下问题，评估你的沟通能力水平，帮助我们为你提供个性化的提升建议。
            </p>
            {renderQuestionnaire()}
          </div>
        ) : (
          renderResult()
        )}
      </div>
    </div>
  );
}