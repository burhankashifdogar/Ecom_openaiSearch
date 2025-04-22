"use client"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Bar } from "@visx/shape"
import { LinePath } from "@visx/shape"
import { curveMonotoneX } from "@visx/curve"
import { Pie } from "@visx/shape"
import { Text } from "@visx/text"
import { localPoint } from "@visx/event"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { LegendOrdinal } from "@visx/legend"
import { ParentSize } from "@visx/responsive"

// Line Chart
interface LineChartProps {
  data: Array<{
    name: string
    data: number[]
  }>
  categories: string[]
  index: string
  colors?: string[]
  yAxisWidth?: number
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  valueFormatter?: (value: number) => string
}

export function LineChart({
  data,
  categories,
  index,
  colors = ["#2563eb", "#4f46e5", "#7c3aed", "#a855f7", "#d946ef"],
  yAxisWidth = 40,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  valueFormatter = (value: number) => `${value}`,
}: LineChartProps) {
  const getX = (d: any, i: number) => categories[i]
  const getY = (d: any) => d

  // Find min and max values for y-axis
  const allValues = data.flatMap((series) => series.data)
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const padding = (maxValue - minValue) * 0.1

  // Tooltip setup
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<{
    category: string
    values: { name: string; value: number }[]
  }>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "var(--tooltip-background)",
    color: "var(--tooltip-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    padding: "8px 12px",
    fontSize: "12px",
  }

  // Create color scale
  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.name),
    range: colors,
  })

  return (
    <div className="w-full h-full">
      {showLegend && (
        <div className="flex justify-center mb-4">
          <LegendOrdinal
            scale={colorScale}
            direction="row"
            labelMargin="0 15px 0 0"
            className="text-xs flex flex-wrap justify-center gap-4"
          />
        </div>
      )}
      <div className="w-full h-full" ref={containerRef}>
        <ParentSize>
          {({ width, height }) => {
            // Bounds
            const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }
            const innerWidth = width - margin.left - margin.right
            const innerHeight = height - margin.top - margin.bottom

            // Scales
            const xScale = scaleBand({
              domain: categories,
              range: [0, innerWidth],
              padding: 0.2,
            })

            const yScale = scaleLinear({
              domain: [Math.max(0, minValue - padding), maxValue + padding],
              range: [innerHeight, 0],
              nice: true,
            })

            return (
              <svg width={width} height={height}>
                <Group left={margin.left} top={margin.top}>
                  {showGridLines && (
                    <Grid
                      width={innerWidth}
                      height={innerHeight}
                      xScale={xScale}
                      yScale={yScale}
                      stroke="var(--border)"
                      strokeOpacity={0.4}
                      numTicksRows={5}
                      numTicksColumns={categories.length}
                    />
                  )}

                  {data.map((series, i) => (
                    <LinePath
                      key={`line-${series.name}`}
                      data={series.data}
                      x={(d, i) => xScale(categories[i]) ?? 0 + xScale.bandwidth() / 2}
                      y={(d) => yScale(d) ?? 0}
                      stroke={colorScale(series.name)}
                      strokeWidth={2}
                      curve={curveMonotoneX}
                    />
                  ))}

                  {/* Invisible bars for better tooltip interaction */}
                  {categories.map((category, i) => (
                    <Bar
                      key={`bar-${category}`}
                      x={xScale(category) ?? 0}
                      y={0}
                      width={xScale.bandwidth()}
                      height={innerHeight}
                      fill="transparent"
                      onMouseMove={(event) => {
                        const point = localPoint(event) || { x: 0, y: 0 }
                        showTooltip({
                          tooltipData: {
                            category,
                            values: data.map((series) => ({
                              name: series.name,
                              value: series.data[i],
                            })),
                          },
                          tooltipLeft: point.x,
                          tooltipTop: point.y,
                        })
                      }}
                      onMouseLeave={() => hideTooltip()}
                    />
                  ))}

                  {showXAxis && (
                    <AxisBottom
                      top={innerHeight}
                      scale={xScale}
                      stroke="var(--border)"
                      tickStroke="var(--border)"
                      tickLabelProps={{
                        fill: "var(--foreground)",
                        fontSize: 10,
                        textAnchor: "middle",
                      }}
                    />
                  )}

                  {showYAxis && (
                    <AxisLeft
                      scale={yScale}
                      stroke="var(--border)"
                      tickStroke="var(--border)"
                      tickLabelProps={{
                        fill: "var(--foreground)",
                        fontSize: 10,
                        textAnchor: "end",
                        dx: -4,
                        dy: 4,
                      }}
                      tickFormat={(value) => valueFormatter(value as number)}
                    />
                  )}
                </Group>
              </svg>
            )
          }}
        </ParentSize>

        {tooltipData && (
          <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div className="font-medium mb-1">{tooltipData.category}</div>
            {tooltipData.values.map((value, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorScale(value.name) }} />
                <span>
                  {value.name}: {valueFormatter(value.value)}
                </span>
              </div>
            ))}
          </TooltipInPortal>
        )}
      </div>
    </div>
  )
}

// Bar Chart
interface BarChartProps {
  data: Array<{
    name: string
    data: number[]
  }>
  categories: string[]
  index: string
  colors?: string[]
  yAxisWidth?: number
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  valueFormatter?: (value: number) => string
}

export function BarChart({
  data,
  categories,
  index,
  colors = ["#2563eb", "#4f46e5", "#7c3aed", "#a855f7", "#d946ef"],
  yAxisWidth = 40,
  showLegend = false,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  valueFormatter = (value: number) => `${value}`,
}: BarChartProps) {
  // Find min and max values for y-axis
  const allValues = data.flatMap((series) => series.data)
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const padding = (maxValue - minValue) * 0.1

  // Tooltip setup
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<{
    category: string
    values: { name: string; value: number }[]
  }>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "var(--tooltip-background)",
    color: "var(--tooltip-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    padding: "8px 12px",
    fontSize: "12px",
  }

  // Create color scale
  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.name),
    range: colors,
  })

  return (
    <div className="w-full h-full">
      {showLegend && (
        <div className="flex justify-center mb-4">
          <LegendOrdinal
            scale={colorScale}
            direction="row"
            labelMargin="0 15px 0 0"
            className="text-xs flex flex-wrap justify-center gap-4"
          />
        </div>
      )}
      <div className="w-full h-full" ref={containerRef}>
        <ParentSize>
          {({ width, height }) => {
            // Bounds
            const margin = { top: 20, right: 20, bottom: 40, left: yAxisWidth }
            const innerWidth = width - margin.left - margin.right
            const innerHeight = height - margin.top - margin.bottom

            // Scales
            const xScale = scaleBand({
              domain: categories,
              range: [0, innerWidth],
              padding: 0.2,
            })

            const yScale = scaleLinear({
              domain: [Math.max(0, minValue - padding), maxValue + padding],
              range: [innerHeight, 0],
              nice: true,
            })

            // Calculate bar width based on number of series
            const barWidth = xScale.bandwidth() / data.length

            return (
              <svg width={width} height={height}>
                <Group left={margin.left} top={margin.top}>
                  {showGridLines && (
                    <Grid
                      width={innerWidth}
                      height={innerHeight}
                      xScale={xScale}
                      yScale={yScale}
                      stroke="var(--border)"
                      strokeOpacity={0.4}
                      numTicksRows={5}
                      numTicksColumns={categories.length}
                    />
                  )}

                  {data.map((series, seriesIndex) => (
                    <Group key={`series-${series.name}`}>
                      {series.data.map((value, i) => (
                        <Bar
                          key={`bar-${series.name}-${i}`}
                          x={(xScale(categories[i]) ?? 0) + seriesIndex * barWidth}
                          y={yScale(value)}
                          width={barWidth}
                          height={innerHeight - yScale(value)}
                          fill={colorScale(series.name)}
                          opacity={0.8}
                          onMouseMove={(event) => {
                            const point = localPoint(event) || { x: 0, y: 0 }
                            showTooltip({
                              tooltipData: {
                                category: categories[i],
                                values: data.map((s) => ({
                                  name: s.name,
                                  value: s.data[i],
                                })),
                              },
                              tooltipLeft: point.x,
                              tooltipTop: point.y,
                            })
                          }}
                          onMouseLeave={() => hideTooltip()}
                        />
                      ))}
                    </Group>
                  ))}

                  {showXAxis && (
                    <AxisBottom
                      top={innerHeight}
                      scale={xScale}
                      stroke="var(--border)"
                      tickStroke="var(--border)"
                      tickLabelProps={{
                        fill: "var(--foreground)",
                        fontSize: 10,
                        textAnchor: "middle",
                      }}
                    />
                  )}

                  {showYAxis && (
                    <AxisLeft
                      scale={yScale}
                      stroke="var(--border)"
                      tickStroke="var(--border)"
                      tickLabelProps={{
                        fill: "var(--foreground)",
                        fontSize: 10,
                        textAnchor: "end",
                        dx: -4,
                        dy: 4,
                      }}
                      tickFormat={(value) => valueFormatter(value as number)}
                    />
                  )}
                </Group>
              </svg>
            )
          }}
        </ParentSize>

        {tooltipData && (
          <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div className="font-medium mb-1">{tooltipData.category}</div>
            {tooltipData.values.map((value, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorScale(value.name) }} />
                <span>
                  {value.name}: {valueFormatter(value.value)}
                </span>
              </div>
            ))}
          </TooltipInPortal>
        )}
      </div>
    </div>
  )
}

// Pie Chart
interface PieChartProps {
  data: Array<{
    name: string
    value: number
  }>
  index: string
  valueKey: string
  category?: string
  colors?: string[]
  showLegend?: boolean
  valueFormatter?: (value: number) => string
}

export function PieChart({
  data,
  index,
  valueKey,
  category,
  colors = ["#2563eb", "#4f46e5", "#7c3aed", "#a855f7", "#d946ef"],
  showLegend = false,
  valueFormatter = (value: number) => `${value}`,
}: PieChartProps) {
  // Tooltip setup
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<{
    name: string
    value: number
  }>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: "var(--tooltip-background)",
    color: "var(--tooltip-foreground)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    padding: "8px 12px",
    fontSize: "12px",
  }

  // Create color scale
  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.name),
    range: colors,
  })

  return (
    <div className="w-full h-full">
      {showLegend && (
        <div className="flex justify-center mb-4">
          <LegendOrdinal
            scale={colorScale}
            direction="row"
            labelMargin="0 15px 0 0"
            className="text-xs flex flex-wrap justify-center gap-4"
          />
        </div>
      )}
      <div className="w-full h-full" ref={containerRef}>
        <ParentSize>
          {({ width, height }) => {
            // Bounds
            const margin = { top: 20, right: 20, bottom: 20, left: 20 }
            const innerWidth = width - margin.left - margin.right
            const innerHeight = height - margin.top - margin.bottom
            const radius = Math.min(innerWidth, innerHeight) / 2
            const centerX = innerWidth / 2
            const centerY = innerHeight / 2

            return (
              <svg width={width} height={height}>
                <Group top={centerY + margin.top} left={centerX + margin.left}>
                  <Pie
                    data={data}
                    pieValue={(d) => d.value}
                    outerRadius={radius}
                    innerRadius={radius / 2}
                    padAngle={0.01}
                  >
                    {(pie) => {
                      return pie.arcs.map((arc, i) => {
                        const [centroidX, centroidY] = pie.path.centroid(arc)
                        const hasSpaceForLabel = arc.endAngle - arc.startAngle > 0.1
                        const arcPath = pie.path(arc) ?? ""
                        const arcFill = colorScale(arc.data.name)

                        return (
                          <g key={`arc-${i}`}>
                            <path
                              d={arcPath}
                              fill={arcFill}
                              onMouseMove={(event) => {
                                const point = localPoint(event) || { x: 0, y: 0 }
                                showTooltip({
                                  tooltipData: {
                                    name: arc.data.name,
                                    value: arc.data.value,
                                  },
                                  tooltipLeft: point.x,
                                  tooltipTop: point.y,
                                })
                              }}
                              onMouseLeave={() => hideTooltip()}
                            />
                            {hasSpaceForLabel && (
                              <Text
                                x={centroidX}
                                y={centroidY}
                                textAnchor="middle"
                                verticalAnchor="middle"
                                fill="white"
                                fontSize={12}
                                fontWeight="bold"
                              >
                                {arc.data.value}
                              </Text>
                            )}
                          </g>
                        )
                      })
                    }}
                  </Pie>
                </Group>
              </svg>
            )
          }}
        </ParentSize>

        {tooltipData && (
          <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorScale(tooltipData.name) }} />
              <span className="font-medium">{tooltipData.name}</span>
            </div>
            <div className="mt-1">{valueFormatter(tooltipData.value)}</div>
          </TooltipInPortal>
        )}
      </div>
    </div>
  )
}
