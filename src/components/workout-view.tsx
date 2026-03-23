import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Trophy, Library, History, Layout, Plus, Play, ChevronRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function WorkoutView() {
  const currentSplit = [
    { day: "Mon", focus: "Chest & Triceps", status: "Completed" },
    { day: "Tue", focus: "Back & Biceps", status: "Active" },
    { day: "Wed", focus: "Rest", status: "Rest" },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Workout</h1>
        <Button size="sm" className="rounded-full gap-2">
          <Plus className="w-4 h-4" /> Start Workout
        </Button>
      </div>

      {/* Current Program Split */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" /> Current Split
          </h2>
          <Button variant="link" className="text-xs p-0 h-auto">View Split Builder</Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 swipe-container">
          {currentSplit.map((day, idx) => (
            <Card key={idx} className={`min-w-[140px] border-none shadow-sm ${day.status === 'Active' ? 'bg-primary text-primary-foreground ring-2 ring-accent ring-offset-2' : 'glass-card'}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold opacity-80">{day.day}</span>
                  {day.status === 'Active' && <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>}
                </div>
                <p className="text-sm font-semibold h-10">{day.focus}</p>
                <Badge variant={day.status === 'Active' ? 'secondary' : 'outline'} className="text-[9px] w-full justify-center">
                  {day.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm hover:translate-y-[-2px] transition-transform">
          <CardContent className="p-5 flex flex-col items-center gap-3">
            <div className="p-4 bg-orange-100 rounded-3xl">
              <Trophy className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Personal Records</p>
              <p className="text-[10px] text-muted-foreground">8 new this month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:translate-y-[-2px] transition-transform">
          <CardContent className="p-5 flex flex-col items-center gap-3">
            <div className="p-4 bg-blue-100 rounded-3xl">
              <Library className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Exercise Library</p>
              <p className="text-[10px] text-muted-foreground">300+ Exercises</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Workout History
        </h2>
        {[1, 2].map((i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                   <Dumbbell className="w-6 h-6 text-primary/50" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Push Day Routine</h4>
                  <p className="text-xs text-muted-foreground">Oct 24 • 1h 15m • 24 Sets</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
