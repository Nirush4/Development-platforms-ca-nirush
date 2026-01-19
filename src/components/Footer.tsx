export const Footer = () => {
  return (
    <footer className='mt-20 border-t bg-gray-50'>
      {/* Main Content */}
      <div className='grid max-w-6xl gap-8 px-4 py-12 mx-auto sm:px-10 md:grid-cols-3'>
        {/* About Section */}
        <div>
          <h3 className='mb-2 text-lg font-bold text-gray-900'>NewsHub</h3>
          <p className='text-sm text-gray-600'>
            A modern news article platform built with React & Supabase.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className='mb-2 font-semibold text-gray-900'>Explore</h4>
          <ul className='space-y-1 text-sm text-gray-600'>
            <li>
              <a href='/' className='transition-colors hover:text-blue-600'>
                Home
              </a>
            </li>
            <li>
              <a href='/' className='transition-colors hover:text-blue-600'>
                Latest Articles
              </a>
            </li>
            <li>
              <a href='/' className='transition-colors hover:text-blue-600'>
                Categories
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className='mb-2 font-semibold text-gray-900'>Legal</h4>
          <ul className='space-y-1 text-sm text-gray-600'>
            <li>
              <a href='/' className='transition-colors hover:text-blue-600'>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href='/' className='transition-colors hover:text-blue-600'>
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='py-6 text-sm text-center text-gray-500 border-t border-gray-200'>
        © {new Date().getFullYear()} NewsHub. All rights reserved.
      </div>
    </footer>
  );
};
