import { useState } from 'react';
import { Article } from '../types';

interface Props {
  initialData?: Partial<Article>;
  onSubmit: (data: {
    title: string;
    body: string;
    category: string;
    image_url?: string;
  }) => void;
}

export const ArticleForm = ({ initialData = {}, onSubmit }: Props) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [body, setBody] = useState(initialData.body || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [imageUrl, setImageUrl] = useState(initialData.image_url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || !category)
      return alert('Please fill all required fields');
    onSubmit({ title, body, category, image_url: imageUrl || undefined });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md p-4 mx-auto bg-white rounded shadow'
    >
      <input
        type='text'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='w-full p-2 mb-2 text-base border rounded'
        required
      />
      <textarea
        placeholder='Body'
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className='w-full p-2 mb-2 text-base border rounded'
        rows={5}
        required
      />
      <input
        type='text'
        placeholder='Image URL (optional)'
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className='w-full p-2 mb-2 text-base border rounded'
      />
      <input
        type='text'
        placeholder='Category'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className='w-full p-2 mb-2 text-base border rounded'
        required
      />
      <button
        type='submit'
        className='w-full p-2 text-white bg-blue-500 rounded'
      >
        Submit
      </button>
    </form>
  );
};
