import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import { Activity, Thermometer, Heart, Brain, Bone, ShieldAlert } from "lucide-react"

const diseaseData = [
  { name: 'Respiratory', value: 400, color: '#0ea5e9', icon: Thermometer },
  { name: 'Cardiac', value: 300, color: '#f43f5e', icon: Heart },
  { name: 'Neurological', value: 300, color: '#8b5cf6', icon: Brain },
  { name: 'Orthopedic', value: 200, color: '#f59e0b', icon: Bone },
  { name: 'Infectious', value: 150, color: '#10b981', icon: ShieldAlert },
  { name: 'Trauma', value: 100, color: '#64748b', icon: Activity },
];

const severityData = [
  { name: 'Respiratory', critical: 120, moderate: 200, mild: 80 },
  { name: 'Cardiac', critical: 150, moderate: 100, mild: 50 },
  { name: 'Neurological', critical: 90, moderate: 160, mild: 50 },
  { name: 'Orthopedic', critical: 20, moderate: 130, mild: 50 },
  { name: 'Infectious', critical: 40, moderate: 80, mild: 30 },
]

export default function DiseaseAnalysis() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Disease Analysis</h2>
          <p className="text-slate-500 mt-1">Epidemiological breakdown and severity grouping of current patient population.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {diseaseData.slice(0, 4).map((d) => (
          <Card key={d.name} className="border-slate-200/60 shadow-sm overflow-hidden group">
            <div className={`h-1.5 w-full`} style={{ backgroundColor: d.color }} />
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">{d.name} Cases</p>
                  <p className="text-3xl font-bold text-slate-900">{d.value}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${d.color}15`, color: d.color }}>
                  <d.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-normal">
                  +12% vs last week
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-3 border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Case Distribution</CardTitle>
            <CardDescription>Primary diagnosis groups across all wards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diseaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Severity by Group</CardTitle>
            <CardDescription>Acuity breakdown driving ICU demand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                  <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                  <Bar dataKey="critical" name="Critical (ICU)" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="moderate" name="Moderate" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="mild" name="Mild" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
