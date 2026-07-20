import { useState, useMemo, useRef, useCallback } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { Search } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

const ARTICLES_PER_PAGE = 12;

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const observer = useRef<IntersectionObserver>();

  // Fetch all categories for filter with longer cache time
  const { data: allCategories } = useQuery({
    queryKey: ['article-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('category')
        .eq('type', 'article');
      if (error) throw error;
      return Array.from(new Set((data || []).map(a => a.category).filter(Boolean)));
    },
    staleTime: 60 * 60 * 1000, // 1 hour cache
    cacheTime: 24 * 60 * 60 * 1000, // 24 hour cache
  });

  // Infinite scroll query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching
  } = useInfiniteQuery({
    queryKey: ['articles', selectedCategory, search],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * ARTICLES_PER_PAGE;
      const to = from + ARTICLES_PER_PAGE - 1;
      
      let query = supabase
        .from('articles')
        .select('id, title, excerpt, category, image_url, published_at, type', { count: 'exact' })
        .eq('type', 'article')
        .order('published_at', { ascending: false })
        .range(from, to);

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { data, count, nextPage: data.length === ARTICLES_PER_PAGE ? pageParam + 1 : undefined };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    refetchOnWindowFocus: false,
  });

  // Reset infinite query when filters change
  useMemo(() => {
    setSelectedCategory('');
    setSearch('');
  }, [selectedCategory, search]);

  // Intersection Observer for infinite scroll
  const lastArticleRef = useCallback((node: HTMLDivElement) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-2">
            Yazılarım
          </h1>
          <p className="text-coffee-600 dark:text-coffee-300 mb-10">
            Tarih, kültür ve toplum üzerine detaylı araştırma ve incelemeler
          </p>
          
          {/* Modern Filters Card */}
          <div className="mb-10 bg-white dark:bg-coffee-900 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
              <button
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === ''
                    ? 'bg-coffee-700 text-white border-coffee-700 shadow'
                    : 'bg-coffee-100 dark:bg-coffee-800 text-coffee-700 dark:text-coffee-200 border-coffee-200 dark:border-coffee-700 hover:bg-coffee-200 dark:hover:bg-coffee-700'
                }`}
                onClick={() => setSelectedCategory('')}
              >
                Tümü
              </button>
              {allCategories?.map((cat: string) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-coffee-700 text-white border-coffee-700 shadow'
                      : 'bg-coffee-100 dark:bg-coffee-800 text-coffee-700 dark:text-coffee-200 border-coffee-200 dark:border-coffee-700 hover:bg-coffee-200 dark:hover:bg-coffee-700'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Search Box Modern */}
            <div className="relative flex-1 max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 dark:text-coffee-500" size={18} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Başlıkta ara..."
                className="w-full pl-10 pr-4 py-2 rounded-full border bg-coffee-50 dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700 text-coffee-800 dark:text-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-400 transition"
              />
            </div>
          </div>

          {/* Show loading animation when fetching initial data */}
          {isFetching && !isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <Loading text="Makaleler yükleniyor..." />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.pages.map((page, i) => (
              page.data.map((article, index) => {
                const isLastElement = i === data.pages.length - 1 && index === page.data.length - 1;
                return (
                  <div
                    key={article.id}
                    ref={isLastElement ? lastArticleRef : undefined}
                  >
                    <ArticleCard 
                      id={article.id}
                      title={article.title}
                      excerpt={article.excerpt}
                      category={article.category}
                      type={article.type}
                      date={new Date(article.published_at).toLocaleDateString('tr-TR')}
                      image={article.image_url}
                    />
                  </div>
                );
              })
            ))}
          </div>

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <Loading text="Daha fazla makale yükleniyor..." />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Articles;
