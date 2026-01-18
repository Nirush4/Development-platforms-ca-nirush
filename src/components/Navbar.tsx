import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Loading } from '../utils/Loading';

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // loading state for logout

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);

    setTimeout(async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('username');
      localStorage.removeItem('avatar_url');
      setLoading(false);
    }, 1000);
  };

  const username =
    localStorage.getItem('username') ||
    user?.user_metadata?.name ||
    user?.email ||
    'User';
  const avatar =
    localStorage.getItem('avatar_url') ||
    user?.user_metadata?.avatar_url ||
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  return (
    <>
      {loading && <Loading message='Logging out…' />}
      <nav className='fixed top-0 z-50 w-full bg-white border-b'>
        <div className='flex items-center justify-between max-w-6xl px-4 py-4 mx-auto'>
          {/* Logo */}
          <Link to='/' className='text-xl font-bold'>
            NewsApp
          </Link>

          <div className='flex items-center gap-6'>
            <Link to='/' className='hover:text-blue-600'>
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to='/articles/new'
                  className='font-medium hover:text-blue-600'
                >
                  New Article
                </Link>

                <Link
                  to='/my-articles'
                  className='font-medium hover:text-blue-600'
                >
                  My Articles
                </Link>

                <div className='flex items-center gap-2'>
                  <img
                    src={avatar}
                    alt='avatar'
                    className='object-cover w-8 h-8 rounded-full'
                  />
                  <span className='text-sm font-medium'>{username}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className='text-sm text-red-500 hover:underline'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='hover:text-blue-600'>
                  Login
                </Link>
                <Link to='/register' className='hover:text-blue-600'>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
