import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Flame, 
  Droplets, 
  CheckCircle2, 
  Footprints, 
  Weight, 
  Target,
  ChevronRight,
  TrendingUp,
  Brain
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DashboardView() {
  const metrics = [
    { label: "Calories", value: "1,840", unit: "kcal", target: "2,200", icon: <Flame className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" },
    { label: "Protein", value: "120", unit: "g", target: "150", icon: <Target className="w-5 h-5 text-blue-500" />, color: "bg-blue-50" },
    { label: "Hydration", value: "1.8", unit: "L", target: "3.0", icon: <Droplets className="w-5 h-5 text-sky-500" />, color: "bg-sky-50" },
    { label: "Steps", value: "8,432", unit: "steps", target: "10,000", icon: <Footprints className="w-5 h-5 text-green-500" />, color: "bg-green-50" },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* AI Suggestion Banner */}
      <Card className="border-none bg-primary text-primary-foreground overflow-hidden">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">PulseFlow Insight</h3>
            <p className="text-sm opacity-90">Based on your activity, try increasing protein by 15g today to support muscle recovery from yesterday's lift.</p>
          </div>
        </CardContent>
      </Card>

      {/* Swipeable Metrics Belt */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-headline">Daily Overview</h2>
          <span className="text-xs text-muted-foreground flex items-center">Swipe for more <ChevronRight className="w-3 h-3 ml-1" /></span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 swipe-container">
          {metrics.map((m, idx) => (
            <Card key={idx} className="min-w-[160px] flex-shrink-0 border-none shadow-sm glass-card">
              <CardContent className="p-4 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl ${m.color}`}>
                    {m.icon}
                  </div>
                  <Badge variant="outline" className="text-[10px] font-normal border-muted-foreground/20">
                    {Math.round((parseInt(m.value.replace(',', '')) / parseInt(m.target.replace(',', ''))) * 100)}%
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{m.value}</span>
                    <span className="text-[10px] text-muted-foreground">{m.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly Progress & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Active Goals
              </h3>
              <Badge variant="secondary">3 Pending</Badge>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weight Goal (Loss)</span>
                  <span className="font-medium">78.5 / 75.0 kg</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Protein Target</span>
                  <span className="font-medium">80% reached</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Latest Metric
              </h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
              <div>
                <p className="text-xs text-muted-foreground">Current Weight</p>
                <p className="text-2xl font-bold">78.5 kg</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-500 font-medium">-0.4 kg</p>
                <p className="text-[10px] text-muted-foreground">vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
