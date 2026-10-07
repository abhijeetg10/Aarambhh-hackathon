import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Brain, Activity, Clock, ShieldAlert, CheckCircle2, RotateCw } from "lucide-react"

export default function Administration() {
  const [isTraining, setIsTraining] = useState(false)
  const [trainStatus, setTrainStatus] = useState<string | null>(null)

  const handleRetrain = async () => {
    setIsTraining(true)
    setTrainStatus(null)
    
    try {
      const res = await fetch('http://localhost:8000/admin/train', {
        method: 'POST'
      })
      if (res.ok) {
        setTrainStatus("Training job started successfully. The model will update in the background.")
      } else {
        setTrainStatus("Failed to start training.")
      }
    } catch (err) {
      setTrainStatus("Error connecting to server.")
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Administration</h2>
          <p className="text-slate-500 mt-1">System health, database configuration, and ML model management.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Server className="h-4 w-4" /> API Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Online</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <p className="text-xs text-slate-500">Latency: 14ms</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Database className="h-4 w-4" /> Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Connected</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <p className="text-xs text-slate-500">Pool usage: 12%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Brain className="h-4 w-4" /> ML Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">Active</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <p className="text-xs text-slate-500">v1.0-histgradboost</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle>Model Training & Retraining</CardTitle>
            <CardDescription>
              Force a manual retrain of the predictive models using the latest historical dataset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded shadow-sm">
                  <Activity className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-900">Bed Demand Forecast Model</p>
                  <p className="text-xs text-slate-500">Last trained: 2 hours ago</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Healthy</Badge>
            </div>

            {trainStatus && (
              <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md flex items-center gap-2 border border-blue-100">
                <CheckCircle2 className="h-4 w-4" /> {trainStatus}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRetrain} 
              disabled={isTraining}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              {isTraining ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" /> Training...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" /> Trigger Retrain Pipeline
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader>
            <CardTitle>System Warnings</CardTitle>
            <CardDescription>
              Active alerts from the backend infrastructure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100 items-start">
                <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800">High API Latency Detected</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    The external EHR integration endpoint experienced high latency (&gt; 2s) briefly around 14:00 today. Data syncing was delayed but recovered.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 items-start">
                <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">Scheduled Maintenance</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Database snapshot and vacuum scheduled for Sunday at 02:00 AM. Expect 5 minutes of read-only mode.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
