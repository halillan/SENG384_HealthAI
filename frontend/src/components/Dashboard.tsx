import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Clock, Check, Globe, Activity, RotateCcw, SearchX, Cpu, ChevronDown, AlertTriangle, User, Users, Database, TrendingUp, Send, Plus, X, Server, Wifi } from 'lucide-react';

import { Card, Button } from './ui-components';
import { cn } from '../lib/utils';
import RequestMeetingModal from './RequestMeetingModal';
import RequestsTab from './RequestsTab';
import MessagesTab from './MessagesTab';


// --- Mock Data ---

const MOCK_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    title: "Real-time EEG Signal Analysis for Epilepsy",
    author: "Dr. Selin Yilmaz",
    match: "98%",
    tags: ["Neural Networks", "Neurology"],
    image: "/Gemini_Generated_Image_nz9e11nz9e11nz9e.png",
    reason: "Matches your expertise in AI & Signal Processing"
  },
  {
    id: 'rec-2',
    title: "Predictive Modeling for Diabetic Retinopathy",
    author: "Prof. Ahmet Kaya",
    match: "94%",
    tags: ["Computer Vision", "Ophthalmology"],
    image: "/Gemini_Generated_Image_nz9e11nz9e11nz9e.png",
    reason: "High synergy with your recent publications"
  }
];

const MOCK_POSTS = [
  {
    id: 1,
    title: "AI-Powered Stroke Detection",
    author: "Hacettepe University Radiology",
    imageObjPos: "left top", 
    badges: [
      { text: "Radiology", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Computer Vision", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Clinical Trial", bg: "bg-slate-50 text-slate-700 border-slate-200" },
      { text: "Market Ready", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ],
    domain: "Radiology",
    stage: "Market Ready",
    tech: ["Computer Vision"],
    city: "Ankara",
    description: "Looking for computer vision engineers to deploy our stroke detection pipeline within Hacettepe's clinical workflow.",
    postedAt: "2h ago"
  },
  {
    id: 2,
    title: "Cardio-Analytics Prediction Engine",
    author: "METU (ODTÜ) Biomedical Research",
    imageObjPos: "right top", 
    badges: [
      { text: "Cardiology", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Data Analytics", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Prototype", bg: "bg-slate-50 text-slate-700 border-slate-200" },
      { text: "Market Ready", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ],
    domain: "Cardiology",
    stage: "Market Ready",
    tech: ["Data Analytics"],
    city: "Ankara",
    description: "Optimizing algorithmic predictions using ECG signals for regional cardiovascular screening centers.",
    postedAt: "5h ago"
  },
  {
    id: 3,
    title: "Remote Robotic Suturing",
    author: "Istanbul University Faculty of Medicine",
    imageObjPos: "left bottom", 
    badges: [
      { text: "Surgery", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Robotics", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Prototype", bg: "bg-slate-50 text-slate-700 border-slate-200" },
      { text: "Idea", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ],
    domain: "Surgery",
    stage: "Idea",
    tech: ["Robotics"],
    city: "Istanbul",
    description: "Seeking deep learning and robotic control experts for remote-operated suturing validation in high-risk surgery.",
    postedAt: "1d ago"
  },
  {
    id: 4,
    title: "Genomic Sequencing Acceleration",
    author: "Bilkent University Genetics Lab",
    imageObjPos: "right bottom", 
    badges: [
      { text: "Bioinformatics", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Deep Learning", bg: "bg-blue-50 text-blue-700 border-blue-200" },
      { text: "Concept Validation", bg: "bg-slate-50 text-slate-700 border-slate-200" },
    ],
    domain: "Bioinformatics",
    stage: "Concept Validation",
    tech: ["Deep Learning"],
    city: "Ankara",
    description: "Connecting institutional genomics data with deep learning architectures to discover new metabolic pathways.",
    postedAt: "2d ago"
  }
];

// --- Animation Variants ---
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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};



// --- Animation Components ---

// --- Animation Components ---

function GlobalMapModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-10"
    >
      <div className="relative w-full max-w-6xl aspect-[16/9] bg-slate-900 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        {/* Map Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Globe className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Global Research Pulse</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">124 Nodes Online • 14.2TB Data/Sec</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Map Visualization Area */}
          <div className="flex-1 relative bg-slate-950 overflow-hidden group">
             {/* The High-Fidelity Night Map Background */}
             <div 
               className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 scale-110 group-hover:scale-100 transition-transform duration-[20s] ease-linear"
               style={{ backgroundImage: 'url("/night_world_map.png")' }}
             />
             
             {/* Scanline Effect */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_4px,3px_100%]" />
             
             {/* Grid Lines Overlay */}
             <div className="absolute inset-0 opacity-20 pointer-events-none z-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
             
             {/* Animated Overlay (Arcs & Nodes) */}
             <svg className="absolute inset-0 w-full h-full z-20" viewBox="0 0 1000 500">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 0 }} />
                    <stop offset="50%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>

                {/* Calibrated Nodes (Based on the generated world map image) */}
                {[
                  { x: 230, y: 180, name: "New York" },
                  { x: 510, y: 165, name: "Ankara" },
                  { x: 480, y: 150, name: "Zurich" },
                  { x: 820, y: 310, name: "Singapore" },
                  { x: 310, y: 340, name: "Sao Paulo" },
                ].map((node, i) => (
                  <g key={i}>
                    {/* Pulsing Outer Circle */}
                    <motion.circle 
                      cx={node.x} cy={node.y} r="12" 
                      fill="rgba(96, 165, 250, 0.2)"
                      animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    />
                    {/* Inner Solid Node */}
                    <circle cx={node.x} cy={node.y} r="3" fill="#60a5fa" filter="url(#glow)" />
                    {/* Label */}
                    <text x={node.x + 8} y={node.y - 8} className="text-[9px] font-black fill-white/60 uppercase tracking-tighter pointer-events-none">{node.name}</text>
                  </g>
                ))}

                {/* Data Arcs connecting nodes */}
                <motion.path 
                  d="M230,180 Q370,120 510,165" 
                  fill="none" stroke="url(#arcGrad)" strokeWidth="1.5" strokeDasharray="5,5"
                  animate={{ strokeDashoffset: [0, -50] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <motion.path 
                  d="M510,165 Q660,230 820,310" 
                  fill="none" stroke="url(#arcGrad)" strokeWidth="1.5" strokeDasharray="5,5"
                  animate={{ strokeDashoffset: [0, -50] }} transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
                <motion.path 
                  d="M310,340 Q270,260 230,180" 
                  fill="none" stroke="url(#arcGrad)" strokeWidth="1.5" strokeDasharray="5,5"
                  animate={{ strokeDashoffset: [0, -50] }} transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
                />
                <motion.path 
                  d="M480,150 Q650,100 820,310" 
                  fill="none" stroke="url(#arcGrad)" strokeWidth="1.5" strokeDasharray="5,5"
                  animate={{ strokeDashoffset: [0, -50] }} transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1.5 }}
                />
             </svg>

             {/* Dynamic UI Frames */}
             <div className="absolute top-6 left-6 w-32 h-32 border-l-2 border-t-2 border-white/10 pointer-events-none z-30" />
             <div className="absolute top-6 right-6 w-32 h-32 border-r-2 border-t-2 border-white/10 pointer-events-none z-30" />
             <div className="absolute bottom-6 left-6 w-32 h-32 border-l-2 border-b-2 border-white/10 pointer-events-none z-30" />
             <div className="absolute bottom-6 right-6 w-32 h-32 border-r-2 border-b-2 border-white/10 pointer-events-none z-30" />

             {/* Floating Network Telemetry */}
             <div className="absolute bottom-10 left-10 space-y-4 z-40">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-slate-900/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 w-72 shadow-2xl"
                >
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-blue-400" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Network Health</p>
                            <p className="text-xs font-black text-white">SYSTEM OPTIMAL</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">99.9% UPTIME</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] text-white/30 font-bold uppercase tracking-tight">Active Sync Latency</span>
                         <span className="text-xs text-blue-400 font-black">14.02ms</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <motion.div animate={{ width: ['40%', '85%', '60%', '90%', '75%'] }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-gradient-to-r from-blue-600 to-blue-400" />
                      </div>
                   </div>
                </motion.div>
             </div>
          </div>

          {/* Activity Sidebar */}
          <div className="w-80 border-l border-white/5 bg-slate-950/50 flex flex-col">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Server className="w-3 h-3" /> Live Feed
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono">
               {[
                 { time: "12:44:02", msg: "Ankara Node [TR-01] matched with Boston [US-42]", type: "match" },
                 { time: "12:43:58", msg: "1.2GB MRI dataset encrypted and transmitted", type: "data" },
                 { time: "12:43:50", msg: "New AI model weights distributed to 14 nodes", type: "system" },
                 { time: "12:43:42", msg: "Researcher Dr. Selin Y. accessed local node", type: "user" },
               ].map((log, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   transition={{ delay: i * 0.1 }}
                   key={i} 
                   className="space-y-1"
                 >
                   <p className="text-[9px] text-blue-500/50">{log.time}</p>
                   <p className="text-[11px] text-slate-300 leading-tight">{log.msg}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PostCardSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-6 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-3 w-3/4">
          <div className="flex gap-2">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-6 w-24 bg-slate-200 rounded-md" />
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-6 w-32 bg-slate-200 rounded-md" />
          </div>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} className="h-8 w-full max-w-md bg-slate-200 rounded-md" />
        </div>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="h-4 w-16 bg-slate-200 rounded-md" />
      </div>
      <div className="space-y-2 mt-4">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-4 w-full bg-slate-200 rounded-md" />
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="h-4 w-5/6 bg-slate-200 rounded-md" />
      </div>
      <div className="mt-8 flex justify-between items-center pt-4 border-t border-slate-100 mt-6">
        <div className="flex gap-2">
           <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-6 w-20 bg-slate-200 rounded-md" />
           <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} className="h-6 w-24 bg-slate-200 rounded-md" />
        </div>
        <div className="flex gap-2">
           <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="h-8 w-24 bg-slate-200 rounded-md" />
           <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="h-8 w-28 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
}

type ModalStep = 'nda' | 'message' | 'success';

export default function Dashboard() {
  const navigate = useNavigate();
   const [showRequestsHover, setShowRequestsHover] = useState(false);
  const [showMessagesHover, setShowMessagesHover] = useState(false);
  
  // Refactored Multi-Select Filters
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [reportingPost, setReportingPost] = useState<any | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'feed' | 'requests' | 'messages' | 'insights'>('feed');
  const [showMapModal, setShowMapModal] = useState(false);

  const [posts, setPosts] = useState<any[]>(MOCK_POSTS);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPosts = async () => {
      try {
        const token = sessionStorage.getItem('healthai_token');
        const res = await fetch('http://localhost:3000/api/posts', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            author: p.author?.fullName || 'Unknown User',
            imageObjPos: "center",
            badges: p.tags.map((t: string) => ({ text: t, bg: "bg-blue-50 text-blue-700 border-blue-200" })),
            domain: p.domain || 'General',
            stage: p.tags[0] || 'Idea',
            tech: p.tags,
            city: 'Global Network',
            description: p.description,
            postedAt: new Date(p.createdAt).toLocaleDateString()
          }));
          // Show real posts at the top, followed by mock posts if empty
          setPosts(mapped.length > 0 ? mapped : MOCK_POSTS);
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    if (selectedDomains.length > 0 && !selectedDomains.includes(post.domain)) return false;
    if (selectedTechs.length > 0 && !post.tech.some((t: string) => selectedTechs.includes(t))) return false;
    if (selectedStages.length > 0 && !selectedStages.includes(post.stage)) return false;
    if (selectedCities.length > 0 && !selectedCities.includes(post.city)) return false;
    return true;
  });

  const handleReset = () => {
    setIsResetting(true);
    setSelectedDomains([]);
    setSelectedTechs([]);
    setSelectedStages([]);
    setSelectedCities([]);
    setTimeout(() => setIsResetting(false), 600);
  };

  const toggleFilter = (stateVal: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    if (stateVal.includes(val)) setter(stateVal.filter(v => v !== val));
    else setter([...stateVal, val]);
  };
  
  // Modal State
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const handleOpenModal = (post: any) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  // Accordion State for Filter Groups
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    if (expandedGroups.includes(label)) {
      setExpandedGroups(expandedGroups.filter(g => g !== label));
    } else {
      setExpandedGroups([...expandedGroups, label]);
    }
  };

  const filterGroups = [
    { label: 'Working Domain', icon: Globe, options: [
      { name: 'Radiology', count: 1 }, { name: 'Cardiology', count: 1 }, { name: 'Dermatology', count: 0 }, 
      { name: 'Bioinformatics', count: 1 }, { name: 'Surgery', count: 1 }, { name: 'Neurology', count: 0 }
    ], active: selectedDomains, setter: setSelectedDomains },
    { label: 'Technical Tags', icon: Cpu, options: [
      { name: 'Computer Vision', count: 1 }, { name: 'NLP', count: 0 }, { name: 'Robotics', count: 1 },
      { name: 'Data Analytics', count: 1 }, { name: 'Deep Learning', count: 1 }
    ], active: selectedTechs, setter: setSelectedTechs },
    { label: 'Project Stage', icon: Activity, options: [
      { name: 'Idea', count: 1 }, { name: 'Concept Validation', count: 1 }, { name: 'Prototype', count: 0 },
      { name: 'Clinical Trial', count: 0 }, { name: 'Market Ready', count: 2 }
    ], active: selectedStages, setter: setSelectedStages },
    { label: 'City Match', icon: MapPin, options: [
      { name: 'Ankara', count: 2 }, { name: 'Istanbul', count: 1 }, { name: 'London', count: 1 }
    ], active: selectedCities, setter: setSelectedCities }
  ];

  return (
    <div className="min-h-screen relative">
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sticky top-4 z-20">
        <header className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 px-6 sm:px-8 pt-6">
          <div className="flex flex-row justify-between items-center py-4 px-6 sm:px-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              HealthAI <span className="text-blue-600">Space</span>
            </h1>
            
            <nav className="flex items-center gap-1">
              {[
                { id: 'feed', label: 'Collaboration Feed', icon: Globe },
                { id: 'insights', label: 'Platform Insights', icon: Activity },
                { id: 'requests', label: 'Meeting Requests', icon: Clock, count: 2, color: 'bg-blue-600' },
                { id: 'messages', label: 'Messages', icon: Send, count: 1, color: 'bg-emerald-500', pulse: true },
              ].map((tab) => (
                <div 
                  key={tab.id}
                  className="relative"
                  onMouseEnter={() => {
                    if (tab.id === 'messages') setShowMessagesHover(true);
                    if (tab.id === 'requests') setShowRequestsHover(true);
                  }}
                  onMouseLeave={() => {
                    if (tab.id === 'messages') setShowMessagesHover(false);
                    if (tab.id === 'requests') setShowRequestsHover(false);
                  }}
                >
                  <button
                    onClick={() => setActiveDashboardTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-[12px] font-black transition-all rounded-xl relative whitespace-nowrap",
                      activeDashboardTab === tab.id 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {tab.count && (
                      <span className={cn(
                        "ml-1 w-4 h-4 text-[9px] text-white font-bold rounded-full flex items-center justify-center border border-white shadow-sm",
                        tab.color,
                        tab.pulse && "animate-pulse"
                      )}>
                        {tab.count}
                      </span>
                    )}
                    {activeDashboardTab === tab.id && (
                      <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-600/5 rounded-xl -z-10" />
                    )}
                  </button>

                  <AnimatePresence>
                    {tab.id === 'messages' && showMessagesHover && activeDashboardTab === 'feed' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 p-5 text-slate-900 z-50 cursor-pointer overflow-hidden"
                        onClick={() => setActiveDashboardTab('messages')}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                            <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Unread Messages</h4>
                            <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">1 New</span>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black text-xs">TG</div>
                              <div className="overflow-hidden">
                                <p className="text-[13px] font-black truncate text-slate-900">Taha G.</p>
                                <p className="text-[11px] font-bold text-slate-400 truncate">RE: Stroke Detection Dataset...</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 opacity-40">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400 font-black text-xs">AV</div>
                              <div className="overflow-hidden">
                                <p className="text-[13px] font-black truncate text-slate-400">Prof. Ayşe V.</p>
                                <p className="text-[11px] font-bold text-slate-400 truncate">The NDA is ready...</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 pt-3 border-t border-slate-50 flex justify-center">
                            <span className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center gap-2">Go to Conversations <Send className="w-3 h-3" /></span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {tab.id === 'requests' && showRequestsHover && activeDashboardTab === 'feed' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 p-5 text-slate-900 z-50 cursor-pointer overflow-hidden"
                        onClick={() => setActiveDashboardTab('requests')}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -mr-12 -mt-12" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
                            <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Pending Requests</h4>
                            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">2 New</span>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[13px] font-black truncate text-slate-900">Taha G.</p>
                                <p className="text-[11px] font-bold text-slate-400 truncate">RE: AI in Radiology</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[13px] font-black truncate text-slate-900">Dr. Ahmet Yılmaz</p>
                                <p className="text-[11px] font-bold text-slate-400 truncate">RE: Cardio-Analytics</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 pt-3 border-t border-slate-50 flex justify-center">
                            <span className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-2">Go to Meeting Requests <Clock className="w-3 h-3" /></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <button 
              onClick={() => navigate('/create')}
              className="bg-slate-900 text-white hover:bg-blue-600 h-10 px-5 rounded-xl font-black text-[11px] transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex items-center gap-2 group whitespace-nowrap"
            >
              <div className="w-5 h-5 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Plus className="w-3 h-3 text-blue-400" />
              </div>
              Create Post
            </button>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div layout className="flex flex-col lg:flex-row gap-8">
          
          {activeDashboardTab === 'feed' && (
            <AnimatePresence mode="popLayout">
              {showFilters && (
                <motion.aside 
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "25%" }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="lg:w-1/4 w-full flex-shrink-0 relative"
                >
              <div className="sticky top-6 group">
                {/* Fixed Background Layer (No Blur/Overlay) */}
                <div 
                  className="absolute inset-0 rounded-[2.5rem] border border-white/30 shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: "url('/filters_background2.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />

                {/* Scrolling Content Layer */}
                <div className="relative z-10 p-6 max-h-[calc(100vh-48px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/50">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                        <Filter className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Filters</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button 
                        onClick={handleReset}
                        animate={{ rotate: isResetting ? -360 : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="p-2 text-slate-400 hover:text-blue-600 bg-white/80 hover:bg-white rounded-xl shadow-sm transition-all"
                        title="Reset Filters"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </motion.button>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="p-2 text-slate-400 hover:text-red-500 bg-white/80 hover:bg-white rounded-xl shadow-sm transition-all"
                        title="Hide Filters"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {filterGroups.map((group, idx) => (
                      <div key={group.label} className={`space-y-4 ${idx !== 0 ? 'pt-6 border-t border-slate-200/50' : ''}`}>
                        <button 
                          onClick={() => toggleGroup(group.label)}
                          className="w-full flex items-center justify-between group/header"
                        >
                          <div className="flex items-center gap-2 text-slate-500 group-hover/header:text-blue-600 transition-colors">
                            <group.icon className="w-4 h-4" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.1em]">{group.label}</h3>
                          </div>
                          <ChevronDown className={cn(
                            "w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover/header:text-blue-400",
                            expandedGroups.includes(group.label) ? "rotate-0" : "-rotate-90"
                          )} />
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedGroups.includes(group.label) && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 pt-1">
                                {group.options.map((opt) => (
                                  <motion.button 
                                    key={opt.name}
                                    whileTap={{ scale: 0.98 }}
                                    whileHover={{ x: 4 }}
                                    onClick={() => toggleFilter(group.active, group.setter, opt.name)}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                                      group.active.includes(opt.name) 
                                        ? 'border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                                        : 'border-white/50 bg-white/40 hover:bg-white hover:shadow-md'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                        group.active.includes(opt.name) ? 'bg-white border-white' : 'bg-white border-slate-200 shadow-inner'
                                      }`}>
                                        {group.active.includes(opt.name) && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
                                      </div>
                                      <span className={`text-[14px] font-bold ${
                                        group.active.includes(opt.name) ? 'text-white' : 'text-slate-700'
                                      }`}>{opt.name}</span>
                                    </div>
                                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg transition-all ${
                                      group.active.includes(opt.name) 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 ring-4 ring-slate-900/5'
                                    }`}>
                                      {opt.count}
                                    </span>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
              )}
            </AnimatePresence>
          )}

                 <motion.section layout className={cn("transition-all duration-500", activeDashboardTab === 'feed' && showFilters ? "lg:w-3/4 w-full" : "w-full")}>
            <AnimatePresence mode="wait">
              {activeDashboardTab === 'insights' ? (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  {/* Insights Header */}
                  <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                          <Activity className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black tracking-tight">HealthAI Insights</h2>
                          <p className="text-sm font-medium text-slate-400">Aggregated medical research metrics across the network</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-8 mt-10">
                        {[
                          { label: "Active Researchers", val: "4,822", growth: "+12%", icon: Users, color: "text-blue-400" },
                          { label: "Data Analyzed", val: "14.2 TB", growth: "+24%", icon: Database, color: "text-purple-400" },
                          { label: "AI Matches", val: "3,140", growth: "+18%", icon: Cpu, color: "text-emerald-400" },
                          { label: "Growth Rate", val: "38%", growth: "+5%", icon: TrendingUp, color: "text-amber-400" },
                        ].map((stat, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                              <stat.icon className={cn("w-4 h-4", stat.color)} />
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-black">{stat.val}</span>
                              <span className="text-[10px] font-bold text-emerald-400 mb-1">{stat.growth}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-2 gap-8">
                    {/* Top Research Areas */}
                    <Card className="rounded-[2.5rem] p-8 border-slate-100 shadow-xl shadow-slate-200/50">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Research Hotspots</h3>
                      <div className="space-y-6">
                        {[
                          { label: "Computer Vision", val: 85, color: "bg-blue-600" },
                          { label: "NLP & Clinical Text", val: 65, color: "bg-blue-400" },
                          { label: "Genomic Sequencing", val: 45, color: "bg-indigo-500" },
                          { label: "IoT Patient Monitoring", val: 30, color: "bg-slate-300" },
                        ].map((bar, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold text-slate-600">
                              <span>{bar.label}</span>
                              <span>{bar.val}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${bar.val}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className={cn("h-full rounded-full", bar.color)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Collaboration Pulse */}
                    <Card className="rounded-[2.5rem] p-8 border-slate-100 shadow-xl shadow-slate-200/50">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Collaboration Pulse</h3>
                      <div className="space-y-4">
                        {[
                          { pair: ["Hacettepe", "ODTÜ"], count: 124 },
                          { pair: ["Ankara Üniv.", "Bilkent"], count: 98 },
                          { pair: ["Ege Üniv.", "ITU"], count: 76 },
                          { pair: ["Koç Üniv.", "Sabancı"], count: 54 },
                        ].map((pulse, i) => (
                          <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 hover:border-blue-200 transition-all cursor-default">
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white border-2 border-white">{pulse.pair[0][0]}</div>
                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-black text-white border-2 border-white">{pulse.pair[1][0]}</div>
                              </div>
                              <span className="text-xs font-bold text-slate-700">{pulse.pair[0]} × {pulse.pair[1]}</span>
                            </div>
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{pulse.count} Active</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Network Activity Banner */}
                  <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                        <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-blue-900 tracking-tight">System Status: Optimal</h4>
                        <p className="text-sm font-medium text-blue-600/60">Node latency: 14ms • Global nodes: 124 online</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowMapModal(true)}
                      className="bg-blue-600 text-white rounded-xl h-12 px-8 font-black text-sm shadow-xl shadow-blue-600/20"
                    >
                      View Real-time Map
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showMapModal && (
                      <GlobalMapModal isOpen={showMapModal} onClose={() => setShowMapModal(false)} />
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : activeDashboardTab === 'requests' ? (
                <RequestsTab />
              ) : activeDashboardTab === 'messages' ? (
                <MessagesTab />
              ) : (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {!showFilters && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setShowFilters(true)}
                      className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 transition-all font-bold text-xs"
                    >
                      <Filter className="w-3.5 h-3.5 text-blue-600" />
                      Show Filters
                    </motion.button>
                  )}
                  {isLoading ? (
                    <div className="space-y-5 animate-in fade-in duration-500">
                      <PostCardSkeleton />
                      <PostCardSkeleton />
                      <PostCardSkeleton />
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-center mt-2"
                    >
                      <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-full mb-6 border border-slate-100 shadow-inner">
                        <SearchX className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No Results Found</h3>
                      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                        Try adjusting your filters to find more specific collaborators matching your exact requirements.
                      </p>
                      <Button onClick={handleReset} variant="outline" className="border-slate-300 h-11 px-6 shadow-sm">
                        Clear All Filters
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-12">
                      {/* AI Matchmaking Section */}
                      <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                              <Cpu className="w-5 h-5 text-white animate-pulse" />
                            </div>
                            <div>
                              <h2 className="text-xl font-black text-slate-900 tracking-tight">Smart Recommendations</h2>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Based on your AI profile</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-1 w-8 bg-blue-600 rounded-full" />
                            <div className="h-1 w-2 bg-slate-200 rounded-full" />
                            <div className="h-1 w-2 bg-slate-200 rounded-full" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {posts.slice(0, 2).map((post, i) => {
                            const rec = { 
                              id: post.id, 
                              title: post.title, 
                              author: post.author, 
                              match: i === 0 ? "98%" : "87%", 
                              tags: post.tech?.slice(0,2) || [], 
                              image: "/Gemini_Generated_Image_nz9e11nz9e11nz9e.png", 
                              reason: "Based on recent profile activity" 
                            };
                            return (
                            <motion.div 
                              key={rec.id}
                              whileHover={{ y: -5 }}
                              className="group relative bg-white rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col h-full cursor-pointer"
                              onClick={() => navigate(`/post/${rec.id}`)}
                            >
                              <div className="flex gap-6 p-7">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden shrink-0 border border-slate-100 shadow-xl relative">
                                  <img src={rec.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex gap-1.5 mb-3">
                                    {rec.tags.map(t => (
                                      <span key={t} className="text-[8px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{t}</span>
                                    ))}
                                  </div>
                                  <h3 className="text-[16px] font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{rec.title}</h3>
                                  <div className="flex items-center justify-between mt-3">
                                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><User className="w-3 h-3" /> {rec.author}</p>
                                    <div className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg shadow-blue-600/20 flex items-center gap-1.5 animate-pulse">
                                      <Activity className="w-2.5 h-2.5" /> AI MATCH {rec.match}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-auto px-6 pb-6 pt-2">
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  <p className="text-[10px] font-bold text-slate-600 italic">"{rec.reason}"</p>
                                </div>
                              </div>
                              
                              {/* Interactive Border Glow */}
                              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-[2.5rem] pointer-events-none transition-all" />
                            </motion.div>
                            );
                          })}
                        </div>
                      </motion.section>

                      <div className="flex items-center gap-4 py-4">
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Discussions</span>
                        <div className="h-px bg-slate-100 flex-1" />
                      </div>

                      <motion.div 
                        className="space-y-5"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                      >
                        {filteredPosts.map((post) => (
                          <motion.div key={post.id} variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Card className="hover:border-blue-200 transition-colors p-0 overflow-hidden group shadow-lg rounded-xl bg-white flex flex-col">
                              
                              {/* Image Header Block */}
                              <div className="relative w-full h-52 overflow-hidden bg-slate-100 flex-shrink-0 border-b border-slate-100">
                                <div 
                                  className="absolute w-[200%] h-[200%]" 
                                  style={{
                                    backgroundImage: `url('/Gemini_Generated_Image_nz9e11nz9e11nz9e.png')`,
                                    backgroundSize: '100% 100%',
                                    ...(post.imageObjPos === 'left top' ? { top: 0, left: 0 } : {}),
                                    ...(post.imageObjPos === 'right top' ? { top: 0, left: '-100%' } : {}),
                                    ...(post.imageObjPos === 'left bottom' ? { top: '-100%', left: 0 } : {}),
                                    ...(post.imageObjPos === 'right bottom' ? { top: '-100%', left: '-100%' } : {}),
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent flex flex-col justify-end p-5">
                                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                                     {post.badges.map(b => (
                                       <div key={b.text} className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded shadow-sm border ${b.bg}`}>{b.text}</div>
                                     ))}
                                  </div>
                                  <h3 className="text-xl font-bold text-white leading-tight drop-shadow-sm">{post.title}</h3>
                                  <div className="flex items-center gap-1.5 mt-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                                    <Globe className="w-3.5 h-3.5" /> {post.author}
                                  </div>
                                </div>
                              </div>

                              {/* Card Content & Footer */}
                              <div className="p-5 flex-1 flex flex-col">
                                 <div className="flex justify-between items-center mb-3">
                                   <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.postedAt} / {post.city}</span>
                                 </div>
                                 <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6 font-medium">
                                   {post.description}
                                 </p>
                                 
                                 <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                                   <button 
                                     title="Report this post"
                                     className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                     onClick={(e) => { e.stopPropagation(); setReportingPost(post); }}
                                   >
                                     <AlertTriangle className="w-4 h-4" />
                                   </button>
                                   
                                   <div className="flex gap-3">
                                     <Button variant="outline" className="h-9 px-4 text-xs font-bold text-slate-600 border-slate-300 hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}>
                                       View Details
                                     </Button>
                                     <Button className="h-9 px-5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20" onClick={(e) => { e.stopPropagation(); handleOpenModal(post); }}>
                                       Request Meeting
                                     </Button>
                                   </div>
                                 </div>
                              </div>

                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

        </motion.div>
      </main>

      {/* --- Request Meeting / NDA Dialog (Modal) --- */}
      <RequestMeetingModal 
        isOpen={!!selectedPost} 
        post={selectedPost} 
        onClose={handleCloseModal} 
      />

      {/* --- Report Post Modal --- */}
      <AnimatePresence>
        {reportingPost && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReportingPost(null)}
              className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-[151] flex items-center justify-center p-6 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col pointer-events-auto"
              >
                {!reportSuccess ? (
                  <div className="p-8">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Report Discussion</h3>
                    <p className="text-sm text-slate-500 font-medium mb-8">
                      Help us maintain a safe professional community. Why are you reporting this post?
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {['Inappropriate Content', 'Spam / Misleading', 'Non-medical Topic', 'Unprofessional Behavior'].map(reason => (
                        <button 
                          key={reason}
                          onClick={() => setReportSuccess(true)}
                          className="w-full p-4 text-left bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 rounded-2xl text-sm font-bold text-slate-700 transition-all group flex items-center justify-between"
                        >
                          {reason}
                          <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-red-400 group-hover:bg-red-50" />
                        </button>
                      ))}
                    </div>
                    
                    <Button variant="outline" onClick={() => setReportingPost(null)} className="w-full border-slate-200 h-12 text-slate-500 font-bold">Cancel</Button>
                  </div>
                ) : (
                  <div className="p-10 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Check className="w-10 h-10 text-green-600 stroke-[3]" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Report Submitted</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                      Thank you for your feedback. Our medical board will review this post within 24 hours.
                    </p>
                    <Button onClick={() => { setReportingPost(null); setReportSuccess(false); }} className="w-full bg-slate-900 text-white h-12 rounded-2xl font-black">Close Window</Button>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
