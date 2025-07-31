import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#9ca3af']; // Green, Red, Gray

const Score = () => {
  const location = useLocation();
  const { questions = [], answers = [], timeTaken = 0 } = location.state || {};
  const userId = localStorage.getItem("userId");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const correctAnswers = questions.filter((q, idx) => {
    const selected = (answers[idx] || "").toString().trim();
    const selectedLetter = selected.slice(0, 1);
    return selectedLetter === q.answer;
  }).length;

  const notAttempted = questions.filter((_, idx) => {
    const selected = (answers[idx] || "").toString().trim();
    return selected === "";
  }).length;

  const incorrectAnswers = questions.length - correctAnswers - notAttempted;

  const data = [
    { name: 'Correct', value: correctAnswers },
    { name: 'Incorrect', value: incorrectAnswers },
    { name: 'Not Answered', value: notAttempted },
  ];

  useEffect(() => {
    if (!questions.length || !userId) return;

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
      questions: formattedQuestions
    };

    axios.post(`${backendUrl}/submit-test`, payload)
      .then(res => console.log("Saved:", res.data))
      .catch(err => console.error("Error saving result:", err));
  }, [questions, answers, timeTaken, userId, correctAnswers]);

  return (
    <div className="w-full bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] z-0 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-xl mt-6">
        <h2 className="text-2xl font-bold text-center mb-4">Your Scorecard</h2>

        {/* Chart */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md">
            <h3 className="text-lg font-semibold text-center mb-4">Performance Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      return (
                        <div className="bg-white border border-gray-300 rounded-md shadow-md p-3 text-sm font-medium text-gray-800">
                          <p>{item.name}: {item.value} questions</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between gap-4">
          <div className="flex justify-between items-center w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
            <span className="font-medium text-gray-700">Total Score</span>
            <span className="font-bold text-blue-600">{correctAnswers} / {questions.length}</span>
          </div>
          <div className="flex justify-between items-center w-full bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-sm">
            <span className="font-medium text-gray-700">Time Taken</span>
            <span className="font-bold text-green-600">{timeTaken} seconds</span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mt-6">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="font-medium mb-2">
                <strong>Q{idx + 1}:</strong> {q.text}
              </p>
              {q.options.map((opt, i) => {
                const selected = (answers[idx] || "").toString().trim();
                const selectedLetter = selected.slice(0, 1);
                const optionLetter = opt.trim().slice(0, 1);

                const isCorrect = optionLetter === q.answer;
                const isSelected = selectedLetter === optionLetter;

                return (
                  <p
                    key={i}
                    className={`px-3 py-1 rounded ${
                      isCorrect
                        ? 'bg-green-200'
                        : isSelected
                        ? 'bg-red-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    {opt}
                  </p>
                );
              })}
              <p className="mt-2 text-sm text-gray-600">
                Correct Answer: <strong>{q.answer}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Score;
