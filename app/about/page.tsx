"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Users, Globe, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">关于我们</h1>
              <p className="text-sm text-muted-foreground">
                了解我们的使命和故事
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <span className="mr-2">💬</span>
              提升沟通能力，改变人生轨迹
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              专业的
              <br />
              <span className="text-primary">沟通能力提升平台</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              我们相信沟通能力是成功的关键 - 它连接人与人之间的理解，
              反映个人的思维深度，是实现个人和职业目标的重要桥梁。
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>我们的使命</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  通过科学的评估方法和个性化的学习路径，帮助每个人提升沟通能力，
                  在个人生活和职业生涯中实现更大的成功和满足感。
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>学习社区</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  我们已经帮助成千上万的用户提升了沟通技能，建立了积极互动的学习社区，
                  让大家在实践中互相学习和成长。
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>专业影响</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  从职场新人到企业高管，从学生到专业人士，
                  我们的平台为各行各业的人们提供专业的沟通能力提升解决方案。
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                我们的故事
              </h3>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  沟通大师源于一个简单的观察：在当今竞争激烈的社会中，许多人的职业发展和个人关系
                  因为沟通能力不足而受到限制，但找到有效的沟通能力提升方法却并不容易。
                </p>
                <p>
                  有效沟通是一门科学与艺术的结合，它不仅关乎表达能力，还涉及倾听技巧、情感智能
                  和情境适应能力。我们的平台结合了心理学研究、语言学分析和现代AI技术，
                  为用户提供科学、系统且个性化的沟通能力提升方案。
                </p>
                <p>
                  无论你是刚踏入职场的新人，还是希望进一步提升领导力的管理者，
                  无论你想改善人际关系，还是增强演讲和谈判能力，我们都能为你提供
                  专业的指导和个性化的学习路径，帮助你在各种场合中实现有效的沟通。
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">我们的价值观</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                这些原则指导着我们所做的一切
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">科学专业</h4>
                  <p className="text-muted-foreground">
                    我们的方法基于心理学、语言学和沟通学的最新研究，
                    确保评估和训练的科学性和有效性。
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">个性化定制</h4>
                  <p className="text-muted-foreground">
                    我们相信每个人的沟通风格和需求都是独特的，
                    提供量身定制的解决方案是最有效的提升方式。
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">实践导向</h4>
                  <p className="text-muted-foreground">
                    我们注重实际应用和实践训练，
                    帮助用户在真实场景中有效地运用所学的沟通技巧。
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">支持成长</h4>
                  <p className="text-muted-foreground">
                    我们不仅提供工具和方法，还建立支持社区，
                    让用户在成长过程中始终有人陪伴和指导。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12"
          >
            <h3 className="text-2xl font-bold mb-4">准备好提升你的沟通能力了吗？</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              加入成千上万已经提升沟通能力的用户行列。
              立即开始你的沟通能力评估，开启个性化的提升之旅。
            </p>
            <Button asChild size="lg" className="font-medium">
              <Link href="/">
                立即开始
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}