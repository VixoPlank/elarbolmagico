import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

interface Product {
  name: string
  quantity: number
}

interface Props {
  title: string
  data: Product[]
  color?: string
}

export function TopProductsChart({ title, data, color = 'hsl(var(--chart-1))' }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No hay datos disponibles</p>
        </CardContent>
      </Card>
    )
  }

  const chartConfig = {
    quantity: {
      label: 'Cantidad',
      color: color,
    },
    name: {
      label: 'Producto',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <XAxis type="number" dataKey="quantity" hide />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={150}
              tickFormatter={(value) => {
                // Truncate long names
                return value.length > 20 ? value.slice(0, 20) + '...' : value
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    // Show full product name in tooltip
                    return payload?.[0]?.payload?.name || value
                  }}
                />
              }
            />
            <Bar dataKey="quantity" fill={color} radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
