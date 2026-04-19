"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  User, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { AnimatedBackground } from './animated-background';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn, errorEmitter } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { cn } from '@/lib/utils';

export function AuthView() {
  const auth = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success detection: If auth state changes to a user, show success state
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSuccess(true);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // Error detection
  useEffect(() => {
    const handleAuthError = (err: any) => {
      setIsLoading(false);
      let message = "Authentication failed.";
      
      // Handle Firebase specific error codes
      if (err.code === 'auth/wrong-password') message = "Incorrect password.";
      if (err.code === 'auth/user-not-found') message = "No account found with this email.";
      if (err.code === 'auth/invalid-email') message = "Invalid email format.";
      if (err.code === 'auth/email-already-in-use') message = "Email already registered. Try logging in.";
      if (err.code === 'auth/weak-password') message = "Password must be at least 6 characters.";
      if (err.code === 'auth/invalid-credential') message = "Invalid credentials. Please check your details.";
      if (err.code === 'auth/operation-not-allowed') message = "Auth provider not enabled in Firebase Console.";
      
      setError(message);
    };

    errorEmitter.on('auth-error', handleAuthError);
    return () => errorEmitter.off('auth-error', handleAuthError);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !auth || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    if (isLogin) {
      initiateEmailSignIn(auth, email, password);
    } else {
      initiateEmailSignUp(auth, email, password);
    }
  };

  const handleGuest = () => {
    if (!auth || isLoading) return;
    setIsLoading(true);
    setError(null);
    initiateAnonymousSignIn(auth);
  };

  return (
    <div className="fixed inset-0 z-[40] flex flex-col bg-slate-950 overflow-hidden font-sans">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col h-full px-8 pt-20 pb-12 overflow-y-auto swipe-container">
        <div className="flex flex-col items-center justify-center mb-12 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-black text-4xl tracking-tighter text-white">arcex</span>
            <span className="font-black text-4xl tracking-tighter bg-gradient-to-br from-[#4ade80] via-[#2dd4bf] to-[#3b82f6] bg-clip-text text-transparent">fit</span>
          </div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] pl-[0.4em]">MISSION CONTROL</p>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full pb-12">
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                  {isSuccess ? "Access Granted" : isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {isSuccess ? "Establishing Connection..." : isLogin ? "Enter your credentials" : "Join the performance community"}
                </p>
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center py-8 animate-in zoom-in-95 fade-in duration-500">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                    <CheckCircle2 className="w-8 h-8 text-slate-950" />
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Email Protocol</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <Input 
                            type="email"
                            placeholder="pilot@arcexfit.ai"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-medium focus:ring-primary/20 placeholder:text-white/10"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Security Key</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <Input 
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 h-14 rounded-2xl bg-white/[0.02] border-white/5 text-white font-medium focus:ring-primary/20 placeholder:text-white/10"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 animate-in fade-in zoom-in-95">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                        <p className="text-[10px] font-bold text-destructive uppercase tracking-tight leading-tight">{error}</p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-14 rounded-2xl bg-primary text-slate-950 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 transition-all active:scale-95"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {isLogin ? "Execute Login" : "Initialize Account"}
                    </Button>
                  </form>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]"><span className="bg-slate-950 px-3 text-white/20">OR</span></div>
                  </div>

                  <Button 
                    variant="ghost" 
                    onClick={handleGuest}
                    disabled={isLoading}
                    className="w-full h-12 rounded-2xl bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    Continue as Guest
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {!isSuccess && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => { setError(null); setIsLogin(!isLogin); }}
                className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                disabled={isLoading}
              >
                {isLogin ? "Need an account?" : "Already have an account?"}
                <span className="text-white">{isLogin ? "Sign Up" : "Login"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4 text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
            <span>Secure Encryption</span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <span>Biometric Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
