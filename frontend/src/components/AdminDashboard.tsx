import { useState, useEffect } from 'react';
import { Users, FileText, Activity, ShieldAlert, Download, Edit2, Trash2, LogOut, CheckCircle2, X, AlertTriangle, UserMinus, UserCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, Label } from './ui-components';
import { useNavigate, useLocation } from 'react-router-dom';

function TableSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-6 w-48 bg-slate-200 rounded-md" />
      </div>
      <div className="p-4 border-b border-slate-100 flex gap-12 bg-slate-50">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-4 w-24 bg-slate-200 rounded" />
      </div>
      <div className="divide-y divide-slate-100">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex gap-16 items-center">
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} className="h-5 w-32 bg-slate-200 rounded-md" />
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="h-5 w-48 bg-slate-200 rounded-md" />
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }} className="h-8 w-20 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

const INITIAL_MOCK_USERS = [
  { id: 1, name: 'Dr. Ayşe Yılmaz', email: 'ayse.yilmaz@hacettepe.edu.tr', role: 'Healthcare Pro', status: 'Active' },
  { id: 2, name: 'Caner Demir', email: 'cdemir@metu.edu.tr', role: 'Engineer', status: 'Active' },
  { id: 3, name: 'Prof. Hasan Korkmaz', email: 'hkorkmaz@ankara.edu.tr', role: 'Healthcare Pro', status: 'Suspended' },
  { id: 4, name: 'Zeynep Aksoy', email: 'zaksoy@bilkent.edu.tr', role: 'Engineer', status: 'Active' },
  { id: 5, name: 'Dr. Mehmet Taş', email: 'mtas@gazi.edu.tr', role: 'Healthcare Pro', status: 'Active' },
];

const INITIAL_MOCK_POSTS = [
  { id: 101, title: 'Need ML Expert for Medical Imaging Startup', author: 'Dr. Ayşe Yılmaz', reports: 0 },
  { id: 102, title: 'Looking for a Cardiologist for Data Validation', author: 'Caner Demir', reports: 2 },
  { id: 103, title: 'Inappropriate Content - Unrelated to Healthcare', author: 'Unknown', reports: 5 },
];

const MOCK_LOGS = [
  { id: 1001, action: 'User registered', user: 'cdemir@metu.edu.tr', time: '10:42 AM', ip: '192.168.1.4' },
  { id: 1002, action: 'Failed login attempt', user: 'admin@healthai.com', time: '10:15 AM', ip: '45.22.11.9' },
  { id: 1003, action: 'Post deleted by Admin', user: 'System', time: '09:30 AM', ip: 'Internal' },
  { id: 1004, action: 'Data export initialized', user: 'ayse.yilmaz@hacettepe.edu.tr', time: '08:12 AM', ip: '192.168.1.18' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'logs' | 'profession-requests'>('users');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data States
  const [users, setUsers] = useState(INITIAL_MOCK_USERS);
  const [posts, setPosts] = useState(INITIAL_MOCK_POSTS);
  const [professionRequests, setProfessionRequests] = useState([
    { id: 1, userId: 2, name: 'Caner Demir', type: 'Specialization Update', currentRole: 'AI & Machine Learning', requestedRole: 'Biomedical Engineering', reason: 'Medical Informatics Career Shift', status: 'Pending', date: 'Today, 02:45 PM' },
    { id: 2, userId: 4, name: 'Zeynep Aksoy', type: 'Profession Migration', currentRole: 'Engineer', requestedRole: 'Healthcare Pro', reason: 'Transitioning to Biomedical Research', status: 'Pending', date: 'Yesterday, 11:20 AM' },
  ]);
  
  // Interaction States
  const [toastAlert, setToastAlert] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  
  const [editingUser, setEditingUser] = useState<any>(null);
  const [suspendingUser, setSuspendingUser] = useState<any>(null);
  const [activatingUser, setActivatingUser] = useState<any>(null);
  const [removingPost, setRemovingPost] = useState<any>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastAlert({ msg, type });
    setTimeout(() => setToastAlert(null), 3000);
  };

  useEffect(() => {
    // Basic RBAC Security Simulation
    const role = sessionStorage.getItem('healthai_role');
    if (role !== 'admin') {
      navigate('/');
    } else if (location.state?.justLoggedIn) {
      showToast('Authentication Verified: Welcome, System Administrator.', 'success');
      // Clear history state immediately so refresh doesn't violently duplicate toast
      navigate('/admin', { replace: true, state: {} });
    }
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [navigate, location]);

  const handleSuspendConfirm = () => {
    if (suspendingUser) {
      setUsers(users.map(u => u.id === suspendingUser.id ? { ...u, status: 'Suspended' } : u));
      showToast(`${suspendingUser.name} has been suspended.`, 'success');
      setSuspendingUser(null);
    }
  };

  const handleActivateConfirm = () => {
    if (activatingUser) {
      setUsers(users.map(u => u.id === activatingUser.id ? { ...u, status: 'Active' } : u));
      showToast(`${activatingUser.name} is now active.`, 'success');
      setActivatingUser(null);
    }
  };

  const handleRemovePostConfirm = () => {
    if (removingPost) {
      setPosts(posts.filter(p => p.id !== removingPost.id));
      showToast('Content has been force-removed and archived for moderation review.', 'error');
      setRemovingPost(null);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      showToast('Profile updated successfully', 'success');
      setEditingUser(null);
    }
  };

  const handleApproveMigration = (req: any) => {
    if (req.type === 'Profession Migration') {
      setUsers(users.map(u => u.id === req.userId ? { ...u, role: req.requestedRole } : u));
    }
    // For Specialization Update, we'd update a different field in a real app
    setProfessionRequests(professionRequests.filter(r => r.id !== req.id));
    showToast(`${req.type} approved for ${req.name}.`, 'success');
  };

  const handleRejectMigration = (req: any) => {
    setProfessionRequests(professionRequests.filter(r => r.id !== req.id));
    showToast(`Profession migration request for ${req.name} has been rejected.`, 'error');
  };

  return (
    <div className="min-h-screen flex overflow-hidden font-sans relative">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shrink-0 overflow-y-auto">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600/20 p-2 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Admin<span className="text-blue-400">OS</span></span>
          </div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-4">HealthAI Command Center</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            User Management
          </button>
          
          <button 
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'posts' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            Content Moderation
          </button>

          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'logs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-5 h-5" />
            System Audit Logs
          </button>

          <button 
            onClick={() => setActiveTab('profession-requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'profession-requests' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            Profession Requests
            {professionRequests.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                {professionRequests.length}
              </span>
            )}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => {
              sessionStorage.removeItem('healthai_role');
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Securely
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'posts' && 'Content Moderation'}
              {activeTab === 'logs' && 'System Audit Logs'}
              {activeTab === 'profession-requests' && 'Profession Migration Requests'}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Review and manage platform resources across the network.</p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 font-semibold text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            System Live
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl">
          
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl"><Users className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Professionals</p>
                  <p className="text-2xl font-bold text-slate-900">1,248</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-indigo-500">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl"><FileText className="w-6 h-6 text-indigo-600" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Posts</p>
                  <p className="text-2xl font-bold text-slate-900">342</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-4">
                <div className="bg-amber-50 p-3 rounded-xl"><ShieldAlert className="w-6 h-6 text-amber-600" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Reports</p>
                  <p className="text-2xl font-bold text-slate-900">5</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl"><Activity className="w-6 h-6 text-emerald-600" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">System Status</p>
                  <p className="text-2xl font-bold text-slate-900">99.9%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <>
                  {activeTab === 'users' && (
                    <Card className="overflow-hidden border border-slate-200 shadow-sm">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Registered Institutional Accounts</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                              <th className="p-4 pl-6">Professional</th>
                              <th className="p-4">Edu Email Validation</th>
                              <th className="p-4">Domain Role</th>
                              <th className="p-4">Account Status</th>
                              <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-slate-900">{user.name}</td>
                                <td className="p-4 text-slate-600 font-medium text-sm">{user.email}</td>
                                <td className="p-4">
                                  <Badge variant="outline" className="bg-white shadow-sm font-medium">{user.role}</Badge>
                                </td>
                                <td className="p-4">
                                  <Badge variant="secondary" className={user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}>
                                    {user.status}
                                  </Badge>
                                </td>
                                <td className="p-4 pr-6 flex justify-end gap-2">
                                  <Button 
                                    onClick={() => setEditingUser(user)}
                                    variant="outline" 
                                    className="h-8 px-3 text-xs bg-white text-slate-600 hover:text-slate-900"
                                  >
                                    <Edit2 className="w-3 h-3 mr-1.5" /> Edit
                                  </Button>
                                  
                                  {user.status === 'Active' ? (
                                    <Button 
                                      onClick={() => setSuspendingUser(user)}
                                      variant="outline" 
                                      className="h-8 px-3 text-xs bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                                    >
                                      <UserMinus className="w-3 h-3 mr-1.5" /> Suspend
                                    </Button>
                                  ) : (
                                    <Button 
                                      onClick={() => setActivatingUser(user)}
                                      variant="outline" 
                                      className="h-8 px-3 text-xs bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                                    >
                                      <UserCheck className="w-3 h-3 mr-1.5" /> Activate
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'posts' && (
                    <Card className="overflow-hidden border border-slate-200 shadow-sm">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Active Collaborations & Reports</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                              <th className="p-4 pl-6">Post Title</th>
                              <th className="p-4">Author</th>
                              <th className="p-4">Flags/Reports</th>
                              <th className="p-4 text-right pr-6">Moderation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {posts.map((post) => (
                              <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-slate-900 max-w-sm truncate">{post.title}</td>
                                <td className="p-4 text-slate-600 text-sm font-medium">{post.author}</td>
                                <td className="p-4">
                                  {post.reports > 0 ? (
                                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                      {post.reports} Reports
                                    </Badge>
                                  ) : (
                                    <span className="text-slate-400 text-sm font-medium">Clean</span>
                                  )}
                                </td>
                                <td className="p-4 pr-6 flex justify-end">
                                  <Button 
                                    onClick={() => setRemovingPost(post)}
                                    variant="outline" 
                                    className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1.5" /> Force Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'profession-requests' && (
                    <Card className="overflow-hidden border border-slate-200 shadow-sm">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Pending Identity Migration Protocol</h3>
                        <p className="text-sm text-slate-500 font-medium">Verify the credentials before allowing a primary domain role change.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                              <th className="p-4 pl-6">Professional</th>
                              <th className="p-4">Requested Change</th>
                              <th className="p-4">Reason / Notes</th>
                              <th className="p-4">Timestamp</th>
                              <th className="p-4 text-right pr-6">Decision</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {professionRequests.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic">
                                  No pending profession migration requests at this time.
                                </td>
                              </tr>
                            ) : (
                              professionRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 pl-6">
                                    <p className="font-bold text-slate-900">{req.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className={req.type === 'Profession Migration' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}>
                                        {req.type}
                                      </Badge>
                                      <span className="text-[10px] text-slate-400 font-mono">ID: {req.userId}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="bg-slate-100 text-slate-600 line-through">{req.currentRole}</Badge>
                                      <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{req.requestedRole}</Badge>
                                    </div>
                                  </td>
                                  <td className="p-4 text-slate-600 text-sm italic font-medium">"{req.reason}"</td>
                                  <td className="p-4 text-slate-400 text-xs font-mono">{req.date}</td>
                                  <td className="p-4 pr-6 flex justify-end gap-2">
                                    <Button 
                                      onClick={() => handleApproveMigration(req)}
                                      className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      onClick={() => handleRejectMigration(req)}
                                      variant="outline"
                                      className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      Reject
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}

                  {activeTab === 'logs' && (
                    <Card className="overflow-hidden border border-slate-200 shadow-sm">
                      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">System Activity Log</h3>
                          <p className="text-sm text-slate-500 font-medium">Unalterable audit trail (GDPR Compliant)</p>
                        </div>
                        <Button onClick={() => showToast('Audit logs formatted as CSV and download started (Mock-up).')} className="bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                          <Download className="w-4 h-4 mr-2" />
                          Download Audit Trail (CSV)
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                              <th className="p-4 pl-6">Timestamp</th>
                              <th className="p-4">Action Event</th>
                              <th className="p-4">Initiating Entity</th>
                              <th className="p-4">Origin IP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {MOCK_LOGS.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors font-mono text-[13px]">
                                <td className="p-4 pl-6 text-slate-500">{log.time}</td>
                                <td className="p-4 text-slate-900 font-medium">{log.action}</td>
                                <td className="p-4 text-slate-500">{log.user}</td>
                                <td className="p-4 text-slate-400">{log.ip}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Dynamic Toast Notification Container */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-8 right-8 z-[100] border px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
              toastAlert.type === 'error' 
                ? 'bg-red-50 text-red-800 border-red-200' 
                : 'bg-green-50 text-green-800 border-green-200'
            }`}
          >
            <div className={`p-1.5 rounded-full ${toastAlert.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
              {toastAlert.type === 'error' ? (
                <ShieldAlert className={`w-5 h-5 ${toastAlert.type === 'error' ? 'text-red-600' : 'text-green-600'}`} />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </div>
            <span className="font-semibold text-sm">{toastAlert.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setEditingUser(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Edit Professional Profile</h3>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleEditSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Full Name</Label>
                    <input 
                      type="text" 
                      defaultValue={editingUser.name} 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Role</Label>
                    <select 
                      defaultValue={editingUser.role} 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Healthcare Pro</option>
                      <option>Engineer</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Institutional Email</Label>
                    <input 
                      type="email" 
                      defaultValue={editingUser.email} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500" 
                      disabled
                    />
                    <p className="text-xs text-slate-400">Email forms the core primary key and cannot be superficially altered.</p>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 mt-6">
                  <Button type="button" onClick={() => setEditingUser(null)} variant="outline" className="bg-white">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Confirmation Dialog */}
      <AnimatePresence>
        {suspendingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setSuspendingUser(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 text-center"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Suspend User?</h3>
                <p className="text-slate-500 font-medium">
                  Are you sure you want to suspend <strong className="text-slate-800">{suspendingUser.name}</strong>? They will lose access to the platform immediately.
                </p>
              </div>
              
              <div className="p-4 flex gap-3 bg-slate-50 border-t border-slate-100">
                <Button 
                  onClick={() => setSuspendingUser(null)}
                  variant="outline"
                  className="flex-1 bg-white border-slate-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSuspendConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Suspend
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activating Confirmation Dialog */}
      <AnimatePresence>
        {activatingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setActivatingUser(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 text-center"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                  <Info className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Lift Suspension?</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Lift suspension for <strong className="text-slate-800">{activatingUser.name}</strong>? They will regain full platform access and visibility across the professional network immediately.
                </p>
              </div>
              
              <div className="p-4 flex gap-3 bg-slate-50 border-t border-slate-100">
                <Button 
                  onClick={() => setActivatingUser(null)}
                  variant="outline"
                  className="flex-1 bg-white border-slate-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleActivateConfirm}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 shadow-md"
                >
                  Yes, Activate
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Force Remove Content Dialog with Heavy Keyframe Shake Animation */}
      <AnimatePresence>
        {removingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setRemovingPost(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ 
                scale: [0.7, 1.05, 1], 
                opacity: 1,
                x: [-10, 10, -5, 5, 0] // Shake animation directly integrated for strong emphasis
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-red-500 text-center"
            >
              <div className="p-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-50 shadow-inner">
                  <Trash2 className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Critical Action: Force Remove Content</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  You are about to permanently remove this post from the public feed. This action will be rigidly logged in the <strong className="text-slate-900">System Audit Trail</strong>. Are you absolutely sure?
                </p>
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left border-dashed">
                  <p className="text-xs font-mono text-slate-500 truncate">TARGET: {removingPost.title}</p>
                </div>
              </div>
              
              <div className="p-4 flex gap-3 bg-red-50/50 border-t border-red-100">
                <Button 
                  onClick={() => setRemovingPost(null)}
                  variant="outline"
                  className="flex-1 bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleRemovePostConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 font-bold"
                >
                  Confirm Removal
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
