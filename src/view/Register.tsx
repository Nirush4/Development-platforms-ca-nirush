import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Loading } from '../utils/Loading';
import { useSnackbar } from 'notistack';

export const Register = () => {
  const [name, setName] = useState('');
  const [avatar_url, setAvatar_url] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: {} },
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('No user ID returned from signup');

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: name, avatar_url })
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        enqueueSnackbar('Failed to update profile info', { variant: 'error' });
      }

      setShowLoader(true);

      localStorage.setItem('username', name);
      localStorage.setItem(
        'avatar_url',
        avatar_url ||
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      );

      setTimeout(() => {
        setShowLoader(false);
        enqueueSnackbar('Check your email to confirm your registration.', {
          variant: 'success',
        });
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      enqueueSnackbar((err as Error).message || 'Something went wrong', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } catch (err) {
      console.error('Google signup error:', err);
      enqueueSnackbar('Could not connect to Google', { variant: 'error' });
    }
  };

  return (
    <main className='relative flex items-center justify-center min-h-screen px-4 bg-gray-50'>
      {showLoader && (
        <div aria-live='polite' aria-busy='true'>
          <Loading message='Creating account…' />
        </div>
      )}

      <form
        onSubmit={handleRegister}
        aria-labelledby='form-title'
        className='w-full max-w-md p-8 mt-20 transition-opacity duration-300 bg-white border shadow-sm rounded-xl'
        style={{ opacity: showLoader ? 0.3 : 1 }}
      >
        <div className='mb-6 text-center'>
          <h1 id='form-title' className='text-2xl font-semibold text-gray-900'>
            Create an account
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Join NewsApp to start publishing
          </p>
        </div>

        <div className='mb-6'>
          <button
            type='button'
            onClick={handleGoogleLogin}
            aria-label='Sign up with Google'
            className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            <svg
              aria-hidden='true'
              className='w-4 h-4 mr-2'
              viewBox='0 0 24 24'
            >
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className='relative flex items-center justify-center mb-6'>
          <div
            aria-hidden='true'
            className='absolute inset-0 flex items-center'
          >
            <div className='w-full border-t border-gray-200' />
          </div>
          <span className='relative px-3 text-xs text-gray-400 uppercase bg-white'>
            Or continue with email
          </span>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='name-input'
            className='block mb-1 text-sm font-medium text-gray-700'
          >
            Full name{' '}
            <span className='text-red-500' aria-hidden='true'>
              *
            </span>
          </label>
          <input
            id='name-input'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-required='true'
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='John Doe'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='avatar-input'
            className='block mb-1 text-sm font-medium text-gray-700'
          >
            Profile picture url{' '}
            <span className='text-xs text-gray-400'>(optional)</span>
          </label>
          <input
            id='avatar-input'
            type='url'
            value={avatar_url}
            onChange={(e) => setAvatar_url(e.target.value)}
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='https://unsplash.com/'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='email-input'
            className='block mb-1 text-sm font-medium text-gray-700'
          >
            Email address{' '}
            <span className='text-red-500' aria-hidden='true'>
              *
            </span>
          </label>
          <input
            id='email-input'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required='true'
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='you@example.com'
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='password-input'
            className='block mb-1 text-sm font-medium text-gray-700'
          >
            Password{' '}
            <span className='text-red-500' aria-hidden='true'>
              *
            </span>
          </label>
          <input
            id='password-input'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required='true'
            aria-describedby='password-hint'
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='At least 8 characters'
          />
          <span id='password-hint' className='block mt-1 text-xs text-gray-500'>
            Must contain at least 8 characters.
          </span>
        </div>

        <button
          type='submit'
          disabled={loading}
          aria-busy={loading}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60'
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className='mt-6 text-sm text-center text-gray-500'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline'
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
};
