import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Trash2, Eye } from 'lucide-react';
import { Loading } from './ui/loading';
import { Video } from '@/types';

export const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setVideos(data.map(video => ({
            ...video,
            video_id: video.id,
            status: video.status as "draft" | "published"
          })));
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu videoyu silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Video başarıyla silindi",
      });

      // Listeyi yenile
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Hata",
        description: "Video silinemedi",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: tr });
  };

  if (isLoading) {
    return <Loading text="Videolar yükleniyor..." />;
  }

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
    </div>
  );
}; 