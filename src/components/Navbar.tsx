import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  const placeholderAvatar =
    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

  return (
    <header className='fixed top-0 z-50 w-full py-2 border-b bg-white/90 backdrop-blur'>
      <nav className='flex items-center justify-between h-16 px-4 mx-auto sm:px-10 max-w-7xl'>
        {/* Logo */}
        <Link to='/' className='text-xl font-bold tracking-tight text-gray-900'>
          News<span className='text-blue-600'>App</span>
        </Link>

        {/* Navigation */}
        <div className='flex items-center gap-4'>
          {user ? (
            <>
              {/* User avatar + name */}
              <div className='flex items-center gap-2'>
                <img
                  src={user.user_metadata?.avatar_url ?? placeholderAvatar}
                  alt={user.user_metadata?.name ?? 'User'}
                  className='object-cover w-8 h-8 rounded-full'
                />
                <span className='text-sm font-medium text-gray-700'>
                  Hello, {user.user_metadata?.name ?? 'User'}
                </span>
              </div>

              <Link
                to='/create'
                className='px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700'
              >
                Create Article
              </Link>

              <button
                onClick={handleLogout}
                className='px-4 py-2 text-sm font-medium text-gray-600 transition rounded-md hover:bg-gray-200 hover:text-gray-900'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='px-4 py-2 text-sm font-medium text-gray-600 transition rounded-md hover:bg-gray-100 hover:text-gray-900'
              >
                Login
              </Link>

              <Link
                to='/register'
                className='px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700'
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
