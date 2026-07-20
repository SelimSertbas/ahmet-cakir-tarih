import React, { useState } from 'react';
import { VideoList } from '@/components/VideoList';
import { VideoForm } from '@/components/VideoForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArticleManagement } from '@/components/ArticleManagement';
import { Dashboard } from '@/components/Dashboard';
import type { Article } from '@/types';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { BarChart3, FileText, HelpCircle, Video, TrendingUp, X } from 'lucide-react';

interface Question {
  id: string;
  name: string;
  email: string;
  title: string;
  question: string;
  status: 'pending' | 'answered';
  created_at: string;
  answer: string | null;
  is_published: boolean;
}

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
  { key: 'articles', label: 'Yazılarım', icon: <FileText size={18} /> },
  { key: 'questions', label: 'Sorular', icon: <HelpCircle size={18} /> },
  { key: 'videos', label: 'Videolar', icon: <Video size={18} /> },
  { key: 'analytics', label: 'Detaylı Analiz', icon: <TrendingUp size={18} /> },
];

export const WriterPanel: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [videoListKey, setVideoListKey] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [articles] = useState<Article[]>([]);
  const [loading] = useState(false);
  const queryClient = useQueryClient();

  const { data: questions } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*');
      if (error) throw error;
      return data as Question[];
    },
  });

  const answerMutation = useMutation<void, Error, { questionId: string; answer: string; isPublished: boolean }>({
    mutationFn: async ({ questionId, answer, isPublished }) => {
      const { error } = await supabase
        .from('questions')
        .update({
          answer,
          status: 'answered',
          is_published: isPublished
        })
        .eq('id', questionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setSelectedQuestion(null);
    },
  });

  const deleteMutation = useMutation<void, Error, { questionId: string }>({
    mutationFn: async ({ questionId }) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setSelectedQuestion(null);
    },
  });

  const handleVideoSave = () => {
    setVideoListKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-coffee-900 border-r border-coffee-200 dark:border-coffee-800 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-coffee-900 dark:text-coffee-100">Yazar Paneli</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activePage === item.key
                    ? 'bg-coffee-100 dark:bg-coffee-800 text-coffee-900 dark:text-coffee-100'
                    : 'text-coffee-600 dark:text-coffee-400 hover:bg-coffee-50 dark:hover:bg-coffee-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'articles' && <ArticleManagement />}
        {activePage === 'videos' && (
          <div className="space-y-8">
            <VideoForm onSave={handleVideoSave} />
            <VideoList key={videoListKey} />
          </div>
        )}
        {activePage === 'questions' && (
          <div className="space-y-8">
            {selectedQuestion ? (
              <div className="max-w-2xl mx-auto bg-white dark:bg-coffee-900 rounded-lg p-6 shadow-md border border-coffee-200 dark:border-coffee-700">
                <h2 className="text-xl font-bold mb-4">Soru Detayı</h2>
                <div className="mb-2">
                  <span className="font-semibold">Ad Soyad: </span>{selectedQuestion.name}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Başlık: </span>{selectedQuestion.title}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Soru: </span>{selectedQuestion.question}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Tarih: </span>{new Date(selectedQuestion.created_at).toLocaleDateString('tr-TR')}
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Yanıt</label>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded"
                    value={selectedQuestion.answer || ''}
                    onChange={e => {
                      setSelectedQuestion({ ...selectedQuestion, answer: e.target.value });
                    }}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-coffee-800 text-gray-800 dark:text-coffee-100"
                    onClick={() => setSelectedQuestion(null)}
                  >İptal</button>
                  <button
                    className="px-4 py-2 rounded bg-coffee-700 text-white"
                    onClick={() => {
                      if (!selectedQuestion.answer || !selectedQuestion.answer.trim()) return;
                      answerMutation.mutate({
                        questionId: selectedQuestion.id,
                        answer: selectedQuestion.answer,
                        isPublished: true
                      });
                    }}
                  >Yanıtı Kaydet</button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {questions?.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white dark:bg-coffee-800 rounded-lg p-6 shadow-sm border border-coffee-200 dark:border-coffee-700 cursor-pointer hover:bg-coffee-50 dark:hover:bg-coffee-900/40 flex flex-col gap-2"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-coffee-900 dark:text-coffee-100">
                          {question.title}
                        </h3>
                        <p className="text-sm text-coffee-600 dark:text-coffee-400">
                          {question.name} • {new Date(question.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.status === 'answered'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {question.status === 'answered' ? 'Yanıtlandı' : 'Beklemede'}
                        </span>
                        <button
                          className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs"
                          onClick={e => {
                            e.stopPropagation();
                            if (window.confirm('Bu soruyu silmek istediğine emin misin?')) {
                              deleteMutation.mutate({ questionId: question.id });
                            }
                          }}
                        >Sil</button>
                      </div>
                    </div>
                    <p className="text-coffee-700 dark:text-coffee-300 mb-4">{question.question}</p>
                    {question.answer && (
                      <div className="mt-4 p-4 bg-coffee-50 dark:bg-coffee-900/50 rounded-lg">
                        <p className="text-coffee-800 dark:text-coffee-200">{question.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activePage === 'analytics' && <AnalyticsPanel articles={articles} loading={loading} />}
      </main>
    </div>
  );
};

export default WriterPanel; 