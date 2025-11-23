import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface SuccessStoryProps {
  name: string;
  role: string;
  avatar: string;
  story: string;
  rating: number;
  delay: number;
}

const SuccessStory: React.FC<SuccessStoryProps> = ({ name, role, avatar, story, rating, delay }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "p-6 rounded-xl shadow-lg",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white'
      )}
    >
      {/* Rating stars */}
      <div className="mb-4">
        {[...Array(5)].map((_, i) => (
          <i 
            key={i} 
            className={`fa-solid fa-star text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          ></i>
        ))}
      </div>
      
      {/* Story content */}
      <p className={cn(
        "mb-6 text-lg italic",
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        "{story}"
      </p>
      
      {/* User info */}
      <div className="flex items-center gap-4">
        <img 
          src={avatar} 
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-bold text-blue-900 dark:text-white">{name}</h4>
          <p className={cn(
            "text-sm",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          )}>
            {role}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const SuccessStories: React.FC = () => {
  const { theme } = useTheme();
  
  // Success stories data
  const stories = [
    {
      name: "张小明",
      role: "市场部经理",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_1_1&prompt=asian%20professional%20man%20avatar%20business%20person&sign=1a2b3c4d5e6f",
      story: "通过平台的训练，我的演讲和团队沟通能力有了显著提升，成功获得了部门主管的职位。",
      rating: 5
    },
    {
      name: "李华",
      role: "产品设计师",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_1_1&prompt=asian%20professional%20woman%20avatar%20creative%20designer&sign=2b3c4d5e6f7a",
      story: "AI对话练习帮助我克服了社交焦虑，现在我可以自信地向客户展示我的设计方案。",
      rating: 5
    },
    {
      name: "王强",
      role: "技术总监",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_1_1&prompt=asian%20professional%20man%20avatar%20tech%20director&sign=3c4d5e6f7a8b",
      story: "平台的非暴力沟通技巧让我能够更好地管理团队冲突，提高了团队的整体效率。",
      rating: 4
    }
  ];
  
  return (
    <div className={cn(
      "py-16 px-4 sm:px-6 lg:px-8",
      theme === 'dark' ? 'bg-slate-900' : 'bg-white'
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            用户成功故事
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
            看看我们的用户如何通过平台提升沟通能力，改变他们的职业生涯和人际关系
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <SuccessStory
              key={index}
              name={story.name}
              role={story.role}
              avatar={story.avatar}
              story={story.story}
              rating={story.rating}
              delay={index * 0.2}
            />
          ))}
        </div>
        
        {/* Statistics section */}
        <div className={cn(
          "mt-24 grid grid-cols-2 md:grid-cols-4 gap-6",
          theme === 'dark' ? 'text-white' : 'text-blue-900'
        )}>
          {[
            { value: "10K+", label: "活跃用户" },
            { value: "98%", label: "用户满意度" },
            { value: "50+", label: "对话场景" },
            { value: "200+", label: "知识库文章" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className={cn(
                "text-lg",
                theme === 'dark' ? 'text-gray-400' : 'text-blue-600'
              )}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;