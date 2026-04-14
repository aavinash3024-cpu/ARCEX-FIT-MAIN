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
  ArrowRight,
  Check
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from 'recharts';
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { isSameDay, format, startOfWeek, addDays } from 'date-fns';
import { type Task } from '@/components/tasks-view';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  hydrationAmount: number;
  onUpdateHydration: (amount: number) => void;
  stepsCount?: number;
  onUpdateSteps?: (amount: number) => void;
  goalData: any;
  weightHistory?: any[];
  loggedMeals?: any[];
  streakData?: { count: number, history: string[] };
  onViewHydration?: () => void;
  onViewSteps?: () => void;
  onViewTasks?: () => void;
  onViewCalculators?: (type: string) => void;
  onViewGoalSetting?: () => void;
  onViewProgress?: () => void;
  onViewGuide?: () => void;
  onViewNutritionSummary?: () => void;
}

const MetricSphere = ({ type, icon: Icon }: { type: 'steps' | 'hydration' | 'calories' | 'streak', icon: any }) => {
  const configs = {
    steps: {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: '#10b981',
      shadow: 'rgba(16, 185, 129, 0.2)'
    },
    hydration: {
      bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      border: '#0ea5e9',
      shadow: 'rgba(14, 165, 233, 0.2)'
    },
    calories: {
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      border: '#f59e0b',
      shadow: 'rgba(245, 158, 11, 0.2)'
    },
    streak: {
      bg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      border: '#ef4444',
      shadow: 'rgba(239, 68, 68, 0.2)'
    }
  };

  const config = configs[type];

  return (
    <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
      {/* Outer Boundary Ring - Perfectly Centered */}
      <div 
        className="absolute inset-[-3px] rounded-full border opacity-30 pointer-events-none" 
        style={{ borderColor: config.border }}
      />
      
      {/* Main 3D Sphere Body */}
      <div 
        className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden shadow-[0_3px_6px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.3)]"
        style={{ background: config.bg }}
      >
        {/* Top Gloss Highlight for 3D depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_65%)]" />
        
        {/* The Icon */}
        <div className="relative z-10 text-white drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.3)]">
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export function DashboardView({ 
  tasks, 
  onToggleTask, 
  hydrationAmount, 
  onUpdateHydration, 
  stepsCount = 0,
  onUpdateSteps,
  goalData,
  weightHistory = [],
  loggedMeals = [],
  streakData = { count: 0, history: [] },
  onViewHydration, 
  onViewSteps,
  onViewTasks,
  onViewCalculators,
  onViewGoalSetting,
  onViewProgress,
  onViewGuide,
  onViewNutritionSummary
}: DashboardViewProps) {
  const metricsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const [activeMetric, setActiveMetric] = useState(0);
  const [activeTool, setActiveTool] = useState(0);

  const latestWeightEntry = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
  
  const currentWeight = latestWeightEntry ? latestWeightEntry.weight : (goalData?.weight ? parseFloat(goalData.weight) : 0);
  const startWeight = goalData?.weight ? parseFloat(goalData.weight) : (weightHistory.length > 0 ? weightHistory[0].weight : 0);
  
  const weightChange = currentWeight && startWeight ? parseFloat((currentWeight - startWeight).toFixed(1)) : 0;

  const chartData = useMemo(() => {
    const initialWeight = goalData?.weight ? parseFloat(goalData.weight) : 0;
    
    if (weightHistory.length === 0) {
      if (initialWeight > 0) {
        return [
          { weight: initialWeight, isStart: true, formattedDate: 'Start' },
          { weight: initialWeight, isStart: false, formattedDate: format(new Date(), 'MMM d') }
        ];
      }
      return [];
    }

    const history = [...weightHistory].map(h => ({
      ...h,
      formattedDate: format(new Date(h.date), 'MMM d')
    }));

    if (initialWeight > 0 && !history.find(h => h.isStart)) {
      history.unshift({ weight: initialWeight, isStart: true, formattedDate: 'Start' } as any);
    }
    return history;
  }, [weightHistory, goalData]);

  const currentIntake = useMemo(() => {
    return loggedMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
      fiber: acc.fiber + (meal.fiber || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  }, [loggedMeals]);

  const targetCal = goalData?.finalCalories || 2200;
  const bmr = goalData?.bmr || 1600;
  const tdee = goalData?.tdee || 2500;
  
  const currentCal = Math.round(currentIntake.calories);
  const calDiff = targetCal - currentCal;
  const calStatus = `${Math.abs(calDiff).toLocaleString()} Kcal ${calDiff >= 0 ? 'left' : 'over'}`;

  const targetWeight = goalData?.targetWeight ? parseFloat(goalData.targetWeight) : 0;
  
  const progressPercent = useMemo(() => {
    if (!startWeight || !targetWeight || startWeight === targetWeight) return 0;
    
    const objective = goalData?.objective || 'loss';
    let progress = 0;
    
    if (objective === 'loss') {
      if (currentWeight >= startWeight) return 0;
      progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;
    } else if (objective === 'gain') {
      if (currentWeight <= startWeight) return 0;
      progress = ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100;
    } else {
      return 100;
    }
    
    return Math.min(100, Math.max(0, Math.round(progress)));
  }, [startWeight, targetWeight, currentWeight, goalData]);

  const coachImage = PlaceHolderImages.find(img => img.id === 'gym-coach');

  // Metrics Sequence: Calories, Hydration, Streak, Steps
  const metrics = [
    { 
      id: 'calories',
      label: "Calories", 
      value: calStatus, 
      unit: "", 
      target: targetCal.toLocaleString(), 
      current: currentCal,
      targetVal: targetCal,
      icon: Flame, 
      color: "bg-orange-50" 
    },
    { 
      id: 'hydration',
      label: "Hydration", 
      value: (hydrationAmount / 1000).toFixed(1), 
      unit: "L", 
      target: (goalData?.hydrationTargetLiters || 3.0).toFixed(1), 
      current: hydrationAmount / 1000,
      targetVal: goalData?.hydrationTargetLiters || 3.0,
      icon: Droplets, 
      color: "bg-sky-50" 
    },
    { 
      id: 'streak',
      label: "Streak", 
      value: streakData.count.toString(), 
      unit: "days", 
      target: "7", 
      current: streakData.count,
      targetVal: 7,
      icon: Zap, 
      color: "bg-yellow-50" 
    },
    { 
      id: 'steps',
      label: "Steps", 
      value: stepsCount.toLocaleString(), 
      unit: "steps", 
      target: "10,000", 
      current: stepsCount,
      targetVal: 10000,
      icon: Footprints, 
      color: "bg-green-50" 
    },
  ];

  const nutrients = [
    { 
      label: "Protein", 
      current: Math.round(currentIntake.protein), 
      target: goalData?.protein || 150, 
      unit: "g",
      color: "#FFC107"
    },
    { 
      label: "Carbs", 
      current: Math.round(currentIntake.carbs), 
      target: goalData?.carbs || 250, 
      unit: "g",
      color: "#42A5F5"
    },
    { 
      label: "Fat", 
      current: Math.round(currentIntake.fat), 
      target: goalData?.fats || 70, 
      unit: "g",
      color: "#FF7043"
    },
    { 
      label: "Fiber", 
      current: Math.round(currentIntake.fiber), 
      target: goalData?.fiber || 30, 
      unit: "g",
      color: "#10b981"
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

  // Streak Circle Calculation (Mon-Sun)
  const streakWeekStatus = useMemo(() => {
    const today = new Date();
    const mon = startOfWeek(today, { weekStartsOn: 1 });
    return [0, 1, 2, 3, 4, 5, 6].map(offset => {
      const day = addDays(mon, offset);
      const dayStr = format(day, 'yyyy-MM-dd');
      const label = format(day, 'EEE');
      return {
        label,
        active: streakData.history.includes(dayStr),
        dayNum: format(day, 'd')
      };
    });
  }, [streakData]);

  return (
    <div className="space-y-4 pb-24 pt-4">
      <Card 
        onClick={onViewGuide}
        className="border-none text-white overflow-hidden shadow-md cursor-pointer active:scale-[0.98] transition-all hover:shadow-lg"
        style={{ background: 'linear-gradient(to right, #065A54, #08A391)' }}
      >
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
              Your Personal Analyzer
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
              const isSteps = m.id === "steps";
              const isStreak = m.id === "streak";
              const showDetails = isHydration || isSteps;

              return (
                <Card 
                  key={idx} 
                  onClick={() => {
                    if (isCalories) onViewNutritionSummary?.();
                  }}
                  className={cn(
                    "min-w-[260px] flex-shrink-0 border-none shadow-sm bg-card snap-center",
                    isCalories && "cursor-pointer active:scale-[0.98] transition-all hover:bg-muted/5"
                  )}
                >
                  <CardContent className="p-3 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        {isCalories || isHydration || isSteps || isStreak ? (
                          <MetricSphere type={m.id as any} icon={m.icon} />
                        ) : (
                          <div className={`p-1.5 rounded-lg w-fit ${m.color}`}>
                            <m.icon className="w-4 h-4 text-yellow-500" />
                          </div>
                        )}
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-1">{m.label}</p>
                      </div>
                      {isStreak ? (
                        <span className="text-[9px] font-black text-primary uppercase tracking-tighter">{streakData.count} DAY STREAK</span>
                      ) : (
                        <span className="text-[10px] font-bold text-muted-foreground">{percentage}%</span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {!isStreak && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold">{m.value}</span>
                          <span className="text-[9px] text-muted-foreground font-medium">{m.unit}</span>
                        </div>
                      )}
                      
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
                            disabled={hydrationAmount >= 50000}
                            className="text-primary hover:text-primary/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isStreak ? (
                        <div className="flex justify-between w-full px-1">
                          {streakWeekStatus.map((day, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center transition-all border",
                                day.active 
                                  ? "bg-[#ff6b6b] border-[#ff6b6b] shadow-sm" 
                                  : "bg-muted/30 border-muted/50"
                              )}>
                                <span className={cn("text-[8px] font-black", day.active ? "text-white" : "text-muted-foreground/40")}>
                                  {day.dayNum}
                                </span>
                              </div>
                              <span className="text-[7px] font-black text-muted-foreground uppercase">{day.label}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="relative flex-1 h-6 flex items-center">
                            <Progress 
                              value={Math.min(percentage, 100)} 
                              className="h-1.5 w-full" 
                              indicatorClassName={isCalories ? "bg-gradient-to-r from-[#F59202] to-[#FFB84D]" : isSteps ? "bg-green-500" : ""}
                            />
                            
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
                              onClick={() => {
                                if (isHydration) onViewHydration?.();
                                if (isSteps) onViewSteps?.();
                              }}
                              className="flex items-center gap-0.5 text-[8px] font-black text-primary uppercase shrink-0 hover:opacity-70 transition-opacity"
                            >
                              Details <ChevronRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </>
                      )}
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

      <Card 
        onClick={onViewNutritionSummary}
        className="border-none shadow-sm overflow-hidden bg-card cursor-pointer active:scale-[0.98] transition-all hover:bg-muted/5"
      >
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
                      <span className={cn("text-[10px] font-light", isOver ? "text-destructive" : "text-foreground")}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-700 ease-out rounded-full")} 
                      style={{ 
                        width: `${Math.min((n.current / n.target) * 100, 100)}%`,
                        backgroundColor: isOver ? 'hsl(var(--destructive))' : n.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-card overflow-hidden">
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
            <div className="flex justify-between items-center text-[8px] font-bold text-muted-foreground">
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
          <Card 
            onClick={onViewProgress}
            className="min-w-[280px] flex-shrink-0 border-none shadow-sm bg-card overflow-hidden snap-center cursor-pointer active:scale-[0.98] transition-all hover:bg-muted/5"
          >
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
                  <AreaChart data={chartData}>
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
                      dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 1, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-[280px] flex-shrink-0 border-none shadow-sm bg-card snap-center">
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

      <section>
        <Card className="border-none shadow-sm overflow-hidden bg-card">
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
                </>
              )}
            </div>
            <div className="pt-3 border-t border-muted/20 flex items-center justify-between">
              <div className="flex-1">
                {todaysTasks.length > 2 && (
                  <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.1em]">
                    + {todaysTasks.length - 2} more tasks
                  </p>
                )}
              </div>
              <button 
                onClick={() => onViewTasks?.()}
                className="text-[9px] font-black text-primary uppercase flex items-center gap-1 hover:opacity-70 transition-all"
              >
                See More <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
