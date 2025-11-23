"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-muted/20 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                <span className="mr-2">💬</span>
                沟通能力提升平台
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                提升你的沟通技巧<br />
                <span className="text-primary">自信应对各种场景</span>
              </h1>

              <p className="mt-6 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto">
                通过个性化评估和学习路径，掌握高效沟通技能，无论是职场还是生活，让你的表达更有影响力。
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => {
                    const assessmentSection = document.querySelector('#assessment');
                    if (assessmentSection) {
                      assessmentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg"
                >
                  开始沟通评估
                </button>
                <button
                  onClick={() => router.push('/communication/knowledge')}
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-background text-foreground border border-border hover:bg-muted rounded-md transition-colors shadow-sm"
                >
                  浏览知识库
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  个性化评估
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  定制学习路径
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  场景模拟练习
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content - Communication Assessment */}
      <section id="assessment" className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  沟通能力评估系统
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  通过科学的评估工具，全面了解你的沟通优势和待提升领域，获取个性化的提升建议。
                </p>
              </div>

              <div className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">选择评估类型</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 px-4 rounded-lg border border-primary bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors">
                        职场沟通
                      </button>
                      <button className="py-3 px-4 rounded-lg border border-border hover:bg-muted transition-colors">
                        社交沟通
                      </button>
                      <button className="py-3 px-4 rounded-lg border border-border hover:bg-muted transition-colors">
                        演讲表达
                      </button>
                      <button className="py-3 px-4 rounded-lg border border-border hover:bg-muted transition-colors">
                        冲突管理
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">完成度</label>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground">已完成 6/10 题</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-foreground">能力雷达图</h3>
                    <div className="h-64 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl font-bold text-primary">86<span className="text-sm">%</span></div>
                        </div>
                        <div className="absolute inset-0 opacity-20">
                          {/* 简化的雷达图表示 */}
                          <div className="w-full h-full border-4 border-primary rounded-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border-4 border-primary rounded-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 h-2/5 border-4 border-primary rounded-full" />
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      继续评估
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl space-y-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                为什么选择我们的沟通能力提升平台？
              </h2>
              <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                科学的评估系统和个性化学习路径，让沟通能力提升变得高效而有趣。
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-2xl bg-background p-8 shadow-sm border border-border"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">科学评估</h3>
                  <p className="text-muted-foreground">
                    通过多维度评估，精准分析你的沟通优势和不足，为你提供个性化提升方案。
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-2xl bg-background p-8 shadow-sm border border-border"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">个性化学习</h3>
                  <p className="text-muted-foreground">
                    根据你的评估结果，定制专属学习路径，循序渐进提升各项沟通技能。
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="rounded-2xl bg-background p-8 shadow-sm border border-border"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">实践反馈</h3>
                  <p className="text-muted-foreground">
                    通过真实场景模拟练习，获取即时反馈，在实践中巩固和提升沟通能力。
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Link */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                灵活的提升方案
              </h2>
              <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                选择适合您的计划，获取专业的沟通能力评估和个性化学习资源。
              </p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/pricing')}
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg"
                >
                  查看详细方案
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                如何提升你的沟通能力？
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div 
                className="flex flex-col items-center p-6 rounded-xl bg-background shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <span className="text-xl">1️⃣</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">完成能力评估</h3>
                <p className="text-muted-foreground text-center">
                  选择适合你的评估类型，完成专业的沟通能力测试
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center p-6 rounded-xl bg-background shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <span className="text-xl">2️⃣</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">获取学习计划</h3>
                <p className="text-muted-foreground text-center">
                  根据评估结果，获取个性化的学习路径和提升建议
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center p-6 rounded-xl bg-background shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <span className="text-xl">3️⃣</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">练习与提升</h3>
                <p className="text-muted-foreground text-center">
                  通过场景模拟练习，不断提升沟通技巧，获取即时反馈
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Back to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
