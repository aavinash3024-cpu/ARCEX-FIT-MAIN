import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Weight, Trophy, TrendingDown, ArrowUpRight, Crown, Medal, User } from "lucide-react";
import { 
  LineChart, 
  Line, 
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
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold font-headline">Progress & Rank</h1>
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
            <TabsTrigger value="weight" className="rounded-md">Weight Tracker</TabsTrigger>
            <TabsTrigger value="rank" className="rounded-md">Global Ranking</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "weight" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Current Weight</p>
                  <h2 className="text-4xl font-bold">78.5 <span className="text-lg font-normal text-muted-foreground">kg</span></h2>
                </div>
                <Badge className="bg-green-100 text-green-700 border-none px-3 py-1 gap-1">
                  <TrendingDown className="w-4 h-4" /> 2.5%
                </Badge>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-muted/30 rounded-2xl">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold">Start</p>
                   <p className="font-semibold">80.5</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-2xl">
                   <p className="text-[10px] text-muted-foreground uppercase font-bold">Goal</p>
                   <p className="font-semibold">75.0</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-2xl border-2 border-primary/20">
                   <p className="text-[10px] text-primary uppercase font-bold">Left</p>
                   <p className="font-semibold text-primary">3.5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-xs opacity-80">Next Goal Milestone</p>
                   <h4 className="font-bold">Reach 77.0 kg</h4>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-bold">45%</span>
                   <ArrowUpRight className="w-5 h-5 text-accent" />
                </div>
             </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="grid gap-4">
             {ranking.map((user, idx) => (
               <Card key={idx} className={`border-none shadow-sm ${user.isUser ? 'ring-2 ring-primary bg-primary/5' : 'glass-card'}`}>
                 <CardContent className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-8 flex justify-center font-bold text-lg text-muted-foreground">
                        {user.rank}
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className={`font-semibold ${user.isUser ? 'text-primary' : ''}`}>{user.name}</p>
                        <p className="text-[10px] text-muted-foreground">Consistency Level 12</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-sm">{user.points.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Flow Points</p>
                   </div>
                 </CardContent>
               </Card>
             ))}
          </div>
          <Card className="border-none shadow-sm bg-accent/10 border-2 border-dashed border-accent">
             <CardContent className="p-6 text-center space-y-2">
                <p className="text-sm font-medium">Want to climb higher?</p>
                <p className="text-xs text-muted-foreground">Complete 3 consecutive workout days to earn a 500 point bonus!</p>
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
