import React, { useEffect, useContext } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import SuccessStories from '@/components/SuccessStories';
import { AuthContext } from '@/contexts/authContext';

// Animation variants for scroll reveal
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Section wrapper with scroll reveal animation
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Knowledge base preview component
const KnowledgeBasePreview: React.FC = () => {
  const { theme } = useTheme();
  
  // Sample knowledge base articles with images
  const articles = [
    {
      id: 1,
      title: "非暴力沟通的4个关键步骤",
      excerpt: "学习如何通过观察、感受、需要和请求四个步骤，建立更健康的沟通方式...",
      category: "基础技巧",
      readTime: "5分钟",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=nonviolent%20communication%20model%20chart%2C%20psychology%20infographic&sign=e31dde8bf0006a657874164bd8454646"
    },
    {
      id: 2,
      title: "情绪智能在沟通中的应用",
      excerpt: "了解如何识别和管理自己的情绪，同时理解他人的情绪，提升沟通效果...",
      category: "情绪管理",
      readTime: "7分钟",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=emotion%20words%20vocabulary%20list%2C%20psychology%20infographic&sign=98a4f1aed5b7bdd5d44e7534ba2b6a01"
    },
    {
      id: 3,
      title: "职场冲突解决的心理学策略",
      excerpt: "掌握基于心理学的冲突解决技巧，将职场矛盾转化为合作机会...",
      category: "职场沟通",
      readTime: "6分钟",
      imageUrl: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=workplace%20conflict%20resolution%20people%20problem%20solving&sign=f51f25feeca340ab0678748075a0b759"
    }
  ];
  
  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-blue-900 dark:text-blue-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            心理学知识库预览
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            探索专业的沟通心理学知识，提升你的沟通能力
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* 文章封面图 */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className={`p-6 ${theme === 'dark' ? 'border-t border-slate-700' : 'border-t border-gray-100'}`}>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                  theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  {article.category}
                </span>
                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {article.excerpt}
                </p>
                <div className={`flex justify-between items-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>阅读时间: {article.readTime}</span>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    阅读更多 <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <motion.a
            href="/knowledge"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            探索全部知识库
          </motion.a>
        </div>
      </div>
    </div>
  );
};

// CTA section component
const CtaSection: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
      theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-800 to-indigo-700'
    }`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 rounded-full bg-white"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          准备好提升你的沟通能力了吗？
        </motion.h2>
        <motion.p 
          className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isAuthenticated 
            ? '继续你的学习之旅，每天进步一点点' 
            : '加入我们，开始免费试用，提升你的沟通技巧，改变你的人际关系'}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {isAuthenticated ? (
            <>
              <a 
                href="/assessment" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-800 bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                开始评估
              </a>
              <a 
                href="/ai-practice" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
              >
                AI对话练习
              </a>
            </>
          ) : (
            <>
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-800 bg-white hover:bg-blue-50 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('login-btn')?.click();
                }}
              >
                开始免费试用
              </a>
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('login-btn')?.click();
                }}
              >
                了解更多
              </a>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Footer component
const Footer: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <footer className={`py-12 px-4 ${theme === 'dark' ? 'bg-slate-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>沟通技巧提升平台</h3>
            <p className="mb-4">通过个性化学习和实践，提升你的沟通能力，改善人际关系。</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-weixin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-weibo text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fa-brands fa-zhihu text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className={`text-md font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>功能导航</h4>
            <ul className="space-y-2">
              <li><a href="/assessment" className="hover:underline">沟通评估</a></li>
              <li><a href="/ai-practice" className="hover:underline">AI对话练习</a></li>
              <li><a href="/knowledge" className="hover:underline">心理学知识库</a></li>
              <li><a href="/progress" className="hover:underline">进度追踪</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-md font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>关于我们</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">团队介绍</a></li>
              <li><a href="#" className="hover:underline">联系我们</a></li>
              <li><a href="#" className="hover:underline">隐私政策</a></li>
              <li><a href="#" className="hover:underline">服务条款</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-md font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>订阅更新</h4>
            <p className="mb-4">获取最新的沟通技巧和心理学知识</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="输入你的邮箱" 
                className={`px-4 py-2 rounded-l-md w-full focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors">
                订阅
              </button>
            </div>
          </div>
        </div>
        
        <div className={`mt-12 pt-8 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'} text-center`}>
          <p>&copy; {new Date().getFullYear()} 沟通技巧提升平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

// Main Home component
export default function Home() {
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <AnimatedSection className="py-16 px-4">
        <FeaturesSection />
      </AnimatedSection>
      
      <AnimatedSection>
        <SuccessStories />
      </AnimatedSection>
      
      <AnimatedSection>
        <KnowledgeBasePreview />
      </AnimatedSection>
      
      {/* CTA Section */}
      <AnimatedSection>
        <div className={`py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
          theme === 'dark' ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-800 to-indigo-700'
        }`}>
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=people%20successful%20communication%20team%20collaboration%20business%20success&sign=a5ba27a4b71fff88837047292d3ef782" 
              alt="Successful communication"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-1/4 w-60 h-60 rounded-full bg-white"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              准备好提升你的沟通能力了吗？
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isAuthenticated 
                ? '继续你的学习之旅，每天进步一点点' 
                : '加入我们，开始免费试用，提升你的沟通技巧，改变你的人际关系'}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isAuthenticated ? (
                <>
                  <a 
                    href="/assessment" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-800 bg-white hover:bg-blue-50 transition-colors duration-200"
                  >
                    开始评估
                  </a>
                  <a 
                    href="/ai-practice" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
                  >
                    AI对话练习
                  </a>
                </>
              ) : (
                <>
                  <a 
                    href="#" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-800 bg-white hover:bg-blue-50 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('login-btn')?.click();
                    }}
                  >
                    开始免费试用
                  </a>
                  <a 
                    href="#" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('login-btn')?.click();
                    }}
                  >
                    了解更多
                  </a>
                </>
              )}
            </motion.div>
            
            {/* Success metrics */}
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">98%</p>
                <p className="text-blue-200">用户满意度</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">10K+</p>
                <p className="text-blue-200">活跃用户</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">4.9/5</p>
                <p className="text-blue-200">平均评分</p>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
      
      <Footer />
    </div>
  );
}