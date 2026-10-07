import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BedDouble, AlertTriangle, Bell, Calendar, ChevronRight, Activity, TrendingUp } from "lucide-react"
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line } from "recharts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"



export default function Overview() {
  const { data: forecastData, isLoading } = useQuery({
    queryKey: ['forecast'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8000/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horizon: 7 })
      })
      if (!res.ok) throw new Error('Failed to fetch forecast')
      return res.json()
    }
  })

  const chartData = forecastData?.chart_data || []

  return (
    <div className="flex-1 space-y-6 p-6 pt-8 max-w-[1600px] mx-auto">
      
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading text-slate-900">Hospital Overview</h2>
          <p className="text-slate-500 mt-1">Capacity intelligence for better patient flow</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 font-medium">
            Demo data
          </Badge>
          <Button variant="outline" className="flex items-center gap-2 font-medium text-slate-600 border-slate-300">
            <Calendar className="h-4 w-4" />
            Next 7 days
            <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
          </Button>
          <Button variant="ghost" size="icon" className="relative rounded-full text-slate-500 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-white"></span>
          </Button>
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold">SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100/50 p-8 shadow-sm flex items-center justify-between">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">Plan ahead. Care with confidence.</h1>
          <p className="text-slate-600 text-lg">AI-powered insights to optimize hospital capacity and deliver better care for every patient.</p>
        </div>
        {/* Placeholder for the hospital background image styling */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000')] bg-cover bg-center mask-image:linear-gradient(to_left,white,transparent)]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/80 to-transparent z-0"></div>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <BedDouble className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Operational Beds</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">120</h3>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                ↑ 4% vs. last week
              </span>
            </div>
          </CardContent>
        </Card>
        
        {/* Card 2 */}
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Occupied Beds</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">93</h3>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                77.5% utilization
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Available ICU Beds</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">3</h3>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                ↓ 50% vs. last week
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 text-orange-500 rounded-lg">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Capacity Alerts</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-1">2</h3>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-orange-500 flex items-center">
                ↑ +1 <span className="text-slate-400 font-normal ml-1">vs. yesterday</span>
              </span>
              <div className="flex items-end gap-1 h-8">
                <div className="w-1.5 bg-orange-200 rounded-t-sm h-3"></div>
                <div className="w-1.5 bg-orange-300 rounded-t-sm h-5"></div>
                <div className="w-1.5 bg-orange-400 rounded-t-sm h-4"></div>
                <div className="w-1.5 bg-orange-500 rounded-t-sm h-7"></div>
                <div className="w-1.5 bg-orange-500 rounded-t-sm h-6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Forecast Chart */}
        <Card className="col-span-2 rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-lg font-bold">Bed Demand Forecast</CardTitle>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-md shadow-sm">General</button>
              <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">ICU</button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px] w-full">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 150]} ticks={[0, 30, 60, 90, 120, 150]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  {/* Prediction Range Fill */}
                  <Area type="monotone" dataKey="range" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.2} />
                  
                  {/* Boundary Lines for Range */}
                  <Line type="monotone" dataKey="upper" stroke="#1e293b" strokeOpacity={0.6} strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />
                  <Line type="monotone" dataKey="lower" stroke="#1e293b" strokeOpacity={0.6} strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />
                  
                  {/* Forecast Line */}
                  <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{r: 6}} />
                  
                  {/* Actual Line */}
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "white"}} activeDot={{r: 6}} />
                  
                  {/* Capacity Line */}
                  <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="4 4" />
                  
                  {/* Today Line */}
                  <ReferenceLine x={chartData && chartData.length > 7 ? chartData[6].date : "Today"} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#64748b', fontSize: 11 }} />
                </ComposedChart>
              </ResponsiveContainer>
              )}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary border-2 border-white ring-1 ring-primary"></div>
                Actual
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 border-t-2 border-primary border-dashed"></div>
                Forecast
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-primary/15 rounded-sm"></div>
                Prediction range
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 border-t-2 border-amber-500 border-dashed"></div>
                Capacity (120)
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resource Outlook */}
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <CardTitle className="text-lg font-bold">Resource Outlook</CardTitle>
            <div className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              ICU pressure expected in 48h
              <ChevronRight className="h-3 w-3" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Ventilators</h4>
                  <p className="text-xs text-slate-500">67% utilization</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-slate-900">8</span>
                <span className="text-sm text-slate-500"> / 12</span>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Oxygen Support</h4>
                  <p className="text-xs text-slate-500">80% utilization</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-slate-900">24</span>
                <span className="text-sm text-slate-500"> patients</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Data Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Ward Capacity */}
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-bold">Ward Capacity</CardTitle>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex text-xs font-semibold text-slate-500 mb-1">
                <div className="w-1/3">Ward</div>
                <div className="w-1/4 text-center">Occupied / Total</div>
                <div className="flex-1 text-right">Utilization</div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">General Medicine</div>
                <div className="w-1/4 text-center text-slate-600">48 / 60</div>
                <div className="flex-1 flex items-center justify-end gap-3">
                  <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">80%</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">ICU</div>
                <div className="w-1/4 text-center text-slate-600">9 / 12</div>
                <div className="flex-1 flex items-center justify-end gap-3">
                  <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">75%</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">Cardiology</div>
                <div className="w-1/4 text-center text-slate-600">18 / 24</div>
                <div className="flex-1 flex items-center justify-end gap-3">
                  <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#38bdf8] h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">75%</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">Orthopedics</div>
                <div className="w-1/4 text-center text-slate-600">18 / 24</div>
                <div className="flex-1 flex items-center justify-end gap-3">
                  <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#60a5fa] h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">75%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Disease-wise Demand */}
        <Card className="rounded-xl shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-bold">Disease-wise Demand</CardTitle>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex text-xs font-semibold text-slate-500 mb-1">
                <div className="w-1/3">Condition</div>
                <div className="w-1/3">Predicted patients (next 7 days)</div>
                <div className="w-1/3 text-right">Share</div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">Respiratory</div>
                <div className="w-1/3 text-slate-600">42</div>
                <div className="w-1/3 flex items-center justify-end gap-2">
                  <div className="w-12 bg-slate-100 h-2 rounded-sm overflow-hidden">
                    <div className="bg-primary h-full rounded-sm" style={{ width: '100%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">32%</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">Cardiovascular</div>
                <div className="w-1/3 text-slate-600">36</div>
                <div className="w-1/3 flex items-center justify-end gap-2">
                  <div className="w-12 bg-slate-100 h-2 rounded-sm overflow-hidden">
                    <div className="bg-[#0ea5e9] h-full rounded-sm" style={{ width: '85%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">27%</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">Gastrointestinal</div>
                <div className="w-1/3 text-slate-600">28</div>
                <div className="w-1/3 flex items-center justify-end gap-2">
                  <div className="w-12 bg-slate-100 h-2 rounded-sm overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-sm" style={{ width: '65%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">21%</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <div className="w-1/3 font-medium text-slate-800">Other</div>
                <div className="w-1/3 text-slate-600">26</div>
                <div className="w-1/3 flex items-center justify-end gap-2">
                  <div className="w-12 bg-slate-100 h-2 rounded-sm overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-sm" style={{ width: '60%' }}></div>
                  </div>
                  <span className="font-semibold text-slate-700 w-8 text-right">20%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Priority Alerts */}
        <Card className="rounded-xl shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-bold">Priority Alerts</CardTitle>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-full mt-0.5">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900">ICU demand may exceed capacity</h4>
                <p className="text-xs text-slate-500 mt-1">Forecast shows demand above staffed beds in 48h.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 text-orange-500 rounded-full mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900">Ventilator threshold</h4>
                <p className="text-xs text-slate-500 mt-1">Utilization may exceed 80% within 72 hours.</p>
              </div>
            </div>
            
            <div className="text-xs text-right text-slate-400 flex items-center justify-end gap-2 mt-2">
              <Clock className="h-3 w-3" />
              Updated 2 min ago • Staff review required
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
