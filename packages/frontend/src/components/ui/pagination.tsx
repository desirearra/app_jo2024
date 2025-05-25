import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">
        Page {page} sur {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
