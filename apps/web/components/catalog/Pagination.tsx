'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(totalPages - 5);
    return pages.slice(currentPage - 3, currentPage + 2);
  };

  const visible = getVisiblePages();
  const firstVisible = visible[0] ?? 1;
  const lastVisible = visible[visible.length - 1] ?? totalPages;

  return (
    <nav aria-label="Пагінація каталогу" className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Попередня сторінка"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ←
      </button>

      {firstVisible > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            1
          </button>
          {firstVisible > 2 && <span className="text-white/30 px-1">…</span>}
        </>
      )}

      {visible.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-label={`Сторінка ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
            currentPage === page
              ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/30'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          {page}
        </button>
      ))}

      {lastVisible < totalPages && (
        <>
          {lastVisible < totalPages - 1 && (
            <span className="text-white/30 px-1">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Наступна сторінка"
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        →
      </button>
    </nav>
  );
}