'use client';

import { useEffect, useState } from 'react';

// 主题类型
export type Theme = 'light' | 'dark';

// 默认主题
const DEFAULT_THEME: Theme = 'light';

// 本地存储键名
const THEME_STORAGE_KEY = 'theme';

/**
 * 用于管理应用主题的Hook
 * @returns 主题状态和切换方法
 */
export function useTheme() {
  // 初始化主题状态
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // 初始化时从本地存储加载主题设置
  useEffect(() => {
    // 尝试从本地存储获取保存的主题
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    
    // 如果本地存储中有主题设置，使用它
    // 否则，检查系统首选项
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // 检查系统首选项
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : DEFAULT_THEME;
      
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      
      // 保存到本地存储
      localStorage.setItem(THEME_STORAGE_KEY, initialTheme);
    }
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      // 只有在用户没有明确设置主题时才响应系统变化
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };
    
    // 添加事件监听器
    mediaQuery.addEventListener('change', handleChange);
    
    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 提供切换主题的函数
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // 更新HTML元素的类
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // 保存到本地存储
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  // 提供设置特定主题的函数
  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
    
    // 更新HTML元素的类
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // 保存到本地存储
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDarkMode: theme === 'dark',
    isLightMode: theme === 'light'
  };
}

// 导出单独的toggleTheme函数以便在组件外部使用
export function toggleTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  const currentTheme = savedTheme || DEFAULT_THEME;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  
  return newTheme;
}