import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TestCreationSteps from "../components/TestCreationSteps";
import { FiCpu, FiBookOpen, FiUserCheck } from "react-icons/fi";

const Main = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState("pdf");
  const [step, setStep] = useState(1);
  const [timeLimit, setTimeLimit] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const sizeMB = uploadedFile.size / (1024 * 1024); // convert to MB

    if (sizeMB > 5) {
      alert(`File too large (${sizeMB.toFixed(2)} MB). Max allowed is 5 MB.`);
      e.target.value = ""; // reset file input
      setFile(null);
      return;
    }
    setFile(uploadedFile);
  };

  const handleGenerateFromRole = async () => {
    if (!role || !subject || !numQuestions || !timeLimit) {
      alert("Please select role, subject and question count.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/generate_sectional/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          subject,
          num_questions: parseInt(numQuestions),
        }),
      });
      const data = await res.json();
      navigate("/test", { state: { questions: data.questions, timeLimit: Number(timeLimit) } });
    } catch (err) {
      console.error(err);
      alert("Error generating test.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateTest = async () => {
    if (!file || !numQuestions || !timeLimit) {
      alert("Please provide all inputs ");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_questions", numQuestions);
    try {
      const res = await fetch(`${backendUrl}/generate_test/`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      navigate("/test", { state: { questions: data.questions } });
    } catch (err) {
      console.error(err);
      alert("Error generating test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] bg-[length:400%_400%]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      />

      <div className="relative z-10 text-white flex flex-col min-h-screen">
        <Navbar />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16 mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Create Your AI-Powered Mock Tests
          </h1>
          <p className="text-lg md:text-xl text-white/80 mt-3">
            Choose your mode below and start preparing smarter, faster, and better.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden flex border border-white/30">
            <button
              onClick={() => setMode("pdf")}
              className={`px-6 py-3 flex items-center gap-2 text-lg font-semibold transition-all duration-300 ${mode === "pdf"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "text-white/80 hover:text-white"
                }`}
            >
              <FiCpu /> From PDF
            </button>
            <button
              onClick={() => setMode("role")}
              className={`px-6 py-3 flex items-center gap-2 text-lg font-semibold transition-all duration-300 ${mode === "role"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "text-white/80 hover:text-white"
                }`}
            >
              <FiBookOpen /> Sectional
            </button>
          </div>
        </motion.div>

        {/* Test Creation Steps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-grow px-6 md:px-10 pb-16"
        >
          <TestCreationSteps
            mode={mode}
            file={file}
            numQuestions={numQuestions}
            role={role}
            subject={subject}
            loading={loading}
            handleFileUpload={handleFileUpload}
            handleGenerateTest={handleGenerateTest}
            handleGenerateFromRole={handleGenerateFromRole}
            setNumQuestions={setNumQuestions}
            setRole={setRole}
            setSubject={setSubject}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
          />
        </motion.div>

        {/* Motivation Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white text-gray-800 rounded-2xl shadow-xl max-w-5xl mx-auto mb-12 p-10 text-center"
        >
          <h2 className="text-3xl font-semibold mb-6">
            Master Every Topic with <span className="text-orange-500">AI Precision</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Whether you’re preparing for government exams, interviews, or skill assessments,
            GetTest AI adapts to your needs and makes preparation effortless and effective.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FiUserCheck size={40} className="text-orange-500" />,
                title: "Smart Personalization",
                desc: "Your test evolves with your performance — focusing on weak areas automatically.",
              },
              {
                icon: <FiCpu size={40} className="text-orange-500" />,
                title: "Instant Generation",
                desc: "Upload, choose, and get your tailored test ready within seconds.",
              },
              {
                icon: <FiBookOpen size={40} className="text-orange-500" />,
                title: "Adaptive Difficulty",
                desc: "Questions dynamically adjust in complexity for the best learning curve.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-gradient-to-r from-yellow-50 to-orange-100 border-l-4 border-orange-400 rounded-2xl shadow-md hover:shadow-2xl transition"
              >
                <div className="mb-3 flex justify-center">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Footer />
      </div>
    </div>
  );
};

export default Main;
