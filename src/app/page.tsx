"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Dumbbell, 
  LineChart as ChartIcon,
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { DashboardView } from '@/components/dashboard-view';
import { NutritionView } from '@/components/nutrition-view';
import { WorkoutView } from '@/components/workout-view';
import { ProgressView } from '@/components/progress-view';
import { HydrationView } from '@/components/hydration-view';
import { TasksView, type Task } from '@/components/tasks-view';
import { CalculatorsView } from '@/components/calculators-view';
import { GoalSettingView } from '@/components/goal-setting-view';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function PulseFlowApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCalculator, setActiveCalculator] = useState<'bmr' | '1rm' | 'bodyfat'>('bmr');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrationAmount, setHydrationAmount] = useState(0);
  const [hydrationHistory, setHydrationHistory] = useState<Record<string, number>>({});
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('pulseflow_tasks');
    const savedHydration = localStorage.getItem('pulseflow_hydration');
    const savedHydrationHistory = localStorage.getItem('pulseflow_hydration_history');
    const savedGoal = localStorage.getItem('pulseflow_goal_data');
    const savedWeight = localStorage.getItem('pulseflow_weight_history');
    const savedMeals = localStorage.getItem('pulseflow_today_logged_meals');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse saved tasks", e);
      }
    }
    
    if (savedHydration) {
      setHydrationAmount(Number(savedHydration));
    }

    if (savedHydrationHistory) {
      try {
        setHydrationHistory(JSON.parse(savedHydrationHistory));
      } catch (e) {
        console.error("Failed to parse hydration history", e);
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

    if (savedMeals) {
      try {
        setLoggedMeals(JSON.parse(savedMeals));
      } catch (e) {
        console.error("Failed to parse logged meals", e);
      }
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
      
      // Update history for today
      const today = format(new Date(), 'yyyy-MM-dd');
      setHydrationHistory(prev => ({
        ...prev,
        [today]: hydrationAmount
      }));
    }
  }, [hydrationAmount, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pulseflow_hydration_history', JSON.stringify(hydrationHistory));
    }
  }, [hydrationHistory, isLoaded]);

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
            goalData={goalData}
            weightHistory={weightHistory}
            loggedMeals={loggedMeals}
            onViewHydration={() => setActiveTab('hydration')} 
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
      default: return (
        <DashboardView 
          tasks={tasks} 
          onToggleTask={toggleTask} 
          hydrationAmount={hydrationAmount} 
          onUpdateHydration={updateHydration} 
          goalData={goalData}
          weightHistory={weightHistory}
          loggedMeals={loggedMeals}
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
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
          <span className="font-black text-xl tracking-tighter text-black">arcex</span>
          <span className="font-black text-xl tracking-tighter text-primary">fit</span>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 w-9 h-9">
            <Search className="w-4 h-4" />
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

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur-xl border-t px-6 py-2 flex justify-between items-center z-50">
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
        <button 
          onClick={() => setActiveTab('calculators')}
          className={`flex flex-col items-center transition-colors flex-1 ${activeTab === 'calculators' ? 'text-primary' : 'text-muted-foreground hover:text-primary/60'}`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'calculators' ? 'bg-primary/10' : 'hover:bg-muted'}`}>
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-tight opacity-0 h-0">More</span>
        </button>
      </nav>
    </div>
  );
}
