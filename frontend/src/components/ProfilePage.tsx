import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Trash2, User, AlertTriangle, X, BadgeCheck, FileText, ShieldCheck, UploadCloud, CheckCircle2, ArrowLeft, Briefcase, Stethoscope, Settings, Edit2, Save, MapPin, Building2, Tag, Calendar, ChevronDown, Eye, EyeOff, Lock, History, Clock, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input, Label, Textarea } from './ui-components';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const [showToast, setShowToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Verification State derived from session
  const [isVerified, setIsVerified] = useState(sessionStorage.getItem('healthai_verified') === 'true');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done'>(isVerified ? 'done' : 'idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom Select States
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isProfessionOpen, setIsProfessionOpen] = useState(false);
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [isInstOpen, setIsInstOpen] = useState(false);
  const [newSpec, setNewSpec] = useState('');
  const [newProfession, setNewProfession] = useState('');
  const professionRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);
  const institutionRef = useRef<HTMLDivElement>(null);

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

  // Profile Form States
  const [editName, setEditName] = useState(sessionStorage.getItem('healthai_name') || "");
  const [editProfession, setEditProfession] = useState(sessionStorage.getItem('healthai_profession') || "");
  const [editAge, setEditAge] = useState(sessionStorage.getItem('healthai_age') || "");
  const [editInstitution, setEditInstitution] = useState(sessionStorage.getItem('healthai_institution') || "");
  const [editSpecialization, setEditSpecialization] = useState(sessionStorage.getItem('healthai_specialization') || "");
  const [editBio, setEditBio] = useState(sessionStorage.getItem('healthai_bio') || "Pioneering research in AI-assisted radiology. Focus on bridging the gap between deep learning architectures and clinical triage workflows. Passionate about ethical AI implementation in healthcare and mentoring technical engineers in medical nuances.");

  // Account Settings States
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'pending'>(sessionStorage.getItem('healthai_profession_request') === 'pending' ? 'pending' : 'idle');
  const [privacyOnlyVerified, setPrivacyOnlyVerified] = useState(sessionStorage.getItem('healthai_privacy_verified') === 'true');
  const [privacyHideEmail, setPrivacyHideEmail] = useState(sessionStorage.getItem('healthai_privacy_email') === 'true');

  // Specialization Update States
  const [isSpecChangeModalOpen, setIsSpecChangeModalOpen] = useState(false);
  const [pendingRequestType, setPendingRequestType] = useState<'profession' | 'specialization' | null>(sessionStorage.getItem('healthai_request_type') as any || null);

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUploadClick = () => {
    if (uploadStatus === 'idle') {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadStatus('uploading');
      // Simulate upload and verification process
      setTimeout(() => {
        setUploadStatus('done');
        setIsVerified(true);
        sessionStorage.setItem('healthai_verified', 'true');
      }, 2000);
    }
  };

  const handleSaveProfile = () => {
    sessionStorage.setItem('healthai_name', editName);
    sessionStorage.setItem('healthai_profession', editProfession);
    sessionStorage.setItem('healthai_age', editAge);
    sessionStorage.setItem('healthai_institution', editInstitution);
    sessionStorage.setItem('healthai_specialization', editSpecialization);
    sessionStorage.setItem('healthai_bio', editBio);
    setIsEditModalOpen(false);
  };

  const submitProfessionRequest = () => {
    setRequestStatus('pending');
    setPendingRequestType('profession');
    sessionStorage.setItem('healthai_profession_request', 'pending');
    sessionStorage.setItem('healthai_request_type', 'profession');
    setIsChangeRequestModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const submitSpecRequest = () => {
    setRequestStatus('pending');
    setPendingRequestType('specialization');
    sessionStorage.setItem('healthai_profession_request', 'pending');
    sessionStorage.setItem('healthai_request_type', 'specialization');
    setIsSpecChangeModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const togglePrivacyVerified = () => {
    const newVal = !privacyOnlyVerified;
    setPrivacyOnlyVerified(newVal);
    sessionStorage.setItem('healthai_privacy_verified', String(newVal));
  };

  const togglePrivacyEmail = () => {
    const newVal = !privacyHideEmail;
    setPrivacyHideEmail(newVal);
    sessionStorage.setItem('healthai_privacy_email', String(newVal));
  };

  const userName = sessionStorage.getItem('healthai_name') || "Dr. Ayşe Yılmaz";
  const userProfession = sessionStorage.getItem('healthai_profession') || "medical";
  const userAge = sessionStorage.getItem('healthai_age') || "30";
  const userInstitution = sessionStorage.getItem('healthai_institution') || "Hacettepe University Medical Faculty";
  const userSpecializationStr = sessionStorage.getItem('healthai_specialization') || "Radiology, Deep Learning, Ethics";
  const userEmail = sessionStorage.getItem('healthai_email') || "ayse.yilmaz@hacettepe.edu.tr";
  const userBio = sessionStorage.getItem('healthai_bio') || "Pioneering research in AI-assisted radiology. Focus on bridging the gap between deep learning architectures and clinical triage workflows. Passionate about ethical AI implementation in healthcare and mentoring technical engineers in medical nuances.";
  const specializations = userSpecializationStr.split(',').map(s => s.trim()).filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center relative z-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-3xl space-y-8"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </motion.div>
        
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-10 flex flex-col sm:flex-row justify-between items-center bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Professional Identity</h1>
            <p className="text-slate-600 font-medium mt-2">Manage your public profile, credentials, and verification status.</p>
          </div>
          <Button 
            onClick={() => setIsEditModalOpen(true)}
            className="rounded-xl px-6 h-12 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm flex gap-2 font-bold transition-all"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
            Edit Profile
          </Button>
        </motion.div>

        {/* Hero Section Upgrade */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 sm:p-10 border-t-4 border-t-blue-600 shadow-sm relative overflow-hidden bg-white/90 backdrop-blur-md">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-28 h-28 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 shadow-md relative">
              <User className="w-12 h-12 text-slate-300" />
              {isVerified && (
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                  <BadgeCheck className="w-8 h-8 text-blue-600" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 border-b border-transparent">
                <h2 className="text-3xl font-extrabold text-slate-900">{userName}</h2>
                {isVerified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Verified Pro
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[15px] font-bold text-blue-600 mb-1">
                {userProfession === 'medical' ? <Stethoscope className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                <span>{userProfession === 'medical' ? 'Healthcare Professional' : 'Engineer / Tech Expert'}</span>
                <span className="text-slate-300 mx-1">|</span>
                <span className="text-slate-500">{userAge} Years Old</span>
              </div>
              <p className="text-slate-500 font-medium text-sm">{userInstitution}</p>
              
              <div className="inline-flex items-center mt-4 px-4 py-1.5 bg-slate-50 rounded-full text-sm font-semibold text-slate-700 border border-slate-200 shadow-sm">
                {userEmail}
              </div>
            </div>
          </div>
          </Card>
        </motion.div>

        {/* Professional Bio Card */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 sm:p-10 shadow-sm bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Professional Bio</h3>
          </div>
          
          <div className="bg-slate-50/50 p-6 sm:p-8 rounded-2xl border border-slate-100">
            <p className="text-slate-700 leading-relaxed text-[15px] font-medium italic">
              "{userBio}"
            </p>
          </div>
            
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold rounded-lg shadow-sm hover:border-slate-300 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                  {specializations.length === 0 && <span className="text-slate-400 text-sm italic">No specializations specified</span>}
                </div>
              </div>
          </Card>
        </motion.div>

        {/* Verification Center */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 sm:p-10 shadow-sm bg-white/90 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Identity & Credentials</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {isVerified ? 'Status: Verified' : 'Status: Pending Action'}
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[15px] font-medium text-slate-600 leading-relaxed max-w-2xl">
              To unlock full platform capabilities, create high-tier posts, and process confidential NDAs, you must verify your academic or medical institution credentials.
            </p>
            
            {!isVerified && (
              <div 
                onClick={handleUploadClick}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${uploadStatus === 'idle' ? 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/50' : 'border-blue-500 bg-blue-50'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                
                {uploadStatus === 'idle' && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                      <UploadCloud className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-[15px] font-bold text-blue-700 mb-1">Click to upload or drag and drop</span>
                    <span className="text-sm font-medium text-slate-500">Upload Institutional ID or Diploma (PDF/JPG/PNG)</span>
                  </div>
                )}
                
                {uploadStatus === 'uploading' && (
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <span className="text-sm font-bold text-blue-700">Encrypting & Uploading Credentials...</span>
                  </div>
                )}
              </div>
            )}

            {isVerified && (
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[15px] font-bold text-emerald-900">Credentials Verified Successfully</h4>
                  <p className="text-sm font-medium text-emerald-700 mt-1">Your institutional identity has been confirmed. You now have full clearance across the HealthAI network.</p>
                </div>
              </div>
            )}
            
            <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wide mt-4">
              Verification documents are encrypted and only visibly processed by system administrators.
            </p>
          </div>
          </Card>
        </motion.div>

        {/* Account Settings / Change Profession */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 sm:p-10 shadow-sm bg-white/90 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Settings className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Account Settings</h3>
            </div>
            
            <div className="p-6 rounded-2xl border border-slate-200 bg-white mb-6 transition-all shadow-sm">
              <div className="flex items-start gap-4">
                <div className={cn("mt-1 p-2 rounded-full shrink-0", requestStatus === 'pending' ? "bg-blue-100 animate-pulse" : "bg-slate-100")}>
                  {requestStatus === 'pending' ? <Clock className="w-5 h-5 text-blue-600" /> : <Settings className="w-5 h-5 text-slate-500" />}
                </div>
                <div className="flex-1">
                  <h4 className={cn("font-bold mb-1 text-[15px]", requestStatus === 'pending' ? "text-blue-900" : "text-slate-900")}>
                    {requestStatus === 'pending' ? "Identity Update Protocol Active" : "Professional Identity Management"}
                  </h4>
                  <p className={cn("text-sm mb-6 leading-relaxed font-medium", requestStatus === 'pending' ? "text-blue-800/80" : "text-slate-500")}>
                    {requestStatus === 'pending' 
                      ? "Your request is currently being reviewed by our administrative board. System verification is in progress."
                      : "Manage your professional domain or request a full identity migration if your core career path has changed."}
                  </p>
                  
                  {requestStatus === 'idle' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button 
                        onClick={() => setIsSpecChangeModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest h-11"
                      >
                        Update Specialization
                      </Button>
                      <Button 
                        onClick={() => setIsChangeRequestModalOpen(true)}
                        variant="outline" 
                        className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest h-11 bg-white"
                      >
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Identity Migration
                      </Button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100 shadow-sm">
                      <History className="w-3 h-3" />
                      {pendingRequestType === 'profession' ? 'Profession Migration' : 'Specialization Update'} - #PROF-7721
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Privacy & Visibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Privacy & Visibility</h4>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  onClick={togglePrivacyVerified}
                  className={cn(
                    "p-4 rounded-xl border transition-all text-left group",
                    privacyOnlyVerified ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={cn("p-1.5 rounded-lg", privacyOnlyVerified ? "bg-blue-100" : "bg-slate-100")}>
                      <ShieldCheck className={cn("w-4 h-4", privacyOnlyVerified ? "text-blue-600" : "text-slate-500")} />
                    </div>
                    <div className={cn("w-8 h-4 rounded-full relative transition-colors", privacyOnlyVerified ? "bg-blue-600" : "bg-slate-200")}>
                      <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", privacyOnlyVerified ? "left-4.5" : "left-0.5")} />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Strict Verification</p>
                  <p className="text-[11px] text-slate-500 font-medium">Only show profile to verified pros</p>
                </button>

                <button 
                  onClick={togglePrivacyEmail}
                  className={cn(
                    "p-4 rounded-xl border transition-all text-left group",
                    privacyHideEmail ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={cn("p-1.5 rounded-lg", privacyHideEmail ? "bg-blue-100" : "bg-slate-100")}>
                      {privacyHideEmail ? <EyeOff className="w-4 h-4 text-blue-600" /> : <Eye className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className={cn("w-8 h-4 rounded-full relative transition-colors", privacyHideEmail ? "bg-blue-600" : "bg-slate-200")}>
                      <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", privacyHideEmail ? "left-4.5" : "left-0.5")} />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Hide Credentials</p>
                  <p className="text-[11px] text-slate-500 font-medium">Mask email and institution publicly</p>
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions Card */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 sm:p-10 shadow-sm bg-white/90 backdrop-blur-md">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Download className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Data Management</h3>
          </div>
          
          <div className="space-y-6">
            {/* Export Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
              <div>
                <h4 className="font-bold text-slate-900 text-[15px]">Export My Data</h4>
                <p className="text-sm text-slate-500 mt-1.5 max-w-md leading-relaxed">
                  Download a personal archive of your data including all posts and interactions (GDPR requirement).
                </p>
              </div>
              <Button onClick={handleExport} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto h-11 px-6 shadow-md shadow-blue-600/20 rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export Archive
              </Button>
            </div>

            {/* Delete Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 rounded-2xl bg-red-50/50 border border-red-100 hover:border-red-200 transition-colors">
              <div>
                <h4 className="font-bold text-red-700 text-[15px]">Delete Account</h4>
                <p className="text-sm text-red-600/80 mt-1.5 max-w-md leading-relaxed">
                  Permanently delete your account and wipe all identifiable data from our servers (Compliance requirement).
                </p>
              </div>
              <Button 
                onClick={() => setShowDeleteModal(true)} 
                variant="outline" 
                className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 w-full sm:w-auto h-11 bg-white rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-200"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  Edit Professional Profile
                </h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="pl-10" placeholder="e.g. Dr. Jane Smith" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profession</Label>
                    <div className="relative" ref={professionRef}>
                      <button 
                        type="button" 
                        onClick={() => setIsProfessionOpen(!isProfessionOpen)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm flex justify-between items-center transition-all focus:ring-2 focus:ring-blue-500"
                      >
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          {editProfession === 'medical' ? <Stethoscope className="w-4 h-4 text-blue-600" /> : <Briefcase className="w-4 h-4 text-blue-600" />}
                          <span>{editProfession === 'medical' ? 'Healthcare Pro' : 'Engineer / Tech'}</span>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isProfessionOpen && "rotate-180")} />
                      </button>
                      
                      <AnimatePresence>
                        {isProfessionOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1.5"
                          >
                            {[
                              { id: 'medical', label: 'Healthcare Pro', icon: Stethoscope },
                              { id: 'engineer', label: 'Engineer / Tech', icon: Briefcase }
                            ].map((p) => (
                              <button 
                                key={p.id}
                                type="button"
                                onClick={() => { setEditProfession(p.id); setIsProfessionOpen(false); }}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <p.icon className={cn("w-4 h-4", editProfession === p.id ? "text-blue-600" : "text-slate-400")} />
                                  {p.label}
                                </div>
                                {editProfession === p.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} className="pl-10" placeholder="30" />
                    </div>
                  </div>
                </div>

                {/* Standardized Institution Selection */}
                <div className="space-y-2 relative" ref={institutionRef}>
                  <Label className="text-slate-700 font-bold text-[11px] uppercase tracking-wider">Institution</Label>
                  <button 
                    type="button" 
                    onClick={() => setIsInstOpen(!isInstOpen)} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm flex justify-between items-center focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className={cn("w-4 h-4", !editInstitution ? "text-slate-400" : "text-blue-600")} />
                      <span className={cn(!editInstitution && "text-slate-400")}>{editInstitution || "Select your institution..."}</span>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isInstOpen && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {isInstOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1.5 max-h-60 overflow-y-auto"
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
                            onClick={() => { setEditInstitution(inst); setIsInstOpen(false); }} 
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              {inst}
                              {editInstitution === inst && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label>Primary Specialization</Label>
                  <div className="relative" ref={specRef}>
                    <button 
                      type="button" 
                      onClick={() => setIsSpecOpen(!isSpecOpen)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm flex justify-between items-center transition-all focus:ring-2 focus:ring-blue-500"
                    >
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <Tag className={cn("w-4 h-4", editSpecialization ? "text-blue-600" : "text-slate-400")} />
                        <span>{editSpecialization || "Select specialization"}</span>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isSpecOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {isSpecOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1.5 max-h-60 overflow-y-auto"
                        >
                          {(editProfession === 'engineer' 
                            ? ["Software Engineering", "AI & Machine Learning", "Data Science", "Biomedical Engineering", "Computer Engineering", "Robotics & Automation", "Electrical Engineering", "Cyber Security"]
                            : ["Radiology", "Cardiology", "Neurology", "Oncology", "Pathology", "Dermatology", "General Surgery", "Biomedical Research", "Medical Informatics"]
                          ).map(s => (
                            <button 
                              key={s}
                              type="button"
                              onClick={() => { setEditSpecialization(s); setIsSpecOpen(false); }}
                              className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors flex items-center justify-between"
                            >
                              {s}
                              {editSpecialization === s && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea 
                    value={editBio} 
                    onChange={e => setEditBio(e.target.value)} 
                    className="min-h-[120px]" 
                    placeholder="Tell others about your professional background and goals..." 
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleSaveProfile} className="flex-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 h-12 flex gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Specialization Change Modal */}
      <AnimatePresence>
        {isSpecChangeModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setIsSpecChangeModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 pb-4 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-inner">
                  <Edit2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">Update Specialization</h3>
                <p className="text-slate-500 font-medium mt-3 leading-relaxed">
                  Shifting your primary expert domain within <strong className="text-slate-900">{userProfession === 'medical' ? 'Healthcare' : 'Engineering'}</strong>?
                </p>
              </div>

              <div className="px-8 py-4 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Target Specialization</Label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
                    {userProfession === 'medical' 
                      ? ['Radiology', 'Cardiology', 'Neurology', 'Oncology', 'Medical Informatics']
                      : ['AI & Machine Learning', 'Data Science', 'Biomedical Engineering', 'Cyber Security', 'Robotics']
                    .map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                  <Label className="text-xs font-extrabold uppercase text-blue-600 tracking-wider mb-2 block">Verification Document (Optional)</Label>
                  <input type="file" className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer w-full" />
                </div>
              </div>

              <div className="p-8 pt-4 flex flex-col gap-3">
                <Button onClick={submitSpecRequest} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 text-base">
                  Submit Update Request
                </Button>
                <Button variant="ghost" onClick={() => setIsSpecChangeModalOpen(false)} className="w-full h-12 text-slate-500 font-bold hover:bg-slate-50">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isChangeRequestModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => setIsChangeRequestModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 pb-4 text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 border border-amber-100">
                  <ShieldAlert className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">Identity Migration Protocol</h3>
                <p className="text-slate-500 font-medium mt-3 leading-relaxed">
                  You are about to initiate a formal request to change your professional identity. This is a regulated action.
                </p>
              </div>

              <div className="px-8 py-6 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Current Verification will be REVOKED</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Active collaboration requests PAUSED</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Requires manual Admin Review</span>
                  </div>
                </div>
                
                <p className="text-[13px] text-slate-400 font-semibold text-center italic">
                  "I understand that my professional credentials will be re-evaluated for the new role."
                </p>
              </div>

              <div className="p-8 pt-2 flex flex-col gap-3">
                <Button 
                  onClick={submitProfessionRequest}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 text-base"
                >
                  Confirm & Send Request
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsChangeRequestModalOpen(false)}
                  className="w-full h-12 text-slate-500 font-bold hover:bg-slate-50"
                >
                  Cancel Migration
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mock Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <Download className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-[15px]">Exporting data... this is a visualization.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Are you absolutely sure?</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-[15px]">
                  This action cannot be undone. All your posts, messages, and raw analytical data will be fundamentally erased to uphold strict privacy protocols.
                </p>
              </div>
              
              <div className="p-5 flex flex-col sm:flex-row gap-3 bg-slate-50 mt-4 border-t border-slate-100">
                <Button 
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 relative h-12 font-semibold rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 relative h-12 font-semibold rounded-xl"
                >
                  Yes, Delete My Account
                </Button>
              </div>
              
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 p-2.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
