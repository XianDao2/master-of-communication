import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useContext(AuthContext);
  const { theme } = useTheme();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error('请填写所有必填字段');
      return;
    }
    
    if (!isLogin && !username) {
      toast.error('请填写用户名');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (isLogin) {
        // Try to login
        success = await login(email, password);
      } else {
        // Try to register
        success = await register(email, password, username);
      }
      
      if (success) {
        toast.success(isLogin ? '登录成功' : '注册成功');
        onClose();
      } else {
        toast.error(isLogin ? '登录失败，请检查邮箱和密码' : '注册失败，请稍后再试');
      }
    } catch (error) {
      toast.error('发生错误，请稍后再试');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Reset form when modal opens/closes or form type changes
  React.useEffect(() => {
    if (isOpen) {
      // Focus on email input when modal opens
      const emailInput = document.getElementById('email');
      if (emailInput) {
        emailInput.focus();
      }
    } else {
      // Reset form when modal closes
      setEmail('');
      setPassword('');
      setUsername('');
      setIsLogin(true);
    }
  }, [isOpen, isLogin]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          {/* Modal content */}
          <motion.div
            className={`relative w-full max-w-md rounded-xl p-6 shadow-2xl ${
              theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              className={`absolute top-4 right-4 p-1 rounded-full ${
                theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              } transition-colors`}
              onClick={onClose}
              aria-label="Close modal"
            >
              <i className="fa-solid fa-times"></i>
            </button>
            
            {/* Form header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {isLogin ? '欢迎回来' : '创建账号'}
              </h2>
              <p 
                className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
              >
                {isLogin 
                  ? '登录你的账号继续你的学习之旅' 
                  : '注册账号开始提升你的沟通能力'}
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username field (only for registration) */}
              {!isLogin && (
                <div>
                  <label 
                    htmlFor="username" 
                    className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    用户名
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                  />
                </div>
              )}
              
              {/* Email field */}
              <div>
                <label htmlFor="email" 
                  className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                />
              </div>
              
              {/* Password field */}
              <div>
                <label 
                  htmlFor="password" 
                  className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  密码
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                />
              </div>
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                  isLoading 
                    ? 'bg-blue-500/80 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                    {isLogin ? '登录中...' : '注册中...'}
                  </>
                ) : (
                  isLogin ? '登录' : '注册'
                )}
              </button>
              
              {/* Forgot password (only for login) */}
              {isLogin && (
                <div className="text-center">
                  <a 
                    href="#" 
                    className={`text-sm ${
                      theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    忘记密码?
                  </a>
                </div>
              )}
            </form>
            
            {/* Switch between login and register */}
            <div className={`mt-6 text-center text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isLogin 
                ? (
                  <>
                    还没有账号?{' '}
                    <button 
                      onClick={() => setIsLogin(false)}
                      className={`font-medium ${
                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      立即注册
                    </button>
                  </>
                )
                : (
                  <>
                    已有账号?{' '}
                    <button 
                      onClick={() => setIsLogin(true)}
                      className={`font-medium ${
                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      立即登录
                    </button>
                  </>
                )
              }
            </div>
            
            {/* Social login options */}
            <div className="mt-8">
              <div className="relative flex items-center justify-center">
                <div className={`absolute w-full border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}></div>
                <div className={`relative px-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  或通过以下方式登录
                </div>
              </div>
              
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-white hover:bg-slate-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  aria-label="Login with WeChat"
                >
                  <i className="fa-brands fa-weixin text-xl"></i>
                </button>
                <button 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-white hover:bg-slate-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  aria-label="Login with QQ"
                >
                  <i className="fa-brands fa-qq text-xl"></i>
                </button>
                <button 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-white hover:bg-slate-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  aria-label="Login with Weibo"
                >
                  <i className="fa-brands fa-weibo text-xl"></i>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}