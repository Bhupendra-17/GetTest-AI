import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiCheckCircle, FiXCircle, FiClock, FiAward, FiArrowRight } from "react-icons/fi";

const CHART_COLORS = ["#10b981", "#ef4444", "#cbd5e1"];

export default function Score() {
  const location = useLocation();
  const { questions = [], answers = {}, timeTaken = 0 } = location.state || {};
  const userId = localStorage.getItem("userId");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const hasSubmitted = useRef(false);

  const correctAnswers = questions.filter((q, idx) => {
    const selected = (answers[idx] || "").toString().trim().slice(0, 1);
    return selected === q.answer;
  }).length;

  const notAttempted = questions.filter((_, idx) => {
    const selected = (answers[idx] || "").toString().trim();
    return selected === "";
  }).length;

  const incorrectAnswers = questions.length - correctAnswers - notAttempted;
  const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

  const chartData = [
    { name: "Correct", value: correctAnswers },
    { name: "Incorrect", value: incorrectAnswers },
    { name: "Unanswered", value: notAttempted },
  ];

  useEffect(() => {
    if (hasSubmitted.current || !questions.length || !userId) return;
    hasSubmitted.current = true;

    const formattedQuestions = questions.map((q, idx) => ({
      text: q.text,
      options: q.options,
      answer: q.answer,
      userAnswer: (answers[idx] || "").toString().trim().slice(0, 1),
    }));

    const payload = {
      user_id: userId,
      title: "Mock Test",
      score: correctAnswers,
      total: questions.length,
      timeTaken,
      questions: formattedQuestions,
    };

    axios.post(`${backendUrl}/submit-test`, payload).catch((err) => {
      console.error("Error saving result:", err);
      hasSubmitted.current = false;
    });
  }, [questions, answers, correctAnswers, timeTaken, userId, backendUrl]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-orange-100/40 via-amber-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-100/70 inline-block mb-2">
                TEST EVALUATION REPORT
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Performance Scorecard
              </h1>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-1.5">
                <FiClock className="text-slate-400" />
                {Math.floor(timeTaken / 60)}M {timeTaken % 60}S
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-1.5">
                <FiAward className="text-emerald-500" />
                {accuracy}% ACCURACY
              </span>
            </div>
          </div>

          {/* Charts & Stats Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Visual Pie Chart */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-slate-500 mb-2">// DISTRIBUTION</span>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 text-xs font-medium text-slate-600 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Correct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Incorrect
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Skipped
                </span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600">FINAL SCORE:</span>
                <span className="text-slate-900 font-bold text-sm">
                  {correctAnswers} / {questions.length}
                </span>
              </div>
              <div className="flex justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="font-semibold">CORRECT ANSWERS:</span>
                <span className="font-bold">{correctAnswers}</span>
              </div>
              <div className="flex justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                <span className="font-semibold">INCORRECT:</span>
                <span className="font-bold">{incorrectAnswers}</span>
              </div>
              <div className="flex justify-between p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
                <span className="font-semibold">UNATTEMPTED:</span>
                <span className="font-bold">{notAttempted}</span>
              </div>
            </div>
          </div>

          {/* Item-by-Item Diagnostics */}
          <div className="pt-6 border-t border-slate-100">
            <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-wider block mb-4">
              // ITEM-BY-ITEM DIAGNOSTIC AUDIT
            </span>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const selected = (answers[idx] || "").toString().trim().slice(0, 1);
                const isCorrect = selected === q.answer;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition ${
                      isCorrect
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : selected
                        ? 'bg-rose-50/30 border-rose-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-slate-500 font-bold">ITEM {idx + 1}</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : selected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCorrect ? '✓ CORRECT' : selected ? '✗ INCORRECT' : '— SKIPPED'}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 mb-3">{q.text}</p>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, i) => {
                        const optLetter = opt.trim().slice(0, 1);
                        const isThisCorrect = optLetter === q.answer;
                        const isThisSelected = selected === optLetter;

                        let style = "bg-white border-slate-200 text-slate-600";
                        if (isThisCorrect) {
                          style = "bg-emerald-100/70 border-emerald-400 text-emerald-900 font-semibold";
                        } else if (isThisSelected) {
                          style = "bg-rose-100/70 border-rose-400 text-rose-900 font-semibold";
                        }

                        return (
                          <div key={i} className={`p-3 rounded-xl border text-xs ${style}`}>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Navigation */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              to="/main"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Launch Another Mock Test</span>
              <FiArrowRight />
            </Link>
            <Link
              to="/profile"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider transition text-center"
            >
              View Test History
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}