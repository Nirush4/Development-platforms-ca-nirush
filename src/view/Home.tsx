import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article, ArticleFromDB } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Loading } from '../utils/Loading';
import { useNavigate } from 'react-router-dom';

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

  if (!articles.length)
    return (
      <p className='mt-40 text-xl text-center text-gray-500'>
        No articles found.
      </p>
    );

  // Take the most recent article for the cover
  const [featured, ...otherArticles] = articles;
  console.log(featured);
  return (
    <div className='w-full'>
      {/* Cover Section */}
      <section
        className='relative flex items-center w-full h-screen text-white bg-gray-900'
        style={{
          backgroundImage: `url(${
            featured.image_url ||
            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black/40'></div>
        <div className='relative max-w-5xl px-4 mx-auto text-center sm:px-6 lg:px-8'>
          <span className='inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase bg-blue-600 rounded sm:text-sm'>
            {featured.category}
          </span>
          <h1 className='mb-4 text-xl font-bold sm:text-3xl lg:text-5xl'>
            {featured.title}
          </h1>
          <p className='max-w-3xl mx-auto mb-6 text-lg leading-relaxed sm:text-xl'>
            {featured.body.length > 200
              ? featured.body.slice(0, 200) + '...'
              : featured.body}
          </p>
          <button
            onClick={() => navigate(`/article/${featured.id}`)}
            className='px-4 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded sm:text-lg sm:px-6 sm:py-3 hover:bg-blue-700'
          >
            Read Full Article
          </button>
        </div>
      </section>

      {/* Other Articles Grid */}
      <section className='relative z-10 grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto -mt-32 sm:px-6 lg:px-8 sm:grid-cols-2 lg:grid-cols-3'>
        {otherArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onDelete={handleArticleDelete}
          />
        ))}
      </section>
    </div>
  );
};
