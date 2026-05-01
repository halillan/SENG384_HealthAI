import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, Check, CalendarPlus, X, CalendarCheck } from 'lucide-react';
import { Card, Button, Badge, Label } from './ui-components';

type RequestStatus = 'pending_options' | 'awaiting_selection' | 'scheduled';

type MeetingRequest = {
  id: number;
  partnerName: string;
  postTitle: string;
  status: RequestStatus;
  role: 'receiver' | 'sender';
  proposals: string[];
  finalTime?: string;
};

const INITIAL_REQUESTS: MeetingRequest[] = [
  {
    id: 1,
    partnerName: 'Dr. Ahmet Yılmaz',
    postTitle: 'AI in Radiology',
    status: 'pending_options',
    role: 'receiver',
    proposals: [],
  },
  {
    id: 2,
    partnerName: 'Zeynep Aksoy',
    postTitle: 'Healthcare Data Analytics Platform Validation',
    status: 'awaiting_selection',
    role: 'sender',
    proposals: ['2023-10-12T10:00', '2023-10-12T14:30', '2023-10-14T09:00'],
  }
];

export default function RequestsTab() {
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = sessionStorage.getItem('healthai_token');
        const currentUserId = sessionStorage.getItem('healthai_user_id');
        
        const response = await fetch('http://localhost:3000/api/meetings', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map((m: any) => {
            const isReceiver = m.receiverId === currentUserId;
            return {
              id: m.id,
              partnerName: isReceiver ? m.requester?.fullName : m.receiver?.fullName,
              postTitle: m.post?.title || 'Unknown Post',
              status: m.status === 'PROPOSED' ? (isReceiver ? 'pending_options' : 'awaiting_selection') : 'scheduled',
              role: isReceiver ? 'receiver' : 'sender',
              proposals: m.proposedSlots || [],
              finalTime: m.confirmedSlot
            };
          });
          // Use INITIAL_REQUESTS as fallback if empty for demonstration
          setRequests(mapped.length > 0 ? mapped : INITIAL_REQUESTS);
        }
      } catch (err) {
        console.error("Failed to fetch meetings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);
  
  // Modal State
  const [activeRequest, setActiveRequest] = useState<MeetingRequest | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  
  // Proposal Form State
  const [slot1, setSlot1] = useState('');
  const [slot2, setSlot2] = useState('');
  const [slot3, setSlot3] = useState('');

  // Selection state
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Compliance verification
  const [ndaAgreed, setNdaAgreed] = useState(false);

  const openModal = (req: MeetingRequest) => {
    setActiveRequest(req);
    setSlot1(''); setSlot2(''); setSlot3(''); setSelectedSlot('');
    setNdaAgreed(false);
    
    if (req.status === 'pending_options' && req.role === 'receiver') {
      setModalStep(1);
    } else if (req.status === 'awaiting_selection' && req.role === 'sender') {
      setModalStep(2);
    } else {
      setModalStep(3); // Scheduled
    }
  };

  const handlePropose = () => {
    if (!slot1 || !slot2 || !slot3) return;
    
    const nextStatus = 'awaiting_selection' as RequestStatus;
    const newProposals = [slot1, slot2, slot3];

    setRequests(requests.map(r => 
      r.id === activeRequest?.id 
        ? { ...r, status: nextStatus, proposals: newProposals } 
        : r
    ));
    setActiveRequest(prev => prev ? { ...prev, status: nextStatus, proposals: newProposals } : prev);
    setModalStep(3);
  };

  const handleSelect = async () => {
    if (!selectedSlot || !activeRequest) return;
    
    try {
      const token = sessionStorage.getItem('healthai_token');
      const response = await fetch(`http://localhost:3000/api/meetings/${activeRequest.id}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ confirmedSlot: selectedSlot })
      });

      if (!response.ok) {
        alert('Failed to confirm meeting');
        return;
      }

      const nextStatus = 'scheduled' as RequestStatus;
      
      setRequests(requests.map(r => 
        r.id === activeRequest.id 
          ? { ...r, status: nextStatus, finalTime: selectedSlot } 
          : r
      ));
      setActiveRequest({ ...activeRequest, status: nextStatus, finalTime: selectedSlot });
      setModalStep(3);
    } catch (err) {
      alert('Network error while confirming meeting.');
    }
  };

  const formatDate = (datetimeStr: string) => {
    if (!datetimeStr) return '';
    const date = new Date(datetimeStr);
    if (isNaN(date.getTime())) return datetimeStr;
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

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
    <div className="space-y-6">
      
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 gap-5"
      >
        {requests.map(req => (
          <motion.div key={req.id} variants={itemVariants}>
            <Card className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-300 transition-all shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className={
                  req.status === 'scheduled' ? 'bg-green-50 text-green-700 border-green-200' :
                  req.status === 'awaiting_selection' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }>
                  {req.status === 'scheduled' ? 'Scheduled' : req.status === 'awaiting_selection' ? 'Awaiting Time Selection' : 'Action Required'}
                </Badge>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  {req.role === 'receiver' ? 'Received Request' : 'Sent Request'}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{req.partnerName}</h3>
              <p className="text-sm text-slate-600 font-medium mt-1">Re: <span className="text-slate-800">{req.postTitle}</span></p>
              
              {req.status === 'scheduled' && req.finalTime && (
                <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-green-800 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 w-max">
                  <Calendar className="w-4 h-4" /> {formatDate(req.finalTime)}
                </div>
              )}
            </div>
            
            <div className="shrink-0 flex items-center self-start md:self-auto">
              {req.status === 'scheduled' ? (
                <Button variant="outline" onClick={() => openModal(req)} className="bg-white border-slate-200 text-slate-600 h-10 px-5">
                  View Reference
                </Button>
              ) : req.status === 'awaiting_selection' && req.role === 'receiver' ? (
                <Button disabled className="bg-slate-100 text-slate-400 h-10 px-5 opacity-70">
                  Awaiting Response
                </Button>
              ) : (
                <Button onClick={() => openModal(req)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 h-10 px-5">
                  {req.role === 'receiver' ? 'Propose Times' : 'Select Time'}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
        ))}
      </motion.div>

      {/* Stepper Modal */}
      <AnimatePresence>
        {activeRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setActiveRequest(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.96, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 15 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[450px]"
            >
              {/* Left Sidebar Stepper */}
              <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-100 p-8 flex flex-col shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none" />
                
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-10 relative z-10">Scheduling Flow</h3>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 z-10">
                  <div className="relative flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${modalStep >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                      {modalStep > 1 ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold">1</span>}
                    </div>
                    <div>
                      <p className={`text-[15px] font-bold ${modalStep >= 1 ? 'text-blue-900' : 'text-slate-500'}`}>NDAs & Intent</p>
                      <p className="text-xs text-slate-500 font-medium">Agreement verified</p>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${modalStep >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                      {modalStep > 2 ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold">2</span>}
                    </div>
                    <div>
                      <p className={`text-[15px] font-bold ${modalStep >= 2 ? 'text-blue-900' : 'text-slate-500'}`}>Time Proposals</p>
                      <p className="text-xs text-slate-500 font-medium">3 options provided</p>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${modalStep >= 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                      <span className="text-[10px] font-bold">3</span>
                    </div>
                    <div>
                      <p className={`text-[15px] font-bold ${modalStep >= 3 ? 'text-blue-900' : 'text-slate-500'}`}>Confirmation</p>
                      <p className="text-xs text-slate-500 font-medium">Slot finalized</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 p-8 flex flex-col relative bg-white">
                <button onClick={() => setActiveRequest(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>

                {/* Step 1: Propose Options (Receiver Side) */}
                {modalStep === 1 && activeRequest.role === 'receiver' && (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Propose Meeting Times</h2>
                    <p className="text-[15px] text-slate-600 mb-8 leading-relaxed">
                      You have an incoming request from <strong className="text-slate-900">{activeRequest.partnerName}</strong>. Please provide 3 possible meeting times for this introduction.
                    </p>
                    
                    <div className="space-y-5 flex-1">
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Option 1</Label>
                        <input type="datetime-local" value={slot1} onChange={e => setSlot1(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" />
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Option 2</Label>
                        <input type="datetime-local" value={slot2} onChange={e => setSlot2(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" />
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Option 3</Label>
                        <input type="datetime-local" value={slot3} onChange={e => setSlot3(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 mt-6">
                      <input type="checkbox" id="nda-agree-1" checked={ndaAgreed} onChange={(e) => setNdaAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                      <Label htmlFor="nda-agree-1" className="text-[13px] text-slate-600 leading-relaxed font-medium cursor-pointer">
                        I agree to the HealthAI Standard <a href="#" className="text-blue-600 hover:text-blue-800 underline underline-offset-2">Confidentiality & NDA terms</a> for this collaboration.
                      </Label>
                    </div>

                    <Button onClick={handlePropose} disabled={!slot1 || !slot2 || !slot3 || !ndaAgreed} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 h-12 text-[15px]">
                      Send Proposals
                    </Button>
                  </div>
                )}

                {/* Step 2: Select Option (Sender Side) */}
                {modalStep === 2 && activeRequest.role === 'sender' && (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Select a Time</h2>
                    <p className="text-[15px] text-slate-600 mb-8 leading-relaxed">
                      <strong className="text-slate-900">{activeRequest.partnerName}</strong> has proposed the following times. Choose one to finalize the NDA and meeting loop.
                    </p>
                    
                    <div className="space-y-3 flex-1">
                      {activeRequest.proposals.map((timeStr, idx) => (
                        <label key={idx} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedSlot === timeStr ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-blue-200 bg-white'}`}>
                          <input type="radio" name="timeSlot" value={timeStr} checked={selectedSlot === timeStr} onChange={() => setSelectedSlot(timeStr)} className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" />
                          <span className={`font-semibold ${selectedSlot === timeStr ? 'text-blue-900' : 'text-slate-700'}`}>{formatDate(timeStr)}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="flex items-start gap-3 mt-6">
                      <input type="checkbox" id="nda-agree-2" checked={ndaAgreed} onChange={(e) => setNdaAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                      <Label htmlFor="nda-agree-2" className="text-[13px] text-slate-600 leading-relaxed font-medium cursor-pointer">
                        I agree to the HealthAI Standard <a href="#" className="text-blue-600 hover:text-blue-800 underline underline-offset-2">Confidentiality & NDA terms</a> for this collaboration.
                      </Label>
                    </div>

                    <Button onClick={handleSelect} disabled={!selectedSlot || !ndaAgreed} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 h-12 text-[15px]">
                      Confirm Meeting Time
                    </Button>
                  </div>
                )}

                {/* Step 3: Success Screen */}
                {modalStep === 3 && (
                  <div className="flex flex-col h-full items-center justify-center text-center py-8 animate-in zoom-in-95 duration-500 rounded-xl bg-slate-50/50">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      {activeRequest.status === 'scheduled' ? (
                        <CalendarCheck className="w-10 h-10 text-green-600" />
                      ) : (
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      )}
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                      {activeRequest.status === 'scheduled' ? 'Meeting Confirmed!' : 'Proposals Sent!'}
                    </h2>
                    
                    <p className="text-[15px] text-slate-600 font-medium max-w-sm leading-relaxed mb-6">
                      {activeRequest.status === 'scheduled' 
                        ? "Great! The meeting has been finalized and added to your collaboration calendar. An automated invite will be sent to both parties."
                        : "Your time proposals have been securely sent. You will be notified once they make a selection."}
                    </p>
                    
                    <div className="flex gap-4 mt-4">
                      <Button onClick={() => setActiveRequest(null)} variant="outline" className="h-12 px-6 border-slate-200">
                        Back to Dashboard
                      </Button>
                      {activeRequest.status === 'scheduled' && (
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-6 shadow-md shadow-slate-900/20 rounded-xl">
                          <CalendarPlus className="w-5 h-5 mr-2 text-slate-300" />
                          Add to Google Calendar
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
