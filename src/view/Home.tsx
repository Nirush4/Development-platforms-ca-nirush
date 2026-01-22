import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article, ArticleFromDB } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HomeSkeleton } from '../components/HomeSkeleton';
import { Pagination } from '../components/Pagination'; // ✅ import Pagination

const PAGE_SIZE = 10;

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
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
        `,
          { count: 'exact' }
        )
        .order('created_at', { ascending: false })
        .range(from, to);

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
        setTotalPages(Math.ceil((count ?? 0) / PAGE_SIZE));
      }

      setLoading(false);
    };

    fetchArticles();
  }, [page]);

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

  // Featured article + rest
  const [featured, ...otherArticles] = articles;

  // Top stories: random 4 articles from otherArticles
  const topStories = [...otherArticles]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className='w-full mt-10 bg-gray-50'>
      {/* HERO SECTION */}
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
          <h1 className='mb-4 text-2xl font-bold font-serifDisplay sm:text-6xl'>
            {featured.title}
          </h1>
          <p className='max-w-4xl mx-auto mb-4 text-lg'>
            {featured.body.slice(0, 255)}...
          </p>
          <button
            onClick={() => navigate(`/article/${featured.id}`)}
            className='px-6 py-2 mb-[8rem] text-sm font-semibold bg-blue-600 sm:mb-0 sm:text-lg rounded-3xl hover:bg-blue-700'
          >
            Read Full Article
          </button>
        </div>
      </section>

      {/* MAIN GRID */}
      <section
        id='articles-grid'
        className='relative z-10 px-4 mx-auto -mt-[9rem] max-w-6xl'
      >
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {otherArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setSearchParams({ page: String(p) });

            const grid = document.getElementById('articles-grid');
            if (grid) {
              grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />
      </section>

      {/* TOP STORIES */}
      {topStories.length > 0 && (
        <section className='px-4 mx-auto mt-16 mb-10 sm:mb-20 max-w-7xl'>
          <h3 className='pb-4 mb-10 text-3xl font-bold text-gray-900 border-b-2 border-gray-200'>
            Top Stories
          </h3>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {topStories.map((story) => (
              <ArticleCard key={story.id} article={story} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
