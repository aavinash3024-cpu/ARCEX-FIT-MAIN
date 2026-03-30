"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Dumbbell, 
  LineChart as ChartIcon,
  Bell,
  User,
  Crown
} from 'lucide-react';
import { DashboardView } from '@/components/dashboard-view';
import { NutritionView } from '@/components/nutrition-view';
import { WorkoutView } from '@/components/workout-view';
import { ProgressView } from '@/components/progress-view';
import { HydrationView } from '@/components/hydration-view';
import { StepsView } from '@/components/steps-view';
import { TasksView, type Task } from '@/components/tasks-view';
import { CalculatorsView } from '@/components/calculators-view';
import { GoalSettingView } from '@/components/goal-setting-view';
import { ProfileView } from '@/components/profile-view';
import { Button } from '@/components/ui/button';
import { format, isYesterday } from 'date-fns';

export default function PulseFlowApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCalculator, setActiveCalculator] = useState<'bmr' | '1rm' | 'bodyfat'>('bmr');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrationAmount, setHydrationAmount] = useState(0);
  const [hydrationHistory, setHydrationHistory] = useState<Record<string, number>>({});
  const [stepsCount, setStepsCount] = useState(0);
  const [stepsHistory, setStepsHistory] = useState<Record<string, number>>({});
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<any[]>([]);
  const [streakData, setStreakData] = useState({ count: 0, history: [] as string[] });
  const [isLoaded, setIsLoaded] = useState(false);

  // Global Haptics Listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const hapticsSetting = localStorage.getItem('pulseflow_haptics');
      const isHapticsEnabled = hapticsSetting === null || hapticsSetting === 'true';
      
      if (!isHapticsEnabled) return;

      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(8);
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const lastResetDate = localStorage.getItem('pulseflow_last_reset_date');
    
    // Theme initialization
    const savedDarkMode = localStorage.getItem('pulseflow_dark_mode');
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark');
    }

    // Check if we need to reset daily trackers for a new day
    const isNewDay = lastResetDate !== todayStr;

    const savedTasks = localStorage.getItem('pulseflow_tasks');
    const savedHydration = localStorage.getItem('pulseflow_hydration');
    const savedHydrationHistory = localStorage.getItem('pulseflow_hydration_history');
    const savedSteps = localStorage.getItem('pulseflow_steps');
    const savedStepsHistory = localStorage.getItem('pulseflow_steps_history');
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    const savedWeight = localStorage.getItem('pulseflow_weight_history');
    const savedMeals = localStorage.getItem('pulseflow_today_logged_meals');
    const savedStreak = localStorage.getItem('pulseflow_streak_v3');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse saved tasks", e);
      }
    }
    
    // Reset hydration if it's a new day
    if (isNewDay) {
      setHydrationAmount(0);
      localStorage.setItem('pulseflow_hydration', '0');
      setStepsCount(0);
      localStorage.setItem('pulseflow_steps', '0');
    } else {
      if (savedHydration) setHydrationAmount(Number(savedHydration));
      if (savedSteps) setStepsCount(Number(savedSteps));
    }

    if (savedHydrationHistory) {
      try {
        setHydrationHistory(JSON.parse(savedHydrationHistory));
      } catch (e) {
        console.error("Failed to parse hydration history", e);
      }
    }

    if (savedStepsHistory) {
      try {
        setStepsHistory(JSON.parse(savedStepsHistory));
      } catch (e) {
        console.error("Failed to parse steps history", e);
      }
    }

    if (savedGoal) {
      try {
        setGoalData(JSON.parse(savedGoal));
      } catch (e) {
        console.error("Failed to parse saved goal", e);
      }
    }

    if (savedWeight) {
      try {
        setWeightHistory(JSON.parse(savedWeight));
      } catch (e) {
        console.error("Failed to parse weight history", e);
      }
    }

    // Reset logged meals if it's a new day
    if (isNewDay) {
      setLoggedMeals([]);
      localStorage.setItem('pulseflow_today_logged_meals', '[]');
    } else if (savedMeals) {
      try {
        setLoggedMeals(JSON.parse(savedMeals));
      } catch (e) {
        console.error("Failed to parse logged meals", e);
      }
    }

    // Mark today as the last reset date
    localStorage.setItem('pulseflow_last_reset_date', todayStr);

    // Streak Logic
    if (savedStreak) {
      try {
        const data = JSON.parse(savedStreak);
        const lastOpen = data.lastDate;
        
        if (lastOpen === todayStr) {
          setStreakData({ count: data.count, history: data.history });
        } else {
          const lastDateObj = new Date(lastOpen);
          let newCount = 1;
          
          if (isYesterday(lastDateObj)) {
            newCount = data.count + 1;
          }
          
          const newHistory = [...data.history, todayStr].slice(-30);
          const newData = { count: newCount, history: newHistory, lastDate: todayStr };
          setStreakData({ count: newCount, history: newHistory });
          localStorage.setItem('pulseflow_streak_v3', JSON.stringify(newData));
        }
      } catch (e) {
        console.error("Failed to parse streak", e);
      }
    } else {
      const newData = { count: 1, history: [todayStr], lastDate: todayStr };
      setStreakData({ count: 1, history: [todayStr] });
      localStorage.setItem('pulseflow_streak_v3', JSON.stringify(newData));
    }
    
    setIsLoaded(true);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_hydration', hydrationAmount.toString());
      
      const today = format(new Date(), 'yyyy-MM-dd');
      setHydrationHistory(prev => {
        const newHistory = {
          ...prev,
          [today]: hydrationAmount
        };
        localStorage.setItem('pulseflow_hydration_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [hydrationAmount, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_steps', stepsCount.toString());
      
      const today = format(new Date(), 'yyyy-MM-dd');
      setStepsHistory(prev => {
        const newHistory = {
          ...prev,
          [today]: stepsCount
        };
        localStorage.setItem('pulseflow_steps_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [stepsCount, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_weight_history', JSON.stringify(weightHistory));
    }
  }, [weightHistory, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_today_logged_meals', JSON.stringify(loggedMeals));
    }
  }, [loggedMeals, isLoaded]);

  const refreshGoalData = () => {
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    if (savedGoal) {
      setGoalData(JSON.parse(savedGoal));
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateHydration = (amount: number) => {
    setHydrationAmount(prev => Math.max(0, prev + amount));
  };

  const updateSteps = (amount: number) => {
    setStepsCount(prev => Math.max(0, prev + amount));
  };

  const handleOpenCalculator = (type: string) => {
    const calcMap: Record<string, 'bmr' | '1rm' | 'bodyfat'> = {
      '1 Rep Max': '1rm',
      'Body Fat %': 'bodyfat',
      'BMR / TDEE': 'bmr'
    };
    setActiveCalculator(calcMap[type] || 'bmr');
    setActiveTab('calculators');
  };

  const handleLogWeight = (newEntry: { date: string, weight: number }) => {
    setWeightHistory(prev => {
      const updated = [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return updated;
    });
  };

  const handleDeleteWeight = (date: string) => {
    setWeightHistory(prev => prev.filter(entry => entry.date !== date));
  };

  const renderContent = () => {
    if (!isLoaded) return <div className="flex-1 flex items-center justify-center opacity-20"><p className="text-[10px] font-black uppercase tracking-widest">Loading Your Flow...</p></div>;

    switch(activeTab) {
      case 'dashboard': 
        return (
          <DashboardView 
            tasks={tasks}
            onToggleTask={toggleTask}
            hydrationAmount={hydrationAmount}
            onUpdateHydration={updateHydration}
            stepsCount={stepsCount}
            onUpdateSteps={updateSteps}
            goalData={goalData}
            weightHistory={weightHistory}
            loggedMeals={loggedMeals}
            streakData={streakData}
            onViewHydration={() => setActiveTab('hydration')} 
            onViewSteps={() => setActiveTab('steps')}
            onViewTasks={() => setActiveTab('tasks')} 
            onViewCalculators={handleOpenCalculator}
            onViewGoalSetting={() => setActiveTab('goal-setting')}
          />
        );
      case 'nutrition': 
        return (
          <NutritionView 
            loggedMeals={loggedMeals}
            setLoggedMeals={setLoggedMeals}
          />
        );
      case 'workout': return <WorkoutView />;
      case 'rank': 
        return (
          <ProgressView 
            goalData={goalData} 
            weightHistory={weightHistory}
            onLogWeight={handleLogWeight}
            onDeleteWeight={handleDeleteWeight}
          />
        );
      case 'hydration': 
        return (
          <HydrationView 
            currentMl={hydrationAmount}
            history={hydrationHistory}
            onUpdateMl={updateHydration}
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      case 'steps': 
        return (
          <StepsView 
            currentSteps={stepsCount}
            history={stepsHistory}
            onUpdateSteps={updateSteps}
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      case 'tasks': 
        return (
          <TasksView 
            tasks={tasks}
            setTasks={setTasks}
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      case 'calculators':
        return (
          <CalculatorsView 
            initialType={activeCalculator}
            onBack={() => setActiveTab('dashboard')}
          />
        );
      case 'goal-setting':
        return (
          <GoalSettingView 
            onBack={() => setActiveTab('dashboard')}
            onGoalSaved={refreshGoalData}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            onBack={() => setActiveTab('dashboard')}
          />
        );
      default: return (
        <DashboardView 
          tasks={tasks} 
          onToggleTask={toggleTask} 
          hydrationAmount={hydrationAmount} 
          onUpdateHydration={updateHydration} 
          goalData={goalData}
          weightHistory={weightHistory}
          loggedMeals={loggedMeals}
          streakData={streakData}
        />
      );
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'nutrition', icon: UtensilsCrossed, label: 'Food' },
    { id: 'workout', icon: Dumbbell, label: 'Gym' },
    { id: 'rank', icon: ChartIcon, label: 'Progress' },
  ];

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-background flex flex-col relative shadow-xl border-x">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b relative">
        <div className="flex items-center">
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <User className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
          <span className="font-black text-xl tracking-tighter text-foreground">arcex</span>
          <span className="font-black text-xl tracking-tighter text-primary">fit</span>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 w-9 h-9">
            <Crown className="w-4 h-4 text-amber-500" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 w-9 h-9 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border border-background"></span>
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 overflow-y-auto">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-card/90 backdrop-blur-xl border-t px-6 py-2 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-300 group flex-1 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/60'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10' : 'group-hover:bg-muted'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-tight transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 h-0 overflow-hidden group-hover:opacity-40 group-hover:h-auto'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}