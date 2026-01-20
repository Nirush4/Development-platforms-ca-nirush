import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article } from '../types';
import { Loading } from '../utils/Loading';

import { ArticleCard } from '../components/ArticleCard';

export const MyArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserArticles = async () => {
      setLoading(true);

      // Get currently logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        alert('You must be logged in to view your articles.');
        return;
      }

      // Fetch only articles where author_id = user.id
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      setLoading(false);

      if (error) {
        alert(error.message);
      } else {
        setArticles(data ?? []);
      }
    };

    fetchUserArticles();
  }, []);

  return (
    <div className='px-4 mx-auto mt-32 h-[90vh] max-w-7xl sm:px-6 lg:px-8'>
      <h1 className='mb-6 text-xl font-bold text-gray-900 sm:text-2xl'>
        My Articles
      </h1>

      {loading ? (
        <Loading message='Loading your articles…' />
      ) : articles.length === 0 ? (
        <p className='text-gray-500'>You have not created any articles yet.</p>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={(id) =>
                setArticles((prev) => prev.filter((a) => a.id !== id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
