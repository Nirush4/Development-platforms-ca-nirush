import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article, ArticleFromDB } from '../types';
import { ArticleCard } from '../components/ArticleCard';

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from<'articles', ArticleFromDB>('articles')
        .select(`*`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
      } else if (data) {
        const mappedArticles: Article[] = data.map((item) => ({
          ...item,
          profiles:
            item.profiles && item.profiles.length > 0
              ? item.profiles[0]
              : {
                  id: '',
                  username: 'Unknown Author',
                  email: '',
                  avatar_url:
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
                },
        }));
        setArticles(mappedArticles);
      }
    };
    fetchArticles();
  }, []);

  // ✅ Remove deleted article from state
  const handleArticleDelete = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  return (
    <div className='grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto mt-40 sm:px-10 sm:grid-cols-2 lg:grid-cols-3'>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onDelete={handleArticleDelete} // pass callback
        />
      ))}
    </div>
  );
};
