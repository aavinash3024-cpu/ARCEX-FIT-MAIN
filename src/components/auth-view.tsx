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
  CheckCircle2,
  KeyRound,
  FileText,
  Stethoscope
} from 'lucide-react';
import { AnimatedBackground } from './animated-background';
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn, initiatePasswordReset, errorEmitter } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const PrivacyPolicyContent = () => (
    <div className="space-y-6 text-white/90">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Last Updated on 21 April, 2026</p>
        <p className="text-base font-bold text-white leading-relaxed">
          Welcome to arcex fit. We are committed to protecting your privacy. This policy explains how your personal data is collected, stored, and used within the app, ensuring you remain in full control.
        </p>
      </div>
      
      <div className="space-y-8 text-sm leading-relaxed font-medium">
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">1. The "Local-First" Philosophy</h3>
          <p>
            Your most sensitive health data lives on your device. We use a system called **UID Namespacing**, which creates a separate, locked "bucket" for each user account on a single phone. This ensures that your data remains completely isolated and private, even on a shared device.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">2. What We Collect & Why</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li><span className="font-bold">Identity Info (Name, Email):</span> Used for account management, personalization, and password recovery.</li>
            <li><span className="font-bold">Biological Metrics (Age, Gender, Weight):</span> This data is essential for the app's core function—calculating your Basal Metabolic Rate (BMR) and energy expenditure (TDEE).</li>
            <li><span className="font-bold">Wellness History (Logs):</span> Your food logs, workouts, and other metrics are used to show you your progress over time.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">3. Artificial Intelligence (AI) and Your Data</h3>
          <p>We use Google's Gemini AI for one specific purpose: to parse your meal descriptions. Here’s how we protect you:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li><span className="font-bold">Anonymized Requests:</span> When you type "I ate 3 eggs," only that text is sent to the AI. Your name, email, or any other personal information is **never** included in the request.</li>
            <li><span className="font-bold">Local Learning:</span> Once the AI identifies a food, we save its nutritional data to a private "AI Food Cache" on your device. This makes future logging faster and reduces the need to contact the AI, further protecting your privacy.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">4. Cloud Sync & Security</h3>
          <p>
            For your convenience, we back up essential data to Google's Firestore. This is protected by multiple layers of security:
          </p>
          <ul className="list-disc pl-5 space-y-3">
            <li><span className="font-bold">Encryption:</span> Your data is encrypted both while traveling to the cloud (HTTPS) and while stored on Google's servers.</li>
            <li><span className="font-bold">Firestore Security Rules:</span> We enforce a strict server-side rule: `request.auth.uid == resource.data.userId`. This means it is technically impossible for anyone but you to read or write to your cloud records.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">5. Your Rights and Control</h3>
          <p>You have absolute sovereignty over your data:</p>
          <ul className="list-disc pl-5 space-y-3">
            <li><span className="font-bold">Right to Export:</span> Download a complete JSON file of your history from the Settings menu at any time.</li>
            <li><span className="font-bold">Right to Edit:</span> You can update your personal profile information whenever you wish.</li>
            <li><span className="font-bold">Right to Erasure:</span> Deleting your account will permanently purge all data from your device and our cloud backups.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-white/10">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">6. Our Business Model</h3>
          <p className="text-base font-bold text-white leading-relaxed">
            We do not sell, trade, or rent your personal data to advertisers. Our business is built on offering valuable premium features, not on monetizing your information.
          </p>
        </section>
      </div>
    </div>
  );
const TermsAndConditionsContent = () => (
    <div className="space-y-6 text-white/90">
      <div className="space-y-2 border-b border-white/10 pb-6">
        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Last Updated on 21 April, 2026</p>
      </div>
      
      <div className="space-y-8 text-sm leading-relaxed font-medium">
        <p className="text-base font-bold text-white leading-relaxed">
          These Terms of Use govern your access to and use of the arcex fit application. By creating an account, you agree to follow these rules.
        </p>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">1. Account and Responsibility</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li>You agree to provide accurate information (like age and weight) to ensure the app's calculations are safe and effective for you.</li>
            <li>You are responsible for all activity that occurs under your account and for keeping your password secure.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">2. Service Usage</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li>The app is intended for personal, non-commercial use.</li>
            <li>Abusing the service, attempting to hack the AI, or scraping data is strictly prohibited and will result in immediate account termination.</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">3. AI and Data Storage</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li>We provide a limit of 20 AI-powered meal logs per day to ensure fair usage and control costs.</li>
            <li>While we offer cloud backups, we are not liable for data loss resulting from user actions like clearing browser data or losing a device.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase text-primary tracking-widest">4. Disclaimers</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li>The arcex fit app is provided "as is," without any warranties.</li>
            <li>We do not guarantee specific fitness or weight-loss results, as your progress depends on your own efforts and individual health factors.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-white/10">
          <p className="text-[10px] font-bold text-white/60 italic text-center uppercase tracking-tight">
            We reserve the right to update these terms at any time.
          </p>
        </section>
      </div>
    </div>
);
const MedicalDisclaimerContent = () => (
    <div className="space-y-6 text-white/90">
        <div className="space-y-2 border-b border-white/10 pb-6">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Last Updated on 21 April, 2026</p>
        </div>
        
        <div className="space-y-8 text-sm leading-relaxed font-medium">
            <p className="text-base font-bold text-white leading-relaxed uppercase tracking-tight">
            arcex fit is a digital tracking tool for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>

            <section className="space-y-3">
            <h3 className="text-xs font-black uppercase text-primary tracking-widest">1. Not a Medical Provider</h3>
            <p>
                The creators of arcex fit are not doctors or certified medical professionals. The information provided, including calorie targets and nutritional data, is generated by formulas and AI models, not a personalized medical assessment.
            </p>
            </section>

            <section className="space-y-3">
            <h3 className="text-xs font-black uppercase text-primary tracking-widest">2. Consult Your Doctor</h3>
            <p>
                Always consult with a qualified healthcare provider before starting any new exercise routine or making significant dietary changes, especially if you have pre-existing health conditions.
            </p>
            </section>

            <section className="space-y-3">
            <h3 className="text-xs font-black uppercase text-primary tracking-widest">3. AI for Estimation Only</h3>
            <p>
                Nutritional data from our AI is an estimate. It should not be used to manage medical conditions that require strict, precise nutrition.
            </p>
            </section>

            <section className="space-y-3">
            <h3 className="text-xs font-black uppercase text-primary tracking-widest">4. Assumption of Risk</h3>
            <p>
                If you feel pain, dizziness, or shortness of breath during any exercise, stop immediately and seek medical attention. You perform all activities suggested or tracked in this app at your own risk.
            </p>
            </section>
        </div>
    </div>
);

const LegalDocDialog = ({ doc }: { doc: 'terms' | 'privacy' | 'medical'}) => {
    let title = '';
    let content = null;
    let triggerText = '';
    let Icon = FileText;

    if (doc === 'terms') {
        title = 'Terms and Conditions';
        triggerText = 'Terms';
        content = <TermsAndConditionsContent />;
        Icon = FileText;
    } else if (doc === 'privacy') {
        title = 'Privacy Policy';
        triggerText = 'Privacy Policy';
        content = <PrivacyPolicyContent />;
        Icon = Lock;
    } else {
        title = 'Health & Medical Disclaimer';
        triggerText = 'Disclaimer';
        content = <MedicalDisclaimerContent />;
        Icon = Stethoscope;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-primary underline hover:text-primary/80 transition-colors mx-1">{triggerText}</button>
            </DialogTrigger>
            <DialogContent className="max-w-lg h-[80svh] flex flex-col p-0 bg-slate-950 border-white/10 rounded-3xl">
                <DialogHeader className="p-6 pb-4 text-left border-b border-white/10">
                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 px-6 py-4">
                    {content}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export function AuthView() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
      if (err.code === 'auth/too-many-requests') message = "Too many attempts. Try again later.";
      
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    if (!auth || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await initiatePasswordReset(auth, email);
      toast({
        title: "Reset Link Sent",
        description: `A password reset link has been sent to ${email}.`,
      });
    } catch (e) {
      // Error handled by emitter
    } finally {
      setIsLoading(false);
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
                  {isSuccess ? "Establishing Connection..." : isLogin ? "Enter your details" : "Join the community"}
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
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Email Address</Label>
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
                        <div className="flex justify-between items-center px-1">
                          <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Password</Label>
                          {isLogin && (
                            <button 
                              type="button"
                              onClick={handleForgotPassword}
                              className="text-[8px] font-black text-primary uppercase tracking-widest hover:opacity-70"
                            >
                              Forgot?
                            </button>
                          )}
                        </div>
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

                    {!isLogin && (
                        <div className="items-top flex space-x-3 pt-2">
                            <Checkbox 
                                id="terms" 
                                checked={agreedToTerms} 
                                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                className="mt-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms"
                                    className="text-xs font-bold text-white/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I agree to the legal terms.
                                </label>
                                <p className="text-[10px] text-white/50">
                                    View our 
                                    <LegalDocDialog doc="terms" />, 
                                    <LegalDocDialog doc="privacy" /> and 
                                    <LegalDocDialog doc="medical" />.
                                </p>
                            </div>
                        </div>
                    )}


                    {error && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 animate-in fade-in zoom-in-95">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                        <p className="text-[10px] font-bold text-destructive uppercase tracking-tight leading-tight">{error}</p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isLoading || (!isLogin && !agreedToTerms)}
                      className="w-full h-14 rounded-2xl bg-primary text-slate-950 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 transition-all active:scale-95"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      {isLogin ? "Log In" : "Sign Up"}
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
                <span className="text-white">{isLogin ? "Sign Up" : "Log In"}</span>
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
