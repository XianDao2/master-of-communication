"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Search, Clock, Info, AlertTriangle } from "lucide-react";
import { SearchHistoryRecord } from "@/utils/search-history-utils";
import { createClient } from "@/utils/supabase/client";

interface SearchHistoryDetailProps {
  params: {
    id: string;
  };
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const getSearchTypeLabel = (searchType: string) => {
  return 'Search';
};

const getSearchTypeColor = (searchType: string) => {
  return 'bg-gray-100 text-gray-700';
};

const SearchHistoryDetail = () => {
  const router = useRouter();
  const params = useParams() as { id: string };
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [historyDetail, setHistoryDetail] = useState<SearchHistoryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
      return;
    }

    if (user && params.id) {
      fetchHistoryDetail();
    }
  }, [user, loading, params.id, router]);

  const fetchHistoryDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      
      // 获取搜索历史详情
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user!.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      setHistoryDetail(data);
    } catch (err) {
      console.error('Failed to fetch history detail:', err);
      setError('无法加载搜索历史详情，请稍后再试。');
      toast({
        title: "加载失败",
        description: "无法加载搜索历史详情，请稍后再试。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container px-4 md:px-6 py-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/profile')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </div>
        </div>
        
        {/* Loading */}
        <div className="container px-4 md:px-6 py-8">
          <div className="max-w-3xl mx-auto flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !historyDetail) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container px-4 md:px-6 py-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/profile')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </div>
        </div>
        
        {/* Error */}
        <div className="container px-4 md:px-6 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">无法找到记录</h3>
                <p className="text-muted-foreground mb-6">
                  {error || "搜索历史记录不存在或已被删除"}
                </p>
                <Button onClick={() => router.push('/profile')}>
                  返回个人资料
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/profile')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">搜索历史详情</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Search Query Card */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{historyDetail.search_query}</CardTitle>
                <Badge className={getSearchTypeColor(historyDetail.search_type)}>
                  {getSearchTypeLabel(historyDetail.search_type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(historyDetail.metadata?.search_date || new Date().toISOString())}</span>
                </div>
                {historyDetail.metadata?.results_count && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span>{historyDetail.metadata.results_count} 条结果</span>
                  </div>
                )}
              </div>
              
              {/* Additional Info */}
              {historyDetail.metadata?.additional_info && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">详细信息</h4>
                      <p className="text-sm text-muted-foreground">
                        {historyDetail.metadata.additional_info}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Search Results Card */}
          {historyDetail.search_results && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">搜索结果</CardTitle>
                <CardDescription>
                  本次搜索返回的结果
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 移除了pronunciation和famous-people相关的特殊展示 */}
                {/* 其他类型搜索结果的JSON展示 */}
                <div className="bg-muted/30 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(historyDetail.search_results, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/profile')}
            >
              返回历史列表
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHistoryDetail;