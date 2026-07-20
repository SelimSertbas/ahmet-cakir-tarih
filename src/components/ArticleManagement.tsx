import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArticleList } from './ArticleList';
import { ArticleForm } from './ArticleForm';

interface ArticleManagementProps {
  onArticleSaved?: () => void;
}

export const ArticleManagement: React.FC<ArticleManagementProps> = ({ onArticleSaved }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(undefined);

  const handleSelectTab = (value: string) => {
    if (value === 'articles') {
      setSelectedArticleId(undefined);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <Tabs defaultValue="articles" onValueChange={handleSelectTab}>
        <TabsList className="mb-8 bg-coffee-100">
          <TabsTrigger value="articles" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
            Yazılarım
          </TabsTrigger>
          <TabsTrigger value="edit" className="data-[state=active]:bg-coffee-600 data-[state=active]:text-white">
            {selectedArticleId ? 'Makaleyi Düzenle' : 'Yeni Makale'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles">
          <ArticleList onEdit={setSelectedArticleId} />
        </TabsContent>
        
        <TabsContent value="edit">
          <ArticleForm 
            articleId={selectedArticleId} 
            onSave={() => {
              setSelectedArticleId(undefined);
              onArticleSaved?.();
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 