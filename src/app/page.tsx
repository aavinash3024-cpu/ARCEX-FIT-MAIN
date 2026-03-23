"use client";

import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PulseFlowApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': 
        return (
          <DashboardView 
            tasks={tasks}
            onViewHydration={() => setActiveTab('hydration')} 
            onViewTasks={() => setActiveTab('tasks')} 
          />
        );
      case 'nutrition': return <NutritionView />;
      case 'workout': return <WorkoutView />;
      case 'rank': return <ProgressView />;
      case 'hydration': return <HydrationView onBack={() => setActiveTab('dashboard')} />;
      case 'tasks': 
        return (
          <TasksView 
            tasks={tasks}
            setTasks={setTasks}
            onBack={() => setActiveTab('dashboard')} 
          />
        );
      default: return <DashboardView tasks={tasks} />;
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
      {/* Header with Centered Logo */}
      <header className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b relative">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>

        {/* Center Logo: arcex fit in lowercase */}
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

      {/* Main Content Area */}
      <main className="flex-1 px-4 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
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
        <button className="flex flex-col items-center text-muted-foreground hover:text-primary/60 transition-colors flex-1">
          <div className="p-1.5 rounded-xl hover:bg-muted">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-tight opacity-0 h-0">More</span>
        </button>
      </nav>
    </div>
  );
}
