import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Badge, Button, Card } from './ui-components';
import { MapPin, Clock, Briefcase, Check, UserCircle2, ArrowLeft, Building2, Target, Cpu, ListChecks, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import RequestMeetingModal from './RequestMeetingModal';
import { cn } from '../lib/utils';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock post object providing realistic detail
  const MOCK_POST_DETAIL = {
    id: Number(id) || 1,
    title: "Need ML Expert for Medical Imaging Startup",
    role: "medical",
    domain: "Radiology",
    stage: "Idea",
    city: "Ankara",
    type: "Co-founder",
    postedAt: "2h ago",
    confidentiality: "private",
    suggestedLocation: "Hospital Café / Zoom",
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        {/* Main Content Card */}
        <Card className="p-8 sm:p-10 shadow-sm border-slate-200">
          
          <header className="border-b border-slate-100 pb-8 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className={cn(
                MOCK_POST_DETAIL.role === 'medical' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
              )}>
                {MOCK_POST_DETAIL.role === 'medical' ? 'Healthcare Pro' : 'Engineer'}
              </Badge>
              <Badge variant="outline" className="bg-slate-50 text-slate-600 font-medium">
                {MOCK_POST_DETAIL.domain}
              </Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              {MOCK_POST_DETAIL.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Posted {MOCK_POST_DETAIL.postedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{MOCK_POST_DETAIL.city}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span>{MOCK_POST_DETAIL.type}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[12px] font-bold">Suggested: {MOCK_POST_DETAIL.suggestedLocation}</span>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left: Description Content (2/3 width) */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4 mb-6">
                Project Overview
              </h3>
              
              <motion.div 
                className="space-y-8"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 }
                  }
                }}
              >
                {/* 1. Project Vision */}
                <motion.section 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-lg">Project Vision</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    We are a startup led by two seasoned radiologists aiming to revolutionize early detection of anomalies in chest X-Rays. We have recently gathered a small, initially annotated dataset but lack the deep learning expertise to build and train the first proof-of-concept models.
                  </p>
                </motion.section>

                <div className="w-full h-px bg-slate-100" />

                {/* 2. Technical Stack & Requirements */}
                <motion.section 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  className="border-l-4 border-blue-500 bg-blue-50/50 p-6 rounded-r-2xl shadow-sm"
                >
                  <div className="flex items-center gap-2 text-slate-900 mb-3">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-lg text-blue-950">Technical Stack & Requirements</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    We are specifically looking for a Machine Learning Engineer with a strong background in computer vision (<strong className="text-blue-700 font-semibold">PyTorch</strong> / <strong className="text-blue-700 font-semibold">TensorFlow</strong>). Familiarity with medical imaging formats like <strong className="text-blue-700 font-semibold">DICOM</strong> is highly preferred.
                  </p>
                </motion.section>

                <div className="w-full h-px bg-slate-100" />

                {/* 3. Core Responsibilities */}
                <motion.section 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <ListChecks className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-lg">Core Responsibilities</h4>
                  </div>
                  <ul className="space-y-2.5 text-slate-600 leading-relaxed list-none pl-1">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>Designing an initial pipeline for image preprocessing and normalization.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>Training a baseline classification network (e.g., <strong className="text-blue-700 font-semibold">ResNet</strong> or <strong className="text-blue-700 font-semibold">DenseNet</strong>) to spot primary abnormalities.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>Iterating on the models based on clinical feedback.</span>
                    </li>
                  </ul>
                </motion.section>

                <div className="w-full h-px bg-slate-100" />

                {/* 4. Engagement Terms */}
                <motion.section 
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-lg">Engagement Terms</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100">
                    Currently, this is a part-time equity-based role, looking toward full-time once we secure our seed round after successful prototype validation. Since our intellectual property strategy and dataset are highly sensitive, we require a standard NDA before discussing specifics or granting data access.
                  </p>
                </motion.section>
              </motion.div>
            </div>

            {/* Right: Sidebar Meta Details (1/3 width) */}
            <aside className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Details</h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Project Stage</p>
                      <p className="text-slate-600">{MOCK_POST_DETAIL.stage}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Company Type</p>
                      <p className="text-slate-600">Pre-seed Startup</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <UserCircle2 className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Required Role</p>
                      <p className="text-slate-600">{MOCK_POST_DETAIL.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {MOCK_POST_DETAIL.confidentiality === 'private' && (
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                  <h4 className="text-sm font-semibold text-amber-900 mb-1">Highly Confidential</h4>
                  <p className="text-xs text-amber-700">An NDA is required before the author will disclose proprietary data or materials.</p>
                </div>
              )}
            </aside>
          </div>

          <footer className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-500 font-medium text-center sm:text-left">
              Interested in this collaboration? Let's connect.
            </p>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="h-10 px-6 text-sm bg-white"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                className="h-10 px-6 text-sm"
                onClick={() => setIsModalOpen(true)}
              >
                Request Meeting
              </Button>
            </div>
          </footer>
        </Card>

      </div>

      {/* Shared Global/Context Modal Component */}
      <RequestMeetingModal 
        isOpen={isModalOpen}
        post={MOCK_POST_DETAIL}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
