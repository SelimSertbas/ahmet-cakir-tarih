import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, User } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  name: string;
  email: string;
  question: string;
  answer: string | null;
  created_at: string;
  status: 'pending' | 'answered';
  likes?: number;
}

const SSS = [
  {
    q: 'Sorular ne zaman cevaplanır?',
    a: 'Sorular genellikle 1-3 gün içinde cevaplanır. Yoğunluğa göre değişebilir.'
  },
  {
    q: 'Sorduğum soruyu kimler görebilir?',
    a: 'Yalnızca uygun görülen ve yayınlanan sorular herkese açık olarak görünür.'
  },
  {
    q: 'Birden fazla soru sorabilir miyim?',
    a: 'Evet, ancak spam olmaması için arka arkaya çok fazla soru göndermemeye özen gösterin.'
  }
];

const Questions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'answered' | 'pending'>('all');
  const [sort, setSort] = useState<'new' | 'old'>('new');

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Filtrelenmiş ve sıralanmış sorular
  const filtered = useMemo(() => {
    if (!questions) return [];
    let arr = questions.filter(q =>
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.question.toLowerCase().includes(search.toLowerCase())
    );
    if (filter === 'answered') arr = arr.filter(q => q.status === 'answered');
    if (filter === 'pending') arr = arr.filter(q => q.status === 'pending');
    if (sort === 'old') arr = arr.slice().reverse();
    return arr;
  }, [questions, search, filter, sort]);

  // Skeleton loader
  const skeletons = Array.from({ length: 4 });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-content max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-4">
            Soru & Cevap
          </h1>
          {/* Filtre, Arama, Sıralama */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-coffee-700 text-white border-coffee-700 shadow' : 'bg-coffee-100 dark:bg-coffee-800 text-coffee-700 dark:text-coffee-200 border-coffee-200 dark:border-coffee-700 hover:bg-coffee-200 dark:hover:bg-coffee-700'}`}
                onClick={() => setFilter('all')}
              >Tümü</button>
            </div>
            <div className="relative flex-1 max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-coffee-500" size={18} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Sorularda ara..."
                className="w-full pl-10 pr-4 py-2 rounded-full border bg-coffee-50 dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-800 dark:text-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-400 transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${sort === 'new' ? 'bg-coffee-700 text-white border-coffee-700 shadow' : 'bg-coffee-100 dark:bg-coffee-800 text-coffee-700 dark:text-coffee-200 border-coffee-200 dark:border-coffee-700 hover:bg-coffee-200 dark:hover:bg-coffee-700'}`}
                onClick={() => setSort('new')}
              >En Yeni</button>
              <button
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${sort === 'old' ? 'bg-coffee-700 text-white border-coffee-700 shadow' : 'bg-coffee-100 dark:bg-coffee-800 text-coffee-700 dark:text-coffee-200 border-coffee-200 dark:border-coffee-700 hover:bg-coffee-200 dark:hover:bg-coffee-700'}`}
                onClick={() => setSort('old')}
              >En Eski</button>
            </div>
          </div>
          {/* Soru Kartları */}
          <div className="space-y-6">
            {isLoading
              ? skeletons.map((_, i) => (
                  <div key={i} className="animate-pulse bg-coffee-100 dark:bg-coffee-900/60 rounded-xl h-40" />
                ))
              : filtered.length === 0
              ? <div className="text-center py-8 text-coffee-600 dark:text-coffee-400">Aradığınız kriterlere uygun soru bulunamadı.</div>
              : filtered.map((question) => (
                <div
                  key={question.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Soru: ${question.title}`}
                  className="group bg-white dark:bg-coffee-900 rounded-2xl shadow-lg border border-coffee-100 dark:border-coffee-800 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.015] active:scale-95 cursor-pointer outline-none focus:ring-2 focus:ring-coffee-400"
                  onClick={() => navigate(`/questions/${question.id}`)}
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`/questions/${question.id}`); }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1 text-coffee-400 text-xs ml-auto"><Clock className="w-4 h-4" />{format(new Date(question.created_at), 'd MMM yyyy', { locale: tr })}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-coffee-400" />
                    <span className="text-coffee-700 dark:text-coffee-200 text-sm font-medium">{question.name}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-coffee-900 dark:text-coffee-100 mb-1 line-clamp-2">{question.title}</h2>
                </div>
              ))}
          </div>
          {/* SSS Bölümü (en alt) */}
          <div className="mt-16 bg-coffee-50 dark:bg-coffee-900/60 rounded-xl shadow p-6 border border-coffee-100 dark:border-coffee-800">
            <h2 className="text-lg font-semibold text-coffee-800 dark:text-coffee-100 mb-3">Sıkça Sorulan Sorular</h2>
            <ul className="space-y-2">
              {SSS.map((item, i) => (
                <li key={i}>
                  <span className="font-semibold text-coffee-700 dark:text-coffee-200">{item.q}</span>
                  <div className="text-coffee-600 dark:text-coffee-300 ml-2">{item.a}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Questions; 