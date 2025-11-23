import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const isAuthenticated = !!user;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className={cn(
      "relative min-h-[90vh] flex items-center justify-center overflow-hidden",
      theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-b from-blue-50 to-white'
    )}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-blue-400"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 rounded-full bg-orange-400"></div>
      </div>
      
      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants}>
              <span className={cn(
                "inline-block px-4 py-2 rounded-full text-sm font-medium mb-6",
                theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
              )}>
                基于心理学的沟通训练平台
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-blue-900 dark:text-white"
            >
              提升你的<br />
              <span className="text-orange-500">沟通能力</span>，<br />
              改变你的人生
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className={cn(
                "text-xl mb-8 max-w-lg mx-auto lg:mx-0",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}
            >
              通过科学的评估、AI对话练习和专业知识库，助你成为沟通高手，建立更好的人际关系。
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {isAuthenticated ? (
                <>
                  <a 
                    href="/communication/assessment" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
                  >
                    开始评估
                  </a>
                  <a 
                    href="/communication/ai-practice" 
                    className={cn(
                      "inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md",
                      theme === 'dark' 
                        ? 'border border-gray-700 bg-slate-800 text-white hover:bg-slate-700' 
                        : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                    )}
                  >
                    AI对话练习
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="/auth/login" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
                  >
                    免费开始使用
                  </a>
                  <a 
                    href="#features" 
                    className={cn(
                      "inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md",
                      theme === 'dark' 
                        ? 'border border-gray-700 bg-slate-800 text-white hover:bg-slate-700' 
                        : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                    )}
                  >
                    了解功能
                  </a>
                </>
              )}
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-sm"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_1_1&prompt=professional%20user%20avatar%20person%20${i}&sign=${i}f${i}e${i}d${i}c${i}b${i}a${i}`}
                    alt={`User ${i}`}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900"
                  />
                ))}
              </div>
              <span className={cn(
                "ml-2",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                已有10,000+用户提升了沟通能力
              </span>
            </motion.div>
          </motion.div>
          
          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            {/* Main hero image */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=professional%20communication%20skills%20training%20platform%20interface%20dashboard&sign=f8e7d6c5b4a3"
                alt="沟通大师平台展示"
                className="w-full h-auto"
              />
            </div>
            
            {/* Floating elements */}
            <motion.div
              className={cn(
                "absolute -top-5 -right-5 p-4 rounded-lg shadow-lg",
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              )}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-green-600"></i>
                </div>
                <div>
                  <p className="font-bold text-green-600">98% 提升</p>
                  <p className={cn("text-xs", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>沟通效率</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className={cn(
                "absolute -bottom-5 -left-5 p-4 rounded-lg shadow-lg",
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              )}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="fa-solid fa-star text-blue-600"></i>
                </div>
                <div>
                  <p className="font-bold text-blue-600">4.9/5 评分</p>
                  <p className={cn("text-xs", theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>用户满意度</p>
                </div>
              </div>
            </motion.div>
            
            {/* Background decorative blob */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-144 h-144 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 blur-3xl opacity-20"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg 
          className="relative block w-full h-[50px] sm:h-[80px]" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          fill={theme === 'dark' ? '#0f172a' : '#ffffff'}
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;