'use client';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

const chartData = [
  { month: 'Janvier', revenus: 1200 },
  { month: 'Février', revenus: 2100 },
  { month: 'Mars', revenus: 800 },
];

const chartConfig = {
  revenus: {
    label: 'Revenus',
    color: 'hsl(var(--chart-1))',
  },
} as const;

export function RevenueChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-[400px] w-full"
      data-testid="chart"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenus" fill="hsl(var(--chart-1))" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
