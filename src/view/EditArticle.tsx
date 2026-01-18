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

    // Keep loading animation for 1 second before navigating
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <>
      {loading && <Loading message='Updating article…' />}
      {article ? (
        <ArticleForm initialData={article} onSubmit={handleSubmit} />
      ) : (
        !loading && (
          <p className='mt-10 text-center text-gray-500'>Article not found.</p>
        )
      )}
    </>
  );
};
