import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { LogOut, UserCircle, Bell, MessageSquare, CalendarCheck, ShieldCheck, Coffee, Search, PlusCircle, LayoutDashboard, Settings, HeartPulse, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreatePostForm from './components/CreatePostForm';
import Dashboard from './components/Dashboard';
import PostDetail from './components/PostDetail';
import Landing from './components/Landing';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';

function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileHover, setShowProfileHover] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Hide nav on the Auth landing page and Admin Dashboard
  if (location.pathname === '/' || location.pathname.startsWith('/admin')) {
    return null;
  }
  
  const userName = sessionStorage.getItem('healthai_name') || "Dr. Ayşe Yılmaz";
  const userProfession = sessionStorage.getItem('healthai_profession') || "medical";
  const userEmail = sessionStorage.getItem('healthai_email') || "ayse.yilmaz@hacettepe.edu.tr";
  const userInstitution = sessionStorage.getItem('healthai_institution') || "Hacettepe University";

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8 text-sm font-semibold text-slate-300">
            <Link to="/dashboard" className="hover:text-blue-400 transition-colors font-bold text-lg flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-blue-500" />
              <span>HealthAI</span>
            </Link>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-5 sm:gap-6">
            
            {/* Notification Center */}
            <div 
              className="relative" 
              ref={notifRef}
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <button 
                className="relative text-slate-300 hover:text-white transition-colors p-2"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900 shadow-sm animate-pulse"></span>
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={{
                      hidden: { opacity: 0, scale: 0.95, y: -10 },
                      show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30, staggerChildren: 0.1 } }
                    }}
                    className="absolute right-[-60px] sm:right-0 top-full w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 z-50 origin-top-right"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center relative z-10">
                      <h3 className="font-bold text-[13px] text-slate-900">Notifications</h3>
                      {hasNotifications && (
                        <button onClick={() => setHasNotifications(false)} className="text-[10px] uppercase font-bold text-slate-500 hover:text-blue-600 transition-colors px-2 py-0.5 rounded-md tracking-wider">Clear All</button>
                      )}
                    </div>
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {hasNotifications ? (
                        <>
                          <motion.div variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4">
                            <div className="mt-0.5 bg-blue-100 p-2 rounded-full shrink-0">
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-slate-900 leading-snug">Taha G. sent a meeting request for your 'AI in Radiology' post.</p>
                              <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span> 1 hour ago</p>
                            </div>
                          </motion.div>
                          <motion.div variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4">
                            <div className="mt-0.5 bg-green-100 p-2 rounded-full shrink-0">
                              <CalendarCheck className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-slate-900 leading-snug">Meeting Confirmed: Your session with Dr. Ayşe is set for April 25th.</p>
                              <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span> 3 hours ago</p>
                            </div>
                          </motion.div>
                          <motion.div variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4">
                            <div className="mt-0.5 bg-slate-100 p-2 rounded-full shrink-0">
                              <ShieldCheck className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-slate-900 leading-snug">Security Alert: Your .edu email has been verified for the current session.</p>
                              <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span> Yesterday</p>
                            </div>
                          </motion.div>
                        </>
                      ) : (
                        <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }} className="p-10 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-4 shadow-inner border border-slate-100">
                            <Coffee className="w-8 h-8 text-slate-400" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">All caught up!</h4>
                          <p className="text-xs text-slate-500 font-medium">No new alerts to show right now.</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:block w-px h-5 bg-slate-700" />

            <div 
              className="relative"
              onMouseEnter={() => setShowProfileHover(true)}
              onMouseLeave={() => setShowProfileHover(false)}
            >
              <Link to="/profile" className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors py-2">
                <UserCircle className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <AnimatePresence>
                {showProfileHover && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileHover(false);
                    }}
                    className="absolute right-0 top-full w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 text-slate-900 z-50 cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <UserCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-sm truncate">{userName}</h4>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {userProfession === 'medical' ? 'Healthcare Professional' : 'Engineer / Tech Expert'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {userEmail}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {userInstitution}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider group-hover:text-blue-700">Click to edit profile</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
              {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
                    onClick={() => setShowLogoutConfirm(false)}
                  />
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center z-10 border border-slate-200"
                  >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">Wait, Sign Out?</h3>
                    <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-8">
                      Are you sure you want to end your session? You will need to sign in again to access your collaboration requests.
                    </p>
                    
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          sessionStorage.clear();
                          setShowLogoutConfirm(false);
                          navigate('/');
                        }}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
                      >
                        Yes, Sign Me Out
                      </button>
                      <button 
                        onClick={() => setShowLogoutConfirm(false)}
                        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                      >
                        Keep Me Signed In
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/30 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.2 }}
            className="w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-slate-200"
          >
            <div className="flex items-center border-b border-slate-100 px-4">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                autoFocus
                className="w-full h-14 bg-transparent outline-none px-4 text-[15px] text-slate-900 placeholder:text-slate-400"
                placeholder="What do you need?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="text-xs font-semibold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">ESC</span>
            </div>
            <div className="p-2 space-y-1 bg-slate-50/50">
              <button onClick={() => {navigate('/dashboard'); setIsOpen(false)}} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl transition-colors text-left font-medium">
                <LayoutDashboard className="w-4 h-4 text-blue-600" /> Go to Dashboard
              </button>
              <button onClick={() => {navigate('/create'); setIsOpen(false)}} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl transition-colors text-left font-medium">
                <PlusCircle className="w-4 h-4 text-emerald-600" /> Create New Post
              </button>
              <button onClick={() => {navigate('/admin'); setIsOpen(false)}} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl transition-colors text-left font-medium">
                <Settings className="w-4 h-4 text-slate-500" /> Admin Portal
              </button>
              <button onClick={() => {navigate('/profile'); setIsOpen(false)}} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl transition-colors text-left font-medium">
                <UserCircle className="w-4 h-4 text-orange-500" /> My Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function AmbientBackground() {
  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed opacity-[0.9]" 
      style={{ backgroundImage: `url('/background.png')` }}
    />
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 relative">
        <AmbientBackground />
        <MainNav />
        <CommandPalette />
        <main className="flex-1 w-full flex flex-col items-center relative z-10">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreatePostForm />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
