import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Check, ChevronRight, User, Stethoscope, Briefcase, Globe, Clock, ShieldCheck, FileText, CheckCircle2, ArrowLeft, ChevronDown, Settings, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// --- Mocked Shadcn UI Components for demonstration ---
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 transition-all disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 transition-all disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
));
Textarea.displayName = "Textarea";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn("flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
));
Select.displayName = "Select";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-semibold leading-none text-slate-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
));
Label.displayName = "Label";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'secondary' }>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-slate-200 bg-white text-slate-800 hover:bg-slate-100",
    ghost: "text-slate-800 hover:bg-slate-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  };
  return (
    <button ref={ref} className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2", variants[variant], className)} {...props} />
  );
});
Button.displayName = "Button";

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm", className)}>{children}</div>
);

// --- Custom Animated Select Component ---
const AnimatedSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder,
  label
}: { 
  value: string, 
  onChange: (val: string) => void, 
  options: string[], 
  placeholder: string,
  label?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {label && <Label>{label}</Label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600",
          !value && "text-slate-400"
        )}
      >
        <span>{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden py-1.5"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-slate-50",
                  value === opt ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700"
                )}
              >
                {opt}
                {value === opt && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Component Logic & View ---

const steps = [
  { id: 1, title: 'Core Details', icon: FileText },
  { id: 2, title: 'Project Scope', icon: Briefcase },
  { id: 3, title: 'Visibility & Location', icon: Globe },
];

export default function CreatePostForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'engineer' | 'medical'>('medical');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const savedProfession = sessionStorage.getItem('healthai_profession');
    if (savedProfession === 'engineer' || savedProfession === 'medical') {
      setRole(savedProfession);
    }
  }, []);

  // Form Field Validation States (Step 1)
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState('');
  
  // Implements FR-12: Short Explanation
  const [explanation, setExplanation] = useState('');
  const [highLevel, setHighLevel] = useState('');
  
  // Engineer Details
  const [medDomain, setMedDomain] = useState('');
  const [hasData, setHasData] = useState(false);
  const [expertise, setExpertise] = useState('');
  
  // Medical Details
  const [techStack, setTechStack] = useState('');
  const [dataType, setDataType] = useState('');
  const [goals, setGoals] = useState('');

  // Step 2 Details
  const [collab, setCollab] = useState('');
  const [commitment, setCommitment] = useState('');

  // Step 3 Details
  const [meetingMethod, setMeetingMethod] = useState<'virtual' | 'in-person'>('virtual');
  const [venue, setVenue] = useState('');
  const [confidentiality, setConfidentiality] = useState('');

  const canProceedStep1 = !!title && !!stage && (
    role === 'engineer' 
      ? (!!medDomain && !!expertise) 
      : (!!techStack && !!dataType && !!goals)
  );

  const handlePublish = async () => {
    try {
      const token = sessionStorage.getItem('healthai_token');
      const response = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: explanation || goals || expertise,
          tags: [stage, collab, commitment, meetingMethod, confidentiality].filter(Boolean),
          domain: role === 'engineer' ? medDomain : techStack
        })
      });

      if (!response.ok) {
        alert('Failed to publish post. Make sure you are logged in properly.');
        return;
      }
      setIsSuccessModalOpen(true);
    } catch (error) {
      alert('Network error while publishing post. Is backend running?');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-3xl space-y-8 p-6 lg:p-8 min-h-screen relative"
    >
      {/* Back Button */}
      <div className="flex justify-start">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Collaboration Post</h1>
        <p className="text-slate-500">Find the right expertise to bring your healthcare project to life.</p>
      </motion.div>

      {/* Stepper */}
      <motion.nav 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        aria-label="Progress"
      >
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.title} className={cn(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
              <div className="flex items-center">
                <div className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                  currentStep > step.id ? "bg-blue-600 text-white" : currentStep === step.id ? "border-2 border-blue-600 bg-white text-blue-600" : "border-2 border-slate-300 bg-white text-slate-400"
                )}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <div className="absolute -bottom-6 w-max text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {step.title}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </motion.nav>

      {/* User Identity Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-blue-600/5 border border-blue-600/10 rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center">
            {role === 'medical' ? <Stethoscope className="w-5 h-5 text-blue-600" /> : <Briefcase className="w-5 h-5 text-blue-600" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Authenticated Identity</p>
            <p className="text-sm font-bold text-slate-900">Creating post as <span className="text-blue-600">{role === 'medical' ? 'Healthcare Professional' : 'Engineer / Tech Expert'}</span></p>
          </div>
        </div>
        <Link 
          to="/profile" 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all uppercase tracking-wider shadow-sm group"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          View Profile Settings
        </Link>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        <Card className="mt-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 space-y-8"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900">Core Post Details</h2>
                    <p className="text-sm text-slate-500">Basic information about the role you are looking for.</p>
                  </div>

                  {/* Universal Fields (Post Title & Project Stage) */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Post Title</Label>
                      <Input 
                        id="title" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder="e.g. Seeking ML expert for dermatology image analysis" 
                      />
                    </div>

                    <AnimatedSelect 
                      label="Current Project Stage"
                      value={stage} 
                      onChange={(val) => setStage(val)} 
                      placeholder="Select project stage..."
                      options={["Idea", "Concept Validation", "Prototype", "Clinical Trial", "Market Ready"]}
                    />
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-100">
                    {role === 'engineer' ? (
                      <>
                        <AnimatedSelect 
                          label="Target Medical Domain"
                          value={medDomain} 
                          onChange={(val) => setMedDomain(val)} 
                          placeholder="Select the target medical field..."
                          options={["Radiology", "Cardiology", "Dermatology", "Bioinformatics", "Surgery", "Neurology"]}
                        />

                        <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <input 
                            type="checkbox" 
                            id="hasData" 
                            checked={hasData} 
                            onChange={e => setHasData(e.target.checked)} 
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                          />
                          <div>
                            <Label htmlFor="hasData" className="font-semibold text-slate-800 cursor-pointer">Clinical Data Availability</Label>
                            <p className="text-xs text-slate-500 mt-1">Check this if you currently have access to formatted training data.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expertise">Desired Medical Expertise</Label>
                          <p className="text-xs text-blue-600 font-medium mb-2">Engineers: Mention if you have IRB approval or require help navigating clinical guidelines.</p>
                          <Textarea 
                            id="expertise" 
                            value={expertise} 
                            onChange={e => setExpertise(e.target.value)} 
                            placeholder="What specific clinical knowledge or annotation help do you need?" 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <AnimatedSelect 
                            label="Technical Stack Preference"
                            value={techStack} 
                            onChange={(val) => setTechStack(val)} 
                            placeholder="Select preferred capabilities..."
                            options={["Computer Vision", "NLP", "Robotics", "Data Analytics", "Deep Learning"]}
                          />
                        </div>

                        <div className="space-y-2">
                          <AnimatedSelect 
                            label="Underlying Data Type"
                            value={dataType} 
                            onChange={(val) => setDataType(val)} 
                            placeholder="Which type of data needs processing?"
                            options={["Medical Imaging (DICOM, PNG)", "EHR / Tabular Patient Data", "Genomic / Sequencing sequences", "Biomedical Signals (ECG, EEG)"]}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="goals">AI / Software Goals</Label>
                          <p className="text-xs text-emerald-600 font-medium mb-2">Healthcare Pros: Keep it high-level. Do not share raw patient data here.</p>
                          <Textarea 
                            id="goals" 
                            value={goals} 
                            onChange={e => setGoals(e.target.value)} 
                            placeholder="Describe the ultimate outcome or tool you want the Engineer to help you build..." 
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900">Project Scope & Details</h2>
                    <p className="text-sm text-slate-500">Explain what you are building and what kind of collaboration you need.</p>
                  </div>

                  {/* Implements FR-12: Short Explanation */}
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Short Explanation</Label>
                    <Textarea id="explanation" value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Briefly describe the project goals and current status..." />
                  </div>

                  {/* Implements FR-15: High-level idea for Engineers */}
                  {role === 'engineer' && (
                    <div className="space-y-2 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                        <Label htmlFor="high-level" className="text-blue-900">High-level Idea (Engineer restricted)</Label>
                      </div>
                      <p className="text-xs text-blue-700 mb-2">Avoid revealing sensitive technical details or IP.</p>
                      <Textarea id="high-level" value={highLevel} onChange={e => setHighLevel(e.target.value)} placeholder="Provide a safe, high-level overview of the technology..." className="bg-white" />
                    </div>
                  )}

                  {/* Implements FR-13: Estimated Collaboration Type */}
                  <div className="space-y-2">
                    <AnimatedSelect 
                      label="Estimated Collaboration Type"
                      value={collab} 
                      onChange={(val) => setCollab(val)} 
                      placeholder="Select collaboration type..."
                      options={["Advisor / Consultant", "Co-founder", "Research Partner", "Developer / Engineer"]}
                    />
                  </div>

                  {/* Implements FR-13: Level of Commitment */}
                  <div className="space-y-2">
                    <AnimatedSelect 
                      label="Level of Commitment"
                      value={commitment} 
                      onChange={(val) => setCommitment(val)} 
                      placeholder="Select commitment level..."
                      options={["Low (1-5 hrs/week)", "Medium (5-15 hrs/week)", "High (15-30 hrs/week)", "Full-time"]}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900">Visibility & Location Settings</h2>
                    <p className="text-sm text-slate-500">Configure how and where your post will be seen.</p>
                  </div>

                  <div className="space-y-2">
                    <AnimatedSelect 
                      label="Confidentiality Level"
                      value={confidentiality} 
                      onChange={(val) => setConfidentiality(val)} 
                      placeholder="Select confidentiality..."
                      options={["Public short pitch", "Details discussed in meeting only", "NDA required before disclosure"]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Implements FR-17: Location - Country */}
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" placeholder="e.g. United States" />
                    </div>
                    {/* Implements FR-17: Location - City */}
                    <div className="space-y-2">
                      <Label htmlFor="city">City (Optional)</Label>
                      <Input id="city" placeholder="e.g. Boston, MA" />
                    </div>
                  </div>

                  {/* Suggested Meeting Location / Method */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label>Preferred Meeting Method</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button" 
                          onClick={() => setMeetingMethod('virtual')}
                          className={cn(
                            "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-bold shadow-sm",
                            meetingMethod === 'virtual' 
                              ? "bg-blue-600 border-blue-600 text-white" 
                              : "bg-white border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                          )}
                        >
                          <Globe className={cn("w-4 h-4", meetingMethod === 'virtual' ? "text-white" : "text-blue-600")} />
                          Virtual / Online
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setMeetingMethod('in-person')}
                          className={cn(
                            "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all text-sm font-bold shadow-sm",
                            meetingMethod === 'in-person' 
                              ? "bg-emerald-600 border-emerald-600 text-white" 
                              : "bg-white border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
                          )}
                        >
                          <MapPin className={cn("w-4 h-4", meetingMethod === 'in-person' ? "text-white" : "text-emerald-600")} />
                          In-Person
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Specific Venue / Platform Link (Optional)</Label>
                      <Input 
                        id="venue" 
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Zoom, Microsoft Teams, Hospital Café, Lab 402" 
                      />
                      <p className="text-[11px] text-slate-500">This helps potential partners know how and where you'd like to meet for the initial intro.</p>
                    </div>
                  </div>

                  {/* Implements FR-18: Expiry Date */}
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="expiry">Post Expiry Date</Label>
                    <Input id="expiry" type="date" />
                  </div>

                  {/* Implements FR-18: Auto-close option */}
                  <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                    <input type="checkbox" id="autoclose" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    <Label htmlFor="autoclose" className="font-medium text-slate-700">Auto-close post on expiry date</Label>
                  </div>

                  {/* Implements FR-20: Prevent uploads note */}
                  <div className="bg-red-50 border border-red-100 p-4 rounded-lg mt-4">
                    <p className="text-sm text-red-800 font-medium">Please Note: Technical documentation and patient data uploads are strictly prohibited on this platform.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Actions */}
          <div className="bg-slate-50 p-6 flex justify-between rounded-b-xl border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
              className={cn(currentStep === 1 ? "invisible" : "visible")}
            >
              Back
            </Button>
            
            <div className="flex gap-3">
              {/* Implements FR-19: Save as Draft */}
              {currentStep === 3 && (
                <Button variant="secondary" onClick={() => alert("Post saved as Draft")}>
                  Save as Draft
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button 
                  onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                  disabled={currentStep === 1 && !canProceedStep1}
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                // Implements FR-19: Publish to Active
                <Button onClick={handlePublish}>
                  Publish Post
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Premium Success Modal Overlay */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Animated top glowing element */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 to-green-500" />
              
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }} 
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Collaboration Live!</h2>
              <p className="text-[15px] text-slate-600 font-medium leading-relaxed mb-8">
                Your project has been successfully published to the HealthAI network. Our matching algorithm is now actively highlighting it to potential partners.
              </p>

              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full h-12 text-[15px] bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20"
              >
                Return to Dashboard
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
