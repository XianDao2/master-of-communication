import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

export default function SuccessStories() {
  const { theme } = useTheme();
  
  // Success stories data with additional context images
  const successStories = [
    {
      id: 1,
      name: "李明",
      role: "项目经理",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20male%20project%20manager%20avatar&sign=e3779e8fac9b9a7ccf50cb3d4ab96a7d",
      story: "通过这个平台的学习，我不仅提升了与团队成员的沟通效率，还成功地完成了几个重要项目的交付。现在我的团队氛围更加和谐，工作效率也提高了很多。",
      improvement: "沟通效率提升 40%",
      rating: 5,
      contextImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=project%20team%20collaboration%20business%20people%20success&sign=c53929ec0a00755aec03ab92d158312c"
    },
    {
      id: 2,
      name: "张华",
      role: "销售总监",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20male%20sales%20director%20avatar&sign=508de83caf8b1033d7177604a6f94360",
      story: "这个平台帮助我掌握了更有效的客户沟通技巧，我的销售业绩在3个月内提升了30%。现在我能更好地理解客户需求，并提供更精准的解决方案。",
      improvement: "销售业绩提升 30%",
      rating: 5,
      contextImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sales%20team%20celebrating%20success%20business%20people&sign=198b3a953ac4bc6a038c02244c1f488b"
    },
    {
      id: 3,
      name: "王丽",
      role: "人力资源经理",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=chinese%20female%20HR%20manager%20avatar&sign=adca36a5faea581404af000e98401dd1",
      story: "作为HR，良好的沟通能力至关重要。通过这个平台的学习，我在员工关系管理和冲突解决方面的能力得到了显著提升，员工满意度提高了25%。",
      improvement: "员工满意度提升 25%",
      rating: 4,
      contextImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=HR%20manager%20team%20building%20happy%20employees&sign=4a8bfa29868ba85f732dae405ee3dfe8"
    }
  ];
  
  // Current active story index
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  // Handle next story
  const nextStory = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % successStories.length);
  };
  
  // Handle previous story
  const prevStory = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? successStories.length - 1 : prevIndex - 1
    );
  };
  
  // Auto-rotate stories every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextStory();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <i 
          key={i} 
          className={`fa-solid ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        ></i>
      ));
  };
  
  return (
    <div className={`py-16 px-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ color: theme === 'dark' ? '#E5E7EB' : '#1E3A8A' }}
          >
            用户成功案例
          </motion.h2>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
          >
            看看其他人是如何通过我们的平台提升沟通能力，实现职业和个人成长的
          </motion.p>
        </div>
        
        {/* Main story showcase */}
        <div className="relative max-w-4xl mx-auto">
          {/* Story content */}
          <motion.div 
            className={`rounded-2xl overflow-hidden shadow-lg ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            } relative`}
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background image for story */}
            <div className="w-full h-60 sm:h-80 relative">
              <img 
                src={successStories[activeIndex].contextImage} 
                alt="Story context"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center">
                  <img 
                    src={successStories[activeIndex].avatar} 
                    alt={successStories[activeIndex].name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{successStories[activeIndex].name}</h4>
                    <p>{successStories[activeIndex].role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Story text content */}
            <div className="p-8 md:p-12">
              {/* Star rating */}
              <div className="flex mb-6">
                {renderStars(successStories[activeIndex].rating)}
              </div>
              
              {/* Story quote */}
              <div className="relative mb-8">
                <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4 text-blue-500 text-6xl opacity-20">
                  <i className="fa-solid fa-quote-left"></i>
                </div>
                <p 
                  className="text-lg md:text-xl italic pl-6 relative z-10"
                  style={{ color: theme === 'dark' ? '#D1D5DB' : '#1F2937' }}
                >
                  "{successStories[activeIndex].story}"
                </p>
              </div>
              
              {/* Improvement stats */}
              <div 
                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(30, 58, 138, 0.2)' : 'rgba(30, 58, 138, 0.1)',
                  color: theme === 'dark' ? '#60A5FA' : '#1E40AF'
                }}
              >
                {successStories[activeIndex].improvement}
              </div>
            </div>
          </motion.div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevStory}
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none ${
              theme === 'dark' 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-white text-blue-900 hover:bg-blue-50'
            }`}
            aria-label="Previous story"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button 
            onClick={nextStory}
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none ${
              theme === 'dark' 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-white text-blue-900 hover:bg-blue-50'
            }`}
            aria-label="Next story"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
        
        {/* Story indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {successStories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-10 bg-blue-600'
                  : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'
              }`}
              aria-label={`Go to story ${index + 1}`}
            ></button>
          ))}
        </div>
        
        {/* More stories button */}
        <div className="text-center mt-12">
          <motion.a
            href="#"
            className={`inline-flex items-center justify-center px-6 py-3 border ${
              theme === 'dark'
                ? 'border-blue-700 text-blue-400 hover:bg-blue-900/30'
                : 'border-blue-200 text-blue-700 hover:bg-blue-50'
            } text-base font-medium rounded-md transition-colors duration-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            查看更多成功案例 <i className="fa-solid fa-arrow-right ml-2"></i>
          </motion.a>
        </div>
      </div>
    </div>
  );
}