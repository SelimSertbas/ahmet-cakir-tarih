import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/types';

interface ArticleListProps {
  onEdit: (id: string) => void;
}

const PAGE_SIZE = 10;

export const ArticleList = ({ onEdit }: ArticleListProps) => {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-articles', page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from('articles')
        .select('id, title, excerpt, created_at, updated_at, status, image_url, category', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        articles: (data ?? []).map((article) => ({
          ...article,
          status: article.status as 'draft' | 'published',
        })) as Article[],
        count: count ?? 0,
      };
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Başarılı', description: 'Makale başarıyla silindi' });
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-articles-count'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-most-read-articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics-articles'] });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Makale silinemedi', variant: 'destructive' });
    },
  });

  const handleDelete = (id: string) => {
    if (!window.confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) return;
    deleteMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: tr });
  };

  const articles = data?.articles ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

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
      <div className="flex justify-between items-center">
        <p className="text-sm text-coffee-500">{count} makale</p>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Önceki
          </Button>
          <span className="text-sm text-coffee-600">
            Sayfa {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Sonraki <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
