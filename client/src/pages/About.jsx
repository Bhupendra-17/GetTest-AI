import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiSmile, FiClock, FiTarget, FiBookOpen, FiZap, FiCpu, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-orange-100/40 via-amber-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-600 font-bold px-3 py-1 rounded-full bg-orange-100/70 inline-block mb-3">
            ABOUT GETTEST AI
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Empowering Aspirants with <br />
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Adaptive Intelligence
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From late-night study sessions to high-stakes competitive examinations, we’re on a mission to make test preparation adaptive, personalized, and stress-free.
          </p>
        </div>

        {/* Story Section */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs mb-12">
          <div className="max-w-3xl mx-auto space-y-5 text-slate-600 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
              Born from Struggle, Built for Learners
            </h2>
            <p>
              Remember those exhausting nights before exams? Flipping through hundreds of textbook pages, endless PDFs, and wondering: <em className="text-slate-800">"Where do I even start testing myself?"</em> We’ve been there.
            </p>
            <p>
              Most students waste hours searching for relevant practice questions online — only to discover outdated question banks that don’t align with their actual syllabus, difficulty level, or time constraints.
            </p>
            <p>
              That inspired <strong className="text-orange-600">GetTest AI</strong>: a platform where any learner can upload their study notes or choose their target competitive examination to instantly generate tailored, timed mock tests with comprehensive item-level explanations.
            </p>
          </div>
        </section>

        {/* Pillars / Values Grid */}
        <section className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <FiBookOpen className="text-orange-500 text-2xl" />,
              title: "Our Mission",
              desc: "Democratize high-quality assessment technology by turning any learning material into active recall tests.",
            },
            {
              icon: <FiTarget className="text-amber-500 text-2xl" />,
              title: "Our Vision",
              desc: "Help millions of students bridge the gap between passive reading and active exam mastery.",
            },
            {
              icon: <FiClock className="text-indigo-500 text-2xl" />,
              title: "Our Promise",
              desc: "No repetitive, irrelevant questions. Strictly context-aware questions calibrated to your chosen parameters.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition"
            >
              <div className="p-3 w-fit rounded-xl bg-slate-50 border border-slate-100 mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Technical Architecture Overview */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
              <FiCpu className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">The Technology Behind GetTest AI</h3>
              <p className="text-xs text-slate-500">Fast, resilient microservices architecture</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="font-bold text-slate-900 block">FastAPI Backend</span>
              <p className="text-slate-500 text-xs">
                High-performance Python asynchronous server managing PDF parsing with PyPDF2 and session states.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="font-bold text-slate-900 block">Our AI Ingestion</span>
              <p className="text-slate-500 text-xs">
                Advanced language model extracting key terms, distractors, and valid answer rationales.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="font-bold text-slate-900 block">Interactive Test Engine</span>
              <p className="text-slate-500 text-xs">
                Per-question timing tracking, review bookmarking, and instant countdown timers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="font-bold text-slate-900 block">Diagnostic Scorecards</span>
              <p className="text-slate-500 text-xs">
                Recharts visual breakdown of accuracy distributions, unattempted questions, and historic scores.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-10 text-white text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Start Practicing in Seconds</h3>
          <p className="text-white/90 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Test yourself on your own notes or practice standardized bank and competitive exam questions.
          </p>
          <Link
            to="/main"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-orange-600 font-bold text-xs uppercase tracking-wider hover:bg-orange-50 transition shadow-sm"
          >
            <span>Create Free Test</span>
            <FiZap />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
