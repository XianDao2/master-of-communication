import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { useTheme } from '@/hooks/useTheme';

export default function HeroSection() {
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useTheme();
  
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hero background image with gradient overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=people%20effective%20communication%20teamwork%20collaboration%20business%20concept&sign=4c9d46b4de3a46bd99eb96cc3ccf504a" 
            alt="People communicating effectively"
            className="w-full h-full object-cover opacity-20"
          />
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
              : 'bg-gradient-to-br from-white via-blue-50 to-white'
          }`}></div>
        </div>
        
        {/* Animated background shapes */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            scale: [1, 1.05, 1]
          }} 
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 20, 0],
            scale: [1, 1.05, 1]
          }} 
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Abstract communication graphics */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Message bubbles */}
          <div className="absolute top-1/3 left-1/5 w-24 h-24 rounded-2xl border-2 border-blue-500 transform rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-2xl border-2 border-orange-500 transform -rotate-6"></div>
          <div className="absolute top-2/3 left-1/3 w-20 h-20 rounded-2xl border-2 border-indigo-500 transform rotate-45"></div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path 
              d="M20,30 C40,50 60,30 80,50" 
              stroke={theme === 'dark' ? "#60A5FA" : "#1E40AF"} 
              strokeWidth="0.5" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.path 
              d="M30,70 C50,50 70,70 90,50" 
              stroke={theme === 'dark' ? "#FB923C" : "#C2410C"} 
              strokeWidth="0.5" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
          </svg>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo or icon */}
          <motion.div 
            className="mb-8 inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-800' : 'bg-blue-600'
            }`}>
              <i className="fa-solid fa-comments text-white text-4xl"></i>
            </div>
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-blue-900'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            提升你的<span className="text-orange-500">沟通能力</span>，<br />
            改变你的人际关系
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className={`text-xl md:text-2xl mb-10 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            结合大模型和心理学理论的个性化学习平台，<br className="hidden sm:block" />
            帮助你成为更有效的沟通者
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {isAuthenticated ? (
              <a 
                href="/assessment" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200 text-lg"
              >
                开始沟通评估
              </a>
            ) : (
              <button 
                id="login-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('login-btn')?.click();
                }}
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200 text-lg"
              >
                开始免费试用
              </button>
            )}
            <a 
              href="#features" 
              className={`inline-flex items-center justify-center px-8 py-4 border ${
                theme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } text-base font-medium rounded-lg transition-colors duration-200 text-lg`}
            >
              了解更多
            </a>
          </motion.div>
          
          {/* Trust indicators with images */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className={`text-sm uppercase tracking-wider mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              已有 10,000+ 人提升了他们的沟通能力
            </p>
            
            {/* Trust images */}
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto">
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-md flex items-center justify-center mb-2 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=business%20team%20collaboration%20happy%20people&sign=2478d1fda503eb91a056af7c1195750c" 
                    alt="Business team"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>职场人士</span>
              </div>
              
              <div className={`w-16 h-16 mx-auto rounded-md flex items-center justify-center mb-2 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <img 
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=students%20group%20discussion%20learning%20together&sign=dabbd9157d0194de0f880142afaa491c" 
                  alt="Students"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-md flex items-center justify-center mb-2 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <img 
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=family%20communication%20happy%20parents%20children&sign=c578f7a45a826f3bce30adcb9fb0e9f8" 
                    alt="Family"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>家庭用户</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          向下滚动
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <i className={`fa-solid fa-chevron-down ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}></i>
        </motion.div>
      </motion.div>
    </section>
  );
}