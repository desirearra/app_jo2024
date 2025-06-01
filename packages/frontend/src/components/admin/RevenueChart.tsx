'use client';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

const chartConfig = {
  revenus: {
    label: 'Revenus',
    color: 'hsl(var(--chart-1))',
  },
} as const;

/**
 * Affiche un graphique des revenus mensuels
 * @param data Array<{ month: string; revenus: number }>
 */
export type RevenueChartData = { month: string; revenus: number }[];

export function RevenueChart({ data }: { data: RevenueChartData }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-[400px] w-full"
      data-testid="chart"
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenus" fill="hsl(var(--chart-1))" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
