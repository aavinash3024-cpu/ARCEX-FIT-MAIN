import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  TrendingDown, 
  ArrowUpRight, 
  Crown, 
  Medal, 
  User, 
  LineChart as ChartIcon,
  Scale
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { date: 'Oct 1', weight: 80.5 },
  { date: 'Oct 8', weight: 79.8 },
  { date: 'Oct 15', weight: 79.2 },
  { date: 'Oct 22', weight: 78.5 },
];

const ranking = [
  { rank: 1, name: "Alex Johnson", points: 12450, avatar: <Crown className="w-4 h-4 text-yellow-500" /> },
  { rank: 2, name: "Sam Wilson", points: 11200, avatar: <Medal className="w-4 h-4 text-gray-400" /> },
  { rank: 3, name: "You", points: 10850, avatar: <User className="w-4 h-4 text-primary" />, isUser: true },
  { rank: 4, name: "Jordan Lee", points: 9500, avatar: <User className="w-4 h-4 text-muted-foreground" /> },
];

export function ProgressView() {
  const [view, setView] = useState("weight");

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold font-headline">Progress & Rank</h1>
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 h-11 rounded-xl">
            <TabsTrigger value="weight" className="rounded-lg font-bold text-xs uppercase tracking-tight">Weight Tracker</TabsTrigger>
            <TabsTrigger value="rank" className="rounded-lg font-bold text-xs uppercase tracking-tight">Global Ranking</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "weight" ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
          {/* 1. Current Status & Insights */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-5 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Current Status</p>
                  <div className="flex items-baseline gap-1">
                    <h2 className="text-4xl font-black text-foreground">78.5</h2>
                    <span className="text-sm font-bold text-muted-foreground uppercase">kg</span>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 gap-1 text-[10px] font-black uppercase">
                  <TrendingDown className="w-3 h-3" /> 2.5% Loss
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-muted/20 rounded-2xl border border-muted/30">
                   <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Start</p>
                   <p className="font-black text-sm">80.5 <span className="text-[8px] opacity-40">kg</span></p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-2xl border border-muted/30">
                   <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Goal</p>
                   <p className="font-black text-sm">75.0 <span className="text-[8px] opacity-40">kg</span></p>
                </div>
                <div className="text-center p-3 bg-primary/5 rounded-2xl border border-primary/10">
                   <p className="text-[9px] text-primary uppercase font-black tracking-widest mb-1">Left</p>
                   <p className="font-black text-sm text-primary">3.5 <span className="text-[8px] opacity-40">kg</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Log Entry Action */}
          <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-2">
            <Plus className="w-4 h-4" /> Log New Weight Entry
          </Button>

          {/* 3. Weight Trend Graph */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] flex items-center gap-2">
                  <ChartIcon className="w-3.5 h-3.5 text-primary" /> Weight Trend
                </h3>
                <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-40 tracking-tighter">Last 30 Days</span>
              </div>
              
              <div className="h-[200px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
                      dy={10}
                    />
                    <YAxis 
                      domain={['dataMin - 1', 'dataMax + 1']} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', fontSize: '10px', fontWeight: 'bold' }}
                       itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorWeight)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 4. Goal Milestone Insights */}
          <Card className="border-none shadow-sm bg-primary/90 text-primary-foreground overflow-hidden">
             <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-0.5">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Next Milestone</p>
                   <h4 className="font-black text-sm">Reach 77.0 kg</h4>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <span className="text-2xl font-black">45%</span>
                      <p className="text-[8px] font-bold uppercase opacity-60">Completed</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                     <ArrowUpRight className="w-5 h-5 text-accent" />
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="grid gap-3">
             {ranking.map((user, idx) => (
               <Card key={idx} className={`border-none shadow-sm transition-all ${user.isUser ? 'ring-2 ring-primary/20 bg-primary/5' : 'bg-white'}`}>
                 <CardContent className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-6 flex justify-center font-black text-sm text-muted-foreground/40">
                        {user.rank}
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.isUser ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/50'}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className={`text-sm font-black ${user.isUser ? 'text-primary' : 'text-foreground/80'}`}>{user.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight">Consistency Level 12</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-sm text-foreground">{user.points.toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Points</p>
                   </div>
                 </CardContent>
               </Card>
             ))}
          </div>
          
          <Card className="border-none shadow-sm bg-accent/5 border-2 border-dashed border-accent/30 mt-4">
             <CardContent className="p-6 text-center space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-accent-foreground">Want to climb higher?</p>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Complete 3 consecutive workout days to earn a <span className="text-primary font-bold">500 point</span> bonus!</p>
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
