'use client'

interface LineChartProps {
  data: any[]
  xKey: string
  yKey: string
  gradient?: boolean
  height?: number
}

export function LineChart({ data, xKey, yKey, gradient = false, height = 300 }: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-xl" style={{ height }}>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d: any) => d[yKey] || 0))
  const minValue = 0
  const range = maxValue - minValue || 1
  const barWidth = 100 / data.length

  return (
    <div style={{ height }} className="relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-400 py-2">
        <span>{maxValue}</span>
        <span>{Math.round(maxValue / 2)}</span>
        <span>0</span>
      </div>

      {/* Chart area */}
      <div className="ml-12 h-full flex items-end gap-1">
        {data.map((item: any, index: number) => {
          const value = item[yKey] || 0
          const heightPercent = (value / range) * 100
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full group"
            >
              <div
                className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80"
                style={{
                  height: `${heightPercent}%`,
                  background: gradient
                    ? 'linear-gradient(to top, #247BF7, #6366F1)'
                    : '#247BF7',
                  minHeight: value > 0 ? '4px' : '0',
                }}
              />
              <span className="text-[10px] text-gray-400 mt-1 truncate w-full text-center">
                {item[xKey]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface DonutChartProps {
  data: any[]
  nameKey: string
  valueKey: string
  height?: number
}

export function DonutChart({ data, nameKey, valueKey, height = 300 }: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-xl" style={{ height }}>
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    )
  }

  const colors = ['#247BF7', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E']
  const total = data.reduce((sum: number, item: any) => sum + (item[valueKey] || 0), 0)

  return (
    <div style={{ height }} className="flex items-center gap-6">
      {/* Donut */}
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item: any, index: number) => {
            const value = item[valueKey] || 0
            const percentage = (value / total) * 100
            const offset = data.slice(0, index).reduce((sum: number, d: any) => sum + ((d[valueKey] || 0) / total) * 100, 0) * 0.88
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="12"
                strokeDasharray={`${percentage * 0.88} ${88 - percentage * 0.88}`}
                strokeDashoffset={-offset}
                className="transition-all duration-500"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600 capitalize">{item[nameKey]}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{item[valueKey]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}