import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0 || loading) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
        return;
      }

      enqueueSnackbar('Password reset link sent to your email!', {
        variant: 'success',
      });

      setCooldown(20);
    } catch (err) {
      console.error('Reset error:', err);
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
        onSubmit={handleResetRequest}
        className='w-full max-w-md p-8 bg-white border shadow-sm rounded-xl'
      >
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Reset password
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Enter your email and we'll send you a recovery link
          </p>
        </div>

        <div className='mb-6'>
          <label className='block mb-1 text-sm font-medium text-gray-700'>
            Email address
          </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='you@example.com'
          />
        </div>

        <button
          type='submit'
          disabled={loading || cooldown > 0}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60'
        >
          {loading
            ? 'Sending link…'
            : cooldown > 0
            ? `Resend reset link (${cooldown}s)`
            : 'Send reset link'}
        </button>

        <p className='mt-6 text-sm text-center text-gray-500'>
          Remembered your password?{' '}
          <Link
            to='/login'
            className='font-medium text-blue-600 hover:text-blue-700'
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};
