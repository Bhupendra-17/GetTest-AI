import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUploadCloud,
  FiBriefcase,
  FiBookOpen,
  FiTrendingUp,
  FiUsers,
  FiCpu,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import WheelPicker from "./ScrollSelector"; // ✅ use default import

const roleOptions = [
  { value: "Bank Clerk", label: "Bank Clerk", icon: FiBriefcase },
  { value: "Bank PO", label: "Bank PO", icon: FiTrendingUp },
  { value: "SSC CGL", label: "SSC CGL", icon: FiUsers },
  { value: "Railway", label: "Railway", icon: FiCpu },
];

const subjectOptions = [
  { value: "Logical Reasoning", label: "Logical Reasoning", icon: FiBookOpen },
  { value: "Quantitative Aptitude", label: "Quantitative Aptitude", icon: FiTrendingUp },
  { value: "General Knowledge", label: "General Knowledge", icon: FiBookOpen },
  { value: "English", label: "English", icon: FiBookOpen },
  { value: "Current Affairs", label: "Current Affairs", icon: FiTrendingUp },
];

// Motion animation variants for left/right swipe transitions
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.4 },
  }),
};

export default function TestCreationSteps({
  mode,
  file,
  numQuestions,
  role,
  subject,
  loading,
  handleFileUpload,
  handleGenerateTest,
  handleGenerateFromRole,
  setNumQuestions,
  setRole,
  setSubject,
  timeLimit,
  setTimeLimit,
}) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // track swipe direction

  const totalSteps = mode === "pdf" ? 3 : 5;

  // Validation before allowing next step
  const canProceed = () => {
    if (mode === "pdf") {
      if (step === 1) return !!file;
      if (step === 2) return !!numQuestions;
      if (step === 3) return !!timeLimit;
    } else {
      if (step === 1) return !!role;
      if (step === 2) return !!subject;
      if (step === 3) return !!numQuestions;
      if (step === 4) return !!timeLimit;
    }
    return true;
  };

  const nextStep = () => {
    if (!canProceed()) return; // stop until selection made
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Step titles
  const renderStepTitle = () => {
    const titlesPdf = ["Upload PDF", "Set Questions", "Set Time & Generate"];
    const titlesRole = ["Select Role", "Select Subject", "Set Questions", "Set Time", "Review & Generate"];
    return mode === "pdf" ? titlesPdf[step - 1] : titlesRole[step - 1];
  };

  // Step content rendering
  const renderStepContent = () => {
    if (mode === "pdf") {
      switch (step) {
        case 1:
          return (
            <div className="flex flex-col items-center justify-center space-y-6 p-10 bg-white/70 rounded-2xl shadow-xl border-2 border-orange-300">
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-orange-400 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition"
              >
                <FiUploadCloud size={48} className="text-orange-500 mb-3" />
                <p className="text-lg font-semibold text-gray-700">Click to upload PDF</p>
                <p className="text-sm text-gray-500 mt-1">Supported format: PDF | Max size: 5 MB</p>
              </label>
              <input id="fileUpload" type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
              {file && <p className="text-green-600 font-semibold">Selected: {file.name}</p>}
            </div>
          );
        case 2:
          return (
            <div className="text-center">
              <WheelPicker value={numQuestions} onChange={setNumQuestions} min={5} max={30} step={5} unit=" questions" color="orange" height={240} />
            </div>
          );
        case 3:
          return (
            <div className="text-center bg-white/70 rounded-2xl p-8 shadow-lg border-2 border-orange-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Review & Generate Test</h3>
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-bold text-red-600">{numQuestions}</span> questions from your uploaded PDF.
              </p>
              <WheelPicker value={timeLimit} onChange={setTimeLimit} min={5} max={60} step={5} unit=" min" color="red" height={200} />
              <motion.button
                onClick={handleGenerateTest}
                disabled={loading || !file || !numQuestions || !timeLimit}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                className={`mt-6 px-12 py-4 rounded-full text-white font-bold flex items-center gap-3 mx-auto bg-gradient-to-r from-orange-500 to-red-500 shadow-xl ${
                  loading || !file || !numQuestions || !timeLimit ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl"
                }`}
              >
                {loading ? "Generating..." : <> <FiCheckCircle size={22} /> Generate Test </>}
              </motion.button>
            </div>
          );
      }
    } else {
      switch (step) {
        case 1:
          return (
            <div className="grid gap-4 text-gray-800">
              {roleOptions.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 1.03 }}
                  onClick={() => setRole(opt.value)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 shadow-md text-lg font-semibold ${
                    role === opt.value
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent"
                      : "bg-white/70 border-orange-300 hover:border-orange-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <opt.icon size={22} />
                    {opt.label}
                  </div>
                  {role === opt.value && <FiCheckCircle />}
                </motion.button>
              ))}
            </div>
          );
        case 2:
          return (
            <div className="grid gap-4 text-gray-800">
              {subjectOptions.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 1.03 }}
                  onClick={() => setSubject(opt.value)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 shadow-md text-lg font-semibold ${
                    subject === opt.value
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent"
                      : "bg-white/70 border-orange-300 hover:border-orange-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <opt.icon size={22} />
                    {opt.label}
                  </div>
                  {subject === opt.value && <FiCheckCircle />}
                </motion.button>
              ))}
            </div>
          );
        case 3:
          return (
            <div className="text-center">
              <WheelPicker value={numQuestions} onChange={setNumQuestions} min={5} max={25} step={5} unit=" questions" color="orange" height={240} />
            </div>
          );
        case 4:
          return (
            <div className="text-center">
              <WheelPicker value={timeLimit} onChange={setTimeLimit} min={5} max={60} step={5} unit=" min" color="red" height={240} />
            </div>
          );
        case 5:
          return (
            <div className="text-center bg-white/70 rounded-2xl p-8 shadow-lg border-2 border-orange-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Review Your Test</h3>
              <div className="bg-gradient-to-r from-orange-100 to-red-100 px-8 py-4 rounded-xl mb-6">
                <p className="text-lg text-gray-700">
                  <span className="font-bold text-orange-600">{role}</span> • <span className="font-bold text-orange-600">{subject}</span>
                </p>
                <p className="text-lg text-gray-700 mt-2">
                  <span className="font-bold text-red-600">{numQuestions}</span> questions in{" "}
                  <span className="font-bold text-red-600">{timeLimit}</span> minutes
                </p>
              </div>
              <motion.button
                onClick={handleGenerateFromRole}
                disabled={loading || !role || !subject || !numQuestions || !timeLimit}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                className={`bg-gradient-to-r px-12 py-4 rounded-full from-orange-500 to-red-500 text-white font-bold flex items-center gap-3 mx-auto ${
                  loading || !role || !subject || !numQuestions || !timeLimit ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl"
                }`}
              >
                {loading ? "Generating..." : <> <FiCheckCircle size={22} /> Generate Test </>}
              </motion.button>
            </div>
          );
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-l from-cyan-300 to-red-200 shadow-2xl rounded-3xl p-10 max-w-3xl mx-auto backdrop-blur-sm bg-opacity-80"
    >
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">{renderStepTitle()}</h2>

      {/* Animated card transition */}
      <div className="relative min-h-[300px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            variants={slideVariants}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full px-5"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <motion.button
            onClick={prevStep}
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-2 bg-white text-orange-600 border-2 border-orange-400 px-6 py-3 rounded-full font-semibold shadow hover:bg-orange-50"
          >
            <FiArrowLeft /> Back
          </motion.button>
        ) : (
          <div></div>
        )}
        {step < totalSteps && (
          <motion.button
            onClick={nextStep}
            whileHover={{ scale: canProceed() ? 1.05 : 1 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-lg ${
              canProceed()
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next <FiArrowRight />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
