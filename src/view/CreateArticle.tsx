import { useState } from 'react';
import { ArticleForm } from '../components/ArticleForm';
import supabase from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../utils/Loading';
import { useSnackbar } from 'notistack';

export const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); // ✅ hook for toast

  const handleSubmit = async (data: {
    title: string;
    body: string;
    category: string;
    image_url?: string;
  }) => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        enqueueSnackbar('You must be logged in to create an article.', {
          variant: 'error',
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('articles')
        .insert([{ ...data, author_id: user.id }]);

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
        return;
      }

      enqueueSnackbar('Article created successfully!', { variant: 'success' });

      // Delay for smooth UX
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong while creating the article.', {
        variant: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading message='Creating article…' />}

      <div className='flex justify-center min-h-screen px-4 py-10 pt-[6rem] sm:pt-[7rem] sm:px-6 lg:px-8'>
        <div className='w-full max-w-2xl'>
          {/* Go Back Button */}
          <div className='mb-8 sm:mb-10'>
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
            <div className='p-4 bg-blue-600 sm:p-6'>
              <h1 className='text-lg font-bold text-white sm:text-2xl'>
                Create a New Article
              </h1>
              <p className='mt-1 text-sm text-blue-100 sm:text-base'>
                Fill out the form to publish your article.
              </p>
            </div>

            {/* Form Content */}
            <div className='p-4 sm:p-6'>
              <ArticleForm
                onSubmit={handleSubmit}
                onCancel={() => navigate('/')} // ✅ Cancel button
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
