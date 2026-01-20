import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className='mt-20 border-t border-slate-700 bg-slate-900'>
      {/* Main Content */}
      <div className='grid max-w-6xl gap-8 px-4 py-12 mx-auto sm:px-10 md:grid-cols-4'>
        {/* About Section */}
        <div>
          <h3 className='mb-2 text-lg font-bold text-white'>NewsHub</h3>
          <p className='text-sm text-gray-300'>
            A modern news article platform built with React & Supabase.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className='mb-2 font-semibold text-white'>Explore</h4>
          <ul className='space-y-1 text-sm text-gray-300'>
            <li>
              <a href='/' className='transition-colors hover:text-blue-400'>
                Home
              </a>
            </li>
            <li>
              <a href='/' className='transition-colors hover:text-blue-400'>
                Latest Articles
              </a>
            </li>
            <li>
              <a href='/' className='transition-colors hover:text-blue-400'>
                Categories
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className='mb-2 font-semibold text-white'>Legal</h4>
          <ul className='space-y-1 text-sm text-gray-300'>
            <li>
              <a href='/' className='transition-colors hover:text-blue-400'>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href='/' className='transition-colors hover:text-blue-400'>
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className='mb-2 font-semibold text-white'>Follow Us</h4>
          <div className='flex gap-4 mt-2 text-gray-300'>
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-blue-600'
            >
              <Facebook size={20} />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-blue-400'
            >
              <Twitter size={20} />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-pink-500'
            >
              <Instagram size={20} />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-blue-700'
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='py-6 text-sm text-center text-gray-400 border-t border-slate-700'>
        © 2026 News Hub. All rights reserved. Designed & built by{' '}
        <a
          href='https://www.linkedin.com/in/nirushan-rajamanoharan/'
          target='_blank'
          rel='noopener noreferrer'
          className='font-bold text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text'
        >
          NIRUSH.
        </a>
      </div>
    </footer>
  );
};
