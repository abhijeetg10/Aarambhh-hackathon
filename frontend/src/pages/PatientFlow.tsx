import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts"
import { ArrowRight, UserPlus, UserMinus, RotateCw } from "lucide-react"

const flowData = [
  { name: '08:00', admissions: 12, discharges: 5, transfers: 2 },
  { name: '10:00', admissions: 18, discharges: 12, transfers: 4 },
  { name: '12:00', admissions: 15, discharges: 22, transfers: 8 },
  { name: '14:00', admissions: 10, discharges: 18, transfers: 5 },
  { name: '16:00', admissions: 8, discharges: 10, transfers: 2 },
  { name: '18:00', admissions: 5, discharges: 4, transfers: 1 },
]

export default function PatientFlow() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Patient Flow</h2>
          <p className="text-slate-500 mt-1">Real-time tracking of admissions, discharges, and inter-ward transfers.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-slate-200/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-full">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Admissions Today</p>
                <h3 className="text-2xl font-bold text-slate-900">68</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-500 rounded-full">
                <UserMinus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Discharges Today</p>
                <h3 className="text-2xl font-bold text-slate-900">71</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-full">
                <RotateCw className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Ward Transfers</p>
                <h3 className="text-2xl font-bold text-slate-900">22</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 shadow-sm bg-slate-900 text-white border-none">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-400">Net Flow Status</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-bold text-green-400">-3</h3>
              <span className="text-sm text-slate-400">patients</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Hospital capacity is slowly freeing up.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>Daily Flow Trajectory</CardTitle>
          <CardDescription>Hourly breakdown of patient movement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flowData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="admissions" name="Admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="discharges" name="Discharges" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="transfers" name="Transfers" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
