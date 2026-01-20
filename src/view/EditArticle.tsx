import { useEffect, useState } from 'react';
import { ArticleForm } from '../components/ArticleForm';
import supabase from '../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { Article } from '../types';
import { Loading } from '../utils/Loading';

export const EditArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      setLoading(false);

      if (error) {
        alert(error.message);
      } else {
        setArticle(data);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (data: {
    title: string;
    body: string;
    category: string;
    image_url?: string;
  }) => {
    if (!id) return;

    setLoading(true);

    const { error } = await supabase.from('articles').update(data).eq('id', id);

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <>
      {loading && <Loading message='Updating article…' />}

      <div className='flex justify-center min-h-screen px-4 py-10 pt-32 sm:px-6 lg:px-8'>
        <div className='w-full max-w-2xl'>
          {/* Go Back Button */}
          <div className='mb-10'>
            <button
              onClick={() => navigate('/')}
              className='flex items-center gap-2 text-sm font-medium text-gray-700 transition sm:text-base hover:text-blue-600'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-5 h-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Go Back
            </button>
          </div>

          {/* Form Card */}
          <div className='overflow-hidden bg-white shadow-md rounded-xl'>
            {/* Header */}
            <div className='p-4 bg-gradient-to-r from-blue-600 to-indigo-600 sm:p-6'>
              <h1 className='text-xl font-bold text-white sm:text-2xl'>
                Edit Article
              </h1>
              <p className='mt-1 text-sm text-blue-100 sm:text-base'>
                Update your article details below.
              </p>
            </div>

            {/* Form Content */}
            <div className='p-4 sm:p-6'>
              {article ? (
                <ArticleForm
                  initialData={article}
                  onSubmit={handleSubmit}
                  onCancel={() => navigate('/')} // go back without saving
                />
              ) : (
                !loading && (
                  <p className='mt-6 text-center text-gray-500'>
                    Article not found.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
