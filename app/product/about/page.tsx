import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <div className="w-full max-w-6xl px-4 py-16 md:px-6">
        <div className="space-y-12">
          <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          关于沟通大师
        </h1>
        <p className="text-xl text-gray-600">
          让沟通能力提升变得高效且触手可及
        </p>
      </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              我们相信沟通能力是每个人都可以掌握的核心技能。沟通大师通过创新的AI驱动工具和个性化学习体验，帮助用户有效提升沟通能力，建立更优质的人际关系。
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              利用先进的人工智能技术，我们创建了直观的学习方法，通过科学评估、个性化训练和实时反馈，让沟通能力提升更加高效和实用。
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">How Our AI Learning Tools Work</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-violet-100">
                <CardContent className="p-8 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold">能力评估</h3>
              <p className="text-gray-600">
                我们的AI系统通过多维度评估，分析您当前的沟通能力水平和特点，识别优势与改进空间。
              </p>
                </CardContent>
              </Card>
              <Card className="border-violet-100">
                <CardContent className="p-8 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold">个性化计划</h3>
              <p className="text-gray-600">
                基于评估结果，我们为您量身定制个性化学习计划，聚焦您最需要提升的沟通技能。
              </p>
                </CardContent>
              </Card>
              <Card className="border-violet-100">
                <CardContent className="p-8 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 text-xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold">实践训练</h3>
              <p className="text-gray-600">
                通过AI模拟对话、场景练习和实时反馈，帮助您在安全的环境中提升沟通能力。
              </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">为什么选择沟通大师？</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              在当今社会，良好的沟通能力是个人和职业成功的关键。通过沟通大师，您可以：
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-600">
              <li>提升自信，在各种场合进行清晰有效的表达</li>
              <li>增强倾听和理解能力，建立更好的人际关系</li>
              <li>掌握不同场景下的沟通技巧，适应各种社交和职场环境</li>
              <li>通过AI驱动的个性化训练，实现快速进步</li>
              <li>获得专业反馈和建议，持续改进沟通方式</li>
              <li>在个人生活和职业发展中取得更大成功</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Learning Plans</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-gray-200">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Free Plan</h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">Free</span>
              </div>
              <p className="text-gray-600">
                开始使用我们的基础沟通能力提升工具。适合希望探索沟通基础技能的初学者。
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>基础沟通能力评估</li>
                <li>简单的沟通技巧指南</li>
                <li>基础AI对话练习</li>
                <li>无需注册即可使用</li>
              </ul>
                </CardContent>
              </Card>
              <Card className="border-violet-200 bg-violet-50">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-violet-900">Premium Plan</h3>
                <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium">Paid</span>
              </div>
              <p className="text-gray-600">
                解锁我们AI的全部潜力，获得全面的沟通能力提升解决方案。
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>高级多维度沟通能力评估</li>
                <li>个性化学习计划定制</li>
                <li>无限AI对话练习和场景模拟</li>
                <li>专业沟通技巧知识库</li>
                <li>优先客户支持</li>
                <li>保存和跟踪学习进度</li>
              </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-6 bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900">Contact & Support</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
                对我们的沟通能力提升工具还有疑问或需要帮助？我们的团队随时为您提供支持，帮助您在提升沟通能力的道路上取得成功。
              </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Get in Touch</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-violet-600 font-semibold">Email:</span>
                    <a href="mailto:support@沟通大师.com" className="text-violet-600 hover:text-violet-700 underline">
                    support@沟通大师.com
                  </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-violet-600 font-semibold">Website:</span>
                    <a href="https://沟通大师.com" className="text-violet-600 hover:text-violet-700 underline">
                    沟通大师.com
                  </a>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Quick Links</h3>
                <div className="space-y-2">
                  <div>
                    <Link href="/privacy" className="text-gray-600 hover:text-violet-600">Privacy Policy</Link>
                  </div>
                  <div>
                    <Link href="/terms" className="text-gray-600 hover:text-violet-600">Terms of Use</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-center pt-8">
            <Button asChild size="lg" className="h-12 px-8 text-lg bg-violet-600 hover:bg-violet-700">
              <Link href="/">Start Learning Chinese Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}