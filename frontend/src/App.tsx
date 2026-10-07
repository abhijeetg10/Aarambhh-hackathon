import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { 
  BedDouble, TrendingUp, Stethoscope, Activity, ArrowRightLeft, 
  ClipboardList, Settings, Menu, Bell, ChevronDown, Sun, LogOut, ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Import Pages
import Overview from "./pages/Overview"
import CapacityForecast from "./pages/CapacityForecast"
import DiseaseAnalysis from "./pages/DiseaseAnalysis"
import ResourceForecast from "./pages/ResourceForecast"
import PatientFlow from "./pages/PatientFlow"
import DischargePlanning from "./pages/DischargePlanning"
import LiveBedBoard from "./pages/LiveBedBoard"
import Administration from "./pages/Administration"

const NAVIGATION = [
  { name: "Overview", href: "/", icon: TrendingUp }, // Used standard icon since custom one is hard
  { name: "Capacity Forecast", href: "/capacity", icon: Activity },
  { name: "Disease Analysis", href: "/disease", icon: Stethoscope },
  { name: "Resource Forecast", href: "/resource", icon: BedDouble },
  { name: "Patient Flow", href: "/flow", icon: ArrowRightLeft },
  { name: "Discharge Planning", href: "/discharge", icon: ClipboardList },
  { name: "Bed Board", href: "/bedboard", icon: BedDouble },
]

function NavLinks() {
  const location = useLocation();
  
  return (
    <>
      {NAVIGATION.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        )
      })}
    </>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc]">
      {/* Desktop Sidebar - Dark Theme */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[260px] flex-col bg-[#0f172a] text-white sm:flex">
        <div className="flex h-[72px] items-center px-6">
          <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl text-white tracking-tight">
            <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
              <Stethoscope className="h-6 w-6" />
            </div>
            <span>BedFlow</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4 px-3 flex flex-col gap-1">
          <NavLinks />
          
          <div className="mt-8 mb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            System
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Settings className="h-5 w-5" />
            Administration
          </Link>
        </div>

        {/* User Profile & Theme at bottom */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2 hover:bg-slate-800 p-2 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-slate-700">
                <AvatarFallback className="bg-primary text-white">SC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white leading-none mb-1">Dr. Sarah Chen</span>
                <span className="text-xs text-slate-400 leading-none">Hospital Administrator</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </div>
          
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 h-10 px-4">
            <Sun className="h-4 w-4 mr-3" />
            Light mode
            <ChevronDown className="h-4 w-4 ml-auto text-slate-500" />
          </Button>
        </div>
      </aside>

      <div className="flex flex-col sm:pl-[260px] w-full">
        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/capacity" element={<CapacityForecast />} />
          <Route path="/disease" element={<DiseaseAnalysis />} />
          <Route path="/resource" element={<ResourceForecast />} />
          <Route path="/flow" element={<PatientFlow />} />
          <Route path="/discharge" element={<DischargePlanning />} />
          <Route path="/bedboard" element={<LiveBedBoard />} />
          <Route path="/admin" element={<Administration />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App
