"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { OpenAI } from "openai";

// OpenAI客户端配置
const openaiClient = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.siliconflow.cn/v1",
  apiKey:
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    "sk-tvcwevarnuxopipulvzsqilteuwbrivzihandabyzprbijhl",
  dangerouslyAllowBrowser: true,
});

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

// 定义大模型分析结果接口
interface ModelAnalysisResult {
  overallAnalysis: string;
  personalizedSuggestions: string;
  communicationStyle: string;
  potentialChallenges: string[];
  developmentPlan: {
    shortTerm: string[];
    longTerm: string[];
  };
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
      { value: 5, text: "完全符合" },
    ],
    category: "表达能力",
  },
  {
    id: 2,
    text: "当与他人意见不同时，我能够尊重对方的观点并进行建设性沟通",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" },
    ],
    category: "冲突处理",
  },
  {
    id: 3,
    text: "我能够很好地倾听他人说话，不打断或急于表达自己的看法",
    options: [
      { value: 1, text: "完全不符合" },
      { value: 2, text: "不太符合" },
      { value: 3, text: "一般" },
      { value: 4, text: "比较符合" },
      { value: 5, text: "完全符合" },
    ],
    category: "倾听能力",
  },
  // {
  //   id: 4,
  //   text: "在面对压力时，我能够保持冷静并有效沟通",
  //   options: [
  //     { value: 1, text: "完全不符合" },
  //     { value: 2, text: "不太符合" },
  //     { value: 3, text: "一般" },
  //     { value: 4, text: "比较符合" },
  //     { value: 5, text: "完全符合" }
  //   ],
  //   category: "情绪管理"
  // },
  // {
  //   id: 5,
  //   text: "我能够清晰地理解他人的非语言沟通（如肢体语言、表情等）",
  //   options: [
  //     { value: 1, text: "完全不符合" },
  //     { value: 2, text: "不太符合" },
  //     { value: 3, text: "一般" },
  //     { value: 4, text: "比较符合" },
  //     { value: 5, text: "完全符合" }
  //   ],
  //   category: "非语言沟通"
  // },
  // {
  //   id: 6,
  //   text: "在与不同文化背景的人交流时，我能够尊重文化差异并调整沟通方式",
  //   options: [
  //     { value: 1, text: "完全不符合" },
  //     { value: 2, text: "不太符合" },
  //     { value: 3, text: "一般" },
  //     { value: 4, text: "比较符合" },
  //     { value: 5, text: "完全符合" }
  //   ],
  //   category: "跨文化沟通"
  // },
  // {
  //   id: 7,
  //   text: "我能够有效地使用书面沟通（如邮件、报告等）表达复杂想法",
  //   options: [
  //     { value: 1, text: "完全不符合" },
  //     { value: 2, text: "不太符合" },
  //     { value: 3, text: "一般" },
  //     { value: 4, text: "比较符合" },
  //     { value: 5, text: "完全符合" }
  //   ],
  //   category: "书面表达"
  // },
  // {
  //   id: 8,
  //   text: "当需要向他人提供反馈时，我能够既诚实又委婉地表达",
  //   options: [
  //     { value: 1, text: "完全不符合" },
  //     { value: 2, text: "不太符合" },
  //     { value: 3, text: "一般" },
  //     { value: 4, text: "比较符合" },
  //     { value: 5, text: "完全符合" }
  //   ],
  //   category: "反馈能力"
  // },
  // {
  //   id: 9,
  //   text: "在团队合作中，我能够促进有效的信息共享和协作",
  //   options: [
  //     { value: 1, text: "完全不符合" },
  //     { value: 2, text: "不太符合" },
  //     { value: 3, text: "一般" },
  //     { value: 4, text: "比较符合" },
  //     { value: 5, text: "完全符合" }
  //   ],
  //   category: "团队沟通"
  // },
  // {
  //   id: 10,
  //   text: "我能够根据不同的沟通对象和场合调整自己的沟通风格",
  //   options: [
  //     { value: 1, text: "完全不符合" },
  //     { value: 2, text: "不太符合" },
  //     { value: 3, text: "一般" },
  //     { value: 4, text: "比较符合" },
  //     { value: 5, text: "完全符合" }
  //   ],
  //   category: "沟通适应性"
  // }
];

// 评分组件
const ScoreDisplay: React.FC<{ score: number; maxScore?: number }> = ({
  score,
  maxScore = 5,
}) => {
  const { theme } = useTheme();
  const percentage = (score / maxScore) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">
          {score}/{maxScore}
        </span>
        <span className="text-sm">{percentage}%</span>
      </div>
      <div
        className={cn(
          "w-full h-2 rounded-full overflow-hidden",
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        )}
      >
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



export default function AssessmentPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [modelAnalysis, setModelAnalysis] = useState<ModelAnalysisResult>({
    overallAnalysis: "",
    personalizedSuggestions: "",
    communicationStyle: "",
    potentialChallenges: [],
    developmentPlan: {
      shortTerm: [],
      longTerm: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 处理选项选择
  const handleOptionSelect = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // 选择选项后延迟500毫秒自动跳转到下一题
    // 不包括最后一题，最后一题需要用户手动点击提交
    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
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

  // 大模型调用函数，带重试机制
  const callModelWithRetry = async (prompt: string, maxRetries = 3, retryDelay = 2000): Promise<{ fullResult: any; analysisResult: ModelAnalysisResult }> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 调用大模型
        const response = await openaiClient.chat.completions.create({
          model: "THUDM/GLM-Z1-9B-0414",
          messages: [
            {
              role: "user",
              content: prompt,
            }
          ],
          stream: false,
          max_tokens: 4096,
          temperature: 0.7,
        });

        // 解析大模型返回的结果
        const fullResult = JSON.parse(
          response.choices[0].message.content || "{}"
        );

        // 提取分析部分作为 modelAnalysis，并进行字段映射
        const analysis = fullResult.depthAnalysis || fullResult.inDepthAnalysis || {};
        const analysisResult: ModelAnalysisResult = {
          overallAnalysis: analysis.overallAnalysis || "",
          personalizedSuggestions: analysis.personalizedSuggestions || "",
          communicationStyle: analysis.communicationStyle || "",
          potentialChallenges: analysis.potentialChallenges || [],
          developmentPlan: {
            shortTerm: (() => {
              // 检查是否存在depthAnalysis字段（用户提到的），如果不存在则使用inDepthAnalysis
              const analysis = fullResult.depthAnalysis || fullResult.inDepthAnalysis || {};
              const plan = analysis.developmentPlan;
              if (!plan) return [];
              const shortTerm = plan["short-term"];
              return typeof shortTerm === "string" ? [shortTerm] : (shortTerm || []);
            })(),
            longTerm: (() => {
              // 检查是否存在depthAnalysis字段（用户提到的），如果不存在则使用inDepthAnalysis
              const analysis = fullResult.depthAnalysis || fullResult.inDepthAnalysis || {};
              const plan = analysis.developmentPlan;
              if (!plan) return [];
              const longTerm = plan["long-term"];
              return typeof longTerm === "string" ? [longTerm] : (longTerm || []);
            })()
          }
        };

        // 检查是否获取到了有效的分析结果
        if (analysisResult.overallAnalysis || analysisResult.communicationStyle || fullResult.overallScore) {
          return { fullResult, analysisResult };
        }

        throw new Error("未获取到有效的分析结果");
      } catch (error) {
        console.error(`大模型调用失败 (尝试 ${attempt}/${maxRetries}):`, error);
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < maxRetries) {
          console.log(`等待 ${retryDelay}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          // 最后一次尝试失败，抛出错误
          throw error;
        }
      }
    }
    
    // 理论上不会到达这里，但为了类型安全返回一个默认值
    return {
      fullResult: {},
      analysisResult: {
        overallAnalysis: "",
        personalizedAdvice: "",
        communicationStyle: "",
        potentialChallenges: [],
        developmentPlan: {
          shortTerm: [],
          longTerm: []
        }
      }
    };
  };

  // 提交评估
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsAnalyzing(true);

    try {
      // 准备发送给大模型的提示信息
      // 构建用户选择的详细信息
      const userSelections = Object.entries(answers).map(([questionId, selectedValue]) => {
        // 将字符串类型的ID和值转换为数字类型，以匹配Question接口定义
        const questionIdNum = parseInt(questionId, 10);
        const selectedValueNum = parseInt(selectedValue, 10);
        
        const question = questions.find(q => q.id === questionIdNum);
        const selectedOption = question?.options.find(opt => opt.value === selectedValueNum);
        
        return {
          questionId: questionIdNum,
          questionText: question?.text || 'Unknown Question',
          selectedValue: selectedValueNum,
          selectedOptionText: selectedOption?.text || 'Unknown Option'
        };
      });
      const questionsMatch = userSelections.map(selection => `- 问题${selection.questionId}: ${selection.questionText}\n  选择: ${selection.selectedOptionText} (值: ${selection.selectedValue})`).join('\n        ');
      
      console.log(questionsMatch);
      const prompt = `
      You are a professional communication skills analysis expert, specialized in providing in-depth analysis and personalized suggestions based on communication skills assessment results.

### User Input
${{ questionsMatch }}

### Background Information
The user's communication skills assessment items are as follows:
- Overall Score: Needs to be calculated based on the user's detailed selection information (e.g., Question 1 is worth 1 point, Question 2 2 points, Question 3 3 points, etc. Assume each question has the same weight. Total score is 6 points, full score is 15 points).
- Dimension Scores: Corresponding to 3 assessment dimensions (Clarity of Expression, Constructive Communication, Listening Ability).
- Core Conclusions: Need to summarize strengths and improvement directions based on the scores.
- The user input includes questions and the user's detailed selection information.

### Instructions
Based on the above assessment results, generate a standard JSON output according to the following requirements:
1. Include overall score information (score: total points, percentage: score percentage, overallEvaluation: overall level assessment).
2. Include dimension score list (dimensionName: dimension name, score: dimension score, percentage: dimension score percentage).
3. Include core conclusions (improvementDirection: improvement directions, yourStrengths: personal strengths).
4. Include in-depth analysis:
  - overallAnalysis: Analysis of overall performance (summarize the level and imbalances based on score distribution).
  - communicationStyle: Summary of communication style (describe behavioral characteristics based on strengths and weaknesses).
  - personalizedSuggestions: Personalized improvement suggestions (need to link strategies for strengthening strengths and improving weaknesses).
  - potentialChallenges: List of potential challenges (describe scenario-based problems that weaknesses may cause).
  - developmentPlan: Development plan (short-term actions should be specific and executable, long-term suggestions should be systematic).
  - nextStepActionSuggestions: Next action suggestions (need to include specific action name, description, and action button).

### Requirements
- The JSON structure must strictly match the following example format (fields and hierarchy are exactly the same):
{
  "overallScore": {
    "score": 6,
    "percentage": 40,
    "overallEvaluation": "Your overall communication skills need significant improvement"
  },
  "dimensionScores": [
    {
      "dimensionName": "Clarity of Expression",
      "score": 1,
      "percentage": 20
    },
    {
      "dimensionName": "Constructive Communication",
      "score": 2,
      "percentage": 40
    },
    {
      "dimensionName": "Listening Ability",
      "score": 3,
      "percentage": 60
    }
  ],
  "coreConclusions": {
    "improvementDirection": "Focus on improving clarity of expression and constructive communication skills",
    "yourStrengths": "Listening ability has reached a basic level, and you can maintain basic focus"
  },
  "in-depthAnalysis": {
    "overallAnalysis": "The overall score is low (6 points, 40%). Clarity of expression (20%) and constructive communication (40%) are obvious weaknesses. Listening ability is at a general level (60%). The score distribution is unbalanced, and there is significant room for improvement in core communication skills.",
    "communicationStyle": "Your communication style tends to be passive: It's difficult to express opinions clearly in meetings, and there is a lack of respect and constructive feedback when there are differences of opinion. However, you can maintain basic listening focus and do not frequently interrupt others.",
    "personalizedSuggestions": "1. Strengthen your listening strength: Actively record the other party's views during communication to improve the completeness of information reception. 2. Address your expression weakness: Prepare a 100-word outline of your views before each meeting to practice logical presentation. 3. Improve constructive communication: When you have different opinions, first use the sentence pattern \"I understand your point is..., and my supplement is...\" to respond.",
    "potentialChallenges": [
      "Unclear expression in meetings may lead the team to misunderstand your work ideas.",
      "Lack of constructive responses during disagreements may lead to unnecessary conflicts.",
      "Long-term expression weaknesses may affect your professional influence."
    ],
    "developmentPlan": {
      "short-term": "Within the next 2 weeks, spend 10 minutes each day practicing outlining meeting views (including \"core point + 2 supporting details\").",
      "long-term": "Within 1 month, attend an offline training on \"Structured Expression and Constructive Communication\" to systematically improve core skills."
    },
    "nextStepActionSuggestions": [
      {
        "actionName": "Create an Expression Practice Plan",
        "actionDescription": "Write an outline of your views for tomorrow's meeting based on the structure of \"core point + 2 supporting details\".",
        "actionButton": "Immediately Create Practice Plan"
      },
      {
        "actionName": "Learn Constructive Communication Sentence Patterns",
        "actionDescription": "Memorize and try to use the \"understand + supplement\" response sentence pattern, and record 1 practice scenario.",
        "actionButton": "Start Sentence Pattern Practice"
      }
    ]
  }
}
- Content must be fully based on background information, avoiding subjective assumptions.
- Suggestions must be actionable, challenges must be scenario-based, and plans must be phased.

### Output Format
Standard JSON, with fields exactly matching the above example. Ensure the return is plain text that can be formatted, without any other irrelevant text.
       `

      // 调用大模型，带重试机制
      const { fullResult, analysisResult } = await callModelWithRetry(prompt);

      // 设置模型分析结果
      setModelAnalysis(analysisResult);

      // 从大模型返回中提取评估结果
      const assessmentResult: AssessmentResult = {
        overallScore: fullResult.overallScore?.percentage || 0,
        categoryScores: fullResult.dimensionScores?.reduce((acc: any, dimension: any) => {
          acc[dimension.dimensionName] = dimension.percentage;
          return acc;
        }, {}) || {},
        feedback: fullResult.overallScore?.overallEvaluation || "",
        improvementAreas: fullResult.coreConclusions?.improvementDirection ? [fullResult.coreConclusions.improvementDirection] : [],
        strengths: fullResult.coreConclusions?.yourStrengths ? [fullResult.coreConclusions.yourStrengths] : []
      };
      setResult(assessmentResult);

      // 保存到本地存储（在实际应用中，这里应该调用API保存到服务器）
      const savedResults = 
        localStorage.getItem("communication_assessments") || "[]";
      const results = JSON.parse(savedResults);
      results.push({
        timestamp: new Date().toISOString(),
        result: assessmentResult,
        modelAnalysis: analysisResult
      });
      localStorage.setItem(
        "communication_assessments",
        JSON.stringify(results)
      );
    } catch (error) {
      console.error("所有大模型调用尝试都失败了:", error);
      // 大模型调用失败时，设置默认评估结果
      const assessmentResult: AssessmentResult = {
        overallScore: 0,
        categoryScores: {},
        feedback: "评估失败，请稍后重试",
        improvementAreas: [],
        strengths: []
      };
      setResult(assessmentResult);
      
      // 保存到本地存储
      const savedResults = 
        localStorage.getItem("communication_assessments") || "[]";
      const results = JSON.parse(savedResults);
      results.push({
        timestamp: new Date().toISOString(),
        result: assessmentResult
      });
      localStorage.setItem(
        "communication_assessments",
        JSON.stringify(results)
      );
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setModelAnalysis({
      overallAnalysis: "",
      personalizedSuggestions: "",
      communicationStyle: "",
      potentialChallenges: [],
      developmentPlan: {
        shortTerm: [],
        longTerm: []
      }
    });
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
          <span className="text-sm font-medium">
            问题 {currentStep + 1} / {questions.length}
          </span>
          <span className="text-sm">
            {Math.round(((currentStep + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div
          className={cn(
            "w-full h-2 rounded-full overflow-hidden",
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          )}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep + 1) / questions.length) * 100}%`,
            }}
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
          theme === "dark" ? "bg-slate-800" : "bg-white",
          "shadow-lg border border-gray-200 dark:border-gray-700"
        )}
      >
        <div className="flex items-start gap-3 mb-6">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              theme === "dark"
                ? "bg-blue-900 text-blue-300"
                : "bg-blue-100 text-blue-800"
            )}
          >
            {currentQuestion.id}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentQuestion.text}</h2>
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-medium",
                theme === "dark"
                  ? "bg-blue-900/30 text-blue-300"
                  : "bg-blue-100 text-blue-800"
              )}
            >
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
                onClick={() =>
                  handleOptionSelect(currentQuestion.id, option.value)
                }
                className={cn(
                  "w-full p-4 rounded-lg text-left transition-colors duration-200 flex items-center gap-3",
                  answers[currentQuestion.id] === option.value
                    ? theme === "dark"
                      ? "bg-blue-900/30 border-blue-500 text-blue-300"
                      : "bg-blue-50 border-blue-500 text-blue-800"
                    : theme === "dark"
                      ? "bg-slate-700 hover:bg-slate-650"
                      : "bg-gray-50 hover:bg-gray-100",
                  "border-2"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border",
                    answers[currentQuestion.id] === option.value
                      ? theme === "dark"
                        ? "border-blue-400 bg-blue-400"
                        : "border-blue-500 bg-blue-500"
                      : theme === "dark"
                        ? "border-gray-500"
                        : "border-gray-300"
                  )}
                >
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
              ? "opacity-50 cursor-not-allowed"
              : theme === "dark"
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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
            !isCurrentQuestionAnswered || isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
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
            theme === "dark"
              ? "bg-gradient-to-br from-blue-900/50 to-indigo-900/50"
              : "bg-gradient-to-br from-blue-50 to-indigo-50",
            "shadow-lg"
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
          <p
            className={cn(
              "mt-6 text-lg",
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            )}
          >
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
            theme === "dark" ? "bg-slate-800" : "bg-white",
            "shadow-lg border border-gray-200 dark:border-gray-700"
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
              theme === "dark" ? "bg-slate-800" : "bg-white",
              "shadow-lg border border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  theme === "dark"
                    ? "bg-yellow-900/30 text-yellow-400"
                    : "bg-yellow-100 text-yellow-800"
                )}
              >
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
              theme === "dark" ? "bg-slate-800" : "bg-white",
              "shadow-lg border border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  theme === "dark"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-green-100 text-green-800"
                )}
              >
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

        {/* 大模型深度分析 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-brain text-purple-600 dark:text-purple-400"></i>
            大模型深度分析
          </h2>

          {isAnalyzing ? (
            <div
              className={cn(
                "p-8 rounded-xl text-center",
                theme === "dark" ? "bg-slate-800" : "bg-white",
                "shadow-lg border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="inline-block p-4 rounded-full mb-4 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium">正在进行专业分析...</h3>
              <p
                className={cn(
                  "mt-2",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}
              >
                请稍候，我们正在分析您的沟通能力数据
              </p>
            </div>
          ) : modelAnalysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 总体分析 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className={cn(
                  "p-6 rounded-xl",
                  theme === "dark" ? "bg-slate-800" : "bg-white",
                  "shadow-lg border border-gray-200 dark:border-gray-700",
                  "lg:col-span-2"
                )}
              >
                <h3 className="text-xl font-bold mb-4">总体分析</h3>
                <p
                  className={cn(
                    "text-lg leading-relaxed",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  {modelAnalysis.overallAnalysis}
                </p>
              </motion.div>

              {/* 沟通风格 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className={cn(
                  "p-6 rounded-xl",
                  theme === "dark" ? "bg-slate-800" : "bg-white",
                  "shadow-lg border border-gray-200 dark:border-gray-700"
                )}
              >
                <h3 className="text-xl font-bold mb-4">您的沟通风格</h3>
                <div
                  className={cn(
                    "p-4 rounded-lg",
                    theme === "dark" ? "bg-purple-900/20" : "bg-purple-50"
                  )}
                >
                  <p
                    className={cn(
                      "text-lg",
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    {modelAnalysis.communicationStyle}
                  </p>
                </div>
              </motion.div>

              {/* 个性化建议 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className={cn(
                  "p-6 rounded-xl",
                  theme === "dark" ? "bg-slate-800" : "bg-white",
                  "shadow-lg border border-gray-200 dark:border-gray-700"
                )}
              >
                <h3 className="text-xl font-bold mb-4">个性化建议</h3>
                <p
                  className={cn(
                    "leading-relaxed",
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  )}
                >
                  {modelAnalysis.personalizedSuggestions}
                </p>
              </motion.div>

              {/* 潜在挑战 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className={cn(
                  "p-6 rounded-xl",
                  theme === "dark" ? "bg-slate-800" : "bg-white",
                  "shadow-lg border border-gray-200 dark:border-gray-700"
                )}
              >
                <h3 className="text-xl font-bold mb-4">潜在挑战</h3>
                <ul className="space-y-3">
                  {modelAnalysis.potentialChallenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <i className="fa-solid fa-circle-exclamation text-yellow-500 mt-1.5"></i>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* 发展计划 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.7 }}
                className={cn(
                  "p-6 rounded-xl",
                  theme === "dark" ? "bg-slate-800" : "bg-white",
                  "shadow-lg border border-gray-200 dark:border-gray-700",
                  "lg:col-span-2"
                )}
              >
                <h3 className="text-xl font-bold mb-4">发展计划</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4
                      className={cn(
                        "text-lg font-semibold mb-3 flex items-center gap-2",
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      )}
                    >
                      <i className="fa-solid fa-calendar-day"></i>
                      短期行动计划
                    </h4>
                    <ul className="space-y-3">
                      {modelAnalysis.developmentPlan.shortTerm.map(
                        (action, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <i className="fa-solid fa-check-circle text-blue-500 mt-1.5"></i>
                            <span>{action}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "text-lg font-semibold mb-3 flex items-center gap-2",
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      )}
                    >
                      <i className="fa-solid fa-calendar-alt"></i>
                      长期发展建议
                    </h4>
                    <ul className="space-y-3">
                      {modelAnalysis.developmentPlan.longTerm.map(
                        (plan, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <i className="fa-solid fa-check-circle text-green-500 mt-1.5"></i>
                            <span>{plan}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div
              className={cn(
                "p-8 rounded-xl text-center",
                theme === "dark" ? "bg-slate-800" : "bg-white",
                "shadow-lg border border-gray-200 dark:border-gray-700",
                "opacity-80"
              )}
            >
              <div className="inline-block p-4 rounded-full mb-4 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                <i className="fa-solid fa-brain text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium">深度分析将在此显示</h3>
              <p
                className={cn(
                  "mt-2",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}
              >
                系统正在生成个性化的沟通能力分析报告
              </p>
            </div>
          )}
        </motion.div>

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
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-750"
                  : "bg-white hover:bg-gray-50",
                "shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="inline-block p-3 rounded-full mb-4 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <i className="fa-solid fa-robot text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">AI对话练习</h3>
              <p
                className={cn(
                  "mb-4",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}
              >
                在模拟场景中练习和提升你的沟通技巧
              </p>
              <button
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                  theme === "dark"
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                )}
              >
                开始练习
              </button>
            </motion.a>

            <motion.a
              href="/communication/knowledge"
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-xl text-center transition-all duration-300",
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-750"
                  : "bg-white hover:bg-gray-50",
                "shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="inline-block p-3 rounded-full mb-4 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <i className="fa-solid fa-book text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">学习知识库</h3>
              <p
                className={cn(
                  "mb-4",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}
              >
                阅读专业的沟通技巧文章，深入学习
              </p>
              <button
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
              >
                浏览文章
              </button>
            </motion.a>

            <motion.a
              href="/communication/progress"
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-xl text-center transition-all duration-300",
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-750"
                  : "bg-white hover:bg-gray-50",
                "shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="inline-block p-3 rounded-full mb-4 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <i className="fa-solid fa-chart-line text-xl"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">跟踪进度</h3>
              <p
                className={cn(
                  "mb-4",
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                )}
              >
                {" "}
                查看你的学习进度和能力提升情况
              </p>
              <button
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                  theme === "dark"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                )}
              >
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
              theme === "dark"
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
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
    <div
      className={cn(
        "min-h-screen flex flex-col",
        theme === "dark"
          ? "bg-slate-900 text-gray-100"
          : "bg-white text-gray-800"
      )}
    >
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
