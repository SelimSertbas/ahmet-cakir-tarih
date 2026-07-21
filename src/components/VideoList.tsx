import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Loading } from './ui/loading';
import { Video } from '@/types';

const PAGE_SIZE = 10;

export const VideoList: React.FC = () => {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-videos', page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        videos: (data ?? []).map((video) => ({
          ...video,
          video_id: video.id,
          status: video.status as 'draft' | 'published',
        })) as Video[],
        count: count ?? 0,
      };
    },
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Başarılı', description: 'Video başarıyla silindi' });
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-videos-count'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Video silinemedi', variant: 'destructive' });
    },
  });

  const handleDelete = (id: string) => {
    if (!window.confirm('Bu videoyu silmek istediğinizden emin misiniz?')) return;
    deleteMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: tr });
  };

  if (isLoading) {
    return <Loading text="Videolar yükleniyor..." />;
  }

  const videos = data?.videos ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-coffee-600 dark:text-coffee-400">
          Henüz video bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-coffee-500">{count} video</p>
      <div className="grid gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-coffee-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-coffee-900">{video.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-coffee-500">
                  <span>
                    Eklenme: {formatDate(video.created_at)}
                  </span>
                  <span>
                    Güncelleme: {formatDate(video.updated_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(video.video_url, '_blank')}
                  className="text-coffee-600 hover:text-coffee-800"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(video.id)}
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
