import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
        theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-gray-50'
      )}
    >
      <div className="mb-4 p-3 rounded-lg inline-block bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-white">{title}</h3>
      <p className={cn(
        "text-lg",
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {description}
      </p>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const { theme } = useTheme();
  
  // Features data
  const features = [
    {
      icon: <i className="fa-solid fa-clipboard-check text-xl"></i>,
      title: "科学评估系统",
      description: "基于心理学理论的评估模型，全面分析你的沟通风格和能力水平。"
    },
    {
      icon: <i className="fa-solid fa-robot text-xl"></i>,
      title: "AI对话练习",
      description: "多种场景的模拟对话，实时反馈和指导，帮助你在安全环境中提升技能。"
    },
    {
      icon: <i className="fa-solid fa-book text-xl"></i>,
      title: "专业知识库",
      description: "丰富的心理学沟通技巧文章，从基础到进阶，满足不同学习需求。"
    },
    {
      icon: <i className="fa-solid fa-chart-line text-xl"></i>,
      title: "进度跟踪",
      description: "可视化你的学习进度和能力提升，激励你持续进步。"
    },
    {
      icon: <i className="fa-solid fa-headset text-xl"></i>,
      title: "个性化指导",
      description: "根据你的评估结果，提供定制化的学习路径和建议。"
    },
    {
      icon: <i className="fa-solid fa-users text-xl"></i>,
      title: "社区支持",
      description: "加入志同道合的学习社区，分享经验，互相鼓励和成长。"
    }
  ];
  
  return (
    <div id="features" className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          我们的核心功能
        </motion.h2>
        <motion.p 
          className={cn(
            "text-xl max-w-3xl mx-auto",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          基于心理学理论设计的全方位沟通训练系统，帮助你提升各种场景下的沟通能力
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </div>
      
      {/* Feature highlight section */}
      <div className={cn(
        "mt-24 p-8 rounded-2xl relative overflow-hidden",
        theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
      )}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-900 dark:text-white">
              基于心理学的科学训练方法
            </h3>
            <p className={cn(
              "mb-6 text-lg",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              我们的平台结合了认知心理学、非暴力沟通、情绪智能等多种理论，为你提供科学、有效的沟通训练。
            </p>
            <ul className="space-y-4">
              {[
                "个性化评估基于大五人格理论",
                "对话练习融合了非暴力沟通技巧",
                "反馈系统采用成长型思维模式",
                "学习路径基于认知负荷理论设计"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <i className="fa-solid fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                  <span className={cn(
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=psychology%20communication%20model%20brain%20science%20education%20infographic&sign=a9b8c7d6e5f4" 
              alt="心理学沟通模型" 
              className="w-full h-auto rounded-xl shadow-lg"
            />
            
            {/* Floating elements */}
            <motion.div
              className={cn(
                "absolute -top-4 -right-4 p-4 rounded-lg shadow-lg",
                theme === 'dark' ? 'bg-slate-700' : 'bg-white'
              )}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
              whileHover={{ y: -5 }}
            >
              <p className="font-bold text-blue-600">科学验证</p>
              <p className={cn("text-xs", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>基于500+研究文献</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;