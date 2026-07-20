import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import ImageUploader from './ImageUploader';
import ContentEditor from './ContentEditor';
// import { getCurrentUser } from '@/lib/auth'; // Temporarily comment out

interface ArticleFormProps {
  articleId?: string;
  onSave?: () => void;
}

interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  status: "draft" | "published";
  type: string;
  published_at: string | undefined;
  updated_at: string;
  author_id: string; 
}

export const ArticleForm = ({ articleId, onSave }: ArticleFormProps) => {
  // const currentUser = getCurrentUser(); // Temporarily comment out
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ArticleFormData>({
    defaultValues: {
      title: '',
      excerpt: '',
      category: '',
      status: 'draft',
      type: 'article',
      image_url: '',
      author_id: 'temp_author_id' // Placeholder author_id
    }
  });
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single();
        
        if (error) throw error;

        if (data) {
          reset({
            title: data.title || '',
            excerpt: data.excerpt || '',
            category: data.category || '',
            status: (data.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
            content: data.content || '',
            image_url: data.image_url || '',
            type: data.type || '',
            published_at: data.published_at || undefined,
            updated_at: data.updated_at || '',
            author_id: data.author_id || 'temp_author_id' 
          });
          setContent(data.content || '');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        toast({
          title: "Hata",
          description: "Makale yüklenemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
    };

    loadArticle();
  }, [articleId, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    if (!data.title.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir başlık girin",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) { // Check content state directly
      toast({
        title: "Hata",
        description: "Lütfen içerik girin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const articleData: any = {
        ...data, 
        content: content.trim(), 
        updated_at: now,
        created_at: now,
        author_id: "550e8400-e29b-41d4-a716-446655440000"
      };
      if (articleData.status === 'published') {
        articleData.published_at = now;
      }

      if (articleId) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);
        
        if (error) throw error;
      }

      toast({
        title: "Başarılı",
        description: `Makale başarıyla ${articleId ? 'güncellendi' : 'oluşturuldu'}`,
      });

      onSave?.();
    } catch (error) {
      console.error('Error saving article:', error);
      toast({
        title: "Hata",
        description: "Makale kaydedilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = (url: string) => {
    setValue('image_url', url);
  };

  const submitWithStatus = (status: 'draft' | 'published') => {
    setValue('status', status);
    // handleSubmit(onSubmit)(); // Programmatically submit after setting status
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-coffee-700 mb-1">
            Başlık *
          </label>
          <Input 
            {...register('title', { required: true })} 
            placeholder="Makale başlığı"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">Başlık zorunludur</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee-700 mb-1">
            Özet
          </label>
          <Input 
            {...register('excerpt')} 
            placeholder="Makalenin kısa özeti"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee-700 mb-1">
            İçerik *
          </label>
          <Suspense fallback={<div className="p-4 text-center border rounded-lg">İçerik editörü yükleniyor...</div>}>
            <ContentEditor
              initialValue={content}
              onChange={setContent}
            />
          </Suspense>
          {handleSubmit(onSubmit) && !content.trim() && (
            <p className="text-red-500 text-sm mt-1">İçerik zorunludur</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee-700 mb-1">
            Kategori
          </label>
          <Input {...register('category')} placeholder="Makale kategorisi" />
        </div>

        <div>
          <label className="block text-sm font-medium text-coffee-700 mb-1">
            Kapak Görseli
          </label>
          <ImageUploader onImageSelected={handleImageSelected} />
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            onClick={() => submitWithStatus('draft')}
            variant="outline"
            disabled={isLoading}
            className="border-coffee-600 text-coffee-700 hover:bg-coffee-100"
          >
            {isLoading ? 'Kaydediliyor...' : 'Taslak Olarak Kaydet'}
          </Button>
          <Button
            type="submit"
            onClick={() => submitWithStatus('published')}
            className="bg-coffee-700 hover:bg-coffee-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Yayınlanıyor...' : 'Yayınla'}
          </Button>
        </div>
      </div>
    </form>
  );
}; 