export const HomeSkeleton = () => {
  return (
    <div className='w-full bg-gray-50 animate-pulse'>
      {/* ===== Hero Skeleton ===== */}
      <section className='relative flex items-center w-full bg-gray-300 h-dvh'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8'>
          <div className='w-24 h-6 mx-auto mb-4 bg-gray-200 rounded' />
          <div className='h-10 max-w-6xl mx-auto mb-4 bg-gray-200 rounded w-[20rem] sm:w-[60rem] sm:h-12 lg:h-16' />
          <div className='h-4 max-w-2xl mx-auto mb-2 bg-gray-200 rounded' />
          <div className='h-4 max-w-xl mx-auto mb-6 bg-gray-200 rounded' />
          <div className='w-48 h-10 mx-auto bg-gray-200 rounded-lg' />
        </div>
      </section>

      {/* ===== Latest Articles Skeleton ===== */}
      <section className='relative z-10 px-4 mx-auto mt-[5rem] sm:mt-[9rem] max-w-6xl sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='overflow-hidden bg-white shadow-md rounded-xl'
            >
              <div className='w-full h-48 bg-gray-300' />
              <div className='p-4 space-y-3'>
                <div className='w-20 h-3 bg-gray-300 rounded' />
                <div className='h-4 bg-gray-300 rounded' />
                <div className='w-5/6 h-4 bg-gray-300 rounded' />
                <div className='w-4/6 h-3 bg-gray-200 rounded' />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Top Stories Skeleton ===== */}
      <section className='px-4 mx-auto mt-16 mb-10 sm:mb-20 max-w-7xl sm:px-6 lg:px-8'>
        <div className='w-40 h-6 mb-6 bg-gray-300 rounded' />
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='overflow-hidden bg-white shadow-md rounded-xl'
            >
              <div className='w-full h-48 bg-gray-300' />
              <div className='p-4 space-y-3'>
                <div className='w-16 h-3 bg-gray-300 rounded' />
                <div className='h-4 bg-gray-300 rounded' />
                <div className='w-5/6 h-3 bg-gray-200 rounded' />
                <div className='w-24 h-8 mt-4 bg-gray-300 rounded-full' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
