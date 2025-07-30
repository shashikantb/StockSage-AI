"use client"

import { CartesianGrid, Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react";

const generateChartData = () => {
  let lastPrice = 150 + Math.random() * 50;
  return Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'long' });
    lastPrice += (Math.random() - 0.45) * 20;
    lastPrice = Math.max(50, lastPrice); // Ensure price doesn't go too low
    return { month, price: Math.round(lastPrice) };
  });
}

const chartConfig = {
  price: {
    label: "Price (USD)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

type StockChartProps = {
  ticker: string;
}

export function StockChart({ ticker }: StockChartProps) {
    const [chartData, setChartData] = useState(generateChartData());

    useEffect(() => {
        // Re-generate data when ticker changes to simulate loading new stock data
        setChartData(generateChartData());
    }, [ticker]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <RechartsLineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          dataKey="price"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value}`}
          domain={['dataMin - 20', 'dataMax + 20']}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="price"
          type="natural"
          stroke="var(--color-price)"
          strokeWidth={3}
          dot={false}
        />
      </RechartsLineChart>
    </ChartContainer>
  )
}
