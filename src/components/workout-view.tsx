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
  RefreshCw
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Workout</h1>
      </div>

      {/* 2x2 Grid Menu */}
      <div className="grid grid-cols-2 gap-3">
        {gridItems.map((item, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer group">
            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
              <div className={`p-3 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-xs tracking-tight">{item.title}</p>
                <p className="text-[9px] text-muted-foreground uppercase font-medium mt-0.5">{item.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Protocol Card - Updated background to be more whitish */}
      <Card className="border-none shadow-sm bg-white/40 backdrop-blur-md overflow-hidden border-2 border-emerald-100/30">
        <CardContent className="p-5 space-y-5">
          {/* Protocol Header */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-900/70">Today's Protocol</h3>
                <p className="text-xs font-bold text-emerald-700/60 uppercase">Monday</p>
              </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-none px-3 py-1 font-bold text-[10px]">
              0/2 DONE
            </Badge>
          </div>

          {/* Exercise Items */}
          <div className="space-y-3">
            {protocolExercises.map((ex, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-50/50 shadow-sm relative group cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-black text-[13px] uppercase tracking-tight text-emerald-900">{ex.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">{ex.category}</p>
                  </div>
                  <RefreshCw className="w-4 h-4 text-muted-foreground/40" />
                </div>
                <div className="mt-4">
                  <span className="text-[9px] font-black text-emerald-600/40 uppercase tracking-[0.2em]">{ex.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Movement Button */}
          <Button variant="ghost" className="w-full h-12 rounded-2xl border-2 border-dashed border-emerald-100/60 text-emerald-600/60 hover:bg-emerald-50/50 hover:text-emerald-700 font-bold text-xs gap-2">
            <Plus className="w-4 h-4" /> ADD EXTRA MOVEMENT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
