import { useState } from 'react';
import { ArticleForm } from '../components/ArticleForm';
import supabase from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../utils/Loading';

export const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    body: string;
    category: string;
    image_url?: string;
  }) => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return alert('You must be logged in to create an article.');
    }

    const { error } = await supabase
      .from('articles')
      .insert([{ ...data, author_id: user.id }]);

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
      {loading && <Loading message='Creating article…' />}
      <ArticleForm onSubmit={handleSubmit} />
    </>
  );
};
