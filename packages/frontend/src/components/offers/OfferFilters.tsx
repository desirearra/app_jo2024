import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  { value: 'special', label: 'Pass Spécial' },
];

export function OfferFilters({ onFilterChange, filters }: OfferFiltersProps) {
  const handleChange = (key: keyof OfferFilters, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="search">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher un événement..."
          value={filters.search || ''}
          onChange={e => handleChange('search', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type de pass</Label>
        <Select
          value={filters.type}
          onValueChange={(value: string) => {
            const validPassTypes = ['day', 'weekend', 'week', 'special', 'all'];
            if (validPassTypes.includes(value)) {
              handleChange('type', value as PassType);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            {passTypeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Prix</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => handleChange('minPrice', Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => handleChange('maxPrice', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          value={filters.date || ''}
          onChange={e => handleChange('date', e.target.value)}
        />
      </div>

      <Button variant="destructive" className="w-full" onClick={() => onFilterChange({})}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
