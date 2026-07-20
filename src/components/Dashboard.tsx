import React from 'react';
import { FileText, Video, HelpCircle, Clock, Plus, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Dashboard stats (gerçek verilerle)
  const { data: totalArticles } = useQuery(['dashboard-articles-count'], async () => {
    const { count, error } = await supabase
      .from('articles')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  });
  const { data: totalVideos } = useQuery(['dashboard-videos-count'], async () => {
    const { count, error } = await supabase
      .from('videos')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  });
  const { data: totalQuestions } = useQuery(['dashboard-questions-count'], async () => {
    const { count, error } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  });
  const { data: pendingQuestions } = useQuery(['dashboard-pending-questions-count'], async () => {
    const { count, error } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');
    if (error) throw error;
    return count || 0;
  });
  // Son eklenenler
  const { data: lastQuestions } = useQuery(['dashboard-last-questions'], async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    return data || [];
  });
  // En çok okunan makaleler (örnek veri, gerçek veriyle değiştirilebilir)
  const { data: mostReadArticles } = useQuery(['dashboard-most-read-articles'], async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, views')
      .order('views', { ascending: false })
      .limit(3);
    if (error) throw error;
    return data || [];
  });

  return (
    <div className="space-y-8">
      {/* Dashboard istatistikleri ve son eklenenler */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#18120b] rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col items-center transition-shadow duration-200 text-white border border-coffee-800">
            <FileText className="w-8 h-8 text-white mb-2" />
            <div className="text-2xl font-bold text-white">{totalArticles ?? '...'}</div>
            <div className="text-white">Makale</div>
          </div>
          <div className="bg-[#18120b] rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col items-center transition-shadow duration-200 text-white border border-coffee-800">
            <Video className="w-8 h-8 text-white mb-2" />
            <div className="text-2xl font-bold text-white">{totalVideos ?? '...'}</div>
            <div className="text-white">Video</div>
          </div>
          <div className="bg-[#18120b] rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col items-center transition-shadow duration-200 text-white border border-coffee-800">
            <HelpCircle className="w-8 h-8 text-white mb-2" />
            <div className="text-2xl font-bold text-white">{totalQuestions ?? '...'}</div>
            <div className="text-white">Soru</div>
          </div>
          <div className="bg-[#18120b] rounded-xl shadow-md hover:shadow-lg p-6 flex flex-col items-center transition-shadow duration-200 text-white border border-coffee-800">
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-300 mb-2" />
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingQuestions ?? '...'}</div>
            <div className="text-white">Bekleyen Soru</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* En Çok Okunan Makaleler */}
          <div className="bg-[#18120b] rounded-xl shadow-md hover:shadow-lg p-6 transition-shadow duration-200 text-coffee-100 border border-coffee-800">
            <div className="font-semibold text-white mb-2">En Çok Okunan Makaleler</div>
            <ul className="space-y-1">
              {(mostReadArticles ?? []).map((a: any) => (
                <li key={a.id} className="text-white text-sm flex justify-between">
                  <span className="text-white">{a.title}</span>
                  <span className="text-xs text-white">{a.views} okunma</span>
                </li>
              ))}
            </ul>
          </div>
          {/* En Son Eklenen Kullanıcı Soruları */}
          <div className="bg-[#18120b] rounded-xl shadow-md hover:shadow-lg p-6 transition-shadow duration-200 text-coffee-100 border border-coffee-800">
            <div className="font-semibold text-white mb-2">En Son Eklenen Kullanıcı Soruları</div>
            <ul className="space-y-1">
              {(lastQuestions ?? []).map((q: any) => (
                <li key={q.id} className="text-white text-sm">{q.title}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-8">
          {/* Hızlı İşlemler */}
          <div className="bg-[#18120b] rounded-xl shadow-md hover:shadow-lg p-6 transition-shadow duration-200 text-coffee-100 border border-coffee-800">
            <h3 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h3>
            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-between bg-transparent border border-coffee-700 text-white hover:bg-coffee-800 rounded-xl font-medium py-4 px-6 transition-all duration-200 gap-2"
                onClick={() => navigate('/writer-panel?tab=articles')}
              >
                <span className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-white" />
                  Yeni Yazı
                </span>
                <ChevronRight className="w-5 h-5 text-white" />
              </Button>
              <Button
                className="w-full flex items-center justify-between bg-transparent border border-coffee-700 text-white hover:bg-coffee-800 rounded-xl font-medium py-4 px-6 transition-all duration-200 gap-2"
                onClick={() => navigate('/writer-panel?tab=videos')}
              >
                <span className="flex items-center">
                  <Video className="w-5 h-5 mr-2 text-white" />
                  Yeni Video
                </span>
                <ChevronRight className="w-5 h-5 text-white" />
              </Button>
              <Button
                className="w-full flex items-center justify-between bg-transparent border border-coffee-700 text-white hover:bg-coffee-800 rounded-xl font-medium py-4 px-6 transition-all duration-200 gap-2"
                onClick={() => navigate('/writer-panel?tab=questions')}
              >
                <span className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-white" />
                  Soruları Görüntüle
                </span>
                <ChevronRight className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 