import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loading } from '@/components/ui/loading';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Facebook, Twitter, Copy, MessageCircle, Instagram, ArrowUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useMemo, useState, useEffect } from 'react';

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

  // Diğer makaleler
  const { data: otherArticles } = useQuery<Article[]>(
    ['other-articles', id],
    async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, image_url, excerpt')
        .neq('id', id || '')
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as Article[];
    },
    { enabled: !!id }
  );

  const formatDateSafe = (dateString: string | undefined) => {
    if (!dateString) return 'Belirtilmemiş';
    try {
      return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: tr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Geçersiz Tarih';
    }
  };

  // Social share handlers
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Reading time calculation
  const getReadingTime = (htmlContent: string | undefined) => {
    if (!htmlContent) return 1;
    // Remove HTML tags and count words
    const text = htmlContent.replace(/<[^>]+>/g, ' ');
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(wordCount / 200)); // 200 kelime/dk
  };
  const readingTime = getReadingTime(article?.content);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Bağlantı kopyalandı!' });
    }
  };

  // Table of Contents (ToC) extraction
  const toc = useMemo(() => {
    if (!article?.content) return [];
    const div = document.createElement('div');
    div.innerHTML = article.content;
    const headings = Array.from(div.querySelectorAll('h2, h3, strong'));
    return headings.map((el, i) => ({
      id: el.id || `toc-heading-${i}`,
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
      tag: el.tagName,
    }));
  }, [article?.content]);

  // Add ids to headings in content for anchor links (h2, h3, strong)
  const contentWithAnchors = useMemo(() => {
    if (!article?.content) return '';
    let idx = 0;
    return article.content
      .replace(/<(h2|h3)([^>]*)>(.*?)<\/\1>/gi, (_, tag, attrs, text) => {
        const id = toc[idx]?.id || `toc-heading-${idx}`;
        idx++;
        return `<${tag} id="${id}"${attrs}>${text}</${tag}>`;
      })
      .replace(/<strong([^>]*)>(.*?)<\/strong>/gi, (_, attrs, text) => {
        const id = toc[idx]?.id || `toc-heading-${idx}`;
        idx++;
        return `<strong id="${id}"${attrs}>${text}</strong>`;
      });
  }, [article?.content, toc]);

  // ToC modal state
  const [tocOpen, setTocOpen] = useState(false);

  // Back to Top button state
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sticky author card state
  const [shrinkAuthor, setShrinkAuthor] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShrinkAuthor(window.scrollY > 180);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Makale görüntülendiğinde views alanını artır
  useEffect(() => {
    async function incrementViews() {
      if (id && article) {
        const { error: updateError } = await supabase
          .from('articles')
          .update({ views: (article.views || 0) + 1 })
          .eq('id', id);
        if (updateError) {
          console.error('Views update error:', updateError);
        }
      }
    }
    incrementViews();
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF6F2] to-[#F3EBE2] dark:from-coffee-900 dark:to-coffee-950 relative overflow-x-hidden">
      {/* SVG Noise Pattern Background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-20" aria-hidden="true">
        <svg width="100%" height="100%" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-content max-w-3xl mx-auto relative">
          {/* ToC Button */}
          {toc.length > 0 && (
            <button
              className="fixed top-24 right-6 z-40 bg-white/90 dark:bg-coffee-900/90 border border-coffee-200 dark:border-coffee-800 shadow-lg rounded-full px-5 py-2 text-coffee-700 dark:text-coffee-200 font-semibold hover:bg-coffee-100 dark:hover:bg-coffee-800 transition-all"
              onClick={() => setTocOpen(true)}
            >
              İçindekiler
            </button>
          )}

          {/* ToC Modal */}
          {tocOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setTocOpen(false)}>
              <div
                className="bg-white dark:bg-coffee-900 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-auto border border-coffee-100 dark:border-coffee-800 relative"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-coffee-400 hover:text-coffee-700 dark:hover:text-coffee-200 text-xl font-bold"
                  onClick={() => setTocOpen(false)}
                  aria-label="Kapat"
                >
                  ×
                </button>
                <div className="font-bold text-coffee-700 dark:text-coffee-200 mb-2 text-sm uppercase tracking-wider">İçindekiler</div>
                <ul className="space-y-1">
                  {toc.map(item => (
                    <li key={item.id} className={item.level === 2 ? 'ml-0' : 'ml-4'}>
                      <a
                        href={`#${item.id}`}
                        className="text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-white text-sm transition-colors block py-1 px-2 rounded hover:bg-coffee-100 dark:hover:bg-coffee-800"
                        onClick={e => {
                          e.preventDefault();
                          setTocOpen(false);
                          const el = document.getElementById(item.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        {item.text}
                        {item.tag === 'STRONG' && <span className="ml-1 text-xs text-coffee-400">(vurgulu)</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-3 mb-6 items-center justify-end">
            <span className="text-coffee-500 text-sm mr-auto">Paylaş:</span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-coffee-100 dark:bg-coffee-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200 text-blue-500 hover:scale-110 active:scale-95"
              title="X'te Paylaş"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-coffee-100 dark:bg-coffee-800 hover:bg-blue-200 dark:hover:bg-blue-900 transition-all duration-200 text-blue-700 hover:scale-110 active:scale-95"
              title="Facebook'ta Paylaş"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-coffee-100 dark:bg-coffee-800 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200 text-green-600 hover:scale-110 active:scale-95"
              title="WhatsApp'ta Paylaş"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href={`https://www.instagram.com/direct/new/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-coffee-100 dark:bg-coffee-800 hover:bg-pink-100 dark:hover:bg-pink-900 transition-all duration-200 text-pink-500 hover:scale-110 active:scale-95"
              title="Instagram'da Paylaş"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <button
              onClick={handleCopy}
              className="p-2 rounded-full bg-coffee-100 dark:bg-coffee-800 hover:bg-coffee-200 dark:hover:bg-coffee-700 transition-all duration-200 text-coffee-700 dark:text-coffee-200 hover:scale-110 active:scale-95"
              title="Bağlantıyı Kopyala"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>

          <article className="prose prose-coffee max-w-none dark:prose-invert prose-lg lg:prose-xl">
            <h1 className="text-4xl font-serif text-coffee-900 dark:text-coffee-100 mb-4">
              {article.title}
            </h1>

            {/* Author Info Card */}
            <div className={`flex items-center gap-4 bg-white/80 dark:bg-coffee-900/80 rounded-xl shadow-md p-4 mb-8 transition-all duration-500 sticky top-4 z-20 ${shrinkAuthor ? 'scale-90 opacity-90 shadow-lg' : ''}` }>
              <img
                src={'/lovable-uploads/14f96f6a-555f-4f61-a62e-21b4e346c9c7.png'}
                alt={'Ahmet Çakır'}
                className="w-14 h-14 rounded-full object-cover border-2 border-coffee-200 dark:border-coffee-700 shadow"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-coffee-800 dark:text-coffee-100 text-lg">
                    Ahmet Çakır
                  </span>
                  <span className="text-xs text-coffee-400 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-800 rounded px-2 py-0.5 ml-2">
                    {formatDateSafe(article.published_at)}
                  </span>
                  <span className="text-xs text-coffee-400 dark:text-coffee-300 ml-2">• {readingTime} dk okuma</span>
                </div>
                <p className="text-coffee-600 dark:text-coffee-300 text-sm mt-1">
                  Tarihçi, Yazar, İçerik Üreticisi
                </p>
              </div>
            </div>

            {/* Article Card */}
            <div className="bg-white/90 dark:bg-coffee-900/90 rounded-2xl shadow-2xl p-8 transition-all duration-500 hover:shadow-3xl group relative overflow-hidden hover:scale-[1.025] active:scale-95">
              {article.image_url && (
                <div className="relative w-full mb-8 rounded-lg overflow-hidden aspect-video">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-coffee-900/60 via-transparent to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
                </div>
              )}
              <div className="text-coffee-600 dark:text-coffee-300 text-lg mb-8">
                {article.excerpt}
              </div>
              <div
                className="text-coffee-800 dark:text-coffee-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contentWithAnchors }}
              />
            </div>
          </article>

          {/* Diğer Makalelere Göz At */}
          {otherArticles && otherArticles.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-coffee-800 dark:text-coffee-100">Diğer Makalelere Göz At</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherArticles.map((other) => (
                  <Link to={`/articles/${other.id}`} key={other.id} className="block bg-white dark:bg-coffee-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="transition-transform duration-300 hover:scale-105 active:scale-95">
                      {other.image_url && (
                        <img src={other.image_url} alt={other.title} className="w-full h-40 object-cover" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-coffee-900 dark:text-coffee-100 mb-2">{other.title}</h3>
                      <p className="text-coffee-700 dark:text-coffee-300 text-sm line-clamp-3">{other.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      {/* Back to Top Button */}
      <button
        onClick={handleBackToTop}
        className={`fixed bottom-8 right-8 z-50 bg-coffee-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-coffee-900 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-coffee-400 ${showTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        aria-label="Yukarı Çık"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ArticleDetail;
