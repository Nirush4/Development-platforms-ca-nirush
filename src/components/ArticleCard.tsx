import { Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Pencil, Trash2 } from 'lucide-react';
import { Article } from '../types';
import { Loading } from '../utils/Loading';
import { showConfirmModal } from '../utils/confirmModal';
import { useSnackbar } from 'notistack';

interface Props {
  article: Article;
  onDelete?: (id: string) => void;
}

export const ArticleCard = ({ article, onDelete }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); // ✅ toast

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user ?? null);
    };
    fetchUser();
  }, []);

  const handleDelete = async () => {
    const confirmed = await showConfirmModal(
      'Are you sure you want to delete this article?'
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setShowLoader(true);

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id);

    // Smooth UX delay
    setTimeout(() => {
      setShowLoader(false);
      setIsDeleting(false);

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Article deleted successfully', {
          variant: 'success',
        });
        onDelete?.(article.id);
      }
    }, 1000);
  };

  return (
    <>
      {showLoader && <Loading message='Deleting article…' />}

      <article className='flex flex-col overflow-hidden transition-all duration-300 bg-white shadow-md rounded-2xl hover:shadow-xl hover:-translate-y-1 group'>
        {/* Article Image */}
        {article.image_url && (
          <div className='relative h-56 overflow-hidden rounded-t-2xl'>
            <img
              src={article.image_url}
              alt={article.title}
              className='object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105'
            />
            <span className='absolute px-3 py-1 text-xs font-semibold text-gray-800 rounded-full shadow-sm left-4 top-4 bg-white/90'>
              {article.category}
            </span>
          </div>
        )}

        {/* Content */}
        <div className='flex flex-col flex-1 p-6'>
          <time className='mb-2 text-xs text-gray-400 sm:text-sm'>
            {new Date(article.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <Link
            to={`/article/${article.id}`}
            className='mb-3 text-lg font-bold text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-600'
          >
            {article.title}
          </Link>
          <div className='flex items-center gap-3 mb-3'>
            <img
              src={
                article.avatar_url ||
                'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
              }
              alt={article.username}
              className='object-cover rounded-full w-9 h-9 ring-1 ring-gray-200'
            />
            <span className='text-sm font-medium text-gray-700'>
              {article.username ?? 'User'}
            </span>
          </div>

          <p className='mb-3 text-sm leading-relaxed text-gray-600 line-clamp-3'>
            {article.body}
          </p>

          <div className='flex items-center justify-between mt-auto'>
            <Link
              to={`/article/${article.id}`}
              className='text-sm font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-800'
            >
              Read more →
            </Link>

            {user?.id === article.user_id && (
              <div className='flex items-center gap-2'>
                <Link
                  to={`/articles/${article.id}/edit`}
                  className='inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-600 transition rounded-lg hover:bg-gray-100 hover:text-gray-900'
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className='inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 transition rounded-lg hover:bg-red-50 disabled:opacity-50'
                >
                  <Trash2 size={16} />
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
};
