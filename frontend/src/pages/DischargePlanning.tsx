import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

const patients = [
  { id: "MRN-10294", ward: "General Med", disease: "Pneumonia", los: 4, expectedDischarge: "Today, 14:00", readiness: 92, status: "Ready", blocker: "None" },
  { id: "MRN-33491", ward: "Orthopedic", disease: "Hip Replacement", los: 3, expectedDischarge: "Today, 16:30", readiness: 85, status: "Pending", blocker: "Physio Sign-off" },
  { id: "MRN-99120", ward: "Cardiac", disease: "Heart Failure", los: 6, expectedDischarge: "Tomorrow", readiness: 65, status: "Delayed", blocker: "Transport Arranged" },
  { id: "MRN-44102", ward: "General Med", disease: "COPD Exacerbation", los: 5, expectedDischarge: "Tomorrow", readiness: 70, status: "Pending", blocker: "Home O2 Setup" },
  { id: "MRN-11002", ward: "ICU -> Stepdown", disease: "Sepsis", los: 8, expectedDischarge: "Today, 18:00", readiness: 88, status: "Ready", blocker: "Bed Cleaning" },
]

export default function DischargePlanning() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Discharge Planning</h2>
          <p className="text-slate-500 mt-1">Manage and accelerate patient departures to free up critical bed capacity.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Export Discharge List
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-emerald-800">Confirmed for Today</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-emerald-600">24</span>
              <span className="text-sm font-medium text-emerald-600/70">patients</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-amber-800">Pending Blockers</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-600">12</span>
              <span className="text-sm font-medium text-amber-600/70">patients</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-indigo-800">Predicted Discharges (Tomorrow)</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-indigo-600">35</span>
              <span className="text-sm font-medium text-indigo-600/70">patients</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle>High Priority Discharges</CardTitle>
          <CardDescription>Patients nearing or exceeding expected length of stay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Patient ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Ward & Disease</TableHead>
                  <TableHead className="font-semibold text-slate-700">LOS (Days)</TableHead>
                  <TableHead className="font-semibold text-slate-700">Readiness Score</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Action/Blocker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900">{p.ward}</span>
                        <span className="text-xs text-slate-500">{p.disease}</span>
                      </div>
                    </TableCell>
                    <TableCell>{p.los}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${p.readiness > 80 ? 'bg-green-500' : p.readiness > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${p.readiness}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{p.readiness}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {p.status === 'Ready' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Ready</Badge>}
                      {p.status === 'Pending' && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Pending</Badge>}
                      {p.status === 'Delayed' && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Delayed</Badge>}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 flex items-center gap-1.5">
                        {p.status === 'Ready' ? <CheckCircle2 className="h-4 w-4 text-green-500"/> : <AlertCircle className="h-4 w-4 text-amber-500"/>}
                        {p.blocker}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
