export const SingleArticleSkeleton = () => {
  return (
    <div className='max-w-4xl px-4 mx-auto mb-10 mt-28 sm:mb-20 sm:px-6 animate-pulse'>
      {/* Back button */}
      <div className='w-24 h-4 mb-6 bg-gray-200 rounded' />

      {/* Hero Image */}
      <div className='relative w-full h-64 mb-6 overflow-hidden bg-gray-200 rounded-lg sm:h-96'>
        <div className='absolute inset-0 bg-gray-300/50' />
      </div>

      {/* Title */}
      <div className='w-3/4 h-6 mb-4 bg-gray-200 rounded sm:h-10' />

      {/* Author row */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gray-200 rounded-full' />
        <div className='space-y-2'>
          <div className='w-32 h-3 bg-gray-200 rounded' />
          <div className='w-24 h-3 bg-gray-200 rounded' />
        </div>
      </div>

      {/* Body lines */}
      <div className='space-y-3'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='w-full h-3 bg-gray-200 rounded' />
        ))}
        <div className='w-2/3 h-3 bg-gray-200 rounded' />
      </div>

      {/* Action buttons */}
      <div className='flex gap-3 mt-8'>
        <div className='w-24 bg-gray-300 rounded-full h-9' />
        <div className='w-24 bg-gray-300 rounded-full h-9' />
      </div>
    </div>
  );
};
