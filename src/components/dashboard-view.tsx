
"use client";

import { useRef, useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Flame, 
  Droplets, 
  Footprints, 
  ChevronRight,
  Zap,
  Calculator,
  TrendingDown,
  ArrowUpRight,
  Scale,
  Plus,
  Minus,
  PieChart,
  Target,
  ListTodo,
  ArrowRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from 'recharts';
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { isSameDay } from 'date-fns';
import { type Task } from '@/components/tasks-view';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  hydrationAmount: number;
  onUpdateHydration: (amount: number) => void;
  goalData: any;
  weightHistory?: any[];
  onViewHydration?: () => void;
  onViewTasks?: () => void;
  onViewCalculators?: (type: string) => void;
  onViewGoalSetting?: () => void;
}

export function DashboardView({ 
  tasks, 
  onToggleTask, 
  hydrationAmount, 
  onUpdateHydration, 
  goalData,
  weightHistory = [],
  onViewHydration, 
  onViewTasks,
  onViewCalculators,
  onViewGoalSetting
}: DashboardViewProps) {
  const metricsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const [activeMetric, setActiveMetric] = useState(0);
  const [activeTool, setActiveTool] = useState(0);

  // Functional Weight Metrics
  const latestWeightEntry = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
  const previousWeightEntry = weightHistory.length > 1 ? weightHistory[weightHistory.length - 2] : null;
  
  const currentWeight = latestWeightEntry ? latestWeightEntry.weight : (goalData?.weight ? parseFloat(goalData.weight) : 0);
  const weightChange = latestWeightEntry && previousWeightEntry ? parseFloat((latestWeightEntry.weight - previousWeightEntry.weight).toFixed(1)) : 0;

  // Use Goal Data or Fallbacks
  const targetCal = goalData?.finalCalories || 2200;
  const bmr = goalData?.bmr || 1600;
  const tdee = goalData?.tdee || 2500;
  
  // Simulated current intake (80% of target for visualization)
  const currentCal = Math.round(targetCal * 0.84);
  const calDiff = targetCal - currentCal;
  const calStatus = calDiff >= 0 ? `${calDiff.toLocaleString()} Left` : `${Math.abs(calDiff).toLocaleString()} Over`;

  const startWeight = goalData?.weight ? parseFloat(goalData.weight) : (weightHistory.length > 0 ? weightHistory[0].weight : 0);
  const targetWeight = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;
  
  const progressPercent = useMemo(() => {
    if (!startWeight || !targetWeight || startWeight === targetWeight) return 0;
    const totalDiff = Math.abs(startWeight - targetWeight);
    const completedDiff = Math.abs(startWeight - currentWeight);
    return Math.min(100, Math.max(0, Math.round((completedDiff / totalDiff) * 100)));
  }, [startWeight, targetWeight, currentWeight]);

  const coachImage = PlaceHolderImages.find(img => img.id === 'gym-coach');

  const metrics = [
    { 
      id: 'calories',
      label: "Calories", 
      value: calStatus, 
      unit: "", 
      target: targetCal.toLocaleString(), 
      current: currentCal,
      targetVal: targetCal,
      icon: <Flame className="w-4 h-4 text-orange-500" />, 
      color: "bg-orange-50" 
    },
    { 
      id: 'streak',
      label: "Streak", 
      value: "12", 
      unit: "days", 
      target: "15", 
      current: 12,
      targetVal: 15,
      icon: <Zap className="w-4 h-4 text-yellow-500" />, 
      color: "bg-yellow-50" 
    },
    { 
      id: 'hydration',
      label: "Hydration", 
      value: (hydrationAmount / 1000).toFixed(1), 
      unit: "L", 
      target: (goalData?.hydrationTargetLiters || 3.0).toFixed(1), 
      current: hydrationAmount / 1000,
      targetVal: goalData?.hydrationTargetLiters || 3.0,
      icon: <Droplets className="w-4 h-4 text-sky-500" />, 
      color: "bg-sky-50" 
    },
    { 
      id: 'steps',
      label: "Steps", 
      value: "8,432", 
      unit: "steps", 
      target: "10,000", 
      current: 8432,
      targetVal: 10000,
      icon: <Footprints className="w-4 h-4 text-green-500" />, 
      color: "bg-green-50" 
    },
  ];

  const nutrients = [
    { 
      label: "Protein", 
      current: goalData?.protein ? Math.round(goalData.protein * 0.72) : 108, 
      target: goalData?.protein || 150, 
      unit: "g" 
    },
    { 
      label: "Carbs", 
      current: goalData?.carbs ? Math.round(goalData.carbs * 0.65) : 162, 
      target: goalData?.carbs || 250, 
      unit: "g" 
    },
    { 
      label: "Fat", 
      current: goalData?.fats ? Math.round(goalData.fats * 0.58) : 41, 
      target: goalData?.fats || 70, 
      unit: "g" 
    },
  ];

  const calculators = [
    { label: "1 Rep Max", description: "Power" },
    { label: "Body Fat %", description: "Body" },
    { label: "BMR / TDEE", description: "Energy" },
  ];

  const priorityBgColor = { low: 'bg-green-500', medium: 'bg-amber-500', high: 'bg-destructive' };
  
  const todaysTasks = tasks
    .filter(t => isSameDay(new Date(t.date), new Date()))
    .sort((a, b) => {
      const pWeight = { high: 3, medium: 2, low: 1 };
      return pWeight[b.priority] - pWeight[a.priority];
    });

  const stats = {
    done: todaysTasks.filter(t => t.completed).length,
    total: todaysTasks.length
  };

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, setter: (val: number) => void) => {
    if (!ref.current) return;
    const container = ref.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const scrollCenter = scrollLeft + containerWidth / 2;
      const distance = Math.abs(childCenter - scrollCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setter(closestIndex);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (!ref.current) return;
    const container = ref.current;
    const children = Array.from(container.children) as HTMLElement[];
    const target = children[index];
    
    if (target) {
      const containerWidth = container.offsetWidth;
      const targetCenter = target.offsetLeft + target.offsetWidth / 2;
      
      container.scrollTo({
        left: targetCenter - containerWidth / 2,
        horizontal: true,
        behavior: 'smooth'
      } as any);
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-10">
      <Card className="border-none bg-gradient-to-br from-primary/90 to-primary text-primary-foreground overflow-hidden shadow-md">
        <CardContent className="p-5 flex items-center gap-4 min-h-[100px]">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shrink-0 relative bg-white/10">
            <Image 
              src={coachImage?.imageUrl || "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop"} 
              alt="Coach"
              fill
              className="object-cover"
              data-ai-hint="fitness coach"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm flex items-center gap-2">
              Your Personal Guide
              <Badge variant="outline" className="text-[9px] h-4 border-white/20 text-white font-normal uppercase tracking-tighter">AI Pulse</Badge>
            </h3>
            <p className="text-xs opacity-90 leading-relaxed">
              {goalData ? `You're targeting ${goalData.finalCalories} kcal today. Great pace towards your ${goalData.targetWeight}kg goal!` : "Set a goal to get personalized AI wellness insights."}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-headline">Daily Overview</h2>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center">
            SWIPE <ChevronRight className="w-3 h-3 ml-1" />
          </span>
        </div>

        <div className="relative group">
          <div 
            ref={metricsRef}
            onScroll={() => handleScroll(metricsRef, setActiveMetric)}
            className="flex gap-3 overflow-x-auto pb-2 swipe-container snap-x snap-mandatory scroll-smooth"
          >
            {metrics.map((m, idx) => {
              const percentage = Math.round((m.current / m.targetVal) * 100);
              const isCalories = m.id === "calories";
              const isHydration = m.id === "hydration";
              const showDetails = isHydration || m.id === "steps";

              return (
                <Card key={idx} className="min-w-[260px] flex-shrink-0 border-none shadow-sm bg-white snap-center">
                  <CardContent className="p-3 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-center">
                      <div className={`p-1.5 rounded-lg ${m.color}`}>
                        {m.icon}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground">{percentage}%</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-0.5">{m.label}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold">{m.value}</span>
                            <span className="text-[9px] text-muted-foreground font-medium">{m.unit}</span>
                          </div>
                          
                          {isHydration && (
                            <div className="flex items-center bg-muted/50 rounded-full px-2 py-0.5 gap-2 border border-border/50 shadow-sm">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onUpdateHydration(-250); }}
                                className="text-primary hover:text-primary/70 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-[9px] font-black text-foreground uppercase tracking-tighter">250ml</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onUpdateHydration(250); }}
                                className="text-primary hover:text-primary/70 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative flex-1 h-6 flex items-center">
                          <Progress value={Math.min(percentage, 100)} className="h-1.5 w-full" />
                          
                          {isCalories && (
                            <>
                              <div 
                                className="absolute bottom-[50%] mb-[3px] flex flex-col items-center -translate-x-1/2" 
                                style={{ left: `${(bmr / m.targetVal) * 100}%` }}
                              >
                                <span className="text-[6px] font-bold text-destructive/60">BMR</span>
                                <div className="h-2 w-[1px] bg-destructive/40" />
                              </div>
                              <div 
                                className="absolute bottom-[50%] mb-[3px] flex flex-col items-center -translate-x-1/2" 
                                style={{ left: `${Math.min((tdee / m.targetVal) * 100, 98)}%` }}
                              >
                                <span className="text-[6px] font-bold text-accent">TDEE</span>
                                <div className="h-2 w-[1px] bg-accent/60" />
                              </div>
                            </>
                          )}
                        </div>
                        {showDetails && (
                          <button 
                            onClick={() => isHydration && onViewHydration?.()}
                            className="flex items-center gap-0.5 text-[8px] font-black text-primary uppercase shrink-0 hover:opacity-70 transition-opacity"
                          >
                            Details <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex justify-center gap-1.5 mt-2">
            {metrics.map((_, i) => (
              <button 
                key={i} 
                onClick={() => scrollTo(metricsRef, i)}
                className={`h-1 rounded-full transition-all duration-300 outline-none ${i === activeMetric ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center justify-start">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-tight">
              <PieChart className="w-3.5 h-3.5 text-primary" />
              Today's Macros
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {nutrients.map((n, idx) => {
              const diff = n.target - n.current;
              const statusLabel = diff >= 0 ? `${diff}${n.unit} Left` : `${Math.abs(diff)}${n.unit} Over`;
              const isOver = diff < 0;

              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{n.label}</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className={cn("text-xs font-black", isOver ? "text-destructive" : "text-foreground")}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-700 ease-out rounded-full", isOver ? "bg-destructive" : "bg-primary")} 
                      style={{ width: `${Math.min((n.current / n.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex flex-col items-start w-full">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-tight">
                <Target className="w-3.5 h-3.5 text-primary" />
                Goal
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-[8px] h-3.5 py-0 uppercase">
                  {goalData?.objective || "Active"}
                </Badge>
              </h3>
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Active Milestone</p>
            </div>
            <div className="absolute right-8 text-right">
              <span className="text-lg font-black text-primary">{progressPercent}%</span>
              <p className="text-[8px] font-bold text-muted-foreground uppercase">Done</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Progress value={progressPercent} className="h-1.5 bg-muted" />
            <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground">
              <span>{startWeight > 0 ? startWeight.toFixed(1) : "---"} kg</span>
              <span className="text-primary">{currentWeight > 0 ? currentWeight.toFixed(1) : "---"} kg</span>
              <span>{targetWeight > 0 ? targetWeight.toFixed(1) : "---"} kg</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest text-left">
              {targetWeight > 0 ? `${Math.abs(currentWeight - targetWeight).toFixed(1)} kg to go` : "Set your target weight"}
            </p>
            <button 
              onClick={onViewGoalSetting}
              className="text-[9px] font-black text-primary uppercase flex items-center gap-1 hover:opacity-70 transition-all"
            >
              Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-2">
        <div 
          ref={toolsRef}
          onScroll={() => handleScroll(toolsRef, setActiveTool)}
          className="flex gap-3 overflow-x-auto pb-4 swipe-container snap-x snap-mandatory scroll-smooth"
        >
          <Card className="min-w-[280px] flex-shrink-0 border-none shadow-sm bg-white overflow-hidden snap-center">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Scale className="w-3 h-3 text-primary" /> Current Weight
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{currentWeight > 0 ? currentWeight.toFixed(1) : "---"}</span>
                    <span className="text-xs text-muted-foreground">kg</span>
                  </div>
                </div>
                {weightChange !== 0 && (
                  <Badge className={cn("border-none px-2 py-0.5 gap-1 text-[10px]", weightChange < 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
                    {weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {Math.abs(weightChange)}kg
                  </Badge>
                )}
              </div>
              
              <div className="h-16 w-full -mx-4 -mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightHistory}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorWeight)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-[280px] flex-shrink-0 border-none shadow-sm bg-white snap-center">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Calculator className="w-3 h-3 text-primary" /> Performance Tools
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {calculators.map((calc, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => onViewCalculators?.(calc.label)}
                    className="p-2 bg-primary/5 rounded-xl text-center hover:bg-primary/10 transition-colors border border-primary/10"
                  >
                    <p className="text-[9px] font-black uppercase text-primary leading-tight">{calc.label}</p>
                    <p className="text-[7px] font-bold text-muted-foreground/60 uppercase">{calc.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center gap-1.5 -mt-2">
          {[0, 1].map((i) => (
            <button 
              key={i} 
              onClick={() => scrollTo(toolsRef, i)}
              className={`h-1 rounded-full transition-all duration-300 outline-none ${i === activeTool ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} 
              />
          ))}
        </div>
      </section>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-tight">
              <ListTodo className="w-3.5 h-3.5 text-primary" />
              Today's Tasks
            </h3>
            <span className="text-[10px] font-bold text-muted-foreground uppercase">{stats.done}/{stats.total} done</span>
          </div>
          <div className="space-y-3">
            {todaysTasks.length === 0 ? (
              <div className="text-center py-6 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-widest">No tasks for today</p>
              </div>
            ) : (
              <>
                {todaysTasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="relative flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-muted/20 shadow-sm group overflow-hidden">
                    <div className={cn("absolute left-0 top-0 bottom-0 w-1", priorityBgColor[task.priority])} />
                    <div className="flex items-center gap-3 pl-2">
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => onToggleTask(task.id)}
                        className="h-4 w-4 rounded-md border-2 border-primary/20 data-[state=checked]:bg-primary"
                      />
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${task.completed ? 'text-muted-foreground line-through decoration-muted-foreground/30' : 'text-foreground/80'}`}>
                          {task.title}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/20" />
                  </div>
                ))}
                {todaysTasks.length > 2 && (
                  <div className="flex justify-center pt-1">
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      + {todaysTasks.length - 2} more tasks
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="pt-2 border-t border-muted/20 flex justify-center">
            <button 
              onClick={() => onViewTasks?.()}
              className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              See More <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
