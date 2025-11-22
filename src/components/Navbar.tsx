import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { useTheme } from '@/hooks/useTheme';

// NavLink component for consistent styling
interface NavLinkProps {
  href: string;
  text: string;
  theme: 'light' | 'dark';
}

function NavLink({ href, text, theme }: NavLinkProps) {
  return (
    <Link 
      to={href}
      className={`text-sm font-medium transition-colors duration-200 ${
        theme === 'dark' 
          ? 'text-gray-300 hover:text-white' 
          : 'text-gray-600 hover:text-blue-900'
      }`}
    >
      {text}
    </Link>
  );
}



interface NavbarProps {
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean) => void;
}

export default function Navbar({ showLoginModal, setShowLoginModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle login button click
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? `${theme === 'dark' 
              ? 'bg-slate-900/90 backdrop-blur-md shadow-md' 
              : 'bg-white/90 backdrop-blur-md shadow-md'}` 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 ${
                theme === 'dark' ? 'bg-blue-800' : 'bg-blue-600'
              }`}>
                <i className="fa-solid fa-comments text-white text-xl"></i>
              </div>
              <span className={`font-bold text-xl ${
                theme === 'dark' ? 'text-white' : 'text-blue-900'
              }`}>
                沟通提升
              </span>
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/assessment" text="沟通评估" theme={theme} />
            <NavLink href="/ai-practice" text="AI对话练习" theme={theme} />
            <NavLink href="/knowledge" text="知识库" theme={theme} />
            <NavLink href="/progress" text="进度追踪" theme={theme} />
            
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors duration-200`}
              aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {theme === 'dark' ? (
                <i className="fa-solid fa-sun"></i>
              ) : (
                <i className="fa-solid fa-moon"></i>
              )}
            </button>
            
            {/* User menu or login button */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-blue-100'
                  }`}>
                    <span className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {user.username}
                  </span>
                </button>
                
                {/* Dropdown menu */}
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                } hidden group-hover:block transition-all duration-200`}>
                  <a href="#" className={`block px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:bg-slate-700 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    个人资料
                  </a>
                  <a href="#" className={`block px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:bg-slate-700 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    设置
                  </a>
                  <div className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-100'} my-1`}></div>
                  <button 
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark' 
                        ? 'text-red-300 hover:bg-slate-700' 
                        : 'text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <button 
                id="login-btn"
                onClick={handleLoginClick}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-white text-blue-900 hover:bg-blue-50' 
                    : 'bg-blue-900 text-white hover:bg-blue-800'
                }`}
              >
                登录/注册
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className={`p-2 rounded-md ${
              theme === 'dark' 
                ? 'text-gray-300 hover:text-white hover:bg-slate-800' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}