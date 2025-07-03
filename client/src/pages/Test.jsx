import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions } = location.state || { questions: [] };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (index, option) => {
    setAnswers({ ...answers, [index]: option });
  };

  const handleSubmit = () => {
    navigate('/score', {
      state: {
        questions,
        answers
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white p-4 border-r">
        <h3 className="font-bold text-xl mb-4 text-center">Question Panel</h3>
        <div className="grid grid-cols-3 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-full px-3 py-2 text-sm ${
                answers[index] ? 'bg-green-500 text-white' : 'bg-gray-300'
              } ${currentIndex === index ? 'ring-2 ring-orange-400' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Q{currentIndex + 1}. {currentQuestion.text}
          </h2>
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className={`block w-full text-left px-4 py-2 rounded-lg border ${
                  answers[currentIndex] === option
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleOptionSelect(currentIndex, option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Previous
            </button>
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
                }
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;