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
  onCancel?: () => void; // ✅ optional cancel callback
}

export const ArticleForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}: Props) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [body, setBody] = useState(initialData.body || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [imageUrl, setImageUrl] = useState(initialData.image_url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || !category) {
      return alert('Please fill all required fields');
    }
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

      {/* Buttons */}
      <div className='flex gap-2 mt-2'>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='flex-1 p-2 text-sm text-gray-700 bg-gray-200 rounded sm:text-base hover:bg-gray-300'
          >
            Cancel
          </button>
        )}
        <button
          type='submit'
          className='flex-1 p-2 text-sm text-white bg-blue-500 rounded sm:text-base hover:bg-blue-600'
        >
          Submit
        </button>
      </div>
    </form>
  );
};
