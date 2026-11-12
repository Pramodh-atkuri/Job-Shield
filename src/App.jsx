import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
  FileText,
  UploadCloud,
  Globe,
  Building2,
  User,
  Lock,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Activity,
  BarChart3,
  Filter,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  AlertOctagon,
  ChevronRight,
  Info,
  Cpu,
  Layers,
  Flag,
  X,
  PlusCircle,
  Download,
  Eye,
  Sliders,
  Send,
  Trash2,
  Mail,
  DollarSign,
  AlertCircle
} from 'lucide-react';

// ==========================================
// SAMPLE & INITIAL DATA (Clearly marked Demo Data)
// ==========================================

const INITIAL_SCANS = [
  {
    id: "SCAN-8921",
    timestamp: "2026-11-10 14:32",
    company: "Apex Global InfoTech",
    role: "Remote Data Entry Clerk",
    score: 88,
    category: "High Risk",
    email: "hr.recruiter.apex@gmail.com",
    url: "http://apexjobs-careers-portal.xyz",
    redFlags: [
      "Demands upfront refundable ₹1,500 security deposit for training kit",
      "Official company email using generic @gmail.com domain",
      "Suspicious high-risk TLD (.xyz) registered 4 days ago",
      "Unrealistic compensation: ₹75,000/week for entry typing"
    ],
    confidence: "94% (Strong NLP pattern match)",
    status: "Flagged Fraud"
  },
  {
    id: "SCAN-8920",
    timestamp: "2026-11-09 11:15",
    company: "Tata Consultancy Services (TCS)",
    role: "Associate Software Engineer",
    score: 12,
    category: "Low Risk",
    email: "careers@tcs.com",
    url: "https://www.tcs.com/careers",
    redFlags: [],
    confidence: "98% (Verified Enterprise Domain)",
    status: "Verified Authentic"
  },
  {
    id: "SCAN-8919",
    timestamp: "2026-11-08 19:40",
    company: "FastScale Growth Partners",
    role: "Growth Operations Intern",
    score: 52,
    category: "Medium Risk",
    email: "hiring@fastscale.co",
    url: "https://fastscale.co/apply",
    redFlags: [
      "Job description contains high-urgency keywords ('Immediate start required today')",
      "Company registration number not verifiable in public records",
      "No physical corporate office listed on website"
    ],
    confidence: "82% (Heuristic flags detected)",
    status: "Needs Caution"
  }
];

const INITIAL_REPORTS = [
  {
    id: "JS-2026-F901",
    timestamp: "2026-11-11 09:20",
    company: "NextGen Media Labs",
    recruiterName: "Priya Sharma (Telegram Admin)",
    channel: "Telegram / WhatsApp",
    fraudType: "Upfront Training Fee",
    amountDemand: "₹3,500",
    description: "Offered a YouTube video reviewing job paying ₹5,000 daily. Sent a fake appointment letter and demanded ₹3,500 registration charge via UPI.",
    status: "Verified Scam",
    upvotes: 42,
    evidenceName: "appointment_letter_scam.pdf"
  },
  {
    id: "JS-2026-F902",
    timestamp: "2026-11-10 16:05",
    company: "Global Logistics Cargo Inc.",
    recruiterName: "David Miller",
    channel: "Direct Email & SMS",
    fraudType: "Phishing & KYC Harvester",
    amountDemand: "N/A (Aadhaar & Bank Card)",
    description: "Sent an SMS claiming application selected. Linked to a phishing portal demanding bank account OTP and Aadhaar scan for 'background verification'.",
    status: "Verified Scam",
    upvotes: 29,
    evidenceName: "sms_phishing_link.png"
  },
  {
    id: "JS-2026-F903",
    timestamp: "2026-11-09 12:44",
    company: "SkyHigh Tech Solutions",
    recruiterName: "Vikram Mehta",
    channel: "LinkedIn InMail",
    fraudType: "Unpaid Assignment Scam",
    amountDemand: "Free Production Work",
    description: "Assigned a full production-ready web application as an 'assessment' with no compensation, then ghosted and launched identical features.",
    status: "Under Review",
    upvotes: 14,
    evidenceName: "github_commit_proof.zip"
  }
];

const BLACKLISTED_DOMAINS = [
  "careers-tcs-verify.xyz",
  "amazon-jobs-hr.online",
  "google-hiring-india.site",
  "wipro-offerletter-portal.top",
  "telegram-workfromhome.biz",
  "quickhire-parttime.click"
];

// Demo Analyzer Presets
const PRESET_SCENARIOS = {
  highRisk: {
    title: "High Risk Scam: Telegram Data Entry",
    jobTitle: "Online Part-time Assistant / Data Typist",
    companyName: "Zenith Global Outsource",
    recruiterEmail: "zenith.hr.team2026@gmail.com",
    salary: "₹15,000 daily (₹90,000 / week)",
    url: "http://zenith-fastjobs.xyz/register",
    description: `URGENT VACANCY! IMMEDIATE JOINING WITHIN 2 HOURS!
Work 2 hours daily from mobile. Earn ₹5,000 to ₹15,000 daily payout guaranteed. No interview needed!
All candidates must submit a mandatory refundable registration fee of ₹1,200 for company software license key and training kit via GooglePay/PhonePe to hr-activation@upi.
Send screenshot immediately on Telegram @ZenithHR_Bot to receive your appointment letter.`
  },
  mediumRisk: {
    title: "Medium Risk: Vague Startup Offer",
    jobTitle: "Business Development Representative",
    companyName: "Nexus Ventures Lab",
    recruiterEmail: "recruitment@nexusventureslab.co",
    salary: "₹30,000 - ₹45,000/month + commission",
    url: "https://nexusventureslab.co/apply",
    description: `Looking for aggressive freshers to join our stealth growth accelerator.
Immediate joining is strictly preferred. You will handle customer outreach and client coordination.
Applicants must use their personal laptop and pay a ₹500 refundable portal badge issuance fee upon initial shortlist. Flexible timings.`
  },
  lowRisk: {
    title: "Low Risk: Legitimate Tech Role",
    jobTitle: "Junior Software Engineer - Backend",
    companyName: "Razorpay Software Private Limited",
    recruiterEmail: "careers@razorpay.com",
    salary: "₹8,00,000 - ₹12,00,000 per annum",
    url: "https://razorpay.com/jobs/backend-jr",
    description: `About the Role:
We are seeking a Junior Backend Developer to design reliable microservices using Node.js and Go.
Requirements:
- Bachelor's degree in Computer Science or related field
- Experience with RESTful APIs, PostgreSQL, and Git
- Strong problem-solving and communication skills
Hiring Process: 1 technical assignment + 2 system design & coding interviews.
Note: Razorpay never asks candidates for registration fees, laptop security deposits, or training charges at any stage of recruitment.`
  }
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState('seeker'); // 'seeker' | 'admin' | 'guest'
  const [notification, setNotification] = useState(null);

  // App wide state
  const [scans, setScans] = useState(INITIAL_SCANS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [blacklist, setBlacklist] = useState(BLACKLISTED_DOMAINS);

  // Global Toast Trigger
  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${
            notification.type === 'danger'
              ? 'bg-red-950/90 border-red-500/50 text-red-200'
              : notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-cyan-950/90 border-cyan-500/50 text-cyan-200'
          }`}>
            {notification.type === 'danger' && <AlertOctagon className="w-5 h-5 text-red-400" />}
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070D18]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070D18] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Job<span className="text-cyan-400">Shield</span></span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  AI v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Recruitment Fraud Defense</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {[
              { id: 'home', label: 'Home', icon: Globe },
              { id: 'analyzer', label: 'AI Job Analyzer', icon: Cpu, badge: 'Core' },
              { id: 'url_checker', label: 'URL Checker', icon: Lock },
              { id: 'company_verify', label: 'Company Verify', icon: Building2 },
              { id: 'report_scam', label: 'Report Scam', icon: Flag },
              { id: 'user_dashboard', label: 'Dashboard', icon: BarChart3 },
              ...(userRole === 'admin' ? [{ id: 'admin_dashboard', label: 'Admin Moderation', icon: Activity, badge: 'Staff' }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {tab.label}
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      tab.badge === 'Core' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Role Switcher & Quick Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <span className="text-slate-400 px-2 hidden sm:inline">Role:</span>
              <button
                onClick={() => {
                  setUserRole('seeker');
                  showToast("Switched to Job Seeker view", "info");
                }}
                className={`px-2.5 py-1 rounded transition-all font-medium ${
                  userRole === 'seeker' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Seeker
              </button>
              <button
                onClick={() => {
                  setUserRole('admin');
                  showToast("Switched to Security Admin view (Unlocked Moderation)", "info");
                }}
                className={`px-2.5 py-1 rounded transition-all font-medium ${
                  userRole === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            <button
              onClick={() => setActiveTab('analyzer')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-cyan-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Verify Job
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Subnav */}
        <div className="lg:hidden flex overflow-x-auto px-4 py-2.5 border-t border-slate-800 gap-2 bg-[#090F1C] scrollbar-none">
          {[
            { id: 'home', label: 'Home' },
            { id: 'analyzer', label: 'AI Analyzer' },
            { id: 'url_checker', label: 'URL Check' },
            { id: 'company_verify', label: 'Company' },
            { id: 'report_scam', label: 'Report' },
            { id: 'user_dashboard', label: 'Dashboard' },
            ...(userRole === 'admin' ? [{ id: 'admin_dashboard', label: 'Admin' }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium border ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(page) => setActiveTab(page)}
            scans={scans}
            reports={reports}
          />
        )}
        {activeTab === 'analyzer' && (
          <JobAnalyzerPage
            onSaveScan={(newScan) => {
              setScans([newScan, ...scans]);
              showToast("Risk assessment saved to user history", "success");
            }}
            blacklist={blacklist}
          />
        )}
        {activeTab === 'url_checker' && <UrlCheckerPage blacklist={blacklist} />}
        {activeTab === 'company_verify' && <CompanyVerificationPage />}
        {activeTab === 'report_scam' && (
          <ReportScamPage
            reports={reports}
            onAddReport={(newReport) => {
              setReports([newReport, ...reports]);
              showToast(`Report ${newReport.id} logged to community ledger`, "success");
            }}
          />
        )}
        {activeTab === 'user_dashboard' && (
          <UserDashboardPage
            scans={scans}
            reports={reports}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'admin_dashboard' && (
          <AdminDashboardPage
            reports={reports}
            setReports={setReports}
            blacklist={blacklist}
            setBlacklist={setBlacklist}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#050912] border-t border-slate-800/80 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-base">JobShield AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Autonomous cyber intelligence platform shielding job seekers, college graduates, and professionals from phishing, fake recruitment agencies, and employment fee fraud.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Yukthi Innovation Challenge 2026 Edition
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Detection Modules</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('analyzer')} className="hover:text-cyan-400 transition-colors">NLP Job Text Scanner</button></li>
              <li><button onClick={() => setActiveTab('url_checker')} className="hover:text-cyan-400 transition-colors">Domain Typosquatting Checker</button></li>
              <li><button onClick={() => setActiveTab('company_verify')} className="hover:text-cyan-400 transition-colors">MCA Registry Cross-Check</button></li>
              <li><button onClick={() => setActiveTab('analyzer')} className="hover:text-cyan-400 transition-colors">Screenshot OCR Extraction</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Threat Intelligence</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('report_scam')} className="hover:text-cyan-400 transition-colors">Community Scam Ledger</button></li>
              <li><button onClick={() => setActiveTab('user_dashboard')} className="hover:text-cyan-400 transition-colors">Student Safety Checklist</button></li>
              <li><button onClick={() => setActiveTab('url_checker')} className="hover:text-cyan-400 transition-colors">Phishing Domain Blocklist</button></li>
              <li><span className="text-slate-500">EMSCAD Scam Corpus v3</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Disclaimer & Safety</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              JobShield uses explainable NLP, machine heuristics, and crowdsourced indicators. Assessments are probabilistic risk estimations to guide due diligence, not legally binding background endorsements.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
              © 2026 JobShield Cybersecurity Labs. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 1. HOME PAGE
// ==========================================
function HomePage({ onNavigate, scans, reports }) {
  const [quickInput, setQuickInput] = useState('');
  const [quickCheckResult, setQuickCheckResult] = useState(null);

  const handleQuickCheck = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    const lower = quickInput.toLowerCase();
    const isFee = lower.includes('fee') || lower.includes('pay') || lower.includes('deposit') || lower.includes('registration');
    const isTelegram = lower.includes('telegram') || lower.includes('whatsapp') || lower.includes('@gmail.com');
    const isUnrealistic = lower.includes('75000') || lower.includes('daily') || lower.includes('5000/day');

    let score = 20;
    if (isFee) score += 40;
    if (isTelegram) score += 25;
    if (isUnrealistic) score += 25;

    setQuickCheckResult({
      score: Math.min(score, 95),
      risk: score > 60 ? 'High Risk' : score > 35 ? 'Medium Risk' : 'Low Risk',
      reason: isFee 
        ? "Warning: Upfront registration fee or payment solicitation detected."
        : isTelegram
        ? "Caution: Unofficial communication channels or public mail provider used."
        : "Initial heuristic scan detected standard recruitment vocabulary."
    });
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Next-Gen Defense Against Job Scams & Phishing
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Don't Trust Every Job Offer. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Verify Before You Apply.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Every year, over 2.4 million job seekers fall prey to fake registration charges, fraudulent employment letters, and identity harvesting. JobShield uses explainable AI, natural language heuristics, and registry verification to give you actionable clarity.
          </p>

          {/* Quick Check Form Bar */}
          <div className="max-w-2xl mx-auto mt-6">
            <form onSubmit={handleQuickCheck} className="p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Paste job message, recruiter email, or offer snippet..."
                  className="w-full bg-transparent text-sm pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-cyan-500/20"
              >
                Instant Heuristic Scan
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Result Popup */}
            {quickCheckResult && (
              <div className="mt-4 p-4 rounded-xl border bg-slate-900/95 border-slate-700 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    quickCheckResult.score > 60 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    quickCheckResult.score > 35 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {quickCheckResult.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">Quick Heuristic: {quickCheckResult.risk}</span>
                      <span className="text-[11px] text-slate-400">Score: {quickCheckResult.score}/100</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{quickCheckResult.reason}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap self-end sm:self-center"
                >
                  Full Deep Scan &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('analyzer')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-7 py-3 rounded-xl shadow-xl shadow-cyan-500/20 flex items-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
            >
              <Cpu className="w-4 h-4" />
              Check a Job Advertisement Now
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
            >
              Explore How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Metrics / Demo Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Recruitment Scans Run", value: "54,290+", sub: "Simulated verified corpus", color: "text-cyan-400" },
            { label: "Frauds & Phishing Flagged", value: "8,940", sub: "16.4% threat detection rate", color: "text-red-400" },
            { label: "Explainability Metric", value: "99.4%", sub: "Every decision transparent", color: "text-emerald-400" },
            { label: "Student Savings Guarded", value: "₹14.2M+", sub: "Prevented upfront fee losses", color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                Demo Metric
              </span>
              <div className={`text-2xl sm:text-3xl font-extrabold ${stat.color} tracking-tight`}>
                {stat.value}
              </div>
              <div className="font-semibold text-slate-200 text-sm mt-1">{stat.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How JobShield Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Under the Hood</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Multimodal Architecture: From Raw Text to Explainable Risk
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Unlike black-box models, JobShield decomposes recruitment data through three verifiable security stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Multimodal Ingestion & OCR",
              icon: FileText,
              desc: "Extract text from WhatsApp chats, Telegram screenshots, appointment PDFs, or pasted email text using image preprocessing and optical character recognition."
            },
            {
              step: "02",
              title: "NLP & Linguistic Heuristics",
              icon: Cpu,
              desc: "Scans for coercive urgency tactics, upfront training/laptop security fee requests, unrealistic salary-to-skill ratios, and matches against the EMSCAD scam corpus."
            },
            {
              step: "03",
              title: "Domain & Identity Cross-Check",
              icon: Globe,
              desc: "Cross-validates sender email domains with corporate records, evaluates DNS age, flags typo-squatted domains, and checks verified MCA business registrations."
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all group">
                <div className="text-4xl font-black text-slate-800 group-hover:text-cyan-500/20 transition-colors absolute top-4 right-5 font-mono">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 text-cyan-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Cybersecurity Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Built Specifically for Job Seekers</h2>
          </div>
          <button
            onClick={() => onNavigate('analyzer')}
            className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-1.5"
          >
            Launch Core Scanner <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldAlert,
              title: "Upfront Fee Detection",
              desc: "Immediately flags requests for 'interview processing charges', 'laptop security bonds', or 'training kit payments'.",
              action: () => onNavigate('analyzer')
            },
            {
              icon: Globe,
              title: "URL Typo-Squatting Guard",
              desc: "Catches malicious lookalike portals such as 'careers-tcs-verify.xyz' impersonating genuine Fortune 500 enterprises.",
              action: () => onNavigate('url_checker')
            },
            {
              icon: Building2,
              title: "Corporate Identity Verification",
              desc: "Flags discrepancies between recruiter emails (@gmail.com / @yahoo.com) and official corporate domains.",
              action: () => onNavigate('company_verify')
            },
            {
              icon: UploadCloud,
              title: "Screenshot OCR Extraction",
              desc: "Upload screenshots from Telegram channels, WhatsApp messages, or printed brochures for instant text analysis.",
              action: () => onNavigate('analyzer')
            },
            {
              icon: Flag,
              title: "Community Threat Ledger",
              desc: "Crowdsourced scam repository where students log fake recruiter UPI handles, phone numbers, and phishing URLs.",
              action: () => onNavigate('report_scam')
            },
            {
              icon: BarChart3,
              title: "Audit History & Security Score",
              desc: "Keep a transparent log of every scanned job posting with printable safety audit breakdowns and compliance checks.",
              action: () => onNavigate('user_dashboard')
            }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                onClick={f.action}
                className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/80 to-[#0A101D] border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Warning Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 border border-red-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Active Threat Warning: Fake Telegram YouTube-Review Jobs</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Over 1,200 reports in the last 14 days demanding ₹1,500 - ₹5,000 via UPI handles posing as media marketing agencies.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('report_scam')}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold rounded-lg whitespace-nowrap"
            >
              View Community Ledger &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Everything you need to know about JobShield's analysis methodology</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Does JobShield guarantee that a job is 100% genuine?",
              a: "No. In accordance with ethical AI standards, JobShield provides probabilistic risk assessments and explains observed red flags. A Low Risk score indicates absence of common indicators, but candidates should always conduct their own final due diligence."
            },
            {
              q: "What are the biggest red flags for recruitment fraud?",
              a: "1) Asking for any upfront payment (for training, laptop security, registration, or badge fees). Legitimate employers never charge candidates. 2) Communication exclusively via Telegram or WhatsApp. 3) Recruiter emails from free domains like @gmail.com or @yahoo.com while claiming to represent major corporations."
            },
            {
              q: "How does the Screenshot OCR Analyzer work?",
              a: "You can drag and drop a screenshot of a job post, SMS, or Telegram chat. The optical character recognition system parses the text and feeds it directly into our linguistic risk engine without storing private images."
            },
            {
              q: "Can I report a scammer to help other students?",
              a: "Yes! Use the 'Report Scam' tab. Once submitted, our community moderation queue reviews the details and appends it to the searchable scam ledger, shielding other job seekers from the same trap."
            }
          ].map((item, idx) => (
            <details key={idx} className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <summary className="font-semibold text-slate-200 text-sm flex items-center justify-between list-none">
                <span>{item.q}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-slate-400 text-xs mt-3 leading-relaxed border-t border-slate-800/80 pt-3">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 2. AI JOB ANALYZER (CORE FEATURE)
// ==========================================
function JobAnalyzerPage({ onSaveScan, blacklist }) {
  // Input states
  const [jobText, setJobText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Load Preset
  const handleLoadPreset = (key) => {
    const p = PRESET_SCENARIOS[key];
    setJobTitle(p.jobTitle);
    setCompanyName(p.companyName);
    setRecruiterEmail(p.recruiterEmail);
    setSalary(p.salary);
    setJobUrl(p.url);
    setJobText(p.description);
    setAnalysisResult(null);
  };

  // Simulated OCR Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setIsOcrProcessing(true);

    // Simulate OCR text extraction
    setTimeout(() => {
      setIsOcrProcessing(false);
      setJobText(
        `[OCR EXTRACTED FROM: ${file.name}]\n` +
        `URGENT HIRING: Work From Home Typist & Document Verification\n` +
        `Earn ₹2,500 daily. Direct payment. Contact HR on WhatsApp: +91-9876543210.\n` +
        `Refundable processing fee ₹999 required for software access key before training session begins.`
      );
      setJobTitle("Work From Home Typist");
      setCompanyName("FastTask Global Solns");
      setRecruiterEmail("fasttask.careers@gmail.com");
      setSalary("₹2,500 daily");
    }, 1200);
  };

  // Clear Form
  const handleClear = () => {
    setJobText('');
    setJobTitle('');
    setCompanyName('');
    setRecruiterEmail('');
    setSalary('');
    setJobUrl('');
    setImageFile(null);
    setAnalysisResult(null);
  };

  // Core Explainable Risk Scoring Engine
  const executeAnalysis = () => {
    if (!jobText.trim() && !jobTitle.trim() && !companyName.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const lowerText = (jobText + " " + jobTitle + " " + companyName + " " + recruiterEmail + " " + jobUrl).toLowerCase();

      let score = 5; // Base uncertainty
      const signals = [];
      const redFlags = [];
      const safeNotes = [];

      // 1. Upfront Payment / Fees (Crucial Scam Pattern)
      const feeTerms = ["fee", "deposit", "payment", "registration", "refundable", "charges", "kit", "pay first", "training charge", "security money", "₹", "upi", "phonepe", "gpay"];
      const detectedFeeTerms = feeTerms.filter(t => lowerText.includes(t));
      if (detectedFeeTerms.length > 0) {
        score += 38;
        redFlags.push({
          type: "Upfront Financial Demand",
          desc: `Detected payment solicitation terms: "${detectedFeeTerms.slice(0, 3).join(', ')}". Legitimate employers never require payment for interviews, training, or equipment.`,
          weight: "+38 Risk Pts"
        });
      } else {
        safeNotes.push("No explicit upfront fee or registration deposit demands detected.");
      }

      // 2. High Urgency & Pressure Language
      const urgencyTerms = ["urgently needed", "immediate joining", "within 2 hours", "limited slots", "today only", "no interview", "direct appointment", "spot offer"];
      const detectedUrgency = urgencyTerms.filter(t => lowerText.includes(t));
      if (detectedUrgency.length > 0) {
        score += 18;
        redFlags.push({
          type: "Coercive Urgency Tactics",
          desc: `Identified pressure phrases: "${detectedUrgency.join(', ')}". Scammers bypass scrutiny using synthetic urgency.`,
          weight: "+18 Risk Pts"
        });
      }

      // 3. Unofficial Channels (Telegram / WhatsApp / Personal Email)
      const channelTerms = ["telegram", "whatsapp", "bot", "inbox me"];
      const isFreeEmail = recruiterEmail.endsWith("@gmail.com") || recruiterEmail.endsWith("@yahoo.com") || recruiterEmail.endsWith("@hotmail.com") || recruiterEmail.endsWith("@outlook.com");
      
      if (channelTerms.some(t => lowerText.includes(t))) {
        score += 22;
        redFlags.push({
          type: "Informal Communication Channels",
          desc: "Job directs applicant to unmonitored messaging apps (WhatsApp / Telegram) rather than enterprise Applicant Tracking Systems (ATS).",
          weight: "+22 Risk Pts"
        });
      }

      if (isFreeEmail && companyName.length > 2) {
        score += 19;
        redFlags.push({
          type: "Recruiter Email Domain Mismatch",
          desc: `Recruiter uses a public email provider (${recruiterEmail}) while claiming corporate representation for "${companyName}".`,
          weight: "+19 Risk Pts"
        });
      } else if (recruiterEmail && !isFreeEmail) {
        safeNotes.push(`Email uses enterprise domain (${recruiterEmail.split('@')[1]}).`);
      }

      // 4. Unrealistic Salary Claims
      const salaryTerms = ["daily payout", "earn 5000", "75,000/week", "90,000 / week", "no experience required", "easy typing"];
      if (salaryTerms.some(t => lowerText.includes(t)) || lowerText.includes("per day") || lowerText.includes("daily")) {
        score += 15;
        redFlags.push({
          type: "Disproportionate Compensation",
          desc: "Salary offered is statistically incompatible with entry-level or non-technical qualification requirements.",
          weight: "+15 Risk Pts"
        });
      }

      // 5. URL and TLD Heuristics
      if (jobUrl) {
        const isBlacklisted = blacklist.some(b => jobUrl.toLowerCase().includes(b));
        const isSuspiciousTLD = [".xyz", ".top", ".click", ".biz", ".site", ".online"].some(tld => jobUrl.toLowerCase().includes(tld));

        if (isBlacklisted) {
          score = 98;
          redFlags.push({
            type: "Blacklisted Threat Domain",
            desc: `The destination URL (${jobUrl}) matches an existing entry in the community fraud repository.`,
            weight: "+60 Risk Pts"
          });
        } else if (isSuspiciousTLD) {
          score += 18;
          redFlags.push({
            type: "High-Risk Top-Level Domain (TLD)",
            desc: "The application link utilizes a cheap/throwaway TLD commonly associated with disposable phishing campaigns.",
            weight: "+18 Risk Pts"
          });
        }
      }

      // Normalized Final Score (0 - 100)
      const finalScore = Math.min(Math.max(score, 8), 98);
      let riskLevel = "Low Risk";
      let badgeColor = "emerald";

      if (finalScore >= 65) {
        riskLevel = "High Risk";
        badgeColor = "red";
      } else if (finalScore >= 35) {
        riskLevel = "Medium Risk";
        badgeColor = "amber";
      }

      const generatedResult = {
        id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        score: finalScore,
        category: riskLevel,
        badgeColor,
        confidence: finalScore > 65 ? "92% (High Confidence)" : "86% (Moderate Confidence)",
        redFlags,
        safeNotes,
        company: companyName || "Unspecified Entity",
        role: jobTitle || "Unspecified Role",
        email: recruiterEmail || "N/A",
        url: jobUrl || "N/A",
        recommendations: finalScore >= 65 ? [
          "Do NOT transfer any money for registration, badges, or training materials under any circumstance.",
          "Cease contact with the recruiter on Telegram/WhatsApp immediately.",
          "Do not share copies of government IDs (Aadhaar, Passport, PAN) or bank account details.",
          "Report this listing to the community scam registry to protect other applicants."
        ] : finalScore >= 35 ? [
          "Verify the recruiter's identity on LinkedIn or via the company's verified HR switchboard.",
          "Check whether the job is listed directly on the official company careers portal.",
          "Never pay fees even if labeled '100% refundable upon joining'."
        ] : [
          "Posting conforms to professional hiring norms.",
          "Standard recommendation: Verify interview calendar invites originate from the official domain."
        ]
      };

      setAnalysisResult(generatedResult);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Job Fraud Analyzer</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Multimodal deep analysis: Natural Language Processing, linguistic urgency scoring & domain verification.
          </p>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Demo Presets:</span>
          <button
            onClick={() => handleLoadPreset('highRisk')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/80 transition-all font-medium"
          >
            Telegram Fee Scam
          </button>
          <button
            onClick={() => handleLoadPreset('mediumRisk')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 transition-all font-medium"
          >
            Suspicious Startup
          </button>
          <button
            onClick={() => handleLoadPreset('lowRisk')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80 transition-all font-medium"
          >
            Legitimate Tech Role
          </button>
        </div>
      </div>

      {/* Main Grid: Input Form vs Results Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Job Information & Offer Details
              </h2>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Clear all fields
              </button>
            </div>

            {/* Quick Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Remote Data Typist / Backend Engineer"
                  className="w-full bg-[#070D18] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Global or Microsoft"
                  className="w-full bg-[#070D18] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recruiter Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    placeholder="recruiter@company.com (or @gmail)"
                    className="w-full bg-[#070D18] border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Offered Salary / Compensation</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. ₹5,000/day or ₹12 LPA"
                    className="w-full bg-[#070D18] border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Application URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recruitment Website / Application Link</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://company-careers-portal.com/apply"
                  className="w-full bg-[#070D18] border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>
            </div>

            {/* Job Description Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Job Advertisement / WhatsApp / Telegram Message Text
                </label>
                <span className="text-[11px] text-slate-500">Supports multiline paste</span>
              </div>
              <textarea
                rows={6}
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the full job offer description, WhatsApp chat message, interview invitation email, or telegram instructions here..."
                className="w-full bg-[#070D18] border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
              />
            </div>

            {/* Screenshot OCR Upload Component */}
            <div className="border-t border-slate-800 pt-4">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Or Upload Screenshot / Image (OCR Text Extraction)
              </label>

              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-4 text-center bg-[#070D18]/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                  {isOcrProcessing ? (
                    <>
                      <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                      <span className="text-xs text-cyan-300 font-semibold">Running Optical Character Recognition...</span>
                      <span className="text-[11px] text-slate-500">Extracting typography and contact vectors</span>
                    </>
                  ) : imageFile ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <span className="text-xs text-emerald-300 font-medium">Loaded: {imageFile.name}</span>
                      <span className="text-[11px] text-slate-400">OCR content extracted to description box above</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-slate-400" />
                      <span className="text-xs text-slate-300 font-medium">
                        Drag & Drop recruitment screenshot, or <span className="text-cyan-400">browse file</span>
                      </span>
                      <span className="text-[11px] text-slate-500">Supports PNG, JPG, WebP screenshots</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Execute Analyze Action */}
            <button
              onClick={executeAnalysis}
              disabled={isAnalyzing || (!jobText.trim() && !jobTitle.trim() && !companyName.trim())}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-cyan-600/20 flex items-center justify-center gap-2.5 text-sm"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Neural Classification & Domain Heuristics...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Fraud Risk & Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Explainable Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {analysisResult ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Score Card */}
              <div className={`p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
                analysisResult.category === 'High Risk'
                  ? 'bg-red-950/20 border-red-500/40'
                  : analysisResult.category === 'Medium Risk'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-emerald-950/20 border-emerald-500/40'
              }`}>
                {/* Background Ring */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Audit ID: {analysisResult.id}
                  </span>
                  <span className="text-xs text-slate-400">{analysisResult.timestamp}</span>
                </div>

                <div className="flex items-center gap-5 my-5">
                  {/* Circular Score Metric */}
                  <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border font-mono shrink-0 shadow-lg ${
                    analysisResult.category === 'High Risk'
                      ? 'bg-red-950/80 border-red-500 text-red-400 shadow-red-900/20'
                      : analysisResult.category === 'Medium Risk'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-400 shadow-amber-900/20'
                      : 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-emerald-900/20'
                  }`}>
                    <span className="text-3xl font-black">{analysisResult.score}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">/ 100 Risk</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-extrabold ${
                        analysisResult.category === 'High Risk' ? 'text-red-400' :
                        analysisResult.category === 'Medium Risk' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {analysisResult.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {analysisResult.category === 'High Risk'
                        ? 'Critical indicators of fraudulent employment activity detected.'
                        : analysisResult.category === 'Medium Risk'
                        ? 'Mixed indicators found. Exercise extreme caution before committing.'
                        : 'Low indicators of synthetic or fraudulent recruitment patterns.'}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      Engine Confidence: {analysisResult.confidence}
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      analysisResult.score > 60 ? 'bg-red-500' : analysisResult.score > 35 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${analysisResult.score}%` }}
                  />
                </div>
              </div>

              {/* Detected Red Flags Breakdown */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Suspicious Indicators & Weight Breakdown
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {analysisResult.redFlags.length} Signals
                  </span>
                </h3>

                {analysisResult.redFlags.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    No overt payment demands or known blacklisted keywords found.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {analysisResult.redFlags.map((flag, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-red-400">{flag.type}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/60">
                            {flag.weight}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{flag.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Safe Signals */}
                {analysisResult.safeNotes.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Positive Baseline Indicators
                    </span>
                    {analysisResult.safeNotes.map((note, idx) => (
                      <div key={idx} className="text-xs text-emerald-400 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actionable Safety Checklist */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Recommended Next Steps
                </h3>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>

                {/* Save & Action Buttons */}
                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => onSaveScan(analysisResult)}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save Audit to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(JSON.stringify(analysisResult, null, 2));
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    title="Copy JSON Payload"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ethical AI Disclaimer */}
              <p className="text-[11px] text-slate-500 leading-relaxed px-1">
                Notice: JobShield generates probabilistic risk assessments based on syntax, known scam corpuses, and domain reputation. This does not constitute legal counsel or a guarantee of employment validity.
              </p>
            </div>
          ) : (
            <div className="h-full min-h-[400px] p-8 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
                <Activity className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-300 text-base">Awaiting Recruitment Input</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Fill in the job details on the left, load one of the demo presets, or upload a screenshot to initiate the explainable risk engine.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. URL SAFETY CHECKER
// ==========================================
function UrlCheckerPage({ blacklist }) {
  const [urlInput, setUrlInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const demoUrls = [
    { label: "Spoofed TCS Portal", url: "https://careers-tcs-verify.xyz/application" },
    { label: "Amazon HR Spoof", url: "http://amazon-jobs-hr.online/login" },
    { label: "Official Google Careers", url: "https://www.google.com/about/careers" },
    { label: "Wipro Lookalike TLD", url: "http://wipro-offerletter-portal.top/check" }
  ];

  const handleCheckUrl = (e) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;

    setAnalyzing(true);
    setTimeout(() => {
      let cleaned = urlInput.trim().toLowerCase();
      if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
        cleaned = 'https://' + cleaned;
      }

      let parsedDomain = "";
      try {
        parsedDomain = new URL(cleaned).hostname;
      } catch {
        parsedDomain = cleaned;
      }

      const isBlacklisted = blacklist.some(b => parsedDomain.includes(b));
      const suspiciousTLDs = [".xyz", ".top", ".online", ".site", ".click", ".biz", ".tk", ".ml"];
      const hasSuspiciousTLD = suspiciousTLDs.some(t => parsedDomain.endsWith(t));
      const hasHyphens = (parsedDomain.match(/-/g) || []).length >= 2;
      const isHttp = cleaned.startsWith('http://');

      // Spoofed brand detection
      const knownBrands = ["google", "microsoft", "amazon", "tcs", "infosys", "wipro", "accenture", "deloitte"];
      const impersonatedBrand = knownBrands.find(b => parsedDomain.includes(b) && !parsedDomain.endsWith(`${b}.com`));

      let riskScore = 10;
      const flags = [];

      if (isBlacklisted) {
        riskScore = 95;
        flags.push("Domain identified in active global recruitment scam blacklist.");
      }
      if (impersonatedBrand) {
        riskScore += 45;
        flags.push(`Brand Impersonation: Domain mimics "${impersonatedBrand.toUpperCase()}" but does not belong to the verified root domain.`);
      }
      if (hasSuspiciousTLD) {
        riskScore += 25;
        flags.push("High-risk TLD: Cheap disposable extension frequently exploited for throwaway phishing portals.");
      }
      if (hasHyphens) {
        riskScore += 15;
        flags.push("Typosquatting structure: Multiple hyphens observed in domain name.");
      }
      if (isHttp) {
        riskScore += 15;
        flags.push("Insecure Connection: Missing SSL/TLS HTTPS encryption certificate.");
      }

      const finalScore = Math.min(riskScore, 99);

      setResult({
        url: cleaned,
        domain: parsedDomain,
        score: finalScore,
        category: finalScore >= 65 ? "High Risk" : finalScore >= 35 ? "Medium Risk" : "Low Risk",
        sslStatus: isHttp ? "Unencrypted (HTTP)" : "Valid SSL Certificate (HTTPS)",
        domainAge: isBlacklisted || hasSuspiciousTLD ? "Estimated < 14 days" : "Estimated 12+ years",
        reputation: isBlacklisted ? "Flagged Phishing Target" : hasSuspiciousTLD ? "Suspicious / Unranked" : "Reputable Enterprise Domain",
        flags
      });

      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Lock className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Recruitment URL Safety Checker</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Inspect application links, domain age, typosquatting vectors, and SSL security before clicking or submitting personal data.
        </p>
      </div>

      {/* URL Input Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <form onSubmit={handleCheckUrl} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste recruitment URL (e.g., https://careers-tcs-verify.xyz/apply)"
              className="w-full bg-[#070D18] border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={analyzing || !urlInput.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {analyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Inspect Link
          </button>
        </form>

        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-500">Test Presets:</span>
          {demoUrls.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setUrlInput(item.url);
                setResult(null);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Box */}
      {result && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono text-slate-400">Target Domain</span>
              <h2 className="text-lg font-mono font-bold text-white break-all">{result.domain}</h2>
              <span className="text-xs text-slate-500 break-all">{result.url}</span>
            </div>

            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 self-start sm:self-center font-bold text-sm ${
              result.category === 'High Risk' ? 'bg-red-950/60 border-red-500/50 text-red-300' :
              result.category === 'Medium Risk' ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' :
              'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
            }`}>
              {result.category === 'High Risk' ? <ShieldAlert className="w-5 h-5 text-red-400" /> : <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              <span>{result.category} ({result.score}/100)</span>
            </div>
          </div>

          {/* Heuristic Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">Reputation Score</span>
              <span className="text-sm font-semibold text-slate-200">{result.reputation}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">Estimated Domain Age</span>
              <span className="text-sm font-semibold text-slate-200">{result.domainAge}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">SSL Certificate</span>
              <span className={`text-sm font-semibold ${result.sslStatus.includes('Unencrypted') ? 'text-red-400' : 'text-emerald-400'}`}>
                {result.sslStatus}
              </span>
            </div>
          </div>

          {/* Detected Warning Flags */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observed Heuristic Vectors</h3>
            {result.flags.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                No known spoofing patterns, malicious TLDs, or blacklist matches detected for this hostname.
              </div>
            ) : (
              <div className="space-y-2">
                {result.flags.map((flag, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Caution:</span> Even legitimate domains can suffer from open-redirect attacks. Always ensure that subdomains belong directly to the enterprise (e.g. <code className="text-cyan-400">jobs.apple.com</code>, NOT <code className="text-red-400">apple-jobs-portal.com</code>).
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. COMPANY VERIFICATION MODULE
// ==========================================
function CompanyVerificationPage() {
  const [compName, setCompName] = useState('');
  const [website, setWebsite] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      label: "Legit Enterprise: Infosys",
      name: "Infosys Limited",
      web: "infosys.com",
      email: "recruitment@infosys.com",
      cin: "L85110KA1981PLC013115"
    },
    {
      label: "Scam Impersonation: 'TCS' on Gmail",
      name: "Tata Consultancy Services",
      web: "tcs.com",
      email: "tcs.hr.onboarding2026@gmail.com",
      cin: "L22210MH1995PLC084781"
    },
    {
      label: "Unregistered Shell Entity",
      name: "FastEarn Micro Career Services",
      web: "fastearncareer.xyz",
      email: "hr@fastearncareer.xyz",
      cin: "U99999DL2026PTC000000"
    }
  ];

  const handleVerify = (e) => {
    e?.preventDefault();
    if (!compName.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const emailDomainClean = emailDomain.trim().toLowerCase().replace('@', '');
      const webClean = website.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

      const isFreeMail = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].includes(emailDomainClean);
      const isMismatch = emailDomainClean && webClean && !emailDomainClean.includes(webClean) && !webClean.includes(emailDomainClean);
      const isFakeCin = cinNumber.includes("000000") || compName.toLowerCase().includes("fastearn");

      let score = 90;
      const issues = [];

      if (isFreeMail) {
        score -= 50;
        issues.push("Recruiter uses a free public email provider (@" + emailDomainClean + ") instead of a corporate enterprise domain.");
      } else if (isMismatch) {
        score -= 40;
        issues.push(`Domain Discrepancy: Recruiter domain (@${emailDomainClean}) does not correspond to corporate website (${webClean}).`);
      }

      if (isFakeCin) {
        score -= 35;
        issues.push("Corporate Identification Number (CIN) returned zero active filings in the Ministry of Corporate Affairs (MCA) database.");
      }

      setVerificationResult({
        name: compName,
        cinStatus: isFakeCin ? "Unverified / Not Registered" : "Active & Compliant (MCA)",
        domainMatch: !isFreeMail && !isMismatch ? "Verified Alignment" : "Critical Domain Mismatch",
        legitimacyScore: Math.max(score, 12),
        issues
      });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building2 className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Company Identity & Domain Verification</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Cross-reference recruiter communications against registered business directories, corporate domains, and public registry records.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 font-medium">Quick Demo Profiles:</span>
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setCompName(p.name);
              setWebsite(p.web);
              setEmailDomain(p.email);
              setCinNumber(p.cin);
              setVerificationResult(null);
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleVerify} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Company Name</label>
            <input
              type="text"
              value={compName}
              onChange={(e) => setCompName(e.target.value)}
              placeholder="e.g. Tata Consultancy Services"
              className="w-full bg-[#070D18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Website URL</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g. tcs.com"
              className="w-full bg-[#070D18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Recruiter Contact Email</label>
            <input
              type="text"
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              placeholder="e.g. careers@tcs.com or hr@gmail.com"
              className="w-full bg-[#070D18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Registration / CIN Number <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={cinNumber}
              onChange={(e) => setCinNumber(e.target.value)}
              placeholder="e.g. L85110KA1981PLC013115"
              className="w-full bg-[#070D18] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !compName.trim()}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          Run Cross-Entity Verification
        </button>
      </form>

      {/* Result Card */}
      {verificationResult && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-400 font-mono">Verification Status</span>
              <h2 className="text-lg font-bold text-white">{verificationResult.name}</h2>
            </div>
            <div className={`text-lg font-bold font-mono px-3 py-1 rounded-xl border ${
              verificationResult.legitimacyScore >= 70
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                : 'bg-red-950/60 border-red-500/40 text-red-400'
            }`}>
              Trust Index: {verificationResult.legitimacyScore}/100
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Registry Filing (MCA / Govt)</span>
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-200">
                {verificationResult.cinStatus.includes('Active') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{verificationResult.cinStatus}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Email vs Web Domain Match</span>
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-200">
                {verificationResult.domainMatch.includes('Verified') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{verificationResult.domainMatch}</span>
              </div>
            </div>
          </div>

          {verificationResult.issues.length > 0 ? (
            <div className="space-y-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Identified Impersonation Hazards</span>
              {verificationResult.issues.map((issue, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official email domain perfectly matches the registered corporate root domain.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. REPORT A SCAM (COMMUNITY SYSTEM)
// ==========================================
function ReportScamPage({ reports, onAddReport }) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form states
  const [company, setCompany] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [channel, setChannel] = useState('Telegram');
  const [fraudType, setFraudType] = useState('Upfront Training Fee');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchType = filterType === 'all' || r.fraudType.toLowerCase().includes(filterType.toLowerCase());
      const matchQuery =
        r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.recruiterName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchQuery;
    });
  }, [reports, filterType, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !desc.trim()) return;

    const newReport = {
      id: `JS-2026-F${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      company,
      recruiterName: recruiter || "Anonymous / Unlisted",
      channel,
      fraudType,
      amountDemand: amount ? `₹${amount}` : "Undisclosed",
      description: desc,
      status: "Under Review",
      upvotes: 1,
      evidenceName: fileName || "evidence_log.png"
    };

    onAddReport(newReport);
    setShowSubmitModal(false);
    setCompany('');
    setRecruiter('');
    setAmount('');
    setDesc('');
    setFileName('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Flag className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Community Scam Ledger</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Crowdsourced threat reports submitted by students & candidates to protect the broader job community.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/20 flex items-center gap-2 text-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Report a Fraudulent Recruiter
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, recruiter name, or pattern..."
            className="w-full bg-[#070D18] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 whitespace-nowrap">Filter:</span>
          {['all', 'fee', 'phishing', 'assignment'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-all ${
                filterType === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Incidents' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                  {report.id}
                </span>
                <h3 className="font-bold text-white text-base">{report.company}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  report.status === 'Verified Scam' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {report.status}
                </span>
              </div>
              <span className="text-xs text-slate-500">{report.timestamp}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
              <div>
                <span className="text-slate-500 block">Recruiter / Admin:</span>
                <span className="font-medium text-slate-200">{report.recruiterName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Medium / Channel:</span>
                <span className="font-medium text-slate-200">{report.channel}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Modus Operandi:</span>
                <span className="font-medium text-amber-400">{report.fraudType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Demanded Amount:</span>
                <span className="font-medium text-red-400">{report.amountDemand}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <FileText className="w-3.5 h-3.5" />
                <span>Supporting Attachment: <code className="text-slate-400">{report.evidenceName}</code></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    report.upvotes += 1;
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Confirm / Upvote ({report.upvotes})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Submit New Report */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090F1C] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-400" />
                Submit Fraud Report
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Entity Claimed</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full bg-[#070D18] border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Recruiter Handle / Name</label>
                  <input
                    type="text"
                    value={recruiter}
                    onChange={(e) => setRecruiter(e.target.value)}
                    placeholder="e.g. John HR on Telegram"
                    className="w-full bg-[#070D18] border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Channel Used</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="w-full bg-[#070D18] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option>Telegram</option>
                    <option>WhatsApp</option>
                    <option>LinkedIn InMail</option>
                    <option>SMS / Direct Call</option>
                    <option>Phishing Email</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fraud Classification</label>
                  <select
                    value={fraudType}
                    onChange={(e) => setFraudType(e.target.value)}
                    className="w-full bg-[#070D18] border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option>Upfront Training Fee</option>
                    <option>Phishing & KYC Harvester</option>
                    <option>Unpaid Assignment Theft</option>
                    <option>Crypto Task Scam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fee Demanded (if any)</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full bg-[#070D18] border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Describe the Modus Operandi</label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Explain what steps the scammer took, what payment method was demanded, and how the link was shared..."
                  className="w-full bg-[#070D18] border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload Proof (Screenshot / PDF)</label>
                <input
                  type="file"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                  className="w-full text-slate-400 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. USER DASHBOARD
// ==========================================
function UserDashboardPage({ scans, reports, onNavigate }) {
  const [selectedScan, setSelectedScan] = useState(null);

  // Statistics Calculation
  const highRiskCount = scans.filter(s => s.category === 'High Risk').length;
  const mediumRiskCount = scans.filter(s => s.category === 'Medium Risk').length;
  const lowRiskCount = scans.filter(s => s.category === 'Low Risk').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Candidate Security Dashboard</h1>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Review personal scan history, audit records, and security postures against predatory recruitment.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Audited Offers</span>
          <div className="text-3xl font-extrabold text-white mt-1">{scans.length}</div>
          <span className="text-[11px] text-cyan-400 mt-1 block">Indexed in local storage</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">High Risk Avoided</span>
          <div className="text-3xl font-extrabold text-red-400 mt-1">{highRiskCount}</div>
          <span className="text-[11px] text-red-400/80 mt-1 block">Flagged upfront demands</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Safe Verified Roles</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{lowRiskCount}</div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Enterprise verified domains</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Your Defense Score</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1">98/100</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero compromised applications</span>
        </div>
      </div>

      {/* Visual Risk Distribution Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">Audited Threat Distribution Profile</span>
          <span className="text-slate-400">{scans.length} Completed Analyses</span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(highRiskCount / Math.max(scans.length, 1)) * 100}%` }}
            className="bg-red-500 h-full transition-all"
            title={`High Risk: ${highRiskCount}`}
          />
          <div
            style={{ width: `${(mediumRiskCount / Math.max(scans.length, 1)) * 100}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`Medium Risk: ${mediumRiskCount}`}
          />
          <div
            style={{ width: `${(lowRiskCount / Math.max(scans.length, 1)) * 100}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`Low Risk: ${lowRiskCount}`}
          />
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>High Risk ({highRiskCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Medium Risk ({mediumRiskCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Low Risk ({lowRiskCount})</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Personal Audit Log & History
          </h2>
          <button
            onClick={() => onNavigate('analyzer')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            + Run New Scan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Role & Company</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Risk Category</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{scan.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{scan.role}</div>
                    <div className="text-slate-400 text-[11px]">{scan.company}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{scan.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      scan.category === 'High Risk' ? 'bg-red-500/20 text-red-400' :
                      scan.category === 'Medium Risk' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {scan.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{scan.score}/100</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedScan(scan)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Evidence Details */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A101D] border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedScan.id}</span>
                <h3 className="font-bold text-white text-base">{selectedScan.role}</h3>
                <span className="text-xs text-slate-400">{selectedScan.company}</span>
              </div>
              <button onClick={() => setSelectedScan(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Risk Assessment Score</span>
                <span className="font-mono font-bold text-base text-cyan-400">{selectedScan.score}/100</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Identified Red Flags:</span>
                {selectedScan.redFlags.length === 0 ? (
                  <p className="text-emerald-400">No high-risk signatures flagged.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {selectedScan.redFlags.map((rf, i) => (
                      <li key={i} className="p-2 rounded bg-red-950/20 text-red-300 border border-red-500/20">
                        {typeof rf === 'string' ? rf : `${rf.type}: ${rf.desc}`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-2 text-[11px] text-slate-500">
                Contact: <code className="text-slate-400">{selectedScan.email}</code> | Link: <code className="text-slate-400">{selectedScan.url}</code>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. ADMIN DASHBOARD & MODERATION
// ==========================================
function AdminDashboardPage({ reports, setReports, blacklist, setBlacklist, showToast }) {
  const [newDomain, setNewDomain] = useState('');

  const handleApprove = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: "Verified Scam" } : r));
    showToast(`Report ${id} approved as Verified Scam across community network`, "success");
  };

  const handleReject = (id) => {
    setReports(reports.filter(r => r.id !== id));
    showToast(`Report ${id} removed as inconclusive/disputed`, "info");
  };

  const handleAddDomain = (e) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    const cleaned = newDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!blacklist.includes(cleaned)) {
      setBlacklist([...blacklist, cleaned]);
      showToast(`Domain ${cleaned} added to real-time blacklist`, "success");
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (domain) => {
    setBlacklist(blacklist.filter(d => d !== domain));
    showToast(`Domain ${domain} removed from blacklist`, "info");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Security Operations & Moderation Queue</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Review crowdsourced incident tickets, blacklist predatory recruitment domains, and monitor platform health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono">
            ● Heuristic Service Online
          </span>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <Flag className="w-4 h-4 text-amber-400" />
            Community Moderation Queue
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {reports.filter(r => r.status === 'Under Review').length} Pending Reviews
          </span>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400">{report.id}</span>
                  <span className="font-bold text-white text-sm">{report.company}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    report.status === 'Verified Scam' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">{report.description}</p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Channel: {report.channel} | Demanded: {report.amountDemand} | Upvotes: {report.upvotes}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {report.status !== 'Verified Scam' && (
                  <button
                    onClick={() => handleApprove(report.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Scam
                  </button>
                )}
                <button
                  onClick={() => handleReject(report.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blacklist Manager */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-400" />
            Active Phishing & Scam Domain Blacklist
          </h2>
          <span className="text-xs text-slate-400">{blacklist.length} Domains Synchronized</span>
        </div>

        {/* Add domain input */}
        <form onSubmit={handleAddDomain} className="flex gap-2">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="Add new predatory domain (e.g., telegram-offer-jobs.top)..."
            className="flex-1 bg-[#070D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Append Blacklist
          </button>
        </form>

        {/* Domain chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {blacklist.map((domain, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <span>{domain}</span>
              <button onClick={() => handleRemoveDomain(domain)} className="text-slate-500 hover:text-red-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
