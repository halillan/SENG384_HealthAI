import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Paperclip, MoreVertical, Globe, Building2, User, CheckCheck, Clock, UploadCloud, Image, FileText, Video, Activity, X, Check, ShieldCheck, Mic, MonitorUp, PhoneOff, ArrowLeft, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui-components';

interface Chat {
  id: number;
  projectTitle: string;
  partnerName: string;
  institution: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  status: 'online' | 'offline';
  messages: Message[];
}

interface Message {
  id: number;
  sender: 'me' | 'partner';
  text: string;
  time: string;
}

const MOCK_CHATS: Chat[] = [
  {
    id: 1,
    projectTitle: "AI-Powered Stroke Detection",
    partnerName: "Taha G.",
    institution: "Hacettepe University",
    lastMessage: "The dataset formatting for the clinical trial is ready. Should we review?",
    time: "10:42 AM",
    unreadCount: 1,
    status: 'online',
    messages: [
      { id: 1, sender: 'me', text: "Hi Taha, I've reviewed the initial CV architecture. It looks promising.", time: "09:15 AM" },
      { id: 2, sender: 'partner', text: "Great! I'm working on the data preprocessing pipeline now.", time: "09:30 AM" },
      { id: 3, sender: 'partner', text: "The dataset formatting for the clinical trial is ready. Should we review?", time: "10:42 AM" },
    ]
  },
  {
    id: 2,
    projectTitle: "Genomic Sequencing Acceleration",
    partnerName: "Prof. Ayşe V.",
    institution: "Bilkent University",
    lastMessage: "I'll send the updated NDA by tonight.",
    time: "Yesterday",
    unreadCount: 0,
    status: 'offline',
    messages: [
      { id: 1, sender: 'partner', text: "Hello, I saw your interest in the Genomic project.", time: "Yesterday" },
      { id: 2, sender: 'me', text: "Yes, I believe our deep learning model can accelerate the sequencing by 3x.", time: "Yesterday" },
      { id: 3, sender: 'partner', text: "I'll send the updated NDA by tonight.", time: "Yesterday" },
    ]
  }
];

export default function MessagesTab() {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState(MOCK_CHATS[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showFiles, setShowFiles] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isProposing, setIsProposing] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', desc: '' });
  const [milestones, setMilestones] = useState([
    { title: "Protocol Alignment", status: "Done", date: "Oct 12", desc: "Institutional NDA and data sharing protocols signed." },
    { title: "Dataset Integration", status: "Done", date: "Oct 15", desc: "4,500 de-identified radiology images synced." },
    { title: "Model Architecture", status: "Active", date: "Current", desc: "Defining the CNN layers for stroke detection." },
    { title: "Clinical Validation", status: "Planned", date: "Nov 2", desc: "Testing model accuracy against doctor labels." },
    { title: "Final Publication", status: "Planned", date: "Dec 10", desc: "Preparing the paper for Medical AI Journal." },
  ]);
  
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const filteredChats = chats.filter(chat => 
    chat.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MOCK_FILES = [
    { name: "Radiology_Dataset_v1.zip", size: "45.2 MB", type: "archive", date: "2 days ago" },
    { name: "Institutional_NDA_Draft.pdf", size: "1.2 MB", type: "pdf", date: "1 day ago" },
    { name: "Clinical_Test_Results.xlsx", size: "890 KB", type: "excel", date: "4 hours ago" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: Date.now(),
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(c => 
      c.id === activeChatId 
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMessage, time: 'Just now' }
        : c
    ));
    
    setNewMessage('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-[720px] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50 relative"
    >
      {/* Sidebar: Chat List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4">Project Discussions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No discussions found</p>
            </div>
          ) : (
            filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={cn(
                  "w-full p-5 text-left border-b border-slate-50 transition-all flex gap-4",
                  activeChatId === chat.id ? "bg-white shadow-sm ring-1 ring-slate-100/50" : "hover:bg-white/50"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {chat.partnerName[0]}
                  </div>
                  {chat.status === 'online' && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{chat.partnerName}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold">{chat.time}</span>
                  </div>
                  <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider mb-1 truncate">{chat.projectTitle}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content: Chat Thread */}
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {/* Project Timeline Panel */}
        <AnimatePresence>
          {showTimeline && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-80 bg-white border-l border-slate-100 shadow-2xl z-40 flex flex-col"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Project Roadmap</h3>
                  <p className="text-[10px] font-bold text-blue-600 mt-0.5 tracking-widest uppercase">Live Tracking</p>
                </div>
                <button onClick={() => setShowTimeline(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                {/* Progress Overview */}
                <div className="mb-8 p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Overall Progress</p>
                    <div className="flex items-end gap-2 mt-1">
                      <span className="text-3xl font-black">65%</span>
                      <span className="text-xs font-bold mb-1 opacity-80">On Track</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '65%' }} 
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                      />
                    </div>
                  </div>
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                  {milestones.map((step, idx) => (
                    <div key={step.title} className="relative flex items-start gap-4 group">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110",
                        step.status === 'Done' ? 'bg-green-500 text-white shadow-md' :
                        step.status === 'Active' ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-50 shadow-blue-600/20' : 
                        step.status === 'Pending' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 animate-pulse' : 'bg-slate-100 text-slate-400'
                      )}>
                        {step.status === 'Done' ? <Check className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={cn("text-[13px] font-black", step.status === 'Active' ? 'text-blue-900' : 'text-slate-800')}>{step.title}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{step.date || 'TBD'}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{step.desc}</p>
                        {step.status === 'Active' && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">In Progress</span>
                          </div>
                        )}
                        {step.status === 'Pending' && (
                          <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 rounded border border-amber-100 w-fit">
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Proposal Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                <AnimatePresence mode="wait">
                  {isProposing ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="space-y-3"
                    >
                      <input 
                        autoFocus
                        placeholder="Milestone Title..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-600/10 outline-none"
                        value={newMilestone.title}
                        onChange={e => setNewMilestone({...newMilestone, title: e.target.value})}
                      />
                      <textarea 
                        placeholder="Brief description..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-600/10 outline-none min-h-[60px]"
                        value={newMilestone.desc}
                        onChange={e => setNewMilestone({...newMilestone, desc: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsProposing(false)}
                          className="flex-1 h-10 text-[11px] font-bold"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => {
                            if (!newMilestone.title) return;
                            setMilestones([...milestones, { ...newMilestone, status: 'Pending', date: 'TBD' }]);
                            setIsProposing(false);
                            setNewMilestone({ title: '', desc: '' });
                            const msg: Message = {
                              id: Date.now(),
                              sender: 'me',
                              text: `🚩 I've proposed a new milestone: "${newMilestone.title}". Let's review the timeline!`,
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, msg] } : c));
                          }}
                          className="flex-1 bg-blue-600 text-white h-10 text-[11px] font-bold rounded-xl"
                        >
                          Send Proposal
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <Button 
                      onClick={() => setIsProposing(true)}
                      className="w-full bg-slate-900 text-white h-10 text-xs font-bold rounded-xl shadow-lg shadow-slate-900/10"
                    >
                      Propose Milestone Change
                    </Button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shared Files Panel */}
        <AnimatePresence>
          {showFiles && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-80 bg-white border-l border-slate-100 shadow-2xl z-40 flex flex-col"
            >
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Shared Assets</h3>
                  <p className="text-[10px] font-bold text-blue-600 mt-0.5 tracking-widest uppercase">Project Documents</p>
                </div>
                <button onClick={() => setShowFiles(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                {!isUploading ? (
                  <>
                    <div className="space-y-4">
                      {MOCK_FILES.map((file) => (
                        <div key={file.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[13px] font-bold text-slate-900 truncate">{file.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">{file.size} • {file.date}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <button className="flex-1 py-2 text-[10px] font-bold bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">Download</button>
                            <button className="px-3 py-2 text-[10px] font-bold bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"><MoreVertical className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      onClick={() => setIsUploading(true)}
                      className="w-full mt-6 bg-blue-600 text-white h-11 text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20"
                    >
                      Upload New Asset
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col h-full">
                    <button 
                      onClick={() => setIsUploading(false)}
                      className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors mb-6"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back to File List
                    </button>
                    <div className="flex-1 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6">
                        <UploadCloud className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-2">Select Clinical Assets</h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-8">
                        Datasets, NDA drafts, or protocol documents. Max file size 500MB.
                      </p>
                      <Button className="w-full bg-white text-slate-900 border border-slate-200 h-10 text-xs font-bold rounded-xl hover:bg-slate-50">
                        Choose Files
                      </Button>
                    </div>
                    <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                        Privacy Note: Institutional documents are encrypted and only accessible to verified collaborators.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Call Interface Overlay */}
        <AnimatePresence>
          {showVideoCall && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden"
            >
              {/* Call Header */}
              <div className="p-6 flex items-center justify-between absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">End-to-End Encrypted</span>
                  </div>
                  <div className="text-white">
                    <h4 className="text-sm font-black tracking-tight">{activeChat.projectTitle}</h4>
                    <p className="text-[10px] font-bold text-white/60">Live Meeting with {activeChat.partnerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-md flex items-center gap-1.5 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" /> REC
                  </div>
                  <span className="text-xs font-mono text-white/80">14:22</span>
                </div>
              </div>

              {/* Video Area */}
              <div className="flex-1 relative flex items-center justify-center bg-black">
                {/* Main Video Area (AI Video) */}
                <div className="w-full h-full relative overflow-hidden">
                  <video 
                    src="/Mühendis_ve_Doktor_Görüntülü_Görüşmesi.mp4"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Scanline/Grid Overlay for "Digital Feed" look */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* Self Preview (Draggable) */}
                <motion.div 
                  drag
                  dragConstraints={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  className="absolute bottom-24 right-6 w-48 h-32 bg-slate-800 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden cursor-move z-30"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
                    <User className="w-10 h-10 text-white/20" />
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded text-[9px] font-black text-white uppercase">You (Me)</div>
                </motion.div>
              </div>

              {/* Call Controls */}
              <div className="h-24 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-6 relative z-20">
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                  <MonitorUp className="w-5 h-5" />
                </button>
                <div className="w-px h-8 bg-white/10" />
                <button 
                  onClick={() => setShowVideoCall(false)}
                  className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all hover:scale-110 active:scale-95"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Chat Header */}
        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              {activeChat.partnerName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-[15px]">{activeChat.partnerName}</h3>
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  activeChat.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                )} />
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Building2 className="w-3 h-3" /> {activeChat.institution}
                </span>
              </div>
            </div>
          </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowVideoCall(true)}
                className="h-9 px-4 text-[11px] font-black gap-2 border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all animate-pulse whitespace-nowrap shadow-sm shadow-emerald-600/5 rounded-xl"
              >
                <Video className="w-3.5 h-3.5" /> Join Video Call
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setShowTimeline(!showTimeline); setShowFiles(false); }}
                className={cn("h-9 px-4 text-[11px] font-black gap-2 rounded-xl transition-all", showTimeline ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-600 border-slate-200 hover:bg-slate-50")}
              >
                <Activity className="w-3.5 h-3.5" /> Project Roadmap
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setShowFiles(!showFiles); setShowTimeline(false); }}
                className={cn("h-9 px-4 text-[11px] font-black gap-2 rounded-xl transition-all", showFiles ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-600 border-slate-200 hover:bg-slate-50")}
              >
                <Paperclip className="w-3.5 h-3.5" /> Shared Files
              </Button>
              <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
          <div className="flex justify-center mb-8">
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Discussion Started: Monday</span>
          </div>

          <div className="flex flex-col space-y-6">
            <AnimatePresence initial={false} mode="popLayout">
              {activeChat.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.8, originX: msg.sender === 'me' ? 1 : 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    msg.sender === 'me' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-3xl text-sm font-medium shadow-sm",
                    msg.sender === 'me' 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-blue-600/10" 
                      : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                  )}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 px-1">
                    <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-50 relative">
          <AnimatePresence>
            {showAttachMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full left-8 mb-4 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 flex flex-col gap-2 z-50 min-w-[160px]"
              >
                {[
                  { icon: Image, label: 'Gallery', color: 'bg-purple-50 text-purple-600' },
                  { icon: FileText, label: 'Document', color: 'bg-blue-50 text-blue-600' },
                  { icon: Video, label: 'Video', color: 'bg-rose-50 text-rose-600' },
                ].map((item) => (
                  <button 
                    key={item.label}
                    onClick={() => setShowAttachMenu(false)}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all group w-full"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-2 pl-4 pr-2 focus-within:ring-2 focus-within:ring-blue-600/10 focus-within:border-blue-600 transition-all shadow-inner">
            <button 
              type="button" 
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={cn(
                "p-2 rounded-xl transition-all",
                showAttachMenu ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-blue-600"
              )}
            >
              <Paperclip className={cn("w-5 h-5 transition-transform", showAttachMenu && "rotate-45")} />
            </button>
            <input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message about the project..." 
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-700 py-2"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <Clock className="w-3 h-3" /> All communications are secure and project-bound
          </div>
        </div>
      </div>

      {/* Slide-over Files Panel */}
      <AnimatePresence>
        {showFiles && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowFiles(false); setIsUploading(false); }}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-20"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-30 border-l border-slate-100 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">{isUploading ? 'Upload Asset' : 'Shared Files'}</h3>
                <button 
                  onClick={() => { setShowFiles(false); setIsUploading(false); }} 
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <Globe className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {isUploading ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 p-6 text-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-sm font-bold text-blue-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-[11px] font-medium text-slate-400">Upload Project Documents, Datasets or NDAs (PDF/ZIP/CSV)</p>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Privacy Note</p>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                          Institutional documents are encrypted and only accessible to verified project collaborators.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {MOCK_FILES.map((file, i) => (
                      <motion.div 
                        key={file.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-blue-200 transition-colors">
                            <Paperclip className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[13px] font-bold text-slate-800 truncate">{file.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{file.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-bold text-slate-400">{file.date}</span>
                          <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Download</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                {isUploading ? (
                  <button 
                    onClick={() => setIsUploading(false)}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    Back to File List
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsUploading(true)}
                    className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl text-sm hover:bg-slate-100 transition-colors shadow-sm"
                  >
                    Upload New Asset
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
