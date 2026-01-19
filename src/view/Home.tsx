import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article, ArticleFromDB } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Loading } from '../utils/Loading';

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(
          `
    id,
    title,
    body,
    category,
    image_url,
    created_at,
    user_id,
    profiles!inner (
      id,
      username,
      email,
      avatar_url
    )
  `
        )
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error.message);
      } else if (data) {
        const mappedArticles: Article[] = (
          data as unknown as ArticleFromDB[]
        ).map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
          category: item.category,
          image_url:
            item.image_url && item.image_url.trim() !== ''
              ? item.image_url
              : undefined,
          created_at: item.created_at,
          user_id: item.user_id,
          username: item.profiles?.username ?? 'Unknown Author',
          avatar_url:
            item.profiles?.avatar_url ??
            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
        }));

        setArticles(mappedArticles);
      }

      setLoading(false);
    };

    fetchArticles();
  }, []);

  const handleArticleDelete = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  if (loading) return <Loading message='Loading articles…' />;

  return (
    <div className='grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto mt-40 sm:px-10 sm:grid-cols-2 lg:grid-cols-3'>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onDelete={handleArticleDelete}
        />
      ))}
    </div>
  );
};
