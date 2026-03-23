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
  Brain,
  Zap,
  Leaf
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DashboardView() {
  const metrics = [
    { label: "Calories", value: "1,840", unit: "kcal", target: "2,200", icon: <Flame className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" },
    { label: "Hydration", value: "1.8", unit: "L", target: "3.0", icon: <Droplets className="w-5 h-5 text-sky-500" />, color: "bg-sky-50" },
    { label: "Steps", value: "8,432", unit: "steps", target: "10,000", icon: <Footprints className="w-5 h-5 text-green-500" />, color: "bg-green-50" },
  ];

  const nutrients = [
    { label: "Carbs", current: 185, target: 250, unit: "g", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { label: "Protein", current: 120, target: 150, unit: "g", icon: <Target className="w-4 h-4 text-blue-500" /> },
    { label: "Fat", current: 52, target: 70, unit: "g", icon: <Flame className="w-4 h-4 text-red-400" /> },
    { label: "Fiber", current: 22, target: 35, unit: "g", icon: <Leaf className="w-4 h-4 text-emerald-500" /> },
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
          {metrics.map((m, idx) => {
            const current = parseInt(m.value.replace(',', ''));
            const target = parseInt(m.target.replace(',', ''));
            const percentage = Math.round((current / target) * 100);
            return (
              <Card key={idx} className="min-w-[170px] flex-shrink-0 border-none shadow-sm glass-card">
                <CardContent className="p-4 flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-xl ${m.color}`}>
                      {m.icon}
                    </div>
                    <Badge variant="outline" className="text-[10px] font-normal border-muted-foreground/20">
                      {percentage}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold">{m.value}</span>
                        <span className="text-[10px] text-muted-foreground">{m.unit}</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Nutrient Breakdown Section */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Nutrient Breakdown
          </h3>
          <div className="space-y-5">
            {nutrients.map((n, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    {n.icon}
                    <span className="font-medium">{n.label}</span>
                  </div>
                  <span className="text-muted-foreground font-mono">
                    {n.current} / {n.target}{n.unit}
                  </span>
                </div>
                <Progress value={(n.current / n.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                  <span>Workout Consistency</span>
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