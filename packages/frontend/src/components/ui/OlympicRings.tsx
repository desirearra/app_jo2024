import { cn } from '@/lib/utils';

// Couleurs des anneaux olympiques
const colors = {
  blue: '#002395',
  red: '#ED2939',
};

interface OlympicRingsProps {
  className?: string;
  variant?: 'hero' | 'small';
}

export function OlympicRings({ className, variant = 'hero' }: OlympicRingsProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Grand anneau bleu */}
      <div
        className={cn(
          'absolute',
          variant === 'hero'
            ? '-top-[20%] -left-[5%] w-[500px] h-[500px] opacity-15'
            : '-top-[10%] -left-[2%] w-[200px] h-[200px] opacity-10',
          'animate-ring-fade-in'
        )}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="none"
            stroke={colors.blue}
            strokeWidth="3"
            className="animate-ring-draw"
          />
        </svg>
      </div>

      {/* Grand anneau rouge */}
      <div
        className={cn(
          'absolute',
          variant === 'hero'
            ? 'top-[5%] left-[15%] w-[400px] h-[400px] opacity-15'
            : 'top-[2%] left-[8%] w-[160px] h-[160px] opacity-10',
          'animate-ring-fade-in-delayed'
        )}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="none"
            stroke={colors.red}
            strokeWidth="3"
            className="animate-ring-draw-delayed"
          />
        </svg>
      </div>
    </div>
  );
}
