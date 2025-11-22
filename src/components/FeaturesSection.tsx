import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function FeaturesSection() {
  const { theme } = useTheme();
  
  // Core features data with additional images
  const features = [
    {
      id: 1,
      title: "沟通评估系统",
      description: "通过专业问卷和模拟对话，全面评估你的沟通风格、优势和需要改进的地方。",
      icon: "fa-clipboard-question",
      color: "from-blue-500 to-blue-700",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=communication%20assessment%20form%20psychology%20test&sign=aaf20c529222c10b4c5b0905a332e891"
    },
    {
      id: 2,
      title: "个性化学习路径",
      description: "基于评估结果，为你定制专属的学习计划，推荐相关心理学理论和实践练习。",
      icon: "fa-road",
      color: "from-green-500 to-green-700",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=personalized%20learning%20path%20education%20psychology&sign=c088645c416232d8d7f8f8c5221ced9a"
    },
    {
      id: 3,
      title: "AI对话练习",
      description: "大模型模拟不同场景对话，提供实时反馈和改进建议，帮助你在实践中提升。",
      icon: "fa-robot",
      color: "from-purple-500 to-purple-700",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=AI%20chat%20bot%20conversation%20simulation%20technology&sign=dd6955e05b9706f32f6c56c214cda46e"
    },
    {
      id: 4,
      title: "心理学知识库",
      description: "整理沟通相关的心理学理论、案例和实用工具，丰富你的理论基础。",
      icon: "fa-book-open",
      color: "from-yellow-500 to-yellow-700",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=psychology%20knowledge%20books%20library%20education&sign=f7a7a926daebf5714e0e30e8785af01a"
    },
    {
      id: 5,
      title: "进度追踪",
      description: "记录你的学习历程和技能提升数据，直观展示你的成长和进步。",
      icon: "fa-chart-line",
      color: "from-red-500 to-red-700",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=progress%20tracking%20chart%20analytics%20dashboard&sign=4fecaac3657062c491a9f9a3512c6da0"
    },
    {
      id: 6,
      title: "实时分析",
      description: "对对话内容进行多维度实时分析，提供针对性的优化建议。",
      icon: "fa-microscope",
      color: "from-indigo-500 to-indigo-700",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=real-time%20analysis%20dashboard%20data%20visualization&sign=72b250d64fc235e5650dea83a527ad5c"
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto">
      <div id="features" className="text-center mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ color: theme === 'dark' ? '#E5E7EB' : '#1E3A8A' }}
        >
          强大功能，助你提升沟通能力
        </motion.h2>
        <motion.p 
          className="text-xl max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
        >
          我们的平台结合了先进的人工智能技术和专业的心理学理论，为你提供全方位的沟通能力提升解决方案
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border ${
              theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750 border-slate-700' : 'bg-white hover:bg-gray-50 border-gray-100'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Feature image */}
            <div className="h-48 overflow-hidden">
              <img 
                src={feature.imageUrl} 
                alt={feature.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            
            {/* Feature content */}
            <div className="p-6">
              {/* Feature icon */}
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${feature.color}`}>
                <i className={`fa-solid ${feature.icon} text-white text-xl`}></i>
              </div>
              
              {/* Feature title */}
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: theme === 'dark' ? '#F9FAFB' : '#111827' }}
              >
                {feature.title}
              </h3>
              
              {/* Feature description */}
              <p 
                className="mb-4"
                style={{ color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
              >
                {feature.description}
              </p>
              
              {/* Learn more button */}
              <a 
                href="#" 
                className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                  feature.color.includes('blue') 
                    ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300' 
                    : feature.color.includes('green')
                      ? 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                      : feature.color.includes('purple')
                        ? 'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300'
                        : feature.color.includes('yellow')
                          ? 'text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300'
                          : feature.color.includes('red')
                            ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                            : 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'
                }`}
              >
                了解更多 <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}