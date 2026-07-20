import React, { useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Youtube, PlayCircle } from 'lucide-react';
import { Loading } from '../components/ui/loading';
import { Link } from 'react-router-dom';

const VIDEOS_PER_PAGE = 12;

const getYoutubeThumbnail = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

// Robust YouTube video ID extractor
function extractVideoId(url: string): string {
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : '';
}

const Videos: React.FC = () => {
  const observer = useRef<IntersectionObserver>();

  // Infinite scroll query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching
  } = useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * VIDEOS_PER_PAGE;
      const to = from + VIDEOS_PER_PAGE - 1;
      
      const { data, error, count } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const processedVideos = data.map(video => ({
        ...video,
        video_id: extractVideoId(video.video_url)
      }));

      return {
        data: processedVideos,
        count,
        nextPage: processedVideos.length === VIDEOS_PER_PAGE ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    refetchOnWindowFocus: false,
  });

  // Intersection Observer for infinite scroll
  const lastVideoRef = useCallback((node: HTMLDivElement) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF6F2] to-[#F3EBE2] dark:from-coffee-900 dark:to-coffee-950">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content">
          <div className="flex items-center gap-3 mb-8">
            <Youtube className="h-8 w-8 text-coffee-800 dark:text-coffee-200" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100">
              Videolar
            </h1>
          </div>

          {/* Show loading animation when fetching initial data */}
          {isFetching && !isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <Loading text="Videolar yükleniyor..." />
            </div>
          )}

          {!isFetching && data?.pages[0]?.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-coffee-600 dark:text-coffee-400 text-lg">
                Henüz video bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.pages.map((page, i) => (
                page.data.map((video, index) => {
                  const isLastElement = i === data.pages.length - 1 && index === page.data.length - 1;
                  return (
                    <div
                      key={video.id}
                      ref={isLastElement ? lastVideoRef : undefined}
                    >
                      <Link
                        to={`/videos/${video.id}`}
                        className="block bg-white dark:bg-coffee-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 group"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={getYoutubeThumbnail(video.video_id)}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:brightness-90 transition"
                            loading="lazy"
                          />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg opacity-80 group-hover:scale-110 group-hover:opacity-100 transition" />
                          </span>
                        </div>
                        <div className="p-4">
                          <h2 className="text-xl font-medium text-coffee-900 dark:text-coffee-100 mb-2 line-clamp-2">
                            {video.title}
                          </h2>
                          <p className="text-sm text-coffee-500 dark:text-coffee-400">
                            {formatDate(video.created_at)}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ))}
            </div>
          )}

          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <Loading text="Daha fazla video yükleniyor..." />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Videos;
