type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  // Calculate page numbers (show ±2 pages)
  const pages: number[] = [];
  for (
    let i = Math.max(1, page - 2);
    i <= Math.min(totalPages, page + 2);
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className='flex items-center justify-center gap-2 mt-10 mb-10 sm:gap-3 sm:mt-12 sm:mb-12'>
      {/* Previous button */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className='px-3 py-2 text-xs font-medium text-gray-700 transition bg-white border rounded-lg shadow-sm sm:px-4 sm:py-2 sm:text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        &lt;
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2  text-xs font-medium border rounded-lg shadow-sm transition sm:px-5 sm:py-2 sm:text-sm ${
            p === page
              ? 'bg-slate-900 text-white shadow-md scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next button */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className='px-3 py-2 text-xs font-medium text-gray-700 transition bg-white border rounded-lg shadow-sm sm:px-4 sm:py-2 sm:text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        &gt;
      </button>
    </div>
  );
};
