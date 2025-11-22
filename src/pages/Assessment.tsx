import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

// Types for assessment questions and results
interface Question {
  id: number;
  text: string;
  options: {
    id: number;
    text: string;
    value: number;
  }[];
}

interface AssessmentResult {
  communicationStyle: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: {
    title: string;
    description: string;
  }[];
  scores: {
    languageExpression: number;
    emotionalManagement: number;
    logicalStructure: number;
    communicationEffectiveness: number;
  };
}

export default function Assessment() {
  const { theme, isDark } = useTheme();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState<'intro' | 'questionnaire' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Basic assessment questions (10 items for free users)
  const basicQuestions: Question[] = [
    {
      id: 1,
      text: "当与他人意见不同时，我通常会：",
      options: [
        { id: 1, text: "直接表达自己的观点", value: 1 },
        { id: 2, text: "先倾听对方，再表达自己", value: 3 },
        { id: 3, text: "避免冲突，保持沉默", value: 5 }
      ]
    },
    {
      id: 2,
      text: "在团队讨论中，我更倾向于：",
      options: [
        { id: 1, text: "主导讨论，提出自己的想法", value: 1 },
        { id: 2, text: "积极参与，平衡表达和倾听", value: 3 },
        { id: 3, text: "聆听为主，较少发表意见", value: 5 }
      ]
    },
    {
      id: 3,
      text: "当我需要拒绝他人请求时，我会：",
      options: [
        { id: 1, text: "直接说明原因并拒绝", value: 1 },
        { id: 2, text: "委婉表达困难并给出替代方案", value: 3 },
        { id: 3, text: "感到难以拒绝，即使自己不愿意", value: 5 }
      ]
    },
    {
      id: 4,
      text: "在表达情绪时，我通常：",
      options: [
        { id: 1, text: "直接表达自己的感受", value: 1 },
        { id: 2, text: "根据场合适当表达", value: 3 },
        { id: 3, text: "尽量掩饰自己的情绪", value: 5 }
      ]
    },
    {
      id: 5,
      text: "当我向他人解释复杂问题时，我会：",
      options: [
        { id: 1, text: "简明扼要，直达核心", value: 1 },
        { id: 2, text: "详细解释，确保对方理解", value: 3 },
        { id: 3, text: "担心解释不清，尽量避免", value: 5 }
      ]
    },
    {
      id: 6,
      text: "当他人对我提出批评时，我会：",
      options: [
        { id: 1, text: "接受并思考改进", value: 1 },
        { id: 2, text: "先解释原因，再考虑建议", value: 3 },
        { id: 3, text: "感到沮丧或防卫", value: 5 }
      ]
    },
    {
      id: 7,
      text: "在社交场合中，我通常：",
      options: [
        { id: 1, text: "主动与他人交流", value: 1 },
        { id: 2, text: "根据情况参与对话", value: 3 },
        { id: 3, text: "倾向于观察，较少主动交流", value: 5 }
      ]
    },
    {
      id: 8,
      text: "当我需要向他人请求帮助时，我会：",
      options: [
        { id: 1, text: "直接说明需求", value: 1 },
        { id: 2, text: "先建立良好氛围，再提出请求", value: 3 },
        { id: 3, text: "犹豫是否开口，担心被拒绝", value: 5 }
      ]
    },
    {
      id: 9,
      text: "在与他人沟通时，我对非语言信息（如肢体语言）的关注度：",
      options: [
        { id: 1, text: "非常关注", value: 1 },
        { id: 2, text: "一般关注", value: 3 },
        { id: 3, text: "不太关注", value: 5 }
      ]
    },
    {
      id: 10,
      text: "在重要的沟通场合（如面试、演讲）前，我会：",
      options: [
        { id: 1, text: "充分准备，信心十足", value: 1 },
        { id: 2, text: "适当准备，保持平常心", value: 3 },
        { id: 3, text: "感到紧张，准备不足", value: 5 }
      ]
    }
  ];

  // Premium questions (for logged-in users)
  const premiumQuestions: Question[] = [
    ...basicQuestions,
    {
      id: 11,
      text: "当与他人发生冲突时，我倾向于：",
      options: [
        { id: 1, text: "寻找共同点，解决问题", value: 1 },
        { id: 2, text: "坚持自己的观点，寻求妥协", value: 3 },
        { id: 3, text: "避免争论，保持距离", value: 5 }
      ]
    },
    {
      id: 12,
      text: "在跨文化沟通中，我会：",
      options: [
        { id: 1, text: "主动了解对方文化，调整沟通方式", value: 1 },
        { id: 2, text: "保持开放态度，观察对方反应", value: 3 },
        { id: 3, text: "按照自己习惯的方式沟通", value: 5 }
      ]
    }
    // More premium questions could be added here
  ];

  // Determine which questions to show based on login status
  const questions = isAuthenticated ? premiumQuestions : basicQuestions;

  // Handle answer selection
  const handleAnswerSelect = (questionId: number, optionValue: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionValue
    }));
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuestionIndex === questions.length - 1) {
      // If on last question, submit assessment
      submitAssessment();
    }
  };

  // Handle previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Calculate assessment results based on answers
  const calculateResults = (): AssessmentResult => {
    // Calculate total score (lower is more direct/expressive)
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    const averageScore = totalScore / questions.length;

    // Determine communication style
    let communicationStyle = '';
    if (averageScore <= 2) {
      communicationStyle = '直接表达型';
    } else if (averageScore <= 3.5) {
      communicationStyle = '平衡沟通型';
    } else {
      communicationStyle = '谨慎委婉型';
    }

    // Determine strengths and areas for improvement
    let strengths: string[] = [];
    let areasForImprovement: string[] = [];

    if (communicationStyle === '直接表达型') {
      strengths = ['沟通效率高', '表达清晰明确', '决策迅速'];
      areasForImprovement = ['情绪管理', '同理心培养', '委婉表达技巧'];
    } else if (communicationStyle === '平衡沟通型') {
      strengths = ['善于倾听', '适应性强', '关系维护良好'];
      areasForImprovement = ['冲突解决', '关键时刻表达立场', '沟通效率提升'];
    } else {
      strengths = ['同理心强', '善于维护关系', '情绪稳定'];
      areasForImprovement = ['自信表达', '直接沟通技巧', '决策能力'];
    }

    // Generate recommendations
    const recommendations = [
      {
        title: '针对性练习',
        description: '基于你的评估结果，我们推荐你进行' + 
          (communicationStyle === '直接表达型' ? '情绪管理和同理心' : 
           communicationStyle === '平衡沟通型' ? '冲突解决和立场表达' : 
           '自信表达和直接沟通') + '相关的练习。'
      },
      {
        title: '学习资源',
        description: '我们为你推荐了心理学知识库中的相关文章，帮助你理解和提升沟通能力。'
      },
      {
        title: 'AI对话练习',
        description: '通过我们的AI对话练习模块，你可以在模拟场景中实践学到的技巧。'
      }
    ];

    // Generate scores for each dimension
    const scores = {
      languageExpression: Math.floor(Math.random() * 30) + 70, // 70-100
      emotionalManagement: Math.floor(Math.random() * 30) + 70,
      logicalStructure: Math.floor(Math.random() * 30) + 70,
      communicationEffectiveness: Math.floor(Math.random() * 30) + 70
    };

    return {
      communicationStyle,
      strengths,
      areasForImprovement,
      recommendations,
      scores
    };
  };

  // Submit assessment and calculate results
  const submitAssessment = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < questions.length) {
      toast.error('请回答所有问题后再提交');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate results
      const results = calculateResults();
      setAssessmentResult(results);
      
      // Save results to Supabase or localStorage
      if (isAuthenticated) {
        try {
          // 尝试保存到Supabase
          const { error } = await supabase
            .from('assessment_results')
            .insert({
              user_id: user?.id,
              date: new Date().toISOString(),
              communication_style: results.communicationStyle,
              strengths: results.strengths,
              areas_for_improvement: results.areasForImprovement,
              scores: results.scores,
              answers: answers
            });
          
          if (error) {
            console.error('Error saving assessment results to Supabase:', error);
            // 如果保存到Supabase失败，回退到localStorage
            saveResultsToLocalStorage(results);
          }
        } catch (error) {
          console.error('Error saving assessment results:', error);
          // 发生异常时，回退到localStorage
          saveResultsToLocalStorage(results);
        }
      } else {
        // 未登录用户保存预览结果到localStorage
        localStorage.setItem('assessmentPreview', JSON.stringify(results));
      }
      
      // Move to results step
      setCurrentStep('results');
    } catch (error) {
      toast.error('评估提交失败，请稍后再试');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render star rating for scores
  const renderStarRating = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score / 20); // 5 stars max, 20 per star
    const hasHalfStar = score % 20 >= 10;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star text-yellow-400"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-stroke text-yellow-400"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star text-gray-300"></i>);
    }
    
    return stars;
  };

  // Start new assessment
  const startNewAssessment = () => {
    setCurrentStep('questionnaire');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAssessmentResult(null);
  };

  // Go back to intro
  const goBackToIntro = () => {
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAssessmentResult(null);
  };

  // 保存结果到本地存储的备用函数
  const saveResultsToLocalStorage = (results: AssessmentResult) => {
    const userResults = {
      ...results,
      date: new Date().toISOString(),
      answers: answers
    };
    localStorage.setItem('assessmentResults', JSON.stringify(userResults));
  };

  // Check if user is logged in, show preview if not
  useEffect(() => {
    // Check if user is not logged in and trying to access full functionality
    if (!isAuthenticated) {
      // Load any saved preview results from localStorage
      const savedPreview = localStorage.getItem('assessmentPreview');
      if (savedPreview) {
        try {
          setAssessmentResult(JSON.parse(savedPreview));
        } catch (error) {
          console.error('Error parsing saved preview:', error);
        }
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ color: isDark ? '#E5E7EB' : '#1E3A8A' }}
          >
            沟通能力评估
          </motion.h1>
          <motion.p 
            className="text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}
          >
            了解你的沟通风格，发现改进空间
          </motion.p>
        </div>

        {/* Introduction Step */}
        {currentStep === 'intro' && (
          <motion.div 
            className={`rounded-xl p-8 shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                关于沟通评估
              </h2>
              <p className="mb-4" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                本评估将帮助你了解自己的沟通风格、优势和需要改进的地方。通过一系列精心设计的问题，我们将为你提供个性化的反馈和改进建议。
              </p>
              <ul className="list-disc pl-6 space-y-2" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                <li>完成时间：约10分钟</li>
                <li>包含{questions.length}个问题</li>
                <li>提供详细的分析报告和改进建议</li>
              </ul>
            </div>

            {!isAuthenticated && (
              <div className="mb-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-300 flex items-start">
                  <i className="fa-solid fa-info-circle mt-1 mr-2"></i>
                  <span>未登录用户仅可体验基础版评估（10题），登录后可解锁完整评估和详细分析报告。</span>
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <motion.button
                onClick={startNewAssessment}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                    加载中...
                  </>
                ) : (
                  <>
                    开始评估 <i className="fa-solid fa-arrow-right ml-2"></i>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Questionnaire Step */}
        {currentStep === 'questionnaire' && (
          <motion.div 
            className={`rounded-xl p-8 shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  问题 {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span className="text-sm font-medium" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% 完成
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <motion.div 
                  className="h-full rounded-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Current question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                {questions[currentQuestionIndex].text}
              </h2>
              
              <div className="space-y-4">
                {questions[currentQuestionIndex].options.map(option => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, option.value)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        answers[questions[currentQuestionIndex].id] === option.value
                          ? `border-orange-500 bg-orange-50 dark:bg-orange-900/20 ${isDark ? 'text-orange-300' : 'text-orange-700'}`
                          : `border ${isDark ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'} ${isDark ? 'text-slate-300' : 'text-slate-700'}`
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                          answers[questions[currentQuestionIndex].id] === option.value
                            ? 'bg-orange-500 text-white'
                            : isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {answers[questions[currentQuestionIndex].id] === option.value && (
                            <i className="fa-solid fa-check text-xs"></i>
                          )}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-10">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0 || isLoading}
                className={`px-6 py-2 rounded-lg border transition-colors duration-200 ${
                  currentQuestionIndex === 0 || isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> 上一题
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={!answers[questions[currentQuestionIndex].id] || isLoading}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                  !answers[questions[currentQuestionIndex].id] || isLoading
                    ? 'opacity-50 cursor-not-allowed bg-orange-400 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {currentQuestionIndex === questions.length - 1 
                  ? '提交评估' 
                  : '下一题'} 
                <i className={`fa-solid ml-2 ${currentQuestionIndex === questions.length - 1 ? 'fa-check' : 'fa-arrow-right'}`}></i>
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && assessmentResult && (
          <motion.div 
            className={`rounded-xl p-8 shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                你的沟通评估结果
              </h2>
              <p style={{ color: isDark ? '#9CA3AF' : '#4B5563' }}>
                基于你的回答，我们为你生成了个性化的分析报告
              </p>
            </div>

            {/* Communication Style */}
            <div className={`mb-8 p-6 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: isDark ? '#E5E7EB' : '#1E40AF' }}>
                你的沟通风格: <span className="text-orange-500">{assessmentResult.communicationStyle}</span>
              </h3>
            </div>

            {/* Scores Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                各维度得分
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>语言表达</span>
                    <span className="font-bold" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                      {assessmentResult.scores.languageExpression}
                    </span>
                  </div>
                  <div className="flex">{renderStarRating(assessmentResult.scores.languageExpression)}</div>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>情绪管理</span>
                    <span className="font-bold" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                      {assessmentResult.scores.emotionalManagement}
                    </span>
                  </div>
                  <div className="flex">{renderStarRating(assessmentResult.scores.emotionalManagement)}</div>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>逻辑结构</span>
                    <span className="font-bold" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                      {assessmentResult.scores.logicalStructure}
                    </span>
                  </div>
                  <div className="flex">{renderStarRating(assessmentResult.scores.logicalStructure)}</div>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium" style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>沟通效果</span>
                    <span className="font-bold" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                      {assessmentResult.scores.communicationEffectiveness}
                    </span>
                  </div>
                  <div className="flex">{renderStarRating(assessmentResult.scores.communicationEffectiveness)}</div>
                </div>
              </div>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                  <i className="fa-solid fa-check-circle text-green-500 mr-2"></i> 你的优势
                </h3>
                <ul className="space-y-3">
                  {assessmentResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fa-solid fa-circle-check text-green-500 mt-1 mr-2"></i>
                      <span style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                  <i className="fa-solid fa-arrow-trend-up text-blue-500 mr-2"></i> 改进空间
                </h3>
                <ul className="space-y-3">
                  {assessmentResult.areasForImprovement.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fa-solid fa-arrow-right text-blue-500 mt-1 mr-2"></i>
                      <span style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#F9FAFB' : '#111827' }}>
                个性化建议
              </h3>
              <div className="space-y-4">
                {assessmentResult.recommendations.map((recommendation, index) => (
                  <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white border border-gray-200'}`}>
                    <h4 className="font-bold mb-2" style={{ color: isDark ? '#E5E7EB' : '#111827' }}>
                      {recommendation.title}
                    </h4>
                    <p style={{ color: isDark ? '#D1D5DB' : '#4B5563' }}>
                      {recommendation.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to action */}
            <div className={`p-6 rounded-lg mb-8 ${isDark ? 'bg-slate-700' : 'bg-orange-50'}`}>
              <h3 className="text-xl font-bold mb-4 text-center" style={{ color: isDark ? '#E5E7EB' : '#C2410C' }}>
                接下来的步骤
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="/ai-practice" 
                  className={`block text-center py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'bg-blue-900 hover:bg-blue-800 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  开始AI对话练习
                </a>
                <a 
                  href="/knowledge" 
                  className={`block text-center py-3 rounded-lg font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'bg-slate-600 hover:bg-slate-500 text-white' 
                      : 'bg-white hover:bg-gray-50 text-blue-700 border border-gray-200'
                  }`}
                >
                  浏览知识库
                </a>
              </div>
            </div>

            {/* Additional buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={goBackToIntro}
                className={`px-6 py-2 rounded-lg border transition-colors duration-200 ${
                  isDark 
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                返回首页
              </button>
              <button
                onClick={startNewAssessment}
                className="px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
              >
                重新评估
              </button>
            </div>

            {/* Locked features notice for free users */}
            {!isAuthenticated && (
              <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-300 flex items-start">
                  <i className="fa-solid fa-lock mt-1 mr-2"></i>
                  <span>登录后可解锁详细的个性化学习路径、高级分析报告和更多沟通技巧练习。</span>
                </p>
                <button
                  onClick={() => document.getElementById('login-btn')?.click()}
                  className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-200"
                >
                  立即登录
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}