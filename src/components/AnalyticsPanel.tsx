import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ArticleStats {
  id: string;
  views: number;
  status: 'draft' | 'published';
  created_at: string;
}

export const AnalyticsPanel: React.FC = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['admin-analytics-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, views, status, created_at')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as ArticleStats[];
    },
  });

  if (isLoading) {
    return <div className="text-center text-coffee-400 py-12">Yükleniyor...</div>;
  }

  const list = articles ?? [];
  const totalViews = list.reduce((sum, a) => sum + (a.views || 0), 0);
  const published = list.filter((a) => a.status === 'published').length;
  const draft = list.filter((a) => a.status === 'draft').length;
  const byMonth: Record<string, number> = {};
  list.forEach((a) => {
    const d = new Date(a.created_at);
    const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  });
  const months = Object.keys(byMonth).sort();

  return (
    <div className="bg-coffee-900 dark:bg-coffee-950 rounded-xl shadow p-6 border border-coffee-800">
      <h2 className="text-2xl font-bold text-white mb-6">Detaylı Analiz</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#18120b] rounded-xl p-6 shadow border border-coffee-800">
          <h3 className="text-lg font-semibold text-white mb-4">Makale Okunma Grafiği</h3>
          <div className="h-64 flex flex-col items-center justify-center text-coffee-100">
            <div className="text-4xl font-bold mb-2">{totalViews}</div>
            <div className="text-coffee-400">Toplam Okunma</div>
            <div className="mt-4 text-coffee-400 text-sm">{list.length} makale</div>
          </div>
        </div>
        <div className="bg-[#18120b] rounded-xl p-6 shadow border border-coffee-800">
          <h3 className="text-lg font-semibold text-white mb-4">Yayınlanma Durumu</h3>
          <div className="h-64 flex flex-col items-center justify-center text-coffee-100">
            <div className="text-3xl font-bold">{published}</div>
            <div className="text-coffee-400 mb-4">Yayında</div>
            <div className="text-3xl font-bold">{draft}</div>
            <div className="text-coffee-400">Taslak</div>
          </div>
        </div>
      </div>
      <div className="bg-[#18120b] rounded-xl p-6 shadow border border-coffee-800 mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Tarihe Göre Makale Yayınlanma</h3>
        <div className="h-64 flex flex-col items-center justify-center text-coffee-100">
          {months.length === 0 ? (
            <div className="text-coffee-400">Veri yok</div>
          ) : (
            <ul className="w-full max-w-md mx-auto overflow-y-auto max-h-64">
              {months.map((m) => (
                <li key={m} className="flex justify-between border-b border-coffee-800 py-1">
                  <span>{m}</span>
                  <span>{byMonth[m]} makale</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
