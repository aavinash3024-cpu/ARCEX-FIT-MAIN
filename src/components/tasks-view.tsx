"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2,
  Calendar,
  AlertCircle,
  ClipboardList
} from "lucide-react";
import { addDays, format, startOfToday, isSameDay } from 'date-fns';
import { cn } from "@/lib/utils";

type Priority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  date: Date;
}

interface TasksViewProps {
  onBack: () => void;
}

export function TasksView({ onBack }: TasksViewProps) {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');

  const priorityColor = {
    low: 'text-green-600 bg-green-50 border-green-100',
    medium: 'text-amber-600 bg-amber-50 border-amber-100',
    high: 'text-destructive bg-destructive/10 border-destructive/20'
  };

  // Date Shift logic
  const daysToShow = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 3));

  const filteredTasks = tasks.filter(t => isSameDay(new Date(t.date), selectedDate));

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      priority: selectedPriority,
      completed: false,
      date: selectedDate
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getStats = () => {
    const daily = filteredTasks;
    const high = daily.filter(t => t.priority === 'high');
    const medium = daily.filter(t => t.priority === 'medium');
    const low = daily.filter(t => t.priority === 'low');
    
    return {
      high: { done: high.filter(t => t.completed).length, total: high.length },
      medium: { done: medium.filter(t => t.completed).length, total: medium.length },
      low: { done: low.filter(t => t.completed).length, total: low.length },
      total: { done: daily.filter(t => t.completed).length, total: daily.length }
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 pb-32 pt-4 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-muted/50 w-9 h-9">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-headline">Daily Tasks</h1>
      </div>

      {/* Date Shifter */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-muted/20">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex gap-2 overflow-x-auto swipe-container px-2">
          {daysToShow.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[45px] h-14 rounded-xl transition-all",
                  isSelected ? "bg-primary text-primary-foreground shadow-md scale-110" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
              >
                <span className="text-[10px] font-bold uppercase opacity-60">{format(day, 'EEE')}</span>
                <span className="text-sm font-black">{format(day, 'd')}</span>
              </button>
            );
          })}
        </div>

        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Redesigned Add Task Card */}
      <Card className="border-none shadow-md bg-white">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-foreground">Daily objectives</h2>
            <p className="text-xs text-muted-foreground font-medium">Manage and create tasks for this date.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              NEW OBJECTIVE
            </label>
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?" 
              className="w-full h-14 px-5 bg-muted/10 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              SET PRIORITY
            </label>
            <div className="grid grid-cols-3 gap-1 bg-muted/10 p-1.5 rounded-2xl">
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={cn(
                    "py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedPriority === p 
                      ? "bg-white text-foreground shadow-sm scale-[1.02]" 
                      : "text-muted-foreground hover:text-foreground/70"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={addTask}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Save task
          </Button>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-3 opacity-20">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-foreground/30 flex items-center justify-center">
              <ClipboardList className="w-8 h-8" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">NO TASKS LOGGED</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="border-none shadow-sm bg-white overflow-hidden group">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox 
                    checked={task.completed} 
                    onCheckedChange={() => toggleTask(task.id)}
                    className="h-5 w-5 rounded-md border-2"
                  />
                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-sm font-bold transition-all",
                      task.completed ? "text-muted-foreground line-through opacity-50" : "text-foreground"
                    )}>
                      {task.title}
                    </p>
                    <Badge variant="outline" className={cn("text-[8px] h-4 font-black uppercase tracking-tighter", priorityColor[task.priority])}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Card */}
      <Card className="border-none shadow-lg bg-white border border-muted/10 sticky bottom-4 z-10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3 border-b border-muted/20 pb-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-3 h-3" /> Daily Summary
            </h4>
            <span className="text-[10px] font-black text-primary uppercase">{stats.total.done}/{stats.total.total} Done</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-destructive/5 p-2 rounded-xl text-center border border-destructive/10">
              <p className="text-[8px] font-black text-destructive uppercase tracking-tighter">High</p>
              <p className="text-xs font-black">{stats.high.done}/{stats.high.total}</p>
            </div>
            <div className="bg-amber-50 p-2 rounded-xl text-center border border-amber-100">
              <p className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Medium</p>
              <p className="text-xs font-black">{stats.medium.done}/{stats.medium.total}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-xl text-center border border-green-100">
              <p className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Low</p>
              <p className="text-xs font-black">{stats.low.done}/{stats.low.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
