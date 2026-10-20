import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiFileText, FiCheck, FiX, FiCpu, FiBookOpen } from "react-icons/fi";

const ROLES = [
  { id: "Bank Clerk", label: "Bank Clerk", tag: "CLK" },
  { id: "Bank PO", label: "Bank PO", tag: "PO" },
  { id: "SSC CGL", label: "SSC CGL", tag: "CGL" },
  { id: "Railway", label: "Railway RRB", tag: "RRB" },
];

const SUBJECTS = [
  { id: "Logical Reasoning", label: "Logical Reasoning", code: "REAS" },
  { id: "Quantitative Aptitude", label: "Quantitative Aptitude", code: "QUANT" },
  { id: "General Knowledge", label: "General Knowledge", code: "GK" },
  { id: "English", label: "English Language", code: "ENG" },
  { id: "Current Affairs", label: "Current Affairs", code: "CA" },
];

const QUESTION_PRESETS = [5, 10, 15, 20, 25, 30];
const TIME_PRESETS = [5, 10, 15, 20, 30, 45, 60];

export default function TestCreationSteps({
  mode,
  setMode,
  file,
  setFile,
  handleFileUpload,
  numQuestions,
  setNumQuestions,
  role,
  setRole,
  subject,
  setSubject,
  timeLimit,
  setTimeLimit,
  loading,
  onGenerate,
  error,
}) {
  const fileInputRef = useRef(null);

  const isFormValid =
    mode === "pdf"
      ? !!file && !!numQuestions && !!timeLimit
      : !!role && !!subject && !!numQuestions && !!timeLimit;

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-lg text-slate-800">
      {/* Mode Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-8 max-w-sm mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setMode("pdf")}
          className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
            mode === "pdf"
              ? "bg-white text-slate-900 shadow-sm font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FiCpu className="text-orange-500" />
          <span>From PDF</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("role")}
          className={`flex-1 py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
            mode === "role"
              ? "bg-white text-slate-900 shadow-sm font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FiBookOpen className="text-indigo-500" />
          <span>Sectional Exam</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "pdf" ? (
          <motion.div
            key="pdf-panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
              <span className="font-bold text-slate-700">01 // SELECT STUDY MATERIAL</span>
              <span>MAX ALLOWED: 5 MB</span>
            </div>

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/60 hover:bg-orange-50/20 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition duration-200">
                  <FiUploadCloud className="text-2xl" />
                </div>
                <p className="font-bold text-slate-800 text-sm sm:text-base">
                  Click or drag your PDF lecture notes or textbook here
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Mistral AI will extract key concepts and formulate balanced MCQs
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-orange-50/50 border border-orange-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                    <FiFileText className="text-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 truncate max-w-xs sm:max-w-md">
                        {file.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        READY
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 text-slate-600 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <FiX />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="role-panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                <span className="font-bold text-slate-700">01 // TARGET EXAMINATION</span>
                <span className="text-orange-600 font-bold">CHOOSE 1</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ROLES.map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        isSelected
                          ? "bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        {r.tag}
                      </span>
                      <span className="font-bold text-xs sm:text-sm mt-3">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                <span className="font-bold text-slate-700">02 // SUBJECT DOMAIN</span>
                <span className="text-orange-600 font-bold">CHOOSE 1</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {SUBJECTS.map((s) => {
                  const isSelected = subject === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSubject(s.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      <span className="font-mono text-[9px] block text-slate-400 uppercase font-bold tracking-wider">
                        {s.code}
                      </span>
                      <span className="font-semibold text-xs truncate block mt-1">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Parameters */}
      <div className="mt-8 pt-6 border-t border-slate-100 grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold text-slate-700">NUMBER OF QUESTIONS</span>
            <span className="font-mono font-bold text-orange-600">{numQuestions || "—"} ITEMS</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {QUESTION_PRESETS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setNumQuestions(q)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  Number(numQuestions) === q
                    ? "bg-orange-500 text-white shadow-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 text-xs">
            <span className="font-bold text-slate-700">TIME LIMIT</span>
            <span className="font-mono font-bold text-orange-600">{timeLimit || "—"} MIN</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {TIME_PRESETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeLimit(t)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  Number(timeLimit) === t
                    ? "bg-orange-500 text-white shadow-xs"
                    : "bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {t}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 font-mono">
          <span className="text-slate-400 font-bold">// CONFIG: </span>
          {mode === "pdf"
            ? file
              ? `${file.name.slice(0, 20)}... | ${numQuestions || "?"}Q | ${timeLimit || "?"}M`
              : "SELECT A PDF TO INITIATE"
            : role && subject
            ? `${role} | ${subject} | ${numQuestions || "?"}Q | ${timeLimit || "?"}M`
            : "SELECT ROLE & SUBJECT"}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!isFormValid || loading}
          className={`w-full sm:w-auto px-8 py-3 rounded-full text-xs uppercase tracking-wider font-bold transition duration-200 flex items-center justify-center gap-2 ${
            isFormValid && !loading
              ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg cursor-pointer"
              : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>SYNTHESIZING QUESTIONS...</span>
            </>
          ) : (
            <span>INITIALIZE MOCK TEST</span>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
          ERROR: {error}
        </div>
      )}
    </div>
  );
}
