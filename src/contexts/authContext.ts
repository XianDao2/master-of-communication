import { createContext, useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Define types
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
}

// Mock user data for demonstration when Supabase is not available
export const mockUserData: User = {
  id: "user-123",
  username: "demo_user",
  email: "demo@example.com",
  role: "user",
  createdAt: "2025-01-01T00:00:00Z"
};

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// 初始化Supabase认证监听
export const useAuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 从lib导入Supabase客户端
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Using mock implementation.');
  }

  // 初始化认证状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 从localStorage中检查是否有保存的认证状态
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
          try {
            const userData = JSON.parse(savedAuth);
            setIsAuthenticated(true);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing saved auth data:', error);
            localStorage.removeItem('auth');
          }
        }

        // 设置Supabase认证状态变更监听
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              // 用户已登录
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                // 如果没有找到用户资料，创建一个
                const { error: profileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    username: session.user.email?.split('@')[0] || 'user',
                    email: session.user.email,
                    role: 'user',
                    created_at: new Date().toISOString()
                  });
                  
                if (profileError) {
                  console.error('Error creating user profile:', profileError);
                }
                
                // 使用会话信息创建用户对象
                const userObj: User = {
                  id: session.user.id,
                  username: session.user.email?.split('@')[0] || 'user',
                  email: session.user.email || '',
                  role: 'user',
                  createdAt: new Date(session.user.created_at).toISOString()
                };
                
                setUser(userObj);
                localStorage.setItem('auth', JSON.stringify(userObj));
              } else {
                // 使用从数据库获取的资料
                const userObj: User = {
                  id: data.id,
                  username: data.username,
                  email: data.email,
                  role: data.role,
                  createdAt: data.created_at
                };
                
                setUser(userObj);
                localStorage.setItem('auth', JSON.stringify(userObj));
              }
              
              setIsAuthenticated(true);
            } else {
              // 用户已登出
              setIsAuthenticated(false);
              setUser(null);
              localStorage.removeItem('auth');
            }
            
            setIsLoading(false);
          }
        );

        // 清理函数
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 登录函数
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 尝试使用Supabase登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('登录失败: ' + error.message);
        
        // 如果Supabase登录失败，使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userData: User = {
          ...mockUserData,
          email
        };
        
        localStorage.setItem('auth', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      }

      if (data.user) {
        // 登录成功，获取用户资料
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const userObj: User = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            role: profile.role,
            createdAt: profile.created_at
          };
          
          localStorage.setItem('auth', JSON.stringify(userObj));
          setUser(userObj);
        }
        
        toast.success('登录成功');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('登录过程中出现错误');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册函数
  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 尝试使用Supabase注册
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error('注册失败: ' + error.message);
        
        // 如果Supabase注册失败，使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userData: User = {
          ...mockUserData,
          email,
          username
        };
        
        localStorage.setItem('auth', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      }

      if (data.user) {
        // 注册成功，创建用户资料
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username || email.split('@')[0],
            email: email,
            role: 'user',
            created_at: new Date().toISOString()
          });

        if (!profileError) {
          const userObj: User = {
            id: data.user.id,
            username: username || email.split('@')[0],
            email: email,
            role: 'user',
            createdAt: new Date().toISOString()
          };
          
          localStorage.setItem('auth', JSON.stringify(userObj));
          setUser(userObj);
        }
        
        toast.success('注册成功，请检查邮箱验证');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('注册过程中出现错误');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    try {
      // 调用Supabase登出
      supabase.auth.signOut();
      
      // 清除本地存储
      localStorage.removeItem('auth');
      
      // 更新状态
      setIsAuthenticated(false);
      setUser(null);
      
      toast.success('已成功登出');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('登出过程中出现错误');
    }
  };

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    isLoading
  };
};