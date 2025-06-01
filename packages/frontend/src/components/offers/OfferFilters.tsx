import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PassType } from './OfferCard';

export interface OfferFiltersProps {
  onFilterChange: (filters: OfferFilters) => void;
  filters: OfferFilters;
}

export interface OfferFilters {
  type?: PassType;
  sport?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  location?: string;
  search?: string;
}

const passTypeOptions = [
  { value: 'day', label: 'Pass Journée' },
  { value: 'weekend', label: 'Pass Week-end' },
  { value: 'week', label: 'Pass Semaine' },
];

export function OfferFilters({ onFilterChange, filters }: OfferFiltersProps) {
  const handleChange = (key: keyof OfferFilters, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  // Contraintes UX : minPrice <= maxPrice, valeurs positives
  const minPrice = filters.minPrice && filters.minPrice > 0 ? filters.minPrice : '';
  const maxPrice = filters.maxPrice && filters.maxPrice > 0 ? filters.maxPrice : '';

  return (
    <div className="flex flex-wrap gap-2 md:gap-4 items-end bg-card rounded-lg  md:flex-nowrap overflow-x-auto">
      {/* Recherche */}
      <Input
        id="search"
        className="w-full min-w-[140px]  xl:w-[420px]"
        placeholder="Rechercher..."
        value={filters.search || ''}
        onChange={e => handleChange('search', e.target.value)}
      />

      {/* Types sous forme de chips */}
      <div className="flex gap-1">
        {passTypeOptions.map(option => (
          <Button
            key={option.value}
            type="button"
            variant={filters.type === option.value ? 'default' : 'outline'}
            className={cn(
              'rounded-full px-3 py-1 text-sm',
              filters.type === option.value && 'ring-2 ring-blue-500'
            )}
            onClick={() =>
              handleChange('type', filters.type === option.value ? undefined : option.value)
            }
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Prix min/max */}
      <div className="flex gap-1 items-center">
        <Input
          type="number"
          min={0}
          placeholder="Min €"
          className="w-20"
          value={minPrice}
          onChange={e => {
            const val = Number(e.target.value);
            handleChange('minPrice', val > 0 ? val : undefined);
          }}
        />
        <span className="mx-1 text-slate-400">-</span>
        <Input
          type="number"
          min={0}
          placeholder="Max €"
          className="w-20"
          value={maxPrice}
          onChange={e => {
            const val = Number(e.target.value);
            handleChange('maxPrice', val > 0 ? val : undefined);
          }}
        />
      </div>

      {/* Bouton reset */}
      <Button variant="destructive" className="ml-auto" onClick={() => onFilterChange({})}>
        Réinitialiser
      </Button>
    </div>
  );
}
