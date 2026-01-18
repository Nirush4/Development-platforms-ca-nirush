import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Loading } from '../utils/Loading';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    // Show full-screen loading before navigation
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

    // Delay for smooth UX
    setTimeout(() => {
      setShowLoader(false);
      navigate('/');
    }, 1000); // 1 second delay
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen px-4 bg-gray-50'>
      {/* Full-screen loader */}
      {showLoader && <Loading message='Signing in…' />}

      {/* Login form */}
      <form
        onSubmit={handleLogin}
        className='w-full max-w-md p-8 transition-opacity duration-300 bg-white border shadow-sm rounded-xl'
        style={{ opacity: showLoader ? 0.3 : 1 }}
      >
        {/* Header */}
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-gray-900'>Welcome back</h1>
          <p className='mt-1 text-sm text-gray-500'>Sign in to your account</p>
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Submit */}
        <button
          type='submit'
          disabled={loading}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60'
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        {/* Footer */}
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
