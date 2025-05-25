import { RevenueChart } from '@/components/admin/RevenueChart';
import { render, screen } from '@testing-library/react';

describe('RevenueChart', () => {
  it('affiche le graphique des revenus', () => {
    render(<RevenueChart />);
    // Vérifie la présence du container principal du chart
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
