import { useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { router } from '@inertiajs/react'
import { urlFor } from '@/client'

interface DailySale {
  day: number
  sales: number
  amount: number
}

interface Props {
  data: DailySale[]
  selectedMonth: string
  selectedYear: number
  availableMonths: Array<{ value: string; label: string }>
}

const chartConfig = {
  sales: {
    label: 'Ventas',
    color: '#3b82f6',
  },
  amount: {
    label: 'Monto',
    color: '#10b981',
  },
} satisfies ChartConfig

export function SalesEvolutionChart({ data, selectedMonth, selectedYear, availableMonths }: Props) {
  const [metric, setMetric] = useState<'sales' | 'amount'>('sales')

  const handleMonthChange = (value: string) => {
    const [year, month] = value.split('-')
    router.get(
      urlFor('reports.index'),
      { month, year },
      {
        preserveState: true,
        preserveScroll: true,
      }
    )
  }

  const currentValue = `${selectedYear}-${selectedMonth}`

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Evolución de Ventas</CardTitle>
          <div className="flex gap-2">
            <Select value={metric} onValueChange={(value: any) => setMetric(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Cantidad</SelectItem>
                <SelectItem value="amount">Monto</SelectItem>
              </SelectContent>
            </Select>
            <Select value={currentValue} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay datos disponibles para este mes
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Día ${value}`}
                    formatter={(value, name) => {
                      if (name === 'amount') {
                        return [
                          new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                          }).format(value as number),
                          'Monto',
                        ]
                      }
                      return [value, 'Ventas']
                    }}
                  />
                }
              />
              <Line
                dataKey={metric}
                type="monotone"
                stroke={chartConfig[metric].color}
                strokeWidth={2}
                dot={{
                  fill: chartConfig[metric].color,
                  r: 3,
                }}
                activeDot={{
                  r: 5,
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
