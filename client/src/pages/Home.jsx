import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from '../assets/aptitude-test.png';
import {
  FiFileText,
  FiTarget,
  FiZap,
  FiClock,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiHelpCircle,
  FiArrowRight,
  FiShield,
  FiLayers,
  FiAward,
  FiBookOpen,
  FiChevronDown,
} from 'react-icons/fi';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    category: 'Logical Reasoning (Bank PO / SSC)',
    question: 'Statements: All laptops are devices. Some devices are gadgets. Which conclusion definitely follows?',
    options: [
      { text: 'A) All gadgets are laptops', isCorrect: false },
      { text: 'B) Some gadgets may be laptops', isCorrect: true },
      { text: 'C) No laptop is a gadget', isCorrect: false },
      { text: 'D) All devices are laptops', isCorrect: false },
    ],
    explanation:
      'Since "Some devices are gadgets" and "All laptops are devices", the set of laptops and gadgets may overlap within the device category. Hence, "Some gadgets may be laptops" is a possible and valid conclusion.',
    tag: 'Syllogism • Medium Difficulty',
  },
  {
    id: 2,
    category: 'Quantitative Aptitude',
    question: 'A train 180 meters long is running at 54 km/hr. How many seconds will it take to pass a stationary pole?',
    options: [
      { text: 'A) 10 seconds', isCorrect: false },
      { text: 'B) 12 seconds', isCorrect: true },
      { text: 'C) 15 seconds', isCorrect: false },
      { text: 'D) 18 seconds', isCorrect: false },
    ],
    explanation:
      'Speed in m/s = 54 × (5/18) = 15 m/s. Time to pass a pole = Length of train / Speed = 180 / 15 = 12 seconds.',
    tag: 'Time & Distance • Standard Formula',
  },
  {
    id: 3,
    category: 'Computer & AI General Awareness',
    question: 'In machine learning evaluation, what does the F1-score represent?',
    options: [
      { text: 'A) Arithmetic mean of precision and recall', isCorrect: false },
      { text: 'B) Harmonic mean of precision and recall', isCorrect: true },
      { text: 'C) Ratio of true positives to false positives', isCorrect: false },
      { text: 'D) Overall model accuracy on test data', isCorrect: false },
    ],
    explanation:
      'The F1-score is mathematically defined as the harmonic mean of Precision and Recall: 2 × (P × R) / (P + R), balancing both metrics under imbalanced distributions.',
    tag: 'AI Fundamentals • Core Metric',
  },
];

const FAQS = [
  {
    q: 'How does GetTest AI generate questions from my PDF?',
    a: 'Our backend uses FastAPI and PyPDF2 to parse and clean text from your uploaded document. The content is then analyzed by an advanced language model to synthesize context-aware multiple-choice questions matching standard exam formats.',
  },
  {
    q: 'Can I customize the question count and test timer?',
    a: 'Yes! You can choose between 5 to 30 questions and set time limits from 5 to 60 minutes. The test environment automatically counts down and tracks the time you spend on each individual question.',
  },
  {
    q: 'What exam roles are currently supported?',
    a: 'We currently support specialized patterns for Bank Clerk, Bank PO, SSC CGL, and Railway RRB exams, covering subjects like Quantitative Aptitude, Logical Reasoning, English, General Knowledge, and Current Affairs.',
  },
  {
    q: 'Is there a limit on file size for PDF uploads?',
    a: 'Currently, the maximum allowed file size is 5 MB per PDF, which comfortably accommodates chapter notes, syllabus summaries, and lecture presentations.',
  },
  {
    q: 'Do I get detailed analytics after completing a mock test?',
    a: 'Yes! You receive an item-by-item diagnostic audit, accuracy breakdown, score charts via Recharts, and average time per question to help you pinpoint areas for improvement.',
  },
];

const Home = () => {
  // Interactive Live Question Sandbox State
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Architecture Diagram Lightbox State
  const [showDiagramModal, setShowDiagramModal] = useState(false);

  // Interactive Mode Selector State
  const [activeModeTab, setActiveModeTab] = useState('pdf');

  // Interactive FAQ State
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const currentQ = SAMPLE_QUESTIONS[activeQuestionIdx];

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNextSampleQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setActiveQuestionIdx((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-orange-50/60 via-amber-50/20 via-white to-slate-50 text-slate-800 antialiased selection:bg-orange-100 selection:text-orange-900">
      {/* Background Soft Lighting Mesh (Fast Load CSS) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-orange-200/25 via-amber-100/20 to-indigo-100/20 blur-3xl pointer-events-none -z-10" />

      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/70 border border-orange-200/80 text-orange-800 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>AI-Powered Adaptive Mock Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Master Any Exam with <br />
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-rose-500 bg-clip-text text-transparent">
                Personalized AI Mock Tests
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Convert your study notes, textbooks, and syllabus PDFs into realistic, timed practice tests with instant item-level diagnostics and conceptual explanations in under 5 seconds.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to="/main"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Generate Free Test</span>
                <FiArrowRight className="text-lg" />
              </Link>
              <a
                href="#interactive-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base shadow-xs hover:shadow transition-all duration-200"
              >
                <FiZap className="text-orange-500" />
                <span>Try Live Demo</span>
              </a>
            </div>

            {/* Trust / Metric Badges */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/70 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">⚡ &lt;5s</p>
                <p className="text-xs text-slate-500 font-medium">Generation Time</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">🎯 98%</p>
                <p className="text-xs text-slate-500 font-medium">Concept Accuracy</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">100%</p>
                <p className="text-xs text-slate-500 font-medium">Exam Aligned</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200 shadow-xl p-6 transition-transform duration-300 hover:shadow-2xl">
              {/* Floating Top Badge */}
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <FiAward />
                <span>Smart Assessment Ready</span>
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-slate-400 ml-2">SIMULATION // LIVE</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                  Bank PO / SSC
                </span>
              </div>

              {/* Illustration Preview */}
              <div className="my-5 flex justify-center bg-gradient-to-b from-orange-50/50 to-amber-50/30 rounded-2xl p-4 border border-orange-100">
                <img
                  src={Image}
                  alt="AI Mock Test Evaluation"
                  className="h-44 sm:h-52 w-auto object-contain drop-shadow-sm"
                  loading="eager"
                />
              </div>

              {/* Live Status Indicators */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 flex items-center gap-2">
                    <FiFileText className="text-orange-500" /> PDF Ingestion
                  </span>
                  <span className="font-semibold text-emerald-600 font-mono">PARSED (100%)</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 flex items-center gap-2">
                    <FiBarChart2 className="text-indigo-500" /> Cognitive Taxonomy
                  </span>
                  <span className="font-semibold text-indigo-600 font-mono">BLOOM'S LEVEL 3</span>
                </div>
              </div>

              {/* Action Banner */}
              <Link
                to="/main"
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>Launch Interactive Test Setup</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Question Sandbox (Addresses "interactive and knowledgeable") */}
      <section id="interactive-demo" className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                <FiZap /> Interactive Knowledge Sandbox
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Experience an AI Mock Question Right Now
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Select an answer below to inspect how GetTest AI evaluates concepts and explains rationale.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                Question {activeQuestionIdx + 1} of {SAMPLE_QUESTIONS.length}
              </span>
              <button
                type="button"
                onClick={handleNextSampleQuestion}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>Next Sample</span>
                <FiArrowRight className="text-xs" />
              </button>
            </div>
          </div>

          {/* Question Box */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-orange-100 text-orange-800 font-semibold">
                {currentQ.category}
              </span>
              <span className="text-xs font-mono text-slate-400">• {currentQ.tag}</span>
            </div>

            <p className="text-base sm:text-lg font-semibold text-slate-800 mb-6 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle =
                  'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700';

                if (selectedOption !== null) {
                  if (option.isCorrect) {
                    optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-500 text-rose-900 font-semibold ring-1 ring-rose-500';
                  } else {
                    optionStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border text-left text-sm transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <span>{option.text}</span>
                    {selectedOption !== null && option.isCorrect && (
                      <FiCheckCircle className="text-emerald-600 text-lg flex-shrink-0 mt-0.5" />
                    )}
                    {selectedOption !== null && isSelected && !option.isCorrect && (
                      <FiXCircle className="text-rose-600 text-lg flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant AI Explanation Box */}
            {showExplanation && (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 animate-in fade-in-50 duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-900 mb-1">
                  <FiHelpCircle className="text-orange-600" />
                  <span>AI CONCEPT RATIONALE</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {currentQ.explanation}
                </p>
                <div className="mt-3 pt-3 border-t border-orange-200/50 flex flex-wrap items-center justify-between text-xs text-orange-800 gap-2">
                  <span>✨ Get detailed diagnostic reviews on all generated tests.</span>
                  <Link to="/main" className="font-semibold underline hover:text-orange-950">
                    Generate full mock test now →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Knowledge Architecture: How It Works & Workflow Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold px-3 py-1 rounded-full bg-orange-100/70 inline-block mb-3">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How GetTest AI Converts Study Material into Tests
          </h2>
        </div>

        {/* 4 Interactive Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Ingestion & Parsing',
              desc: 'Upload notes or select a standardized role. PyPDF2 cleans and tokenizes raw document structure.',
              icon: <FiFileText className="text-orange-500 text-xl" />,
              badge: 'FastAPI Service',
            },
            {
              step: '02',
              title: 'Neural MCQ Synthesis',
              desc: 'Our AI analyzes key concepts, distractor options, and formats questions strictly per exam patterns.',
              icon: <FiZap className="text-amber-500 text-xl" />,
              badge: 'Our AI',
            },
            {
              step: '03',
              title: 'Timed Simulation',
              desc: 'Interactive test engine with per-question timers, review flags, and a distraction-free layout.',
              icon: <FiClock className="text-rose-500 text-xl" />,
              badge: 'Client Engine',
            },
            {
              step: '04',
              title: 'Diagnostic Scorecard',
              desc: 'Item-level audits, accuracy distributions, and topic weakness identification saved to your history.',
              icon: <FiBarChart2 className="text-indigo-500 text-xl" />,
              badge: 'Recharts Analytics',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-orange-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-slate-200 group-hover:text-orange-500 transition duration-200">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Architecture Diagram Teaser */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-sm flex-shrink-0">
              <FiLayers />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Full GetTest AI End-to-End Workflow Diagram</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect how authentication, PyPDF2 processing, LLM synthesis, and React analytics work together.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDiagramModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer flex-shrink-0"
          >
            View Architecture Diagram
          </button>
        </div>
      </section>

      {/* Mode Explorer: PDF Mode vs Sectional Mode */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Two Flexible Ways to Prepare
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Whether you have custom lecture notes or are targeting a national competitive exam.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 border border-slate-300/50">
            <button
              type="button"
              onClick={() => setActiveModeTab('pdf')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeModeTab === 'pdf'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiFileText />
              <span>Upload PDF Notes</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModeTab('role')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeModeTab === 'role'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FiTarget />
              <span>Sectional Exam Roles</span>
            </button>
          </div>
        </div>

        {/* Mode Display Content */}
        {activeModeTab === 'pdf' ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider">
                MODE 01. CUSTOM MATERIAL
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Turn Lecture PDFs & Notes into Tests
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Got university lecture slides, coaching summaries, or a dense book chapter? Simply upload the PDF, choose how many questions and minutes you want, and our AI formulates tests directly from your material.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" /> Fast text extraction up to 5 MB per file
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" /> Focuses on definitions, formulas, and conceptual logic
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" /> No redundant filler questions — 100% derived from your text
                </li>
              </ul>
              <Link
                to="/main"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-xs hover:shadow transition"
              >
                <span>Upload PDF & Practice</span>
                <FiArrowRight />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-center items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 text-2xl shadow-xs">
                <FiFileText />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Supported Formats: PDF Notes & Slides</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Standard PDF documents containing text from lectures, coaching notes, or question banks.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
                MODE 02. SECTIONAL DOMAINS
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Standardized Exam Drills & Sections
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Targeting major competitive examinations? Pick your exam role and target subject to practice standard exam patterns with time limits calibrated to real tests.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block">Bank PO & Clerk</span>
                  <span className="text-slate-500 text-[11px]">SBI, IBPS, RRB Patterns</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 block">SSC CGL & CHSL</span>
                  <span className="text-slate-500 text-[11px]">Reasoning & Quantitative</span>
                </div>
              </div>
              <Link
                to="/main"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-xs hover:shadow transition"
              >
                <span>Select Exam & Start</span>
                <FiArrowRight />
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400">Available Sections</h4>
              <div className="space-y-2">
                {[
                  { name: 'Logical Reasoning', tag: 'Syllogisms, Puzzles, Coding' },
                  { name: 'Quantitative Aptitude', tag: 'Arithmetic, Algebra, DI' },
                  { name: 'English Language', tag: 'Comprehension, Grammar' },
                  { name: 'General Awareness', tag: 'Current Affairs & Static GK' },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 rounded-lg bg-white border border-slate-200/60 text-xs">
                    <span className="font-semibold text-slate-700">{s.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{s.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Comparison: Traditional vs GetTest AI */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Why Learners Choose GetTest AI
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            See the difference between conventional static mock tests and intelligent AI synthesis.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 p-4 sm:p-6 bg-slate-50 border-b border-slate-200 text-xs font-mono uppercase tracking-wider font-bold">
            <span className="text-slate-500">Traditional Test Banks</span>
            <span className="text-orange-600">GetTest AI Platform</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {[
              {
                bad: 'Fixed, outdated question sets copied repeatedly across websites',
                good: 'Dynamic generation tailored specifically to your notes & updated patterns',
              },
              {
                bad: 'Rigid tests with fixed question lengths and rigid timers',
                good: 'Custom presets: choose 5 to 30 questions and 5 to 60 minutes',
              },
              {
                bad: 'Only reveals answer key without explaining underlying logic',
                good: 'Instant AI rationale explaining why the correct choice was right',
              },
              {
                bad: 'Requires searching dozens of question banks for one topic',
                good: 'Single click ingestion from your own PDF summaries',
              },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-2 p-4 sm:p-5 items-center gap-4">
                <div className="flex items-start gap-2 text-slate-500">
                  <FiXCircle className="text-rose-400 text-base flex-shrink-0 mt-0.5" />
                  <span>{row.bad}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-800 font-medium">
                  <FiCheckCircle className="text-emerald-500 text-base flex-shrink-0 mt-0.5" />
                  <span>{row.good}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold px-3 py-1 rounded-full bg-indigo-50 inline-block mb-3">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Got Questions? We’ve Got Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50/70 transition"
                >
                  <span className="font-semibold text-sm sm:text-base text-slate-800">
                    {faq.q}
                  </span>
                  <FiChevronDown
                    className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High-Impact Bottom Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white p-8 sm:p-12 shadow-xl overflow-hidden text-center">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Exam Preparation?
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Join thousands of aspirants preparing smarter with instant AI-powered mock tests and diagnostic accuracy tracking.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/main"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm shadow-md hover:shadow-lg transition duration-200"
              >
                Start Your First Test Free
              </Link>
              <Link
                to="/pricing"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-orange-600/30 hover:bg-orange-600/40 border border-white/30 text-white font-semibold text-sm transition"
              >
                View Plans & Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Diagram Lightbox Modal */}
      {showDiagramModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                GetTest AI — End-to-End System Architecture
              </h3>
              <button
                type="button"
                onClick={() => setShowDiagramModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 text-sm font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="my-4 flex justify-center">
              <img
                src="/workflow-diagram.png"
                alt="GetTest AI Workflow Diagram"
                className="rounded-2xl max-h-[60vh] w-auto object-contain border border-slate-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
