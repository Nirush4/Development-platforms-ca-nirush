import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { Article } from '../types';
import { User } from '@supabase/supabase-js';
import { Pencil, Trash2 } from 'lucide-react';
import { SingleArticleSkeleton } from '../components/SingleArticleSkeleton';
import { showConfirmModal } from '../utils/confirmModal';
import { useSnackbar } from 'notistack';

export const SingleArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // ✅ toast

  const [article, setArticle] = useState<Article | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('articles')
        .select(
          `
          *,
          profiles (
            username,
            avatar_url
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else if (data) {
        setArticle({
          ...data,
          username: data.profiles?.username,
          avatar_url: data.profiles?.avatar_url,
        });
      }

      setLoading(false);
    };

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user ?? null);
    };

    fetchArticle();
    fetchUser();
  }, [id, enqueueSnackbar]);

  const handleDelete = async () => {
    if (!article) return;

    const confirmed = await showConfirmModal(
      'Are you sure you want to delete this article?'
    );
    if (!confirmed) return;

    setIsDeleting(true);

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id);

    setTimeout(() => {
      setIsDeleting(false);

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Article deleted successfully', {
          variant: 'success',
        });
        navigate('/');
      }
    }, 1000);
  };

  // Loading skeleton
  if (loading) return <SingleArticleSkeleton />;

  if (!article) {
    return (
      <p className='mt-20 text-lg text-center text-gray-500'>
        Article not found.
      </p>
    );
  }

  return (
    <div className='max-w-4xl px-4 mx-auto mb-10 mt-28 sm:mb-20 sm:px-6'>
      {/* Go Back */}
      <button
        onClick={() => navigate('/')}
        className='flex items-center gap-2 mb-6 text-sm font-medium text-gray-800 transition sm:text-base hover:text-blue-600'
      >
        ← Go Back
      </button>

      {/* Image */}
      {article.image_url && (
        <div className='relative w-full h-64 mb-6 overflow-hidden rounded-lg sm:h-96'>
          <img
            src={article.image_url}
            alt={article.title}
            className='object-cover w-full h-full transition-transform duration-300 hover:scale-105'
          />
          <span className='absolute px-3 py-1 text-xs font-semibold text-gray-800 rounded-full left-4 top-4 bg-white/90'>
            {article.category}
          </span>
        </div>
      )}

      <h1 className='mb-4 text-lg font-bold text-gray-900 sm:text-4xl'>
        {article.title}
      </h1>

      {/* Author */}
      <div className='flex items-center gap-3 mb-6'>
        <img
          src={
            article.avatar_url ||
            'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
          }
          alt={article.username ?? 'User'}
          className='object-cover w-10 h-10 rounded-full'
        />
        <div>
          <p className='text-sm font-medium text-gray-700 sm:text-base'>
            {article.username ?? 'User'}
          </p>
          <time className='text-xs text-gray-400 sm:text-sm'>
            {new Date(article.created_at).toLocaleDateString()}
          </time>
        </div>
      </div>

      <p className='mb-6 text-sm leading-relaxed text-gray-700 whitespace-pre-line sm:text-base'>
        {article.body}
      </p>

      {/* Actions */}
      {user?.id === article.user_id && (
        <div className='flex gap-3 mt-6'>
          <Link
            to={`/articles/${article.id}/edit`}
            className='inline-flex items-center gap-1 px-4 py-2 text-sm bg-gray-300 rounded-md hover:bg-gray-400'
          >
            <Pencil size={16} /> Edit
          </Link>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className='inline-flex items-center gap-1 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50'
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};
