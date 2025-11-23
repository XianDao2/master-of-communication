'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CommunicationPage: React.FC = () => {
  const { theme } = useTheme();
  
  const navItems = [
    {
      title: '首页概览',
      description: '了解沟通大师的核心功能和价值',
      href: '/communication-home',
      icon: '🏠'
    },
    {
      title: '能力评估',
      description: '通过科学的评估系统了解您的沟通能力',
      href: '/communication/assessment',
      icon: '📊'
    },
    {
      title: 'AI对话练习',
      description: '与AI进行真实场景的对话练习，提升沟通技巧',
      href: '/communication/ai-practice',
      icon: '🤖'
    },
    {
      title: '知识中心',
      description: '学习沟通技巧和心理学知识',
      href: '/communication/knowledge',
      icon: '📚'
    },
    {
      title: '学习进度',
      description: '跟踪您的学习进度和能力提升',
      href: '/communication/progress',
      icon: '📈'
    },
    {
      title: '设置',
      description: '个性化您的学习体验',
      href: '/communication/settings',
      icon: '⚙️'
    }
  ];

  return (
    <div className={cn(
      'min-h-screen py-12 px-4 sm:px-6 lg:px-8',
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            沟通大师
          </h1>
          <p className="mx-auto max-w-2xl text-xl opacity-80">
            提升您的沟通能力，自信地表达自己，建立更好的人际关系
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'block rounded-xl p-6 h-full',
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-100',
                  'shadow-md hover:shadow-lg transition-all duration-300 border',
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                    <p className="opacity-70">{item.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CommunicationPage;