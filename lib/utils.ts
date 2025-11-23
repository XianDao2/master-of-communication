import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并多个className，处理条件性className并优化Tailwind类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成唯一ID
 * @param prefix 可选的前缀
 * @returns 唯一ID字符串
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 格式化日期为易读字符串
 * @param date 日期对象或时间戳
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  // 默认选项
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('zh-CN', defaultOptions).format(dateObj);
}

/**
 * 格式化数字为易读字符串（如1000 -> 1k）
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * 截断文本，超过指定长度时添加省略号
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 防抖函数，延迟执行函数直到停止触发一段时间后
 * @param func 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖处理后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * 将字符串首字母大写
 * @param str 原始字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 验证邮箱格式是否正确
 * @param email 邮箱地址
 * @returns 是否为有效邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
