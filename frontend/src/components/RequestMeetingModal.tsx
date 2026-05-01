import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, X, Check, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button, Label, Textarea } from './ui-components';

export type ModalStep = 'nda' | 'message' | 'success';

interface RequestMeetingModalProps {
  isOpen: boolean;
  post: any | null;
  onClose: () => void;
}

export default function RequestMeetingModal({ isOpen, post, onClose }: RequestMeetingModalProps) {
  const navigate = useNavigate();
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [message, setMessage] = useState('');
  
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const [slot1, setSlot1] = useState('');
  const [slot2, setSlot2] = useState('');
  const [slot3, setSlot3] = useState('');
  const [proposedLocation, setProposedLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendRequest = async () => {
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('healthai_token');
      const response = await fetch('http://localhost:3000/api/meetings/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: post.id,
          message, // The backend currently ignores message, but it's sent.
          proposedSlots: [slot1, slot2, slot3]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Failed to send request: ' + (errorData.error || 'Unknown error'));
        setIsSubmitting(false);
        return;
      }

      setModalStep(3);
    } catch (err) {
      alert('Network error while sending request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setModalStep(1);
      setNdaAccepted(false);
      setMessage('');
      setSlot1(''); setSlot2(''); setSlot3('');
      setProposedLocation(post.suggestedLocation || '');
      setShowTermsModal(false);
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          {/* Modal content starts here - match RequestsTab style */}
          <motion.div 
            initial={{ scale: 0.96, opacity: 0, y: 15 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto min-h-[500px]"
          >
            {/* Left Sidebar Stepper */}
            <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-100 p-8 flex flex-col shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 pointer-events-none" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-10 relative z-10">Collaboration Request</h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 z-10">
                <div className="relative flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${modalStep >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                    {modalStep > 1 ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold">1</span>}
                  </div>
                  <div>
                    <p className={`text-[15px] font-bold ${modalStep >= 1 ? 'text-blue-900' : 'text-slate-500'}`}>NDAs & Intent</p>
                    <p className="text-xs text-slate-500 font-medium">Verify terms</p>
                  </div>
                </div>
                <div className="relative flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${modalStep >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                    {modalStep > 2 ? <Check className="w-3 h-3" /> : <span className="text-[10px] font-bold">2</span>}
                  </div>
                  <div>
                    <p className={`text-[15px] font-bold ${modalStep >= 2 ? 'text-blue-900' : 'text-slate-500'}`}>Time Proposals</p>
                    <p className="text-xs text-slate-500 font-medium">Pitch 3 slots</p>
                  </div>
                </div>
                <div className="relative flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${modalStep >= 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                    <span className="text-[10px] font-bold">3</span>
                  </div>
                  <div>
                    <p className={`text-[15px] font-bold ${modalStep >= 3 ? 'text-blue-900' : 'text-slate-500'}`}>Confirmation</p>
                    <p className="text-xs text-slate-500 font-medium">Request delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 p-8 flex flex-col relative bg-white">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full transition-colors z-20">
                <X className="w-4 h-4" />
              </button>

              {modalStep === 1 && (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Non-Disclosure Agreement</h2>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3 mb-6">
                    <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900 font-medium leading-relaxed">
                      Access to <strong className="font-bold">{post.title}</strong> is restricted. You must agree to the institutional NDA terms before attaching an introduction.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <input type="checkbox" id="nda-accept-flow" checked={ndaAccepted} onChange={(e) => setNdaAccepted(e.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                    <Label htmlFor="nda-accept-flow" className="text-[13px] text-slate-700 leading-relaxed font-semibold cursor-pointer">
                      I agree to the HealthAI Standard <button onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-blue-600 hover:text-blue-800 underline underline-offset-2">Confidentiality & NDA terms</button> for this collaboration.
                    </Label>
                  </div>

                  {ndaAccepted && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 mb-6">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="interest-message" className="font-bold text-slate-700">Introduction Brief</Label>
                        <span className={cn("text-xs font-medium", message.length > 500 ? "text-red-500" : "text-slate-400")}>
                          {message.length} / 500
                        </span>
                      </div>
                      <Textarea 
                        id="interest-message"
                        placeholder="Briefly introduce yourself and why you're interested in collaborating considering the project domain..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        className="h-28 bg-slate-50 focus:bg-white text-sm"
                      />
                    </motion.div>
                  )}

                  <div className="mt-auto pt-4">
                    <Button disabled={!ndaAccepted || message.trim().length < 10} onClick={() => setModalStep(2)} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 h-12 text-[15px]">
                      Continue to Timetable
                    </Button>
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Propose Timetable</h2>
                  <p className="text-[15px] text-slate-600 mb-8 leading-relaxed">
                    To accelerate the scheduling process, please propose 3 potential meeting times for your introduction video call.
                  </p>

                  <div className="space-y-6 flex-1">
                    <div>
                      <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Proposal 1</Label>
                      <input type="datetime-local" value={slot1} onChange={e => setSlot1(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Proposal 2</Label>
                      <input type="datetime-local" value={slot2} onChange={e => setSlot2(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Proposal 3</Label>
                      <input type="datetime-local" value={slot3} onChange={e => setSlot3(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <Label htmlFor="proposed-location" className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Proposed Location / Meeting Method</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          id="proposed-location"
                          type="text" 
                          value={proposedLocation} 
                          onChange={e => setProposedLocation(e.target.value)} 
                          placeholder="e.g. Zoom, Google Meet, or a specific physical location" 
                          className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white transition-colors" 
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 font-medium">You can stick with the poster's suggestion or propose an alternative.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-6">
                    <Button variant="outline" onClick={() => setModalStep(1)} disabled={isSubmitting} className="flex-1 border-slate-200 h-12 text-[15px]">Back</Button>
                    <Button disabled={!slot1 || !slot2 || !slot3 || isSubmitting} onClick={handleSendRequest} className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 h-12 text-[15px]">
                      {isSubmitting ? 'Sending...' : 'Send Request & Proposals'}
                    </Button>
                  </div>
                </div>
              )}

              {modalStep === 3 && (
                <div className="flex flex-col h-full items-center justify-center text-center py-8 animate-in zoom-in-95 duration-500 rounded-xl bg-slate-50/50">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                    Proposals Sent!
                  </h2>
                  
                  <p className="text-[15px] text-slate-600 font-medium max-w-sm leading-relaxed mb-6">
                    Your time proposals and NDA agreement have been securely sent. You will be notified once they review your intent and select a time.
                  </p>
                  
                  <Button onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }} className="w-full max-w-xs bg-slate-900 hover:bg-slate-800 text-white h-12 shadow-md shadow-slate-900/20 rounded-xl flex items-center justify-center mx-auto">
                    Back to Dashboard
                  </Button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* NDA Terms Nested Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsModal(false)}
              className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-[121] flex items-center justify-center p-6 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-3xl overflow-hidden flex flex-col pointer-events-auto max-h-[80vh]"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <ShieldAlert className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-none">Confidentiality Agreement</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">HealthAI Standard Terms v2.4</p>
                    </div>
                  </div>
                  <button onClick={() => setShowTermsModal(false)} className="p-2 text-slate-400 hover:text-slate-700 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  <section>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">1. Scope of Disclosure</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      All information shared during this collaboration, including but not limited to datasets, clinical trial data, computer vision architectures, and genomic sequencing methods, shall be deemed strictly confidential.
                    </p>
                  </section>
                  
                  <section>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">2. Obligations of Recipient</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      The recipient agrees to use the Confidential Information solely for the purpose of evaluating and conducting the proposed collaboration. Any secondary use or sharing with third parties is strictly prohibited without written institutional consent.
                    </p>
                  </section>

                  <section>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">3. Data Protection (KVKK/GDPR)</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      HealthAI enforces strict compliance with medical data regulations. All patient-related identifiers must be removed (de-identified) prior to sharing through the secure project portal.
                    </p>
                  </section>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-blue-900 font-semibold leading-relaxed">
                      By proceeding with this collaboration request, you acknowledge that you have read and will adhere to these institutional security protocols.
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                  <Button onClick={() => setShowTermsModal(false)} className="bg-slate-900 text-white px-8 font-black rounded-xl h-11">
                    I Understand
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
