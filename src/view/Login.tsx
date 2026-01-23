import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Loading } from '../utils/Loading';
import { useSnackbar } from 'notistack'; // <-- import useSnackbar

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar(); // <-- initialize snackbar

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        setLoading(false);
        return;
      }

      // Show full-screen loader before navigation
      setShowLoader(true);

      // Fetch user profile to store username/avatar in localStorage
      if (data.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          localStorage.setItem('username', profile.username ?? '');
          localStorage.setItem(
            'avatar_url',
            profile.avatar_url ??
              'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
          );
        }
      }

      // Small delay for smooth UX
      setTimeout(() => {
        setShowLoader(false);
        enqueueSnackbar('Logged in successfully!', { variant: 'success' });
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      enqueueSnackbar((err as Error).message || 'Something went wrong', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen px-4 bg-gray-50'>
      {showLoader && <Loading message='Signing in…' />}

      <form
        onSubmit={handleLogin}
        className='w-full max-w-md p-8 transition-opacity duration-300 bg-white border shadow-sm rounded-xl'
        style={{ opacity: showLoader ? 0.3 : 1 }}
      >
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-gray-900'>Welcome back</h1>
          <p className='mt-1 text-sm text-gray-500'>Sign in to your account</p>
        </div>

        <div className='mb-4'>
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

        <div className='mb-6'>
          <label className='block mb-1 text-sm font-medium text-gray-700'>
            Password
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
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className='mt-6 text-sm text-center text-gray-500'>
          Don’t have an account?{' '}
          <Link
            to='/register'
            className='font-medium text-blue-600 hover:text-blue-700'
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};
