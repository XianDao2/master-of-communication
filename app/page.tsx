"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useParallax, useReverseParallax } from "../hooks/use-parallax";
import { useTheme } from "../hooks/use-theme";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 使用视差效果
  const parallaxOffset = useParallax(150);
  const reverseParallaxOffset = useReverseParallax(50);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`relative py-24 lg:py-36 overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/4 -left-10 w-60 h-60 rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-indigo-300 opacity-20 blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-primary/15 text-primary border border-primary/30 mb-4">
                <span className="mr-2">💬</span>
                企业级沟通能力提升平台
              </div>

              <motion.h1 
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
              >
                提升你的沟通技巧<br />
                <span className="text-primary">自信应对各种场景</span>
              </motion.h1>

              <p className="mt-8 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto leading-relaxed">
                通过个性化评估和学习路径，掌握高效沟通技能，无论是职场还是生活，让你的表达更有影响力。
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-col sm:flex-row gap-5 justify-center"
              >
                <button
                  onClick={() => {
                    const assessmentSection = document.querySelector('#assessment');
                    if (assessmentSection) {
                      assessmentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center justify-center h-16 px-12 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  开始沟通评估
                </button>
                <button
                  onClick={() => router.push('/communication/knowledge')}
                  className="inline-flex items-center justify-center h-16 px-12 text-lg font-semibold bg-background/80 backdrop-blur-sm text-foreground border border-primary/30 hover:bg-primary/10 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  浏览知识库
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10K+</div>
                  <div className="text-muted-foreground">活跃用户</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">98%</div>
                  <div className="text-muted-foreground">用户满意度</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4.9/5</div>
                  <div className="text-muted-foreground">平均评分</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content - Communication Assessment */}
      <section id="assessment" className="py-20 relative overflow-hidden">
        {/* 金色背景光晕 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-playfair">
                  企业级沟通能力评估系统
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  通过科学的多维度评估工具，全面了解你的沟通优势和待提升领域，获取个性化的提升建议。
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-10 shadow-xl backdrop-blur-sm bg-opacity-90 gold-glow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground font-playfair">选择评估类型</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 px-5 rounded-lg border border-primary bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all duration-300 hover:shadow-md">
                        职场沟通
                      </button>
                      <button className="py-4 px-5 rounded-lg border border-border/50 bg-card hover:bg-muted transition-all duration-300">
                        社交沟通
                      </button>
                      <button className="py-4 px-5 rounded-lg border border-border/50 bg-card hover:bg-muted transition-all duration-300">
                        演讲表达
                      </button>
                      <button className="py-4 px-5 rounded-lg border border-border/50 bg-card hover:bg-muted transition-all duration-300">
                        冲突管理
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">完成度</label>
                        <p className="text-sm text-muted-foreground">已完成 6/10 题</p>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full shadow-lg shadow-primary/50" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-foreground font-playfair">能力雷达图</h3>
                    <div className="h-72 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl font-bold text-primary font-playfair">86<span className="text-lg">%</span></div>
                        </div>
                        <div className="absolute inset-0 opacity-30">
                          {/* 美化的雷达图表示 */}
                          <div className="w-full h-full border-4 border-primary rounded-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border-4 border-primary rounded-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 border-4 border-primary rounded-full" />
                          
                          {/* 添加雷达图轴线 */}
                          <div className="absolute top-0 left-1/2 w-px h-full bg-primary/30" style={{ transform: 'translateX(-50%)' }} />
                          <div className="absolute left-0 top-1/2 w-full h-px bg-primary/30" style={{ transform: 'translateY(-50%)' }} />
                          <div className="absolute top-0 left-0 w-full h-full border border-primary/30" style={{ transform: 'rotate(45deg)' }} />
                          <div className="absolute top-0 left-0 w-full h-full border border-primary/30" style={{ transform: 'rotate(135deg)' }} />
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/50">
                      继续完成评估
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/20 relative">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl space-y-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-playfair">
                企业级沟通能力提升解决方案
              </h2>
              <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                科学的评估系统和个性化学习路径，让沟通能力提升变得高效而有趣，助力企业打造卓越团队。
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-card p-8 shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-playfair">AI驱动评估体系</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    通过AI驱动的多维度评估模型，精准分析你的沟通优势和不足，为你提供科学、客观的评估报告。
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-card p-8 shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-playfair">个性化学习路径</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    根据你的评估结果和学习目标，定制专属学习路径，循序渐进提升各项沟通技能，高效达成目标。
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-card p-8 shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-playfair">企业级场景模拟</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    通过真实的企业级场景模拟练习，获取即时反馈和专业指导，在实践中巩固和提升沟通能力。
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Link */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        {/* 金色背景光晕 */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-6xl text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-playfair">
                企业级沟通能力提升方案
              </h2>
              <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                灵活的定价方案，满足企业和个人的不同需求，助力提升沟通能力，打造卓越团队。
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/pricing')}
                  className="inline-flex items-center justify-center h-16 px-12 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all duration-300 shadow-xl hover:shadow-primary/50"
                >
                  查看详细方案
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl text-center space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                三步构建企业级沟通能力
              </h2>
            </motion.div>
            
            <div className="relative">
              {/* 连接线 */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                <motion.div 
                  className="flex flex-col items-center p-8 rounded-2xl bg-card shadow-xl border border-border/50"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/15 border border-primary/30 mb-6">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-playfair">完成企业级评估</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    选择适合企业需求的评估类型，完成专业的沟通能力测试，获取全面的评估报告。
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-center p-8 rounded-2xl bg-card shadow-xl border border-border/50"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/15 border border-primary/30 mb-6">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-playfair">获取定制化学习路径</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    根据评估结果，获取个性化的学习路径和提升建议，针对性提升沟通能力。
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-center p-8 rounded-2xl bg-card shadow-xl border border-border/50"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/15 border border-primary/30 mb-6">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-playfair">实战模拟与优化</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    通过真实场景模拟练习，获取即时反馈和专业指导，在实践中不断优化沟通技巧。
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:bg-primary/90 transition-all duration-300 z-50"
        aria-label="Back to top"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </div>
  );
}
