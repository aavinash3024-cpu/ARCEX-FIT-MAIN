import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Trophy, 
  Library, 
  History, 
  Layout, 
  Plus, 
  RefreshCw,
  ChevronRight
} from "lucide-react";

export function WorkoutView() {
  const gridItems = [
    { title: "Personal Records", subtitle: "8 new this month", icon: <Trophy className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" },
    { title: "Exercise Library", subtitle: "300+ Exercises", icon: <Library className="w-5 h-5 text-blue-500" />, color: "bg-blue-50" },
    { title: "Workout History", subtitle: "View past sessions", icon: <History className="w-5 h-5 text-purple-500" />, color: "bg-purple-50" },
    { title: "My Workout Split", subtitle: "4-day Push/Pull", icon: <Layout className="w-5 h-5 text-emerald-500" />, color: "bg-emerald-50" },
  ];

  const protocolExercises = [
    { name: "Incline Guillotine Press", category: "CHEST • UPPER CHEST", status: "AWAITING DATA" },
    { name: "Cable Kickback (Triceps)", category: "TRICEPS • LATERAL HEAD", status: "AWAITING DATA" },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-2xl font-bold font-headline">Workout</h1>
        <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 bg-muted/50">
          <History className="w-4 h-4" />
        </Button>
      </div>

      {/* 2x2 Grid Menu */}
      <div className="grid grid-cols-2 gap-3">
        {gridItems.map((item, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer group bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-[11px] tracking-tight uppercase">{item.title}</p>
                <p className="text-[9px] text-muted-foreground uppercase font-bold mt-0.5 opacity-60">{item.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Protocol Card - Styled like Meal Log Card */}
      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        {/* Header - Logo on Left */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100/50 rounded-full shrink-0">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-foreground/80">Today's Protocol</h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                COMPLETION: <span className="text-emerald-600">0/2 DONE</span>
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-4">
          {/* Exercise Items - More refined */}
          <div className="space-y-2">
            {protocolExercises.map((ex, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm p-3.5 rounded-xl border border-emerald-50/30 shadow-sm relative group cursor-pointer active:scale-[0.98] transition-all hover:border-emerald-200/50">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Targeted</p>
                    <h4 className="font-bold text-[13px] text-emerald-900">{ex.name}</h4>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">{ex.category}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-black text-emerald-600/30 uppercase tracking-[0.2em]">{ex.status}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground/20" />
                </div>
              </div>
            ))}
          </div>

          {/* Add Movement Button - Styled like main log button */}
          <Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] gap-2">
            <Plus className="w-4 h-4" /> Add Extra Movement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
