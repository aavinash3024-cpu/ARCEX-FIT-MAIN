
import { useRef, useState } from 'react';
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
  Scale,
  Plus,
  Minus,
  PieChart,
  Target,
  ListTodo
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

const weightData = [
  { day: 'Mon', weight: 79.5 },
  { day: 'Tue', weight: 79.2 },
  { day: 'Wed', weight: 78.8 },
  { day: 'Thu', weight: 78.9 },
  { day: 'Fri', weight: 78.5 },
];

interface DashboardViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  hydrationAmount: number;
  onUpdateHydration: (amount: number) => void;
  onViewHydration?: () => void;
  onViewTasks?: () => void;
}

export function DashboardView({ 
  tasks, 
  onToggleTask, 
  hydrationAmount, 
  onUpdateHydration, 
  onViewHydration, 
  onViewTasks 
}: DashboardViewProps) {
  const metricsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const [activeMetric, setActiveMetric] = useState(0);
  const [activeTool, setActiveTool] = useState(0);

  const bmr = 1600;
  const tdee = 2500;
  const currentCal = 1840;
  const targetCal = 2200;

  // Goal Weights
  const startWeight = 81.0;
  const currentWeight = 78.5;
  const goalWeight = 77.0;
  const progressPercent = Math.round(((startWeight - currentWeight) / (startWeight - goalWeight)) * 100);

  const coachImage = PlaceHolderImages.find(img => img.id === 'gym-coach');

  const metrics = [
    { 
      id: 'calories',
      label: "Calories", 
      value: currentCal.toLocaleString(), 
      unit: "kcal", 
      target: targetCal.toLocaleString(), 
      icon: <Flame className="w-4 h-4 text-orange-500" />, 
      color: "bg-orange-50" 
    },
    { 
      id: 'streak',
      label: "Streak", 
      value: "12", 
      unit: "days", 
      target: "15", 
      icon: <Zap className="w-4 h-4 text-yellow-500" />, 
      color: "bg-yellow-50" 
    },
    { 
      id: 'hydration',
      label: "Hydration", 
      value: (hydrationAmount / 1000).toFixed(1), 
      unit: "L", 
      target: "3.0", 
      icon: <Droplets className="w-4 h-4 text-sky-500" />, 
      color: "bg-sky-50" 
    },
    { 
      id: 'steps',
      label: "Steps", 
      value: "8,432", 
      unit: "steps", 
      target: "10,000", 
      icon: <Footprints className="w-4 h-4 text-green-500" />, 
      color: "bg-green-50" 
    },
  ];

  const nutrients = [
    { label: "Carbs", current: 185, target: 250, unit: "g" },
    { label: "Protein", current: 120, target: 150, unit: "g" },
    { label: "Fat", current: 52, target: 70, unit: "g" },
    { label: "Fiber", current: 22, target: 35, unit: "g" },
  ];

  const calculators = [
    { label: "1 Rep Max", description: "Power" },
    { label: "Body Fat %", description: "Body" },
    { label: "BMR / TDEE", description: "Energy" },
  ];

  // Logic to show today's tasks
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const priorityBgColor = { low: 'bg-green-500', medium: 'bg-amber-500', high: 'bg-destructive' };
  
  const todaysTasks = tasks
    .filter(t => isSameDay(new Date(t.date), new Date()))
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

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
      {/* 1. Personal Guide - AI Suggestion Banner */}
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
            <p className="text-xs opacity-90 leading-relaxed">Increase protein by 15g today to support muscle recovery from yesterday's heavy lifting session.</p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Daily Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-headline">Daily Overview</h2>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center">
            SWIPE <ChevronRight className="w-3 h-3 ml-1" />
          </span>
        </div>

        {/* Metrics Belt */}
        <div className="relative group">
          <div 
            ref={metricsRef}
            onScroll={() => handleScroll(metricsRef, setActiveMetric)}
            className="flex gap-3 overflow-x-auto pb-2 swipe-container snap-x snap-mandatory scroll-smooth"
          >
            {metrics.map((m, idx) => {
              const valNum = parseFloat(m.value.replace(',', ''));
              const targetNum = parseFloat(m.target.replace(',', ''));
              const percentage = Math.round((valNum / targetNum) * 100);
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
                                style={{ left: `${(bmr / targetNum) * 100}%` }}
                              >
                                <span className="text-[6px] font-bold text-destructive/60">BMR</span>
                                <div className="h-2 w-[1px] bg-destructive/40" />
                              </div>
                              <div 
                                className="absolute bottom-[50%] mb-[3px] flex flex-col items-center -translate-x-1/2" 
                                style={{ left: `${Math.min((tdee / targetNum) * 100, 98)}%` }}
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
          {/* Pagination Dots for Overview */}
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

      {/* 3. Today's Macros */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center justify-start">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-tight">
              <PieChart className="w-3.5 h-3.5 text-primary" />
              Today's Macros
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {nutrients.map((n, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{n.label}</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs font-black text-foreground">{n.current}</span>
                    <span className="text-[8px] font-bold text-muted-foreground">/ {n.target}{n.unit}</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${Math.min((n.current / n.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Goal Milestone Card */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex flex-col items-start w-full">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-tight">
                <Target className="w-3.5 h-3.5 text-primary" />
                Goal
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-[8px] h-3.5 py-0 uppercase">Loss</Badge>
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
              <span>{startWeight.toFixed(1)} kg</span>
              <span className="text-primary">{currentWeight.toFixed(1)} kg</span>
              <span>{goalWeight.toFixed(1)} kg</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center pt-1">
            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              {(currentWeight - goalWeight).toFixed(1)} kg to go
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5. Weight & Performance Tools (Swipeable) */}
      <section className="space-y-2">
        <div 
          ref={toolsRef}
          onScroll={() => handleScroll(toolsRef, setActiveTool)}
          className="flex gap-3 overflow-x-auto pb-4 swipe-container snap-x snap-mandatory scroll-smooth"
        >
          {/* Weight Card with Graph */}
          <Card className="min-w-[280px] flex-shrink-0 border-none shadow-sm bg-white overflow-hidden snap-center">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Scale className="w-3 h-3 text-primary" /> Current Weight
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{currentWeight}</span>
                    <span className="text-xs text-muted-foreground">kg</span>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-none px-2 py-0.5 gap-1 text-[10px]">
                  <TrendingDown className="w-3 h-3" /> -0.4kg
                </Badge>
              </div>
              
              <div className="h-16 w-full -mx-4 -mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData}>
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

          {/* Calculators Card */}
          <Card className="min-w-[280px] flex-shrink-0 border-none shadow-sm bg-white snap-center">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Calculator className="w-3 h-3 text-primary" /> Performance Tools
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {calculators.map((calc, idx) => (
                  <button 
                    key={idx} 
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
        {/* Pagination Dots for Tools */}
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

      {/* 6. Today's Tasks */}
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
