import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
  type: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  id, 
  title, 
  excerpt, 
  date, 
  category,
  image,
  type
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determine the base path based on the type
  const basePath = type === 'article' ? '/articles/' : '/opinion/';
  
  return (
    <Link to={`${basePath}${id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow border-coffee-100 dark:border-coffee-800 hover:border-coffee-200 dark:hover:border-coffee-700">
        {image && !imageError && (
          <div className="aspect-video overflow-hidden relative bg-coffee-100 dark:bg-coffee-800">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-coffee-200 border-t-coffee-600 rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={image} 
              alt={title}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform hover:scale-105 duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          </div>
        )}
        <CardContent className="pt-6">
          <div className="flex items-center text-sm text-coffee-500 dark:text-coffee-400 mb-2">
            <span>{date}</span>
            <span className="mx-2">•</span>
            <span>{category}</span>
          </div>
          <h3 className="font-serif text-xl font-medium text-coffee-800 dark:text-coffee-200 mb-2">{title}</h3>
          <p className="text-coffee-600 dark:text-coffee-300 line-clamp-3">{excerpt}</p>
        </CardContent>
        <CardFooter className="text-coffee-700 dark:text-coffee-300 text-sm pt-0">
          Devamını Oku
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ArticleCard;
