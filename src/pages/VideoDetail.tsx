import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Loading } from '../components/ui/loading';

interface Video {
  id: string;
  title: string;
  video_url: string;
  video_id: string;
  created_at: string;
  updated_at: string;
}

function extractVideoId(url: string): string {
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : '';
}

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id as string)
        .single();
      if (!error && data) {
        setVideo({ ...data, video_id: extractVideoId(data.video_url) });
      }
      setIsLoading(false);
    };
    fetchVideo();
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
  };

  if (isLoading) return <Loading text="Video yükleniyor..." />;
  if (!video) return <div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow py-16"><div className="container-content max-w-2xl mx-auto"><p>Video bulunamadı.</p></div></main><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FAF6F2] to-[#F3EBE2] dark:from-coffee-900 dark:to-coffee-950">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container-content max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft /> Geri Dön
          </Button>
          <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${video.video_id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-4">{video.title}</h1>
          <p className="text-coffee-600 dark:text-coffee-400 mb-2 text-sm">{formatDate(video.created_at)}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoDetail; 