import React, { useMemo, useRef, useCallback, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Youtube, PlayCircle, Search, X } from 'lucide-react';
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

interface VideoItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  status: string;
  type: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  video_id: string;
}

const VideoCard: React.FC<{ video: VideoItem; innerRef?: (node: HTMLDivElement) => void }> = ({ video, innerRef }) => {
  const formattedDate = format(new Date(video.created_at), 'd MMMM yyyy', { locale: tr });
  return (
    <div ref={innerRef}>
      <Link
        to={`/videos/${video.id}`}
        className="block bg-white dark:bg-coffee-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-coffee-100 dark:border-coffee-700"
      >
        <div className="relative aspect-video overflow-hidden bg-coffee-100 dark:bg-coffee-900">
          <img
            src={getYoutubeThumbnail(video.video_id)}
            alt={video.title}
            className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-14 h-14 text-white drop-shadow-lg opacity-90 group-hover:scale-125 group-hover:opacity-100 transition-transform duration-300" />
          </span>
          {video.type && (
            <span className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-medium uppercase tracking-wide px-2 py-1 rounded-full backdrop-blur-sm">
              {video.type}
            </span>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-medium text-coffee-900 dark:text-coffee-100 mb-1.5 line-clamp-2 group-hover:text-coffee-700 dark:group-hover:text-coffee-300 transition-colors">
            {video.title}
          </h2>
          <p className="text-sm text-coffee-500 dark:text-coffee-400">
            {formattedDate}
          </p>
        </div>
      </Link>
    </div>
  );
};

const Videos: React.FC = () => {
  const observer = useRef<IntersectionObserver>();
  const [search, setSearch] = useState('');

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

  const allVideos = useMemo(
    () => (data?.pages.flatMap((page) => page.data) ?? []) as VideoItem[],
    [data]
  );

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;
  const filteredVideos = useMemo(() => {
    if (!isSearching) return [];
    return allVideos.filter((v) => v.title.toLowerCase().includes(query));
  }, [allVideos, query, isSearching]);

  const heroVideo = !isSearching ? allVideos[0] : undefined;
  const gridVideos = isSearching ? filteredVideos : allVideos.slice(1);

  // Intersection Observer for infinite scroll
  const lastVideoRef = useCallback((node: HTMLDivElement) => {
    if (isFetchingNextPage || isSearching) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage, isSearching]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF6F2] to-[#F3EBE2] dark:from-coffee-900 dark:to-coffee-950">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="container-content">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Youtube className="h-8 w-8 text-coffee-800 dark:text-coffee-200" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100">
                Videolar
              </h1>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-coffee-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Video ara..."
                className="w-full pl-9 pr-9 py-2 rounded-full border border-coffee-200 dark:border-coffee-700 bg-white dark:bg-coffee-800 text-coffee-900 dark:text-coffee-100 placeholder:text-coffee-400 focus:outline-none focus:ring-2 focus:ring-coffee-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-700 dark:hover:text-coffee-200"
                  aria-label="Aramayı temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Show loading animation when fetching initial data */}
          {isFetching && !isFetchingNextPage && allVideos.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <Loading text="Videolar yükleniyor..." />
            </div>
          )}

          {!isFetching && allVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-coffee-600 dark:text-coffee-400 text-lg">
                Henüz video bulunmuyor.
              </p>
            </div>
          ) : isSearching && filteredVideos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-coffee-600 dark:text-coffee-400 text-lg">
                "{search}" için sonuç bulunamadı.
              </p>
            </div>
          ) : (
            <>
              {/* Öne Çıkan / En Yeni Video */}
              {heroVideo && (
                <Link
                  to={`/videos/${heroVideo.id}`}
                  className="group block mb-10 rounded-2xl overflow-hidden shadow-xl border border-coffee-100 dark:border-coffee-700 bg-white dark:bg-coffee-800"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative aspect-video bg-coffee-100 dark:bg-coffee-900 overflow-hidden">
                      <img
                        src={getYoutubeThumbnail(heroVideo.video_id)}
                        alt={heroVideo.title}
                        className="w-full h-full object-cover group-hover:brightness-75 transition duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-20 h-20 text-white drop-shadow-lg opacity-90 group-hover:scale-125 group-hover:opacity-100 transition-transform duration-300" />
                      </span>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <span className="inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-wider text-coffee-600 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-700 rounded-full px-3 py-1 mb-4">
                        En Yeni Video
                      </span>
                      <h2 className="text-2xl md:text-3xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-3 group-hover:text-coffee-700 dark:group-hover:text-coffee-300 transition-colors">
                        {heroVideo.title}
                      </h2>
                      {heroVideo.description && (
                        <p className="text-coffee-600 dark:text-coffee-400 mb-4 line-clamp-3">
                          {heroVideo.description}
                        </p>
                      )}
                      <p className="text-sm text-coffee-500 dark:text-coffee-400">
                        {formatDate(heroVideo.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {gridVideos.map((video, index) => {
                  const isLastElement = !isSearching && index === gridVideos.length - 1;
                  return (
                    <VideoCard
                      key={video.id}
                      video={video}
                      innerRef={isLastElement ? lastVideoRef : undefined}
                    />
                  );
                })}
              </div>
            </>
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
