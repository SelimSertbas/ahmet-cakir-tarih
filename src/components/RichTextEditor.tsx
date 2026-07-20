import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import ImageUploader from './ImageUploader';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Editor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
  }),
  Image,
];

interface RichTextEditorProps {
  initialContent?: string;
  onSave: (content: string, metadata: ArticleMetadata) => void;
  isOpinion?: boolean;
}

interface ArticleMetadata {
  title: string;
  excerpt: string;
  category: string;
  metaDescription: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  initialContent = '', 
  onSave,
  isOpinion = false
}) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const [charactersLeft, setCharactersLeft] = useState(500);
  
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions,
    content: content || '',
    onUpdate: ({ editor }: { editor: Editor }) => {
      setContent(editor.getHTML());
    }
  });

  useEffect(() => {
    // Update preview when content changes
    if (editorRef.current && activeTab === 'preview') {
      editorRef.current.innerHTML = content;
    }
  }, [content, activeTab]);

  // Update characters left counter
  useEffect(() => {
    setCharactersLeft(500 - metaDescription.length);
  }, [metaDescription]);

  const handleCommand = (command: string, value?: string) => {
    if (!editor) return;
    
    switch (command) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'formatBlock':
        if (value === '<h2>') {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        } else if (value === '<h3>') {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        } else if (value === '<blockquote>') {
          editor.chain().focus().toggleBlockquote().run();
        }
        break;
      case 'insertUnorderedList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'insertOrderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'createLink':
        if (value) {
          editor.chain().focus().setLink({ href: value }).run();
        }
        break;
      case 'insertHTML':
        if (value) {
          editor.chain().focus().insertContent(value).run();
        }
        break;
    }
  };

  const handleImageSelected = (imageUrl: string, alt: string, title: string) => {
    const imageHtml = `<figure><img src="${imageUrl}" alt="${alt}" title="${title}" style="max-width:100%"/><figcaption>${title}</figcaption></figure>`;
    handleCommand('insertHTML', imageHtml);
  };

  const handleSave = () => {
    onSave(content, {
      title,
      excerpt,
      category,
      metaDescription
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-coffee-700 block mb-1">
            Başlık
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isOpinion ? "Köşe yazısı başlığı" : "Makale başlığı"}
            className="border-coffee-200 focus:border-coffee-400"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-coffee-700 block mb-1">
            Özet (Excerpt)
          </label>
          <Input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Kısa bir özet"
            className="border-coffee-200 focus:border-coffee-400"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-coffee-700 block mb-1">
            Kategori
          </label>
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Örn: Tarih, Edebiyat, Eğitim"
            className="border-coffee-200 focus:border-coffee-400"
          />
        </div>
      </div>

      {/* Editor toolbar */}
      <div className="border rounded-t-lg border-coffee-200 bg-coffee-50 p-2 flex flex-wrap gap-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => handleCommand('bold')}
          className="text-coffee-700 hover:text-coffee-900 hover:bg-coffee-100 px-2"
        >
          Kalın
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => handleCommand('italic')}
          className="text-coffee-700 hover:text-coffee-900 hover:bg-coffee-100 px-2"
        >
          İtalik
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => handleCommand('formatBlock', '<h2>')}
          className="text-coffee-700 hover:text-coffee-900 hover:bg-coffee-100 px-2"
        >
          Başlık
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => handleCommand('formatBlock', '<h3>')}
          className="text-coffee-700 hover:text-coffee-900 hover:bg-coffee-100 px-2"
        >
          Alt Başlık
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => handleCommand('formatBlock', '<blockquote>')}
          className="text-coffee-700 hover:text-coffee-900 hover:bg-coffee-100 px-2"
        >
          Alıntı
        </Button>
        <ImageUploader onImageSelected={handleImageSelected} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 bg-coffee-100 rounded-none border-x border-t border-coffee-200">
          <TabsTrigger value="write" className="data-[state=active]:bg-white">
            Yaz
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-white">
            Önizleme
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-0">
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[400px] p-4 border border-coffee-200 focus:outline-none focus:ring-1 focus:ring-coffee-400 prose"
            onBlur={() => {
              if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
              }
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[400px] p-4 border border-coffee-200 prose">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-coffee-400 italic">İçerik önizlemesi burada görünecek...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mt-8">
        <div>
          <div className="flex justify-between">
            <label className="text-sm font-medium text-coffee-700 block mb-1">
              Meta Açıklama (SEO için)
            </label>
            <span className={`text-xs ${charactersLeft < 0 ? 'text-red-500' : 'text-coffee-500'}`}>
              {charactersLeft} karakter kaldı
            </span>
          </div>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Arama motorları için açıklama (max 500 karakter)"
            className="w-full border rounded-md border-coffee-200 p-2 h-24 focus:border-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
            maxLength={500}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleSave}
          className="bg-coffee-700 hover:bg-coffee-800"
        >
          Kaydet
        </Button>
      </div>
    </div>
  );
};

export default RichTextEditor;
