import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { Loading } from '../utils/Loading';

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user ?? null);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
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

      <nav className='fixed top-0 z-50 w-full px-4 bg-white border-b shadow-md sm:px-10'>
        <div className='flex items-center justify-between max-w-6xl py-4 mx-auto'>
          {/* Logo */}
          <Link
            to='/'
            className='font-serif text-2xl font-bold text-gray-900 transition hover:text-blue-600'
          >
            NewsHub
          </Link>

          {/* Navigation Links */}
          <div className='flex items-center gap-6'>
            <Link
              to='/'
              className='font-medium text-gray-700 transition hover:text-blue-600'
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to='/articles/new'
                  className='font-medium text-gray-700 transition hover:text-blue-600'
                >
                  New Article
                </Link>

                <Link
                  to='/my-articles'
                  className='font-medium text-gray-700 transition hover:text-blue-600'
                >
                  My Articles
                </Link>

                {/* User Info */}
                <div className='flex items-center gap-2 pl-4 border-l border-gray-300'>
                  <img
                    src={avatar}
                    alt='avatar'
                    className='object-cover w-8 h-8 rounded-full'
                  />
                  <span className='font-medium text-gray-800'>{username}</span>
                </div>

                {/* Prominent Logout Button */}
                <button
                  onClick={handleLogout}
                  className='px-4 py-2 text-sm font-medium text-white transition duration-200 bg-red-600 rounded-lg shadow-sm hover:bg-red-700'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Prominent Login Button */}
                <Link
                  to='/login'
                  className='px-4 py-2 text-sm font-medium text-white transition duration-200 bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700'
                >
                  Login
                </Link>

                {/* Subtle Register Link */}
                <Link
                  to='/register'
                  className='ml-2 font-medium text-gray-700 transition hover:text-blue-600'
                >
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
