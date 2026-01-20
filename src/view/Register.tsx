import { useState } from 'react';
import supabase from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Loading } from '../utils/Loading';

export const Register = () => {
  const [name, setName] = useState('');
  const [avatar_url, setAvatar_url] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Sign up user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: {} }, // metadata optional
      });

      if (authError) {
        alert(authError.message);
        setLoading(false);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) throw new Error('No user ID returned from signup');

      // 2️⃣ Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: name, avatar_url })
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        alert('Failed to update profile info');
      }

      // ✅ Show full-screen loader before navigation
      setShowLoader(true);

      // Optional: Save user info in localStorage
      localStorage.setItem('username', name);
      localStorage.setItem(
        'avatar_url',
        avatar_url ||
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      );

      // Small delay for smooth animation
      setTimeout(() => {
        setShowLoader(false);
        alert('Check your email to confirm your registration.');
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      alert('Something went wrong while creating your account.');
      setLoading(false);
    }
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen px-4 bg-gray-50'>
      {/* Full-screen loader */}
      {showLoader && <Loading message='Creating account…' />}

      {/* Register form */}
      <form
        onSubmit={handleRegister}
        className='w-full max-w-md p-8 transition-opacity duration-300 bg-white border shadow-sm rounded-xl'
        style={{ opacity: showLoader ? 0.3 : 1 }}
      >
        {/* Header */}
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Create an account
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            Join NewsApp to start publishing
          </p>
        </div>

        {/* Name */}
        <div className='mb-4'>
          <label className='block mb-1 text-sm font-medium text-gray-700'>
            Full name
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='John Doe'
          />
        </div>

        {/* Avatar */}
        <div className='mb-4'>
          <label className='block mb-1 text-sm font-medium text-gray-700'>
            Profile picture url (optional)
          </label>
          <input
            type='text'
            value={avatar_url}
            onChange={(e) => setAvatar_url(e.target.value)}
            className='w-full px-3 py-2 text-sm transition border rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            placeholder='https://unsplash.com/'
          />
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
            placeholder='At least 8 characters'
          />
        </div>

        {/* Submit */}
        <button
          type='submit'
          disabled={loading}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60'
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        {/* Footer */}
        <p className='mt-6 text-sm text-center text-gray-500'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-blue-600 hover:text-blue-700'
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};
