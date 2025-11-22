import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 添加一个标志来检查Supabase是否配置正确
export const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY

// 创建Supabase客户端 - 只有在配置正确时才创建
export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    supabase = null;
  }
} else {
  console.warn('Supabase is not configured. Using mock implementation.');
}

// 类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

// 用户认证相关操作
export const auth = {
  // 登录
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data.user
  },
  
  // 注册
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })
    
    if (error) throw error
    return data.user
  },
  
  // 登出
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  
  // 获取当前用户
  getCurrentUser() {
    return supabase.auth.currentUser
  },
  
  // 获取用户配置文件
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }
}