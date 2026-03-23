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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PulseFlowApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'nutrition': return <NutritionView />;
      case 'workout': return <WorkoutView />;
      case 'rank': return <ProgressView />;
      default: return <DashboardView />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'nutrition', icon: UtensilsCrossed, label: 'Food' },
    { id: 'workout', icon: Dumbbell, label: 'Gym' },
    { id: 'rank', icon: ChartIcon, label: 'Stats' },
  ];

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-background flex flex-col relative shadow-xl border-x">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user/100/100" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Welcome back</p>
            <h2 className="font-bold text-lg">Jordan Flow</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/50">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/80 backdrop-blur-xl border-t px-6 py-4 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 group ${isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-primary/60'}`}
            >
              <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-primary/10' : 'group-hover:bg-muted'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden group-hover:opacity-40'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
        <button className="flex flex-col items-center text-muted-foreground hover:text-primary/60 transition-colors">
          <div className="p-2 rounded-2xl hover:bg-muted">
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-0 h-0">More</span>
        </button>
      </nav>
    </div>
  );
}
