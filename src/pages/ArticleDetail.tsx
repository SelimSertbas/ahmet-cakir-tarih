import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loading } from '@/components/ui/loading';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Facebook, Twitter, Copy, MessageCircle, ArrowUp, Instagram, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { shareArticleAsStory } from '@/lib/storyImage';
import { useMemo, useRef, useState, useEffect } from 'react';

// Word/Quill yapıştırmalarından kalan art arda boş <p> bloklarını tek bir
// boşluğa indirger (ör. 10 tane üst üste <p><br></p> tek bir boşluğa iner).
const EMPTY_P_RE = /<p\b[^>]*>[\s\S]*?<\/p>/gi;

function isEmptyParagraph(p: string): boolean {
  const inner = p.replace(/^<p\b[^>]*>/i, '').replace(/<\/p>$/i, '');
  const stripped = inner
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<\/?strong>/gi, '')
    .replace(/<\/?em>/gi, '')
    .replace(/&nbsp;/gi, '')
    .replace(/\s/g, '');
  return stripped.length === 0;
}

function collapseEmptyParagraphs(html: string): string {
  let result = '';
  let lastIndex = 0;
  let lastWasEmpty = false;

  html.replace(EMPTY_P_RE, (match, offset: number) => {
    const between = html.slice(lastIndex, offset);
    result += between;
    if (between.trim().length > 0) lastWasEmpty = false;

    const empty = isEmptyParagraph(match);
    if (!(empty && lastWasEmpty)) {
      result += match;
    }
    lastWasEmpty = empty;
    lastIndex = offset + match.length;
    return match;
  });

  result += html.slice(lastIndex);
  return result;
}

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading } = useQuery<Article | null>(
    ['article', id],
    async () => {
      if (!id) throw new Error('Article ID is required');
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        throw error;
      }
      return data as Article;
    },
    {
      enabled: !!id
    }
  );

  // Önerilen makaleler — önce aynı kategori, yoksa en yeniler
  const { data: relatedArticles } = useQuery<Article[]>(
    ['related-articles', id, article?.category],
    async () => {
      let query = supabase
        .from('articles')
        .select('id, title, image_url, excerpt, category')
        .neq('id', id || '')
        .order('published_at', { ascending: false })
        .limit(4);

      if (article?.category) {
        query = query.eq('category', article.category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
    { enabled: !!id && !!article }
  );

  const formatDateSafe = (dateString: string | undefined) => {
    if (!dateString) return 'Belirtilmemiş';
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Geçersiz Tarih';
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const getReadingTime = (htmlContent: string | undefined) => {
    if (!htmlContent) return 1;
    const text = htmlContent.replace(/<[^>]+>/g, ' ');
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(wordCount / 200));
  };
  const readingTime = getReadingTime(article?.content);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Bağlantı kopyalandı!' });
    }
  };

  const [storyLoading, setStoryLoading] = useState(false);
  const handleStoryShare = async () => {
    if (!article || storyLoading) return;
    setStoryLoading(true);
    try {
      const result = await shareArticleAsStory(article);
      if (result === 'downloaded') {
        toast({
          title: 'Görsel indirildi',
          description: 'Instagram veya TikTok hikayenize yüklemek için galerinizden seçebilirsiniz.',
        });
      } else if (result === 'failed') {
        toast({ title: 'Görsel oluşturulamadı', variant: 'destructive' });
      }
    } finally {
      setStoryLoading(false);
    }
  };

  // İçindekiler (ToC) — sadece içerik değiştiğinde yeniden hesaplanır
  const toc = useMemo(() => {
    if (!article?.content) return [];
    const div = document.createElement('div');
    div.innerHTML = article.content;
    const headings = Array.from(div.querySelectorAll('h2, h3'));
    return headings.map((el, i) => ({
      id: el.id || `toc-heading-${i}`,
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }));
  }, [article?.content]);

  const contentWithAnchors = useMemo(() => {
    if (!article?.content) return '';
    const cleaned = collapseEmptyParagraphs(article.content);
    let idx = 0;
    return cleaned.replace(/<(h2|h3)([^>]*)>(.*?)<\/\1>/gi, (_, tag, attrs, text) => {
      const id = toc[idx]?.id || `toc-heading-${idx}`;
      idx++;
      return `<${tag} id="${id}"${attrs}>${text}</${tag}>`;
    });
  }, [article?.content, toc]);

  // Okuma ilerleme çubuğu + yukarı çık butonu: tek, throttle'lı scroll listener
  const articleRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShowTop(window.scrollY > 400);
        const el = articleRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
          setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [article?.id]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Makale görüntülendiğinde views alanını bir kez artır (id başına tek seferlik guard)
  const viewedIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!id || !article) return;
    if (viewedIdRef.current === id) return;
    viewedIdRef.current = id;

    supabase
      .from('articles')
      .update({ views: (article.views || 0) + 1 })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Views update error:', error);
      });
  }, [id, article]);

  if (isLoading) {
    return <Loading text="Makale yükleniyor..." />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-16">
          <div className="container-content max-w-4xl mx-auto">
            <p>Makale bulunamadı veya yüklenirken bir hata oluştu.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pageUrl = shareUrl;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F2] dark:bg-coffee-950">
      <Helmet>
        <title>{article.title} | Ahmet Çakır</title>
        <meta name="description" content={article.excerpt} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="og:url" content={pageUrl} />
        <meta property="article:published_time" content={article.published_at || article.created_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        {article.category && <meta property="article:section" content={article.category} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.excerpt,
            image: article.image_url ? [article.image_url] : undefined,
            datePublished: article.published_at || article.created_at,
            dateModified: article.updated_at,
            author: { '@type': 'Person', name: 'Ahmet Çakır' },
          })}
        </script>
      </Helmet>

      {/* Okuma ilerleme çubuğu — Navbar'ın (h-16) hemen altında sabit durur */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-transparent">
        <div
          className="h-full bg-coffee-600 dark:bg-coffee-400 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="container-content max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-10 lg:gap-14 items-start">
            {/* Ana içerik */}
            <div ref={articleRef} className="min-w-0">
              {/* Masthead */}
              <header className="mb-6">
                {article.category && (
                  <span className="inline-block bg-coffee-100 dark:bg-coffee-800 text-coffee-700 dark:text-coffee-200 text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 mb-4">
                    {article.category}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-4 leading-tight">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-lg sm:text-xl text-coffee-600 dark:text-coffee-300 leading-relaxed mb-5">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-coffee-500 dark:text-coffee-400 pb-5 border-b border-coffee-200 dark:border-coffee-800">
                  <span className="font-medium text-coffee-800 dark:text-coffee-200">Ahmet Çakır</span>
                  <span>•</span>
                  <span>{formatDateSafe(article.published_at)}</span>
                  <span>•</span>
                  <span>{readingTime} dk okuma</span>
                  <span className="ml-auto flex items-center gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-500 hover:text-blue-500 transition-colors"
                      title="X'te Paylaş"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-500 hover:text-blue-700 transition-colors"
                      title="Facebook'ta Paylaş"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-500 hover:text-green-600 transition-colors"
                      title="WhatsApp'ta Paylaş"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-500 hover:text-coffee-800 dark:hover:text-coffee-100 transition-colors"
                      title="Bağlantıyı Kopyala"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleStoryShare}
                      disabled={storyLoading}
                      className="p-1.5 rounded-full hover:bg-coffee-100 dark:hover:bg-coffee-800 text-coffee-500 hover:text-pink-600 transition-colors disabled:opacity-50"
                      title="Hikayede Paylaş (Instagram/TikTok)"
                    >
                      {storyLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Instagram className="w-4 h-4" />
                      )}
                    </button>
                  </span>
                </div>
              </header>

              {article.image_url && (
                <div className="w-full mb-8 rounded-lg overflow-hidden aspect-video bg-coffee-100 dark:bg-coffee-900">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <article
                className="prose max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: contentWithAnchors }}
              />

              {/* Mobilde İçindekiler ve Önerilen Makaleler içerik altında */}
              <div className="lg:hidden mt-10 space-y-8">
                {toc.length > 0 && (
                  <SidebarToc toc={toc} />
                )}
                {relatedArticles && relatedArticles.length > 0 && (
                  <SidebarRelated articles={relatedArticles} />
                )}
              </div>
            </div>

            {/* Sağ sidebar (masaüstü) */}
            <aside className="hidden lg:block sticky top-24 space-y-6">
              <div className="bg-white dark:bg-coffee-900 rounded-xl border border-coffee-200 dark:border-coffee-800 p-5">
                <div className="flex items-center gap-3">
                  <img
                    src="/lovable-uploads/14f96f6a-555f-4f61-a62e-21b4e346c9c7.png"
                    alt="Ahmet Çakır"
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover border border-coffee-200 dark:border-coffee-700"
                  />
                  <div>
                    <p className="font-semibold text-coffee-900 dark:text-coffee-100">Ahmet Çakır</p>
                    <p className="text-xs text-coffee-500 dark:text-coffee-400">Tarihçi, Yazar</p>
                  </div>
                </div>
              </div>

              {toc.length > 0 && <SidebarToc toc={toc} />}
              {relatedArticles && relatedArticles.length > 0 && (
                <SidebarRelated articles={relatedArticles} />
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <button
        onClick={handleBackToTop}
        className={`fixed bottom-8 right-8 z-40 bg-coffee-700 text-white p-3 rounded-full shadow-lg transition-opacity duration-200 hover:bg-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-400 ${showTop ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-label="Yukarı Çık"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

const SidebarToc: React.FC<{ toc: { id: string; text: string; level: number }[] }> = ({ toc }) => (
  <div className="bg-white dark:bg-coffee-900 rounded-xl border border-coffee-200 dark:border-coffee-800 p-5">
    <p className="font-semibold text-coffee-700 dark:text-coffee-200 mb-3 text-sm uppercase tracking-wider">
      İçindekiler
    </p>
    <ul className="space-y-1.5 text-sm">
      {toc.map((item) => (
        <li key={item.id} className={item.level === 3 ? 'ml-3' : ''}>
          <a
            href={`#${item.id}`}
            className="text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white transition-colors block py-0.5"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const SidebarRelated: React.FC<{ articles: Article[] }> = ({ articles }) => (
  <div className="bg-white dark:bg-coffee-900 rounded-xl border border-coffee-200 dark:border-coffee-800 p-5">
    <p className="font-semibold text-coffee-700 dark:text-coffee-200 mb-3 text-sm uppercase tracking-wider">
      Önerilen Makaleler
    </p>
    <div className="space-y-4">
      {articles.map((other) => (
        <Link
          to={`/articles/${other.id}`}
          key={other.id}
          className="flex gap-3 group"
        >
          {other.image_url && (
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-coffee-100 dark:bg-coffee-800">
              <img
                src={other.image_url}
                alt={other.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-sm font-medium text-coffee-800 dark:text-coffee-100 group-hover:text-coffee-600 dark:group-hover:text-coffee-300 transition-colors line-clamp-3">
            {other.title}
          </p>
        </Link>
      ))}
    </div>
  </div>
);

export default ArticleDetail;
