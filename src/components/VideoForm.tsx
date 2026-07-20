import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { Loading } from './ui/loading';

interface VideoFormProps {
  onSave?: () => void;
  onSuccess?: () => void;
}

interface VideoFormData {
  title: string;
  video_url: string;
  video_id: string;
  type: string;
  created_at: string;
  updated_at: string;
  description: string;
  thumbnail_url: string;
  status?: "draft" | "published";
}

export const VideoForm: React.FC<VideoFormProps> = ({ onSave, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VideoFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: VideoFormData) => {
    if (!data.title.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir başlık girin",
        variant: "destructive",
      });
      return;
    }

    if (!data.video_url.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir video URL'si girin",
        variant: "destructive",
      });
      return;
    }

    // YouTube URL'sini video ID'sine dönüştür
    const videoId = extractVideoId(data.video_url);
    if (!videoId) {
      toast({
        title: "Hata",
        description: "Geçersiz YouTube URL'si",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const videoData = {
        title: data.title.trim(),
        video_url: data.video_url.trim(),
        video_id: videoId,
        type: 'video',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        description: data.description || '',
        thumbnail_url: data.thumbnail_url || '',
        status: data.status || 'draft'
      };

      const { error } = await supabase
        .from('videos')
        .insert([videoData]);
      
      if (error) {
        console.error('Error saving video:', error);
        throw error;
      }

      toast({
        title: "Başarılı",
        description: "Video başarıyla eklendi",
      });

      reset();
      onSave?.();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Hata",
        description: "Video eklenemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // YouTube URL'sinden video ID'sini çıkar
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) {
    return <Loading text="Video kaydediliyor..." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-coffee-700 mb-1">
            Video Başlığı *
          </label>
          <Input 
            {...register('title', { required: true })} 
            placeholder="Video başlığı"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">Başlık zorunludur</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee-700 mb-1">
            YouTube Video URL'si *
          </label>
          <Input 
            {...register('video_url', { required: true })} 
            placeholder="https://www.youtube.com/watch?v=..."
            className={errors.video_url ? 'border-red-500' : ''}
          />
          {errors.video_url && (
            <p className="text-red-500 text-sm mt-1">Video URL'si zorunludur</p>
          )}
          <p className="text-sm text-coffee-500 mt-1">
            Desteklenen formatlar: youtube.com/watch?v=..., youtu.be/...
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-coffee-700 hover:bg-coffee-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Ekleniyor...' : 'Video Ekle'}
          </Button>
        </div>
      </div>
    </form>
  );
}; 