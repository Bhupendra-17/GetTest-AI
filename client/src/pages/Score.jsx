import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Score = () => {
  const location = useLocation();
  const { questions, answers } = location.state || {};

  const correctAnswers = questions.filter((q, idx) => {
    const ans = q.answer || q.options[0]; // fallback
    return answers[idx] === ans;
  }).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Your Scorecard</h2>
        <p className="text-center text-lg mb-6">
          You scored <span className="text-green-600 font-semibold">{correctAnswers}</span> out of{' '}
          {questions.length}
        </p>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow">
              <p className="font-medium mb-2">
                <strong>Q{idx + 1}:</strong> {q.text}
              </p>
              {q.options.map((opt, i) => {
                const isCorrect = opt === (q.answer || q.options[0]);
                const isSelected = answers[idx] === opt;
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
                Correct Answer: <strong>{q.answer || q.options[0]}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Score;
