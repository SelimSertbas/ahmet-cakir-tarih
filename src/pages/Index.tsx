import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { Button } from '../components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HistoricalImagesCarousel from '../components/HistoricalImagesCarousel';

const historicalImages = [
  { src: "/lovable-uploads/IMG-20250425-WA0069.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0068.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0067.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0066.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0065.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0064.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0063.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0062.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0061.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0060.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0059.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0058.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0057.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0056.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0055.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0054.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0053.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0052.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0051.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0050.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0049.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0048.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0047.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0046.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0045.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0044.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0043.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0042.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0041.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0040.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0039.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0038.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0037.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0036.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0035.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0034.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0033.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0032.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0031.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0030.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0029.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0028.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0027.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0026.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0025.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0024.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0023.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0022.jpg" },
  { src: "/lovable-uploads/IMG-20250425-WA0021.jpg" },
];

const Index: React.FC = () => {
  const { data: featuredArticles } = useQuery({
    queryKey: ['featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('type', 'article')
        .order('published_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col relative parchment-bg overflow-hidden">
      <Navbar />
      
      {/* Decorative elements */}
      <div className="pergament-decoration pergament-decoration-1"></div>
      <div className="pergament-decoration pergament-decoration-2"></div>
      <div className="pergament-decoration pergament-decoration-3"></div>
      <div className="pergament-decoration pergament-decoration-4"></div>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="container-content flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-4">
                Ahmet Çakır
              </h1>
              <p className="text-xl text-coffee-800 dark:text-coffee-200 mb-6">
                Tarihçi, Yazar, İçerik Üreticisi
              </p>
              <p className="text-coffee-700 dark:text-coffee-300 mb-8 max-w-lg">
                Tarih ve edebiyat konularında özgün makaleler, köşe yazıları 
                ve sosyal medya içerikleriyle geçmişten günümüze köprüler kuruyorum.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-coffee-700 hover:bg-coffee-800 dark:bg-coffee-600 dark:hover:bg-coffee-700">
                  <Link to="/articles">Yazılarım</Link>
                </Button>
                <Button asChild variant="outline" className="border-coffee-300 text-coffee-800 hover:bg-coffee-100 dark:border-coffee-700 dark:text-coffee-200 dark:hover:bg-coffee-800/50">
                  <Link to="/about">Hakkımda</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="/lovable-uploads/14f96f6a-555f-4f61-a62e-21b4e346c9c7.png" 
                alt="Ahmet Çakır" 
                className="rounded-lg shadow-lg max-w-full h-auto historical-border"
              />
            </div>
          </div>
        </div>

        {/* Historical Images Carousel */}
        <HistoricalImagesCarousel images={historicalImages} />

        {/* Featured Articles */}
        <section className="py-16 dark:bg-coffee-900/30">
          <div className="container-content">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-coffee-800 dark:text-coffee-200">
                Öne Çıkan Makaleler
              </h2>
              <Button asChild variant="link" className="text-coffee-700 dark:text-coffee-300">
                <Link to="/articles">Tümünü Gör</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles?.map(article => (
                <ArticleCard 
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  type={article.type}
                  date={new Date(article.published_at).toLocaleDateString('tr-TR')}
                  image={article.image_url}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
