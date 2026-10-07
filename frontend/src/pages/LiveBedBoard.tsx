import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BedDouble, CheckCircle2, AlertCircle, Clock, Search, Filter } from "lucide-react"

type BedStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance'

interface Bed {
  id: string
  label: string
  status: BedStatus
  patient?: string
  mrn?: string
  isolation: boolean
}

const mockBeds: Bed[] = [
  { id: '1', label: 'ICU-01', status: 'occupied', patient: 'Doe, John', mrn: 'MRN-8472', isolation: true },
  { id: '2', label: 'ICU-02', status: 'occupied', patient: 'Smith, Jane', mrn: 'MRN-1934', isolation: true },
  { id: '3', label: 'ICU-03', status: 'cleaning', isolation: false },
  { id: '4', label: 'ICU-04', status: 'available', isolation: true },
  { id: '5', label: 'GEN-01', status: 'occupied', patient: 'Williams, B', mrn: 'MRN-5581', isolation: false },
  { id: '6', label: 'GEN-02', status: 'maintenance', isolation: false },
  { id: '7', label: 'GEN-03', status: 'available', isolation: false },
  { id: '8', label: 'GEN-04', status: 'occupied', patient: 'Brown, A', mrn: 'MRN-9921', isolation: false },
]

export default function LiveBedBoard() {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filteredBeds = mockBeds.filter(bed => {
    if (filter !== "all" && bed.status !== filter) return false
    if (search && !bed.label.toLowerCase().includes(search.toLowerCase()) && 
        !(bed.patient && bed.patient.toLowerCase().includes(search.toLowerCase()))) {
      return false
    }
    return true
  })

  const getStatusColor = (status: BedStatus) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success border-success/20'
      case 'occupied': return 'bg-primary/10 text-primary border-primary/20'
      case 'cleaning': return 'bg-warning/10 text-warning border-warning/20'
      case 'maintenance': return 'bg-destructive/10 text-destructive border-destructive/20'
    }
  }

  const getStatusIcon = (status: BedStatus) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="h-4 w-4 text-success" />
      case 'occupied': return <BedDouble className="h-4 w-4 text-primary" />
      case 'cleaning': return <Clock className="h-4 w-4 text-warning" />
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-destructive" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-heading">Live Bed Board</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 animate-pulse">
            Live Updates
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search bed or patient..." 
              className="pl-8" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Beds</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredBeds.map(bed => (
          <div key={bed.id} className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-heading font-bold text-lg">{bed.label}</div>
                {getStatusIcon(bed.status)}
              </div>
              <Badge variant="outline" className={`w-fit capitalize ${getStatusColor(bed.status)}`}>
                {bed.status}
              </Badge>
              
              {bed.status === 'occupied' && (
                <div className="pt-2 space-y-1 border-t">
                  <div className="font-medium">{bed.patient}</div>
                  <div className="text-xs text-muted-foreground">{bed.mrn}</div>
                </div>
              )}
              
              {bed.status !== 'occupied' && (
                <div className="pt-2 border-t flex items-center justify-center min-h-[44px]">
                  <span className="text-xs text-muted-foreground italic">
                    {bed.status === 'available' ? 'Ready for admission' : 
                     bed.status === 'cleaning' ? 'Cleaning in progress' : 'Out of service'}
                  </span>
                </div>
              )}
              
              <div className="pt-2 flex gap-2">
                {bed.status === 'occupied' && (
                  <>
                    <Button size="sm" variant="outline" className="w-full text-xs">Transfer</Button>
                    <Button size="sm" variant="default" className="w-full text-xs">Discharge</Button>
                  </>
                )}
                {bed.status === 'available' && (
                  <Button size="sm" variant="default" className="w-full text-xs">Admit Patient</Button>
                )}
                {bed.status === 'cleaning' && (
                  <Button size="sm" variant="outline" className="w-full text-xs">Mark Clean</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
