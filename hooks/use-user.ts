"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';

// 用户类型定义
export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  bio?: string;
  location?: string;
  user_metadata?: {
    name?: string;
    gender?: string;
    [key: string]: any;
  };
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Get user on mount
    getUser();

    // Listen for changes on auth state (login, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // 如果有用户会话，获取完整的用户资料
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 获取用户资料
  async function fetchUserProfile(supabaseUser: User) {
    try {
      // 尝试从用户表获取额外的用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('name, bio, location')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.warn('No additional profile data found');
        // 即使没有找到额外资料，也设置基本用户信息
        setUser({
          ...supabaseUser,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0]
        });
      } else {
        // 合并基本用户信息和额外资料
        setUser({
          ...supabaseUser,
          name: profileData.name,
          bio: profileData.bio,
          location: profileData.location
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // 出错时至少设置基本用户信息
      setUser({
        ...supabaseUser,
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0]
      });
    } finally {
      setLoading(false);
    }
  }

  async function getUser() {
    try {
      const {
        data: { user: supabaseUser },
        error: authError
      } = await supabase.auth.getUser();

      if (authError) {
        console.error('Auth error:', authError);
        setUser(null);
      } else if (supabaseUser) {
        // 如果有用户，获取完整资料
        await fetchUserProfile(supabaseUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error getting user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // 登录方法
  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // 注册方法
  async function register(email: string, password: string, name?: string) {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      // 如果提供了名称，尝试创建用户资料
      if (name) {
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          try {
            await supabase.from('users').insert({
              id: newUser.id,
              name,
              email
            });
          } catch (err) {
            console.warn('Failed to create user profile:', err);
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '注册失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // 登出方法
  async function logout() {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }

  // 更新用户资料
  async function updateUserProfile(data: Partial<UserProfile>) {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('用户未登录');
      }
      
      // 更新Supabase用户元数据（如果需要）
      if (data.name) {
        await supabase.auth.updateUser({
          data: { name: data.name }
        });
      }
      
      // 更新用户表中的资料
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: data.name,
          bio: data.bio,
          location: data.location,
      
        });
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      // 更新本地状态
      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新个人资料失败，请重试';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { user, loading: loading, error, login, register, logout, updateUserProfile };
}

// 导出一个简单版本的useUser，用于页面组件中检查用户登录状态
export const useUserStatus = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      try {
        const {
          data: { user: supabaseUser }
        } = await supabase.auth.getUser();
        
        if (supabaseUser) {
          setUser({
            ...supabaseUser,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0]
          });
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkUser();
  }, []);

  return { user, loading };
}
