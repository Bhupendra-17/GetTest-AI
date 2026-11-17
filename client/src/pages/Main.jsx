import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TestCreationSteps from "../components/TestCreationSteps";
import { FiCpu, FiBookOpen, FiUserCheck, FiTarget, FiZap } from "react-icons/fi";

const Main = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState("10");
  const [timeLimit, setTimeLimit] = useState("15");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("Bank PO");
  const [subject, setSubject] = useState("Logical Reasoning");
  const [mode, setMode] = useState("pdf");
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const sizeMB = uploadedFile.size / (1024 * 1024);
    if (sizeMB > 5) {
      alert(`File too large (${sizeMB.toFixed(2)} MB). Max allowed is 5 MB.`);
      e.target.value = "";
      setFile(null);
      return;
    }
    setError("");
    setFile(uploadedFile);
  };

  const handleGenerateFromRole = async () => {
    if (!role || !subject || !numQuestions || !timeLimit) {
      alert("Please select role, subject, question count, and duration.");
      return;
    }
    setLoading(true);
    setError("");
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

      if (!res.ok) {
        throw new Error(`Failed to generate sectional test (${res.status})`);
      }

      const data = await res.json();
      navigate("/test", {
        state: {
          questions: data.questions,
          timeLimit: Number(timeLimit),
        },
      });
    } catch (err) {
      console.error(err);
      setError("Unable to generate sectional test. Please verify server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTest = async () => {
    if (!file || !numQuestions || !timeLimit) {
      alert("Please upload a PDF file and set question count & time limit.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_questions", numQuestions);

    try {
      const res = await fetch(`${backendUrl}/generate_test/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to generate test from PDF (${res.status})`);
      }

      const data = await res.json();
      navigate("/test", {
        state: {
          questions: data.questions,
          timeLimit: Number(timeLimit),
        },
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate test from PDF. Please check file format and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (mode === "pdf") {
      handleGenerateTest();
    } else {
      handleGenerateFromRole();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Background soft aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-b from-orange-100/40 via-amber-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Full-screen generation loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-5 text-center max-w-xs">
            {/* Animated spinner ring */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
              <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-amber-400 border-b-transparent animate-spin" style={{ animationDuration: "0.6s", animationDirection: "reverse" }} />
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-900 tracking-tight">Synthesizing Questions</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">AI is crafting your mock test&hellip;</p>
            </div>
            {/* Animated dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 text-orange-800 text-xs font-semibold mb-3">
            <FiZap /> Mock Test Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Create Your Custom AI Mock Test
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Configure your parameters below to generate a tailored examination session in seconds.
          </p>
        </div>

        {/* Test Creation Step Component */}
        <TestCreationSteps
          mode={mode}
          setMode={setMode}
          file={file}
          setFile={setFile}
          handleFileUpload={handleFileUpload}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          role={role}
          setRole={setRole}
          subject={subject}
          setSubject={setSubject}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
          loading={loading}
          onGenerate={handleGenerate}
          error={error}
        />

        {/* Motivation / Value Grid */}
        <section className="mt-16 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Master Topics with <span className="text-orange-600">AI Precision</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
            Whether preparing for government examinations, placement interviews, or university assessments,
            GetTest AI adapts to your curriculum and sharpens conceptual retention.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                icon: <FiUserCheck className="text-orange-500 text-2xl" />,
                title: "Adaptive Questioning",
                desc: "Questions synthesize core principles and formulas directly from source texts.",
              },
              {
                icon: <FiCpu className="text-amber-500 text-2xl" />,
                title: "Fast AI Pipeline",
                desc: "High-throughput inference generates complete question papers in seconds.",
              },
              {
                icon: <FiTarget className="text-indigo-500 text-2xl" />,
                title: "Item Diagnostics",
                desc: "Analyze time distribution and accuracy per question after test completion.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-orange-200 transition"
              >
                <div className="p-3 w-fit rounded-xl bg-white border border-slate-200 mb-3 shadow-xs">
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-800 mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Main;
