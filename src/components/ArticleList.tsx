import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Article } from '@/types';

interface ArticleListProps {
  onEdit: (id: string) => void;
}

export const ArticleList = ({ onEdit }: ArticleListProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, excerpt, created_at, updated_at, status, image_url, category')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setArticles(data.map(article => ({
          ...article,
          status: article.status as "draft" | "published"
        })) as Article[]);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Hata",
        description: "Makaleler yüklenemedi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Makale başarıyla silindi",
      });

      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Hata",
        description: "Makale silinemedi",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: tr });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-coffee-600">Yükleniyor...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-coffee-600">Henüz makale bulunmuyor.</p>
        <Button
          onClick={() => onEdit('')}
          className="mt-4 bg-coffee-700 hover:bg-coffee-800 text-white"
        >
          Yeni Makale Oluştur
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => onEdit('')}
          className="bg-coffee-700 hover:bg-coffee-800 text-white"
        >
          Yeni Makale Oluştur
        </Button>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-coffee-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-coffee-900">{article.title}</h3>
                <p className="text-sm text-coffee-600 mt-1">{article.excerpt}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-coffee-500">
                  <span>
                    Oluşturulma: {formatDate(article.created_at)}
                  </span>
                  <span>
                    Güncelleme: {formatDate(article.updated_at)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`/articles/${article.id}`, '_blank')}
                  className="text-coffee-600 hover:text-coffee-800"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(article.id)}
                  className="text-coffee-600 hover:text-coffee-800"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
