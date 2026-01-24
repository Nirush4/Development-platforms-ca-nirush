import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { Loading } from '../utils/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { useSnackbar } from 'notistack';

const DEBOUNCE_DELAY = 500;

export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Reset search input when navigating away from Home
  useEffect(() => {
    if (location.pathname !== '/') {
      setSearch('');
    }
  }, [location.pathname]);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
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

  // Debounced search navigation
  useEffect(() => {
    if (location.pathname !== '/') return; // ✅ only run on Home

    const handler = setTimeout(() => {
      navigate(`/?q=${encodeURIComponent(search)}&page=1`);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [search, navigate, location.pathname]);

  const handleLogout = async () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
        localStorage.clear();
        enqueueSnackbar('Logged out successfully', { variant: 'info' });
      } catch {
        enqueueSnackbar('Logout failed. Please try again.', {
          variant: 'error',
        });
      } finally {
        setLoading(false);
        window.location.reload();
      }
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

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(user
      ? [
          { name: 'New Article', path: '/articles/new' },
          { name: 'My Articles', path: '/my-articles' },
        ]
      : []),
  ];

  return (
    <>
      {loading && <Loading message='Logging out…' />}

      <nav className='fixed top-0 z-50 w-full px-4 bg-red-600 shadow-md sm:px-10'>
        <div className='flex items-center justify-between max-w-6xl py-4 mx-auto'>
          {/* Logo */}
          <Link to='/' className='flex items-center'>
            <img
              src='/logo.png'
              alt='NewsHub Logo'
              className='h-10 mr-2 w-29 sm:w-38 sm:h-15'
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='items-center hidden gap-6 md:flex'>
            {/* Search (desktop) */}
            <div className='relative'>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search articles...'
                className='w-56 py-1.5 pl-9 pr-3 text-sm rounded-full focus:outline-none'
              />
              <Search
                size={16}
                className='absolute text-gray-500 -translate-y-1/2 left-3 top-1/2'
              />
            </div>

            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.div
                  key={link.path}
                  className='relative'
                  initial='rest'
                  whileHover='hover'
                  animate={isActive ? 'hover' : 'rest'}
                >
                  <Link
                    to={link.path}
                    className={`font-medium transition-colors ${
                      isActive
                        ? 'text-yellow-400'
                        : 'text-gray-100 hover:text-yellow-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                  <motion.span
                    variants={{
                      rest: { scaleX: 0, opacity: 0 },
                      hover: { scaleX: 1, opacity: 1 },
                    }}
                    transition={{ duration: 0.2 }}
                    className='absolute left-0 right-0 -bottom-1 h-[3px] bg-yellow-400 rounded-full'
                  />
                </motion.div>
              );
            })}

            {user ? (
              <>
                <div className='flex items-center gap-2 pl-4 border-l-2 border-red-400'>
                  <img src={avatar} className='w-8 h-8 rounded-full' />
                  <span className='text-gray-100'>{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className='px-4 py-2 text-sm bg-white rounded-lg'
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-4 py-2 text-sm bg-white rounded-lg'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='text-gray-100 hover:text-yellow-400'
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-white md:hidden'
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='px-4 pb-4 md:hidden'
            >
              <div className='flex flex-col gap-4 pt-4 border-t border-red-500'>
                {/* Search (mobile) */}
                <div className='relative'>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search articles...'
                    className='w-full py-2 pr-3 text-sm rounded-full pl-9'
                  />
                  <Search
                    size={16}
                    className='absolute text-gray-500 -translate-y-1/2 left-3 top-1/2'
                  />
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className='font-medium text-gray-100 hover:text-yellow-400'
                  >
                    {link.name}
                  </Link>
                ))}

                {user ? (
                  <>
                    <div className='flex items-center gap-2 pt-2 border-t border-red-500'>
                      <img src={avatar} className='w-8 h-8 rounded-full' />
                      <span className='text-gray-100'>{username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className='px-4 py-2 text-sm bg-white rounded-lg'
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to='/login'
                      onClick={() => setIsOpen(false)}
                      className='px-4 py-2 text-sm bg-white rounded-lg'
                    >
                      Login
                    </Link>
                    <Link
                      to='/register'
                      onClick={() => setIsOpen(false)}
                      className='text-gray-100 hover:text-yellow-400'
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
