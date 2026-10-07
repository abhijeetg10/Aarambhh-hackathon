import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Stethoscope, Battery, Pill, Syringe, Wind, Activity } from "lucide-react"

const ventData = [
  { time: '00:00', demand: 18, capacity: 25 },
  { time: '04:00', demand: 19, capacity: 25 },
  { time: '08:00', demand: 22, capacity: 25 },
  { time: '12:00', demand: 23, capacity: 25 },
  { time: '16:00', demand: 24, capacity: 25 },
  { time: '20:00', demand: 21, capacity: 25 },
  { time: '24:00', demand: 20, capacity: 25 },
]

export default function ResourceForecast() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Resource Forecast</h2>
          <p className="text-slate-500 mt-1">Predictive monitoring for critical medical equipment and consumables.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wind className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Ventilators</h3>
                <p className="text-xs text-slate-500">ICU & Emergency</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-slate-900">22<span className="text-lg text-slate-400 font-normal">/25</span></span>
                <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200">Critical</Badge>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
              <p className="text-xs text-slate-500">Forecast: 100% utilization in 12hrs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Oxygen Ports</h3>
                <p className="text-xs text-slate-500">Central Supply</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-slate-900">145<span className="text-lg text-slate-400 font-normal">/200</span></span>
                <Badge className="bg-amber-50 text-amber-600 border-amber-200 shadow-none hover:bg-amber-50">High</Badge>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <p className="text-xs text-slate-500">Stable demand over next 48hrs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Battery className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Defibrillators</h3>
                <p className="text-xs text-slate-500">All Wards</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-slate-900">8<span className="text-lg text-slate-400 font-normal">/15</span></span>
                <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 shadow-none hover:bg-emerald-50">Normal</Badge>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '53%' }}></div>
              </div>
              <p className="text-xs text-slate-500">1 unit pending maintenance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm relative overflow-hidden bg-slate-900 text-white border-none">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Resource AI Insight
              </h3>
              <p className="text-sm text-slate-400 mt-2">Model predicts a surge in respiratory cases this weekend. Recommend securing 5 additional emergency ventilators from regional reserve.</p>
            </div>
            <div className="mt-4">
              <button className="text-sm bg-primary/20 text-primary hover:bg-primary/30 px-4 py-2 rounded-lg font-medium transition-colors">
                View Logistics Plan &rarr;
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>Ventilator Demand 24h Forecast</CardTitle>
          <CardDescription>Based on current ICU admissions and predicted respiratory decline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ventData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 30]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                
                <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'top', value: 'Max Capacity (25)', fill: '#ef4444', fontSize: 11 }} />
                
                <Area type="monotone" dataKey="demand" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
