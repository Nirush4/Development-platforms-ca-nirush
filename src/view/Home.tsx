import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import { Article, ArticleFromDB } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HomeSkeleton } from '../components/HomeSkeleton';
import { Pagination } from '../components/Pagination';

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 500;

export const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const query = searchParams.get('q') ?? '';
  const sortParam = (searchParams.get('sort') as 'asc' | 'desc') ?? 'desc';

  // Sync sort state with URL
  useEffect(() => {
    setSort(sortParam);
  }, [sortParam]);

  // Scroll to articles grid on page change
  useEffect(() => {
    const grid = document.getElementById('articles-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [page]);

  // Keep searchInput synced with URL query
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Debounced update of URL query when typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== query) {
        setSearchParams({ page: '1', q: searchInput, sort });
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchInput, query, sort, setSearchParams]);

  // Fetch articles from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      try {
        // Base query
        let baseQuery = supabase
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
          .order('created_at', { ascending: sort === 'asc' })
          .range(from, to);

        // Apply search if query exists
        if (query) {
          baseQuery = baseQuery.or(
            `title.ilike.%${query}%,body.ilike.%${query}%`
          );
        }

        const { data, error, count } = await baseQuery;

        if (error) throw error;

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
        setTotalPages(Math.ceil((count ?? mapped.length) / PAGE_SIZE));
      } catch (err) {
        console.error('Error fetching articles:', err);
        setArticles([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, query, sort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as 'asc' | 'desc';
    setSort(newSort);
    setSearchParams({ page: '1', q: query, sort: newSort });
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
      <p className='mt-40 text-base text-center text-gray-500 sm:text-xl'>
        No articles found{' '}
        {query && (
          <>
            for "<strong>{query}</strong>"
          </>
        )}
      </p>
    );
  }

  const [featured, ...otherArticles] = articles;
  const topStories = [...otherArticles]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  return (
    <div className='w-full mt-10 bg-gray-50'>
      {/* Featured Section */}
      {!query && featured && (
        <section
          className='relative flex items-center justify-center w-full overflow-hidden text-white h-dvh'
          style={{
            backgroundImage: `url(${featured.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'></div>

          <div className='relative z-10 flex flex-col items-center justify-center max-w-5xl px-4 text-center'>
            <span className='inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-blue-600 rounded-full sm:text-sm animate-bounce-slow'>
              {featured.category}
            </span>

            <h1 className='mb-4 text-3xl font-bold font-serifDisplay md:text-6xl drop-shadow-lg'>
              {featured.title}
            </h1>

            <p className='mb-6 text-lg text-gray-100 sm:text-xl lg:text-2xl line-clamp-3'>
              {featured.body}
            </p>

            <button
              onClick={() => navigate(`/article/${featured.id}`)}
              className='px-5 py-2 text-sm font-semibold text-white transition-all duration-300 rounded-full sm:py-3 sm:px-8 sm:text-lg bg-gradient-to-r from-blue-600 to-indigo-500 hover:scale-105 hover:from-indigo-500 hover:to-blue-600'
            >
              Read Full Article
            </button>
          </div>

          <div className='absolute bottom-20 animate-bounce'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </section>
      )}
      {/* Sort Dropdown */}
      <div className='flex items-center justify-end max-w-6xl px-4 mx-auto mt-8 mb-6 sm:mt-[5rem] sm:px-6 lg:px-8'>
        <label className='mr-3 text-xs font-semibold tracking-wide text-gray-700 uppercase sm:text-sm'>
          Sort by:
        </label>
        <div className='relative'>
          <select
            value={sort}
            onChange={handleSortChange}
            className='py-2 pl-4 pr-10 text-xs text-gray-700 transition duration-300 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md'
          >
            <option value='desc'>Newest First</option>
            <option value='asc'>Oldest First</option>
          </select>

          {/* Custom arrow */}
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <section
        id='articles-grid'
        className='relative z-10 grid max-w-6xl grid-cols-1 gap-6 px-4 mx-auto mt-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3'
      >
        {query
          ? articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          : otherArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
      </section>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) =>
          setSearchParams({ page: String(p), q: query, sort })
        }
      />

      {!query && topStories.length > 0 && (
        <section className='px-4 mx-auto mt-16 mb-10 sm:mb-20 max-w-7xl'>
          <h3 className='pb-4 mb-10 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 sm:text-3xl'>
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
