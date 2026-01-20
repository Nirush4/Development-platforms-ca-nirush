import { Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Pencil, Trash2 } from 'lucide-react';
import { Article } from '../types';
import { Loading } from '../utils/Loading';

interface Props {
  article: Article;
  onDelete?: (id: string) => void;
}

export const ArticleCard = ({ article, onDelete }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user ?? null);
    };
    fetchUser();
  }, []);

  const handleDelete = async () => {
    const confirmed = confirm('Delete this article permanently?');
    if (!confirmed) return;

    setIsDeleting(true);
    setShowLoader(true);

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id);

    // Smooth UX with a small delay
    setTimeout(() => {
      setShowLoader(false);
      setIsDeleting(false);

      if (error) {
        alert(error.message);
      } else {
        alert('Article deleted successfully');
        onDelete?.(article.id);
      }
    }, 800);
  };

  return (
    <>
      {showLoader && <Loading message='Deleting article…' />}

      <article className='flex flex-col overflow-hidden transition bg-white border shadow-sm rounded-xl hover:shadow-lg'>
        {/* Article Image */}
        {article.image_url && (
          <div className='relative overflow-hidden h-52'>
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

        {/* Content */}
        <div className='flex flex-col flex-1 p-6'>
          <time className='mb-2 text-xs text-gray-400'>
            {new Date(article.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>

          <h2 className='mb-2 text-xl font-semibold text-gray-900 line-clamp-2'>
            {article.title}
          </h2>

          <div className='flex items-center gap-2 mb-4'>
            <img
              src={
                article.avatar_url ||
                'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
              }
              alt={article.username}
              className='object-cover w-8 h-8 rounded-full'
            />

            <span className='text-sm font-medium text-gray-700'>
              {article.username ?? 'User'}
            </span>
          </div>

          <p className='mb-6 text-sm leading-relaxed text-gray-600 line-clamp-3'>
            {article.body}
          </p>

          <div className='flex items-center justify-between mt-auto'>
            <Link
              to={`/article/${article.id}`}
              className='text-sm font-medium text-blue-600 hover:text-blue-700'
            >
              Read more →
            </Link>

            {user?.id === article.user_id && (
              <div className='flex items-center gap-2'>
                <Link
                  to={`/articles/${article.id}/edit`}
                  className='inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 rounded-md hover:bg-gray-200 hover:text-gray-900'
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className='inline-flex items-center gap-1 px-2 py-1 text-sm text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50'
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
