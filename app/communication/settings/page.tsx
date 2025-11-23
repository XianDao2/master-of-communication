'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme, toggleTheme } from '@/hooks/use-theme';
import { useUser, updateUserProfile } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

// 设置选项卡类型
type TabType = 'general' | 'notifications' | 'privacy' | 'account';

// 通知设置接口
interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReminders: boolean;
  progressUpdates: boolean;
  newContentAlerts: boolean;
  achievementNotifications: boolean;
}

// 隐私设置接口
interface PrivacySettings {
  shareProgress: boolean;
  leaderboardVisibility: boolean;
  dataCollection: boolean;
  thirdPartyAccess: boolean;
}

// 初始通知设置
const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  dailyReminders: false,
  progressUpdates: true,
  newContentAlerts: true,
  achievementNotifications: true
};

// 初始隐私设置
const initialPrivacySettings: PrivacySettings = {
  shareProgress: false,
  leaderboardVisibility: true,
  dataCollection: true,
  thirdPartyAccess: false
};

// 切换开关组件
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, description, disabled = false }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="flex-1 mr-4">
        <div className="flex items-center">
          <span className={cn("font-medium", disabled && theme === 'dark' ? 'text-gray-500' : disabled && 'text-gray-400')}>
            {label}
          </span>
        </div>
        {description && (
          <p className={cn(
            "text-sm mt-1",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
            disabled && theme === 'dark' ? 'text-gray-500' : disabled && 'text-gray-400'
          )}>
            {description}
          </p>
        )}
      </div>
      <div className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="opacity-0 w-0 h-0"
          id={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <label
          htmlFor={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`cursor-pointer absolute top-0 left-0 right-0 bottom-0 transition-all duration-300 ease-in-out rounded-full ${checked ? 'bg-blue-600' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} ${disabled && 'opacity-50 cursor-not-allowed'}`}
        >
          <span className={`absolute content-[''] h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300 ease-in-out ${checked ? 'transform translate-x-6' : ''}`}></span>
        </label>
      </div>
    </div>
  );
};

// 表单字段组件
const FormField: React.FC<{
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}> = ({ label, type, value, onChange, placeholder, disabled = false, error }) => {
  const { theme } = useTheme();
  
  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={cn(
            "w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none",
            error ? 'border-red-500' : '',
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white'
              : 'bg-white border-gray-300 focus:border-blue-500',
            disabled && theme === 'dark' ? 'bg-slate-800 text-gray-500' : disabled && 'bg-gray-100 text-gray-400'
          )}
        />
      );
    }
    
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
          error ? 'border-red-500' : '',
          theme === 'dark'
            ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white'
            : 'bg-white border-gray-300 focus:border-blue-500',
          disabled && theme === 'dark' ? 'bg-slate-800 text-gray-500' : disabled && 'bg-gray-100 text-gray-400'
        )}
      />
    );
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// 选项卡按钮组件
const TabButton: React.FC<{
  activeTab: TabType;
  tab: TabType;
  label: string;
  icon: string;
  onClick: (tab: TabType) => void;
}> = ({ activeTab, tab, label, icon, onClick }) => {
  const { theme } = useTheme();
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(tab)}
      className={cn(
        "flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left",
        activeTab === tab
          ? theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700 font-medium'
          : theme === 'dark' ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
      )}
    >
      <i className={`fa-solid ${icon}`}></i>
      <span>{label}</span>
    </motion.button>
  );
};

export default function SettingsPage() {
  const { theme } = useTheme();
  const { user, isLoading: isUserLoading } = useUser();
  
  // 当前活动选项卡
  const [activeTab, setActiveTab] = useState<TabType>('general');
  
  // 表单状态
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  
  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  
  // 隐私设置
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(initialPrivacySettings);
  
  // 表单错误
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 处理主题切换
  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  // 处理通知设置变更
  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // 处理隐私设置变更
  const handlePrivacyChange = (key: keyof PrivacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = '姓名不能为空';
    }
    
    if (!email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 保存个人资料
  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 在实际应用中，这里应该调用updateUserProfile函数
      if (updateUserProfile) {
        await updateUserProfile({
          name,
          email,
          bio,
          location,
          avatarUrl
        });
      }
      
      // 显示成功消息
      alert('个人资料已更新');
    } catch (error) {
      alert('更新失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 渲染通用设置选项卡
  const renderGeneralTab = () => (
    <div>
      <h2 className="text-xl font-bold mb-6">通用设置</h2>
      
      <div className={cn(
        "p-6 rounded-xl mb-8",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-lg font-medium mb-4">界面设置</h3>
        
        <ToggleSwitch
          checked={theme === 'dark'}
          onChange={handleThemeToggle}
          label="深色模式"
          description="切换应用的显示主题"
        />
        
        <div className="py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">语言</span>
              <p className={cn(
                "text-sm mt-1",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                选择应用界面语言
              </p>
            </div>
            <select
              className={cn(
                "px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm",
                theme === 'dark'
                  ? 'bg-slate-700 border-slate-600 focus:border-blue-400 text-white'
                  : 'bg-white border-gray-300 focus:border-blue-500'
              )}
              defaultValue="zh-CN"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English (US)</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
        </div>
        
        <div className="py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">字体大小</span>
              <p className={cn(
                "text-sm mt-1",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                调整应用界面字体大小
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className={cn(
                "px-2 py-1 rounded-lg text-xs",
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              )}>
                A-
              </button>
              <span className="font-medium">默认</span>
              <button className={cn(
                "px-2 py-1 rounded-lg text-xs",
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
              )}>
                A+
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "p-6 rounded-xl",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-lg font-medium mb-4">个人资料</h3>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="用户头像"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-avatar.jpg';
                  }}
                />
              ) : (
                <div className={cn(
                  "w-full h-full flex items-center justify-center",
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'
                )}>
                  <i className="fa-solid fa-user text-4xl text-gray-500"></i>
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                <i className="fa-solid fa-camera text-white text-xs"></i>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <p className={cn(
              "text-sm mb-2",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              上传个人头像，支持 JPG, PNG 或 GIF 格式，文件大小不超过 2MB
            </p>
            <button className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
              theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            )}>
              选择文件
            </button>
          </div>
        </div>
        
        <FormField
          label="姓名"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入您的姓名"
          error={errors.name}
        />
        
        <FormField
          label="邮箱"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="请输入您的邮箱地址"
          error={errors.email}
        />
        
        <FormField
          label="个人简介"
          type="textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="简单介绍一下自己..."
        />
        
        <FormField
          label="所在地"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="请输入您的所在地"
        />
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isSubmitting}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium transition-colors duration-200",
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            )}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                保存中...
              </>
            ) : (
              <>
                保存更改
                <i className="fa-solid fa-check ml-2"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
  
  // 渲染通知设置选项卡
  const renderNotificationsTab = () => (
    <div>
      <h2 className="text-xl font-bold mb-6">通知设置</h2>
      
      <div className={cn(
        "p-6 rounded-xl",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">通知偏好</h3>
          
          <ToggleSwitch
            checked={notificationSettings.emailNotifications}
            onChange={() => handleNotificationChange('emailNotifications')}
            label="接收邮件通知"
            description="通过邮件接收重要通知"
          />
          
          <ToggleSwitch
            checked={notificationSettings.pushNotifications}
            onChange={() => handleNotificationChange('pushNotifications')}
            label="接收推送通知"
            description="在应用中接收推送通知"
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">通知类型</h3>
          
          <ToggleSwitch
            checked={notificationSettings.dailyReminders}
            onChange={() => handleNotificationChange('dailyReminders')}
            label="每日学习提醒"
            description="每天定时提醒学习和练习"
          />
          
          <ToggleSwitch
            checked={notificationSettings.progressUpdates}
            onChange={() => handleNotificationChange('progressUpdates')}
            label="进度更新通知"
            description="当你的沟通能力有明显提升时通知你"
          />
          
          <ToggleSwitch
            checked={notificationSettings.newContentAlerts}
            onChange={() => handleNotificationChange('newContentAlerts')}
            label="新内容提醒"
            description="当平台发布新文章或练习场景时通知你"
          />
          
          <ToggleSwitch
            checked={notificationSettings.achievementNotifications}
            onChange={() => handleNotificationChange('achievementNotifications')}
            label="成就通知"
            description="当你获得新徽章或达成学习目标时通知你"
          />
        </div>
        
        <div className="flex justify-end">
          <button className={cn(
            "px-6 py-2.5 rounded-lg font-medium transition-colors duration-200",
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          )}>
            保存设置
            <i className="fa-solid fa-check ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
  
  // 渲染隐私设置选项卡
  const renderPrivacyTab = () => (
    <div>
      <h2 className="text-xl font-bold mb-6">隐私设置</h2>
      
      <div className={cn(
        "p-6 rounded-xl mb-8",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-lg font-medium mb-4">数据共享</h3>
        
        <ToggleSwitch
          checked={privacySettings.shareProgress}
          onChange={() => handlePrivacyChange('shareProgress')}
          label="共享学习进度"
          description="允许与其他用户共享你的学习进度和成就"
        />
        
        <ToggleSwitch
          checked={privacySettings.leaderboardVisibility}
          onChange={() => handlePrivacyChange('leaderboardVisibility')}
          label="排行榜可见性"
          description="在学习排行榜中显示你的排名"
        />
      </div>
      
      <div className={cn(
        "p-6 rounded-xl mb-8",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-lg font-medium mb-4">数据收集</h3>
        
        <ToggleSwitch
          checked={privacySettings.dataCollection}
          onChange={() => handlePrivacyChange('dataCollection')}
          label="使用数据收集"
          description="允许收集你的使用数据以改进服务"
        />
        
        <ToggleSwitch
          checked={privacySettings.thirdPartyAccess}
          onChange={() => handlePrivacyChange('thirdPartyAccess')}
          label="第三方服务访问"
          description="允许授权的第三方服务访问你的部分信息"
        />
      </div>
      
      <div className={cn(
        "p-6 rounded-xl",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-lg font-medium mb-4">账户数据</h3>
        
        <div className="space-y-4">
          <button className={cn(
            "w-full py-3 text-left rounded-lg transition-colors duration-200 flex items-center justify-between",
            theme === 'dark' ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          )}>
            <span className="font-medium">导出我的数据</span>
            <i className="fa-solid fa-download"></i>
          </button>
          
          <button className={cn(
            "w-full py-3 text-left rounded-lg transition-colors duration-200 flex items-center justify-between",
            theme === 'dark' ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
          )}>
            <span className="font-medium">清除学习记录</span>
            <i className="fa-solid fa-trash"></i>
          </button>
          
          <div className="mt-8">
            <button className={cn(
              "w-full py-3 text-left rounded-lg transition-colors duration-200 font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
              theme === 'dark' ? 'hover:text-red-400' : 'hover:text-red-600'
            )}>
              <i className="fa-solid fa-user-xmark mr-2"></i>
              注销账户
            </button>
            <p className={cn(
              "text-sm mt-2 px-3 py-2 rounded-lg",
              theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
            )}>
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              注销账户将永久删除您的所有数据，此操作无法撤销。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染账户设置选项卡
  const renderAccountTab = () => (
    <div>
      <h2 className="text-xl font-bold mb-6">账户设置</h2>
      
      <div className={cn(
        "p-6 rounded-xl mb-8",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-lg font-medium mb-4">密码设置</h3>
        
        <FormField
          label="当前密码"
          type="password"
          value=""
          onChange={() => {}}
          placeholder="请输入当前密码"
        />
        
        <FormField
          label="新密码"
          type="password"
          value=""
          onChange={() => {}}
          placeholder="请输入新密码"
        />
        
        <FormField
          label="确认新密码"
          type="password"
          value=""
          onChange={() => {}}
          placeholder="请再次输入新密码"
        />
        
        <div className="mt-6 flex justify-end">
          <button className={cn(
            "px-6 py-2.5 rounded-lg font-medium transition-colors duration-200",
            theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          )}>
            更改密码
          </button>
        </div>
      </div>
      
      <div className={cn(
        "p-6 rounded-xl",
        theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        'shadow-md border border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-lg font-medium mb-4">连接的账户</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#4267B2] flex items-center justify-center mr-3">
                <i className="fa-brands fa-facebook text-white"></i>
              </div>
              <div>
                <div className="font-medium">Facebook</div>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  未连接
                </p>
              </div>
            </div>
            <button className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
              theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            )}>
              连接
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#DB4437] flex items-center justify-center mr-3">
                <i className="fa-brands fa-google text-white"></i>
              </div>
              <div>
                <div className="font-medium">Google</div>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  已连接
                </p>
              </div>
            </div>
            <button className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
              theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            )}>
              断开连接
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center mr-3">
                <i className="fa-brands fa-twitter text-white"></i>
              </div>
              <div>
                <div className="font-medium">Twitter</div>
                <p className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  未连接
                </p>
              </div>
            </div>
            <button className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
              theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            )}>
              连接
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // 渲染选项卡内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderGeneralTab();
    }
  };
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === 'dark' ? 'bg-slate-900 text-gray-100' : 'bg-white text-gray-800'
    )}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-900 dark:text-blue-300">
          设置
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 侧边导航 */}
          <div className="md:col-span-1">
            <div className={cn(
              "p-4 rounded-xl sticky top-4",
              theme === 'dark' ? 'bg-slate-800' : 'bg-white',
              'shadow-md border border-gray-200 dark:border-gray-700'
            )}>
              <div className="space-y-2">
                <TabButton
                  activeTab={activeTab}
                  tab="general"
                  label="通用设置"
                  icon="fa-gear"
                  onClick={setActiveTab}
                />
                <TabButton
                  activeTab={activeTab}
                  tab="notifications"
                  label="通知设置"
                  icon="fa-bell"
                  onClick={setActiveTab}
                />
                <TabButton
                  activeTab={activeTab}
                  tab="privacy"
                  label="隐私设置"
                  icon="fa-lock"
                  onClick={setActiveTab}
                />
                <TabButton
                  activeTab={activeTab}
                  tab="account"
                  label="账户设置"
                  icon="fa-user"
                  onClick={setActiveTab}
                />
              </div>
            </div>
          </div>
          
          {/* 主内容区域 */}
          <div className="md:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}