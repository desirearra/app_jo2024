import { RevenueChart } from '@/components/admin/RevenueChart';
import { get } from '@/lib/api';
import { useEffect } from 'react';

type Stat = { label: string; value: string; sub: string };
type Sale = { name: string; email: string; amount: string };

type DashboardTabProps = {
  stats: Stat[];
  sales: Sale[];
};

export function DashboardTab({ stats, sales }: DashboardTabProps) {
  useEffect(() => {
    const getOffers = async () => {
      const response = await get('/offers');
      console.log(response.data);
    };
    getOffers();
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-3 flex flex-col items-start"
          >
            <div className="text-[11px] text-muted-foreground mb-1">{stat.label}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-[11px] text-green-600 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
        <div className="bg-white rounded-lg shadow p-6 flex-1 min-w-[280px] flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-4">Revenus mensuels</h2>
          <RevenueChart />
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex-1 min-w-[280px] flex flex-col justify-start">
          <h2 className="text-lg font-semibold mb-4">Ventes récentes</h2>
          <ul className="divide-y">
            {sales.map(sale => (
              <li key={sale.email} className="py-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{sale.name}</div>
                  <div className="text-xs text-muted-foreground">{sale.email}</div>
                </div>
                <span className="font-semibold">{sale.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
