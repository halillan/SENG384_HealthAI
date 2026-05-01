import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, ArrowRight, CheckCircle2, ChevronDown, User, Calendar, Building2, Tag, UploadCloud, ArrowLeft, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button, Label } from './ui-components';

const INSTITUTION_DOMAINS: Record<string, string> = {
  "Hacettepe University": "hacettepe.edu.tr",
  "Middle East Technical University (METU)": "metu.edu.tr",
  "Bilkent University": "bilkent.edu.tr",
  "Istanbul University": "istanbul.edu.tr",
  "Koç University": "ku.edu.tr",
  "Sabancı University": "sabanciuniv.edu",
  "Gazi University": "gazi.edu.tr",
  "Ankara University": "ankara.edu.tr",
  "Ege University": "ege.edu.tr",
  "Boğaziçi University": "boun.edu.tr",
  "ITU (Istanbul Technical University)": "itu.edu.tr",
};

export default function AuthGateway() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotAlert, setShowForgotAlert] = useState(false);
  const [authMessage, setAuthMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  
  // Registration States & Steps
  const [registerStep, setRegisterStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [age, setAge] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [isProfessionOpen, setIsProfessionOpen] = useState(false);
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [isInstOpen, setIsInstOpen] = useState(false);
  const [instError, setInstError] = useState<string | null>(null);
  const [verificationFile, setVerificationFile] = useState<string | null>(null);
  const professionRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const institutionRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (professionRef.current && !professionRef.current.contains(event.target as Node)) {
        setIsProfessionOpen(false);
      }
      if (specRef.current && !specRef.current.contains(event.target as Node)) {
        setIsSpecOpen(false);
      }
      if (institutionRef.current && !institutionRef.current.contains(event.target as Node)) {
        setIsInstOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate email ends with .edu or .edu.tr
  const isValidEduEmail = (email: string) => {
    if (!email) return false;
    const lower = email.toLowerCase();
    return lower.endsWith('.edu') || lower.endsWith('.edu.tr');
  };

  const hasEmailInput = email.length > 0;
  const isEmailValid = isValidEduEmail(email);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    
    if (activeTab === 'login') {
      if (!isEmailValid) return;
      
      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          setAuthMessage({ type: 'error', text: data.error || 'Login failed' });
          return;
        }

        sessionStorage.setItem('healthai_token', data.token);
        sessionStorage.setItem('healthai_user_id', data.user.id);
        sessionStorage.setItem('healthai_role', data.user.role === 'ADMIN' ? 'admin' : 'user');
        sessionStorage.setItem('healthai_name', data.user.fullName);
        sessionStorage.setItem('healthai_profession', data.user.role === 'DOCTOR' ? 'medical' : 'engineer');
        sessionStorage.setItem('healthai_email', email);
        
        if (data.user.role === 'ADMIN') {
          navigate('/admin', { state: { justLoggedIn: true } });
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        setAuthMessage({ type: 'error', text: 'Cannot connect to backend server. Make sure it is running.' });
      }
    } else {
      // Registration Step Logic
      if (registerStep === 1) {
        if (isEmailValid && password.length >= 6) {
          setRegisterStep(2);
        }
      } else if (registerStep === 2) {
        if (fullName && profession && age && institution) {
          const requiredDomain = INSTITUTION_DOMAINS[institution];
          if (requiredDomain && !email.toLowerCase().endsWith(requiredDomain)) {
            setInstError(`This email does not belong to ${institution}. Please use your @${requiredDomain} address.`);
            return;
          }
          setInstError(null);
          setRegisterStep(3);
        }
      } else {
        // Final Registration
        try {
          const role = profession === 'Healthcare Professional' ? 'DOCTOR' : 'ENGINEER';
          const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              password,
              fullName,
              role,
              specialization,
              institution
            })
          });

          const data = await response.json();

          if (!response.ok) {
            setAuthMessage({ type: 'error', text: data.error || 'Registration failed' });
            return;
          }

          setAuthMessage({ type: 'success', text: 'Registration successful! Please sign in.' });
          setActiveTab('login');
          setRegisterStep(1);
          setPassword('');
        } catch (error) {
          setAuthMessage({ type: 'error', text: 'Cannot connect to backend server. Make sure it is running.' });
        }
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-transparent p-6 sm:p-12 relative overflow-hidden">
      {/* Floating Centered Form Container - Using layout for smooth height transitions */}
      <motion.div 
        layout
        className="w-full max-w-lg bg-white/[0.03] backdrop-blur-3xl p-10 sm:p-14 rounded-[3rem] border border-white/10 shadow-2xl relative z-10 transition-all hover:bg-white/[0.05] hover:border-white/20 min-h-[720px] flex flex-col justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-[3rem] pointer-events-none" />
        
        <div className="w-full relative z-10">
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30">
              <HeartPulse className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">HealthAI</h2>
            <div className="h-1 w-12 bg-blue-500 rounded-full" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              {activeTab === 'login' ? 'Welcome Back' : 'Join the Network'}
            </h2>
            <p className="text-blue-100/60 font-medium">
              {activeTab === 'login' ? 'Sign in to access the collaboration portal.' : 'Create your secure institutional account.'}
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex gap-4 mb-8 w-full border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={cn(
                "flex-1 pb-3 text-base font-semibold transition-colors border-b-2 text-center",
                activeTab === 'login'
                  ? "border-blue-500 text-white"
                  : "border-transparent text-white/40 hover:text-white"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={cn(
                "flex-1 pb-3 text-base font-semibold transition-colors border-b-2 text-center",
                activeTab === 'register'
                  ? "border-blue-500 text-white"
                  : "border-transparent text-white/40 hover:text-white"
              )}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 w-full relative">
            
            <AnimatePresence>
              {authMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "p-4 rounded-xl flex items-center gap-3 border mb-4 shadow-lg backdrop-blur-md",
                    authMessage.type === 'success' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border-red-500/30 text-red-300"
                  )}
                >
                  {authMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                  <p className="text-[13px] font-bold">{authMessage.text}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Indicator (Only for Register) */}
            {activeTab === 'register' && (
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                    <motion.div 
                      className="absolute inset-0 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      initial={false}
                      animate={{ x: registerStep >= s ? "0%" : "-100%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  {/* Email Field */}
                  <div className="w-full">
                    <Label htmlFor="email" className="text-white/80 block mb-2 font-semibold text-sm">Institutional Email</Label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., student@university.edu"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-xl backdrop-blur-sm"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/80 block mb-2 font-semibold text-sm">Password</Label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-xl backdrop-blur-sm"
                      required
                    />
                  </div>

                  {showForgotAlert && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className={cn(
                        "p-4 rounded-xl flex items-center gap-3 border",
                        email 
                          ? "bg-emerald-500/10 border-emerald-500/20" 
                          : "bg-amber-500/10 border-amber-500/20"
                      )}
                    >
                      {email ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      )}
                      <p className={cn(
                        "text-[12px] font-bold leading-snug",
                        email ? "text-emerald-400" : "text-amber-400"
                      )}>
                        {email 
                          ? `A recovery code has been sent to ${email}.` 
                          : "Please enter your institutional email first."}
                      </p>
                    </motion.div>
                  )}

                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30">Sign In</Button>
                  <p 
                    onClick={() => setShowForgotAlert(true)}
                    className="text-center text-[13.5px] text-white/40 cursor-pointer hover:text-white transition-colors font-medium"
                  >
                    Forgot your password?
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`register-step-${registerStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  {registerStep === 1 && (
                    <div className="space-y-4">
                      <div className="w-full">
                        <Label htmlFor="reg-email" className="text-white/80 block mb-2 font-semibold text-sm">Onboarding Email</Label>
                        <motion.div 
                          className="relative"
                          animate={hasEmailInput && !isEmailValid ? { x: [-5, 5, -3, 3, 0] } : {}}
                        >
                          <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Must end in .edu or .edu.tr"
                            className={cn(
                              "w-full bg-white/10 border rounded-xl pl-4 pr-11 py-3 focus:outline-none focus:ring-2 transition-all text-white placeholder:text-white/30 backdrop-blur-sm",
                              hasEmailInput ? (isEmailValid ? "border-green-500 ring-green-500/20" : "border-red-500 ring-red-500/20") : "border-white/20"
                            )}
                          />
                          {hasEmailInput && isEmailValid && <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />}
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-password" className="text-white/80 block mb-2 font-semibold text-sm">Set Password</Label>
                        <input
                          id="reg-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-white/30 backdrop-blur-sm shadow-xl"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={!isEmailValid || password.length < 6}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        Start Onboarding <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {registerStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white/80 font-semibold text-sm">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 outline-none backdrop-blur-sm shadow-xl" placeholder="e.g. Dr. Jane Smith" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 relative" ref={professionRef}>
                          <Label className="text-white/80 font-semibold text-sm">Profession</Label>
                          <button 
                            type="button" 
                            onClick={() => setIsProfessionOpen(!isProfessionOpen)} 
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white flex justify-between items-center focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm shadow-xl"
                          >
                            <span className={cn(!profession && "text-slate-400")}>{profession || "Select..."}</span>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isProfessionOpen && "rotate-180")} />
                          </button>
                          
                          <AnimatePresence>
                            {isProfessionOpen && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute z-50 w-full mt-2 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"
                              >
                                {["Engineer / Tech Expert", "Healthcare Professional"].map(p => (
                                  <button 
                                    key={p} 
                                    type="button" 
                                    onClick={() => { setProfession(p); setIsProfessionOpen(false); }} 
                                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 text-sm font-medium text-white/90 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      {p}
                                      {profession === p && <Check className="w-4 h-4 text-blue-600" />}
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/80 font-semibold text-sm">Age</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 outline-none backdrop-blur-sm shadow-xl" placeholder="30" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/80 font-semibold text-sm block mb-2">Institution</Label>
                        <div className="relative" ref={institutionRef}>
                          <button 
                            type="button" 
                            onClick={() => setIsInstOpen(!isInstOpen)} 
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white flex justify-between items-center focus:ring-2 focus:ring-blue-500/50 transition-all backdrop-blur-sm shadow-xl"
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className={cn("w-4 h-4", !institution ? "text-slate-400" : "text-blue-600")} />
                              <span className={cn(!institution && "text-slate-400")}>{institution || "Select your institution..."}</span>
                            </div>
                             <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isInstOpen && "rotate-180")} />
                          </button>
                          
                          {instError && (
                            <motion.p 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="text-[11px] text-red-400 font-bold mt-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20"
                            >
                              {instError}
                            </motion.p>
                          )}
                          
                          <AnimatePresence>
                            {isInstOpen && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute z-50 w-full mt-2 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 max-h-60 overflow-y-auto"
                              >
                                {[
                                  "Hacettepe University", "Middle East Technical University (METU)", "Bilkent University", 
                                  "Istanbul University", "Koç University", "Sabancı University", 
                                  "Gazi University", "Ankara University", "Ege University", 
                                  "Boğaziçi University", "ITU (Istanbul Technical University)", "Other / Outside Network"
                                ].map(inst => (
                                  <button 
                                    key={inst} 
                                    type="button" 
                                    onClick={() => { setInstitution(inst); setIsInstOpen(false); }} 
                                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 text-sm font-medium text-white/90 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      {inst}
                                      {institution === inst && <Check className="w-4 h-4 text-blue-600" />}
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/80 font-semibold text-sm block mb-2">Primary Specialization</Label>
                        <div className="relative" ref={specRef}>
                          <button 
                            type="button" 
                            disabled={!profession}
                            onClick={() => setIsSpecOpen(!isSpecOpen)} 
                            className={cn(
                              "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white flex justify-between items-center transition-all focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm shadow-xl",
                              !profession ? "bg-white/5 border-white/10 cursor-not-allowed text-white/30" : "border-white/20"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Tag className={cn("w-4 h-4", !specialization ? "text-slate-400" : "text-blue-600")} />
                              <span className={cn(!specialization && "text-slate-400")}>{specialization || "Select your specialization area"}</span>
                            </div>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isSpecOpen && "rotate-180")} />
                          </button>
                          
                          <AnimatePresence>
                            {isSpecOpen && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute z-50 w-full mt-2 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 max-h-60 overflow-y-auto"
                              >
                                {(profession === "Engineer / Tech Expert" 
                                  ? ["Software Engineering", "AI & Machine Learning", "Data Science", "Biomedical Engineering", "Computer Engineering", "Robotics & Automation", "Electrical Engineering", "Cyber Security"]
                                  : ["Radiology", "Cardiology", "Neurology", "Oncology", "Pathology", "Dermatology", "General Surgery", "Biomedical Research", "Medical Informatics"]
                                ).map(s => (
                                  <button 
                                    key={s} 
                                    type="button" 
                                    onClick={() => { setSpecialization(s); setIsSpecOpen(false); }} 
                                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 text-sm font-medium text-white/90 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      {s}
                                      {specialization === s && <Check className="w-4 h-4 text-blue-600" />}
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {!profession && <p className="text-[11px] text-amber-600 font-medium mt-1">Please select a profession first</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white/80 font-semibold text-sm">Short Bio</Label>
                        <textarea 
                          value={bio} 
                          onChange={e => setBio(e.target.value)} 
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 outline-none backdrop-blur-sm shadow-xl min-h-[80px]" 
                          placeholder="Briefly describe your professional background..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button type="button" onClick={() => setRegisterStep(1)} variant="outline" className="flex-1 rounded-xl font-bold">Back</Button>
                        <Button type="submit" disabled={!fullName || !profession || !age || !institution} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">Continue</Button>
                      </div>
                    </div>
                  )}

                  {registerStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 items-start">
                        <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-white">Credential Verification</p>
                          <p className="text-xs text-blue-100/60 mt-0.5">Verified badges increase collaboration trust by 400%.</p>
                        </div>
                      </div>
 
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 shadow-xl backdrop-blur-md",
                          verificationFile ? "border-green-400 bg-green-500/10" : "border-white/20 hover:border-blue-400 hover:bg-white/10"
                        )}
                      >
                        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && setVerificationFile(e.target.files[0].name)} />
                        {verificationFile ? (
                          <>
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                              <Check className="w-6 h-6 text-green-400" />
                            </div>
                            <p className="text-[13px] font-bold text-green-400">{verificationFile}</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 text-white/40" />
                            <div className="text-center">
                              <p className="text-sm font-bold text-white">Upload Credentials</p>
                              <p className="text-xs text-white/40 font-medium mt-1">Institutional ID, Diploma or Certificate</p>
                            </div>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-2 px-2 py-0.5 bg-white/5 rounded border border-white/10">Optional</span>
                          </>
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button type="button" onClick={() => setRegisterStep(2)} variant="outline" className="flex-1 rounded-xl font-bold flex items-center justify-center gap-2">
                          <ArrowLeft className="w-4 h-4" /> Professional
                        </Button>
                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20">Complete Setup</Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-slate-400 text-xs mt-12 font-medium">
            By joining, you agree to our Platform Terms of Service and standard NDA requirements.
          </p>
        </div>
      </motion.div>
    </div>
  );
}