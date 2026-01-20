import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article, ArticleFromDB } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { useNavigate } from 'react-router-dom';

/* =======================
   Skeleton Components
======================= */

const HeroSkeleton = () => (
  <section className='relative flex items-center w-full h-[90vh] bg-gray-300 animate-pulse'>
    <div className='absolute inset-0 bg-black/30'></div>
    <div className='relative max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8'>
      <div className='w-32 h-6 mx-auto mb-4 bg-gray-400 rounded' />
      <div className='w-3/4 h-10 mx-auto mb-4 bg-gray-400 rounded' />
      <div className='w-2/3 h-5 mx-auto mb-6 bg-gray-400 rounded' />
      <div className='w-40 h-10 mx-auto bg-gray-400 rounded' />
    </div>
  </section>
);

const ArticleCardSkeleton = () => (
  <div className='overflow-hidden bg-white shadow rounded-xl animate-pulse'>
    <div className='w-full h-48 bg-gray-300' />
    <div className='p-4 space-y-3'>
      <div className='w-20 h-3 bg-gray-300 rounded' />
      <div className='w-full h-4 bg-gray-300 rounded' />
      <div className='w-5/6 h-3 bg-gray-300 rounded' />
      <div className='w-24 h-8 mt-4 bg-gray-300 rounded' />
    </div>
  </div>
);

const GridSkeleton = ({ count = 6 }: { count?: number }) => (
  <section className='relative z-10 px-4 mx-auto -mt-[5rem] max-w-7xl sm:px-6 lg:px-8'>
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  </section>
);

const TopStoriesSkeleton = () => (
  <section className='px-4 mx-auto mt-16 max-w-7xl sm:px-6 lg:px-8'>
    <div className='w-40 h-6 mb-6 bg-gray-300 rounded animate-pulse' />
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  </section>
);

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
            id,
            username,
            avatar_url
          )
        `
        )
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedArticles: Article[] = (
          data as unknown as ArticleFromDB[]
        ).map((item) => ({
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
        }));

        setArticles(mappedArticles);
      }

      setLoading(false);
    };

    fetchArticles();
  }, []);

  /* =======================
     Skeleton View
  ======================= */
  if (loading) {
    return (
      <div className='w-full bg-gray-50'>
        <HeroSkeleton />
        <GridSkeleton />
        <TopStoriesSkeleton />
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
      <section
        className='relative flex items-center w-full text-white h-dvh'
        style={{
          backgroundImage: `url(${featured.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black/60'></div>
        <div className='relative max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8'>
          <span className='inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase bg-blue-600 rounded'>
            {featured.category}
          </span>
          <h1 className='mb-4 text-2xl font-bold sm:text-4xl lg:text-6xl'>
            {featured.title}
          </h1>
          <p className='max-w-3xl mx-auto mb-[3rem] text-lg sm:text-xl'>
            {featured.body.slice(0, 250)}...
          </p>
          <button
            onClick={() => navigate(`/article/${featured.id}`)}
            className='px-6 py-2 text-lg font-semibold bg-blue-600 rounded sm:rounded-lg hover:bg-blue-700'
          >
            Read Full Article
          </button>
        </div>
      </section>

      <section className='relative z-10 px-4 mx-auto  -mt-[9rem] max-w-6xl sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {otherArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className='px-4 mx-auto mt-16 max-w-7xl sm:px-6 lg:px-8'>
        <h3 className='mb-4 text-xl font-bold text-gray-900 sm:text-2xl'>
          Top Stories
        </h3>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {topStories.map((story) => (
            <ArticleCard key={story.id} article={story} />
          ))}
        </div>
      </section>
    </div>
  );
};
