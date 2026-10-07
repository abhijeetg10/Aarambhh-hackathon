import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Loader2 } from "lucide-react"

export default function CapacityForecast() {
  const [horizon, setHorizon] = useState("7")

  const { data: forecastData, isLoading: isLoadingForecast } = useQuery({
    queryKey: ['forecast', horizon],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horizon: parseInt(horizon) })
      })
      if (!res.ok) throw new Error('Failed to fetch forecast')
      return res.json()
    }
  })

  const { data: evalData } = useQuery({
    queryKey: ['model-evaluations'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/model-evaluations')
      if (!res.ok) throw new Error('Failed to fetch evaluation')
      return res.json()
    }
  })

  const chartData = forecastData?.chart_data || []
  
  // Find peak demand in the future predictions
  const futureData = chartData.filter((d: any) => d.predicted !== null && d.actual === null)
  let peakDemand = 0
  let peakDate = "N/A"
  let shortfallDate = "None"
  const CAPACITY = 120 // Updated capacity to match Overview

  if (futureData.length > 0) {
    const peakNode = futureData.reduce((max: any, node: any) => node.predicted > max.predicted ? node : max, futureData[0])
    peakDemand = peakNode.predicted
    peakDate = peakNode.date

    const firstShortfall = futureData.find((d: any) => d.predicted > CAPACITY)
    if (firstShortfall) shortfallDate = firstShortfall.date
  }

  const modelMetrics = evalData && evalData.length > 0 ? evalData[0] : null

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-heading">Capacity Forecast</h2>
        <div className="flex items-center space-x-2">
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="14">14 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Evaluation Report</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Peak Demand (Next {horizon} Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingForecast ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${peakDemand >= CAPACITY ? 'text-destructive' : 'text-slate-900'}`}>{peakDemand} Beds</div>
                <p className="text-xs text-muted-foreground">Expected on {peakDate}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shortfall Timing</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoadingForecast ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${shortfallDate !== 'None' ? 'text-destructive' : 'text-slate-900'}`}>{shortfallDate}</div>
                <p className="text-xs text-muted-foreground">
                  {shortfallDate !== 'None' ? `Demand exceeds ${CAPACITY} staffed beds` : 'Capacity sufficient'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Model Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{modelMetrics ? modelMetrics.model_version : "Loading..."}</div>
            {modelMetrics && (
              <p className="text-xs text-muted-foreground mt-1">MAE: {modelMetrics.MAE} | RMSE: {modelMetrics.RMSE}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Demand vs Capacity Forecast</CardTitle>
          <CardDescription>
            Unconstrained demand projection with 80% confidence interval driven by ML backend
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[400px] w-full">
            {isLoadingForecast ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[60, 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  
                  {/* Prediction Range Fill */}
                  <Area type="monotone" dataKey="range" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  
                  {/* Boundary Lines for Range */}
                  <Line type="monotone" dataKey="upper" stroke="#1e293b" strokeOpacity={0.6} strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />
                  <Line type="monotone" dataKey="lower" stroke="#1e293b" strokeOpacity={0.6} strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />
                  
                  {/* Forecast Line */}
                  <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={{r: 6}} />
                  
                  {/* Actual Line */}
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "white"}} activeDot={{r: 6}} />
                  
                  <ReferenceLine y={CAPACITY} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: `Staffed Capacity (${CAPACITY})`, fill: 'hsl(var(--destructive))', fontSize: 12 }} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
