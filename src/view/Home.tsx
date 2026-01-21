import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article, ArticleFromDB } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { useNavigate } from 'react-router-dom';
import { HomeSkeleton } from '../components/HomeSkeleton';

/* =======================
   Home Component
======================= */

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            username,
            avatar_url
          )
        `
        )
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: Article[] = (data as unknown as ArticleFromDB[]).map(
          (item) => ({
            id: item.id,
            title: item.title,
            body: item.body,
            category: item.category,
            image_url: item.image_url || undefined,
            created_at: item.created_at,
            user_id: item.user_id,
            username: item.profiles?.username ?? 'Unknown Author',
            avatar_url:
              item.profiles?.avatar_url ??
              'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          })
        );

        setArticles(mapped);
      }

      setLoading(false);
    };

    fetchArticles();
  }, []);

  /* 🔥 REMOVE ARTICLE FROM UI AFTER DELETE */
  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== id));
  };

  if (loading) {
    return (
      <div className='w-full bg-gray-50'>
        <HomeSkeleton />
      </div>
    );
  }

  if (!articles.length) {
    return (
      <p className='mt-40 text-xl text-center text-gray-500'>
        No articles found.
      </p>
    );
  }

  const [featured, ...otherArticles] = articles;

  const topStories = [...otherArticles]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className='w-full mt-10 bg-gray-50'>
      {/* HERO */}
      <section
        className='relative flex items-center w-full text-white h-dvh'
        style={{
          backgroundImage: `url(${featured.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black/60'></div>
        <div className='relative max-w-6xl px-4 mx-auto text-center'>
          <span className='inline-block px-3 py-1 mb-4 text-xs font-semibold bg-blue-600 rounded'>
            {featured.category}
          </span>
          <h1 className='mb-4 text-2xl font-bold sm:text-6xl'>
            {featured.title}
          </h1>
          <p className='max-w-3xl mx-auto mb-12 text-lg'>
            {featured.body.slice(0, 250)}...
          </p>
          <button
            onClick={() => navigate(`/article/${featured.id}`)}
            className='px-6 py-2 text-sm font-semibold bg-blue-600 sm:text-lg rounded-3xl hover:bg-blue-700'
          >
            Read Full Article
          </button>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className='relative z-10 px-4 mx-auto -mt-[9rem] max-w-6xl'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {otherArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={handleDeleteArticle}
            />
          ))}
        </div>
      </section>

      {/* TOP STORIES */}
      <section className='px-4 mx-auto mt-16 mb-10 sm:mb-20 max-w-7xl'>
        <h3 className='mb-4 text-xl font-bold text-gray-900'>Top Stories</h3>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {topStories.map((story) => (
            <ArticleCard
              key={story.id}
              article={story}
              onDelete={handleDeleteArticle}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
