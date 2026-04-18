"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Dumbbell, 
  LineChart as ChartIcon,
  Bell,
  User,
  Crown,
  Loader2
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
import { GuideView } from '@/components/guide-view';
import { NotificationsView } from '@/components/notifications-view';
import { Button } from '@/components/ui/button';
import { format, isYesterday } from 'date-fns';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { cn } from '@/lib/utils';

export default function PulseFlowApp() {
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeCalculator, setActiveCalculator] = useState<'bmr' | '1rm' | 'bodyfat'>('bmr');
  const [tasks, setTask] = useState<Task[]>([]);
  const [hydrationAmount, setHydrationAmount] = useState(0);
  const [hydrationHistory, setHydrationHistory] = useState<Record<string, number>>({});
  const [stepsCount, setStepsCount] = useState(0);
  const [stepsHistory, setStepsHistory] = useState<Record<string, number>>({});
  const [goalData, setGoalData] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<any[]>([]);
  const [streakData, setStreakData] = useState({ count: 0, history: [] as string[] });
  const [isLoaded, setIsLoaded] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);

  // Initialize Anonymous Auth
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  // STABLE SCROLL RESET - PRIMARY NAVIGATION
  // This watcher handles all scroll resets because internal navigation is now "Official"
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Back Button / History Support
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        setActiveTab('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    if (window.history.state === null) {
      window.history.replaceState({ tab: 'dashboard' }, '');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (tab: string) => {
    if (tab !== activeTab) {
      window.history.pushState({ tab }, '');
      setActiveTab(tab);
    }
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const lastResetDate = localStorage.getItem('pulseflow_last_reset_date');
    
    const savedDarkMode = localStorage.getItem('pulseflow_dark_mode');
    if (savedDarkMode === 'true') {
      document.documentElement.classList.add('dark');
    }

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
        setTask(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse saved tasks", e);
      }
    }
    
    if (isNewDay) {
      setHydrationAmount(0);
      localStorage.setItem('pulseflow_hydration', '0');
      setStepsCount(0);
      localStorage.setItem('pulseflow_steps', '0');
      localStorage.setItem('pulseflow_meal_credits_v2', '20');
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

    localStorage.setItem('pulseflow_last_reset_date', todayStr);

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
    setTask(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateHydration = (amount: number) => {
    setHydrationAmount(prev => Math.min(50000, Math.max(0, prev + amount)));
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
    navigateTo('calculators');
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
    if (!isLoaded || isUserLoading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Initializing Cloud Flow...</p>
        </div>
      );
    }

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
            onViewHydration={() => navigateTo('hydration')} 
            onViewSteps={() => navigateTo('steps')}
            onViewTasks={() => navigateTo('tasks')} 
            onViewCalculators={handleOpenCalculator}
            onViewGoalSetting={() => navigateTo('goal-setting')}
            onViewProgress={() => navigateTo('rank')}
            onViewGuide={() => navigateTo('guide')}
            onViewNutritionSummary={() => navigateTo('nutrition-summary')}
          />
        );
      case 'nutrition': 
        return (
          <NutritionView 
            key="nutrition-main"
            loggedMeals={loggedMeals}
            setLoggedMeals={setLoggedMeals}
            activeView="log"
            onNavigate={navigateTo}
          />
        );
      case 'nutrition-summary':
        return (
          <NutritionView 
            key="nutrition-summary"
            loggedMeals={loggedMeals}
            setLoggedMeals={setLoggedMeals}
            activeView="summary"
            onNavigate={navigateTo}
          />
        );
      case 'nutrition-micro':
        return (
          <NutritionView 
            key="nutrition-micro"
            loggedMeals={loggedMeals}
            setLoggedMeals={setLoggedMeals}
            activeView="micro"
            onNavigate={navigateTo}
          />
        );
      case 'nutrition-macro':
        return (
          <NutritionView 
            key="nutrition-macro"
            loggedMeals={loggedMeals}
            setLoggedMeals={setLoggedMeals}
            activeView="macro"
            onNavigate={navigateTo}
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
            onBack={() => window.history.back()} 
          />
        );
      case 'steps': 
        return (
          <StepsView 
            currentSteps={stepsCount}
            history={stepsHistory}
            onUpdateSteps={updateSteps}
            onBack={() => window.history.back()} 
          />
        );
      case 'tasks': 
        return (
          <TasksView 
            tasks={tasks}
            setTasks={setTask}
            onBack={() => window.history.back()} 
          />
        );
      case 'calculators':
        return (
          <CalculatorsView 
            initialType={activeCalculator}
            onBack={() => window.history.back()}
          />
        );
      case 'goal-setting':
        return (
          <GoalSettingView 
            onBack={() => window.history.back()}
            onGoalSaved={refreshGoalData}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            onBack={() => window.history.back()}
          />
        );
      case 'subscription':
        return (
          <ProfileView 
            initialSubView="subscription"
            onBack={() => window.history.back()}
          />
        );
      case 'guide':
        return (
          <GuideView 
            goalData={goalData}
            loggedMeals={loggedMeals}
            hydrationAmount={hydrationAmount}
            weightHistory={weightHistory}
            onBack={() => window.history.back()}
          />
        );
      case 'notifications':
        return (
          <NotificationsView 
            onBack={() => window.history.back()}
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
          onViewProgress={() => navigateTo('rank')}
          onViewGuide={() => navigateTo('guide')}
          onViewNutritionSummary={() => navigateTo('nutrition-summary')}
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
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b relative">
        <div className="flex items-center">
          <button 
            onClick={() => navigateTo('profile')}
            className="w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center transition-all"
          >
            <User className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
          <span className="font-black text-xl tracking-tighter text-foreground">arcex</span>
          <span className="font-black text-xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">fit</span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigateTo('subscription')}
            className="rounded-full bg-muted/50 w-9 h-9 flex items-center justify-center"
          >
            <Crown className="w-4 h-4 text-amber-500" />
          </button>
          <button 
            onClick={() => navigateTo('notifications')}
            className="rounded-full bg-muted/50 w-9 h-9 relative flex items-center justify-center"
          >
            <Bell className="w-4 h-4 text-foreground" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-background"></span>
          </button>
        </div>
      </header>

      <main 
        ref={mainRef} 
        id="main-scroll-container"
        className="flex-1 px-4 overflow-y-auto swipe-container"
      >
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-card/90 backdrop-blur-xl border-t px-4 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'nutrition' && ['nutrition-summary', 'nutrition-micro', 'nutrition-macro'].includes(activeTab));
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group flex-1 justify-center max-w-[110px]",
                isActive 
                  ? "bg-primary/10" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon 
                className={cn("w-4 h-4 shrink-0 transition-colors")} 
                style={isActive ? { stroke: 'url(#icon-gradient)', fill: 'none' } : {}}
              />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tight transition-all text-foreground",
                isActive ? "opacity-100 ml-1" : "opacity-0 w-0 h-0 overflow-hidden"
              )}>
                {item.label}
              </span>
              {!isActive && (
                <span className="sr-only">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
