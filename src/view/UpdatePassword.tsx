import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return;
      }

      enqueueSnackbar('Password updated successfully!', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      console.error('Update password error:', err);
      enqueueSnackbar((err as Error).message || 'Something went wrong', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen px-4 bg-gray-50'>
      <form
        onSubmit={handleUpdatePassword}
        className='w-full max-w-md p-8 bg-white border shadow-sm rounded-xl'
      >
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Set new password
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Please enter your new password below
          </p>
        </div>

        <div className='mb-6'>
          <label className='block mb-1 text-sm font-medium text-gray-700'>
            New password
          </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='••••••••'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60'
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
};
