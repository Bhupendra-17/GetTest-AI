import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions = [] } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour
  const [questionTimers, setQuestionTimers] = useState(() => questions.map(() => 0));

  const currentQuestion = questions[currentIndex];

  // Total test timer and current question timer update
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });

      setQuestionTimers(prev => {
        const updated = [...prev];
        updated[currentIndex] += 1;
        return updated;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const handleOptionSelect = (index, option) => {
    setAnswers({ ...answers, [index]: option });
  };

  const handleClearSelection = () => {
    const updated = { ...answers };
    delete updated[currentIndex];
    setAnswers(updated);
  };

  const handleMarkForReview = (index) => {
    setMarkedForReview({ ...markedForReview, [index]: !markedForReview[index] });
  };

  const handleSubmit = () => {
    navigate('/score', {
      state: {
        questions,
        answers,
        timeTaken: 3600 - timeLeft,
        questionTimers, // individual question time taken
      },
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getStatusCount = () => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;

    questions.forEach((_, index) => {
      if (answers[index]) {
        answered++;
      } else if (markedForReview[index]) {
        marked++;
      } else {
        notAnswered++;
      }
    });

    return {
      answered,
      notAnswered,
      marked,
      total: questions.length,
    };
  };

  const { answered, notAnswered, marked, total } = getStatusCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-yellow-100 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800">Mock Test</h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-gray-700">
            Time Left: {formatTime(timeLeft)}
          </span>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Question Section */}
        <div className="flex-1 p-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">
                Q{currentIndex + 1}. {currentQuestion.text}
              </h2>
              <span className="text-sm font-semibold text-indigo-600">
                Time Taken: {formatTime(questionTimers[currentIndex] || 0)}
              </span>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`block w-full text-left px-4 py-2 rounded-lg border transition ${answers[currentIndex] === option
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  onClick={() => handleOptionSelect(currentIndex, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className='flex justify-between items-center'>

              {/* Clear Selection Button */}
              <button
                onClick={handleClearSelection}
                className="mt-4 bg-red-100 text-red-600 px-4 py-1 rounded hover:bg-red-200"
              >
                Clear Selection
              </button>
              <div className="mt-4 flex items-center gap-2">
                <input
                  className='h-5'
                  type="checkbox"
                  checked={markedForReview[currentIndex]}
                  onChange={() => handleMarkForReview(currentIndex)}
                ></input>
                <span className="text-lg">Mark for Review</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>

          </div>
        </div>

        {/* Side Panel */}
        <div className="w-1/4 bg-white border-l p-6 shadow-inner flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-4 text-center">Question Panel</h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full px-3 py-2 text-sm transition ${answers[index]
                      ? 'bg-green-500 text-white'
                      : markedForReview[index]
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-300 text-gray-800'
                    } ${currentIndex === index ? 'ring-2 ring-orange-400' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="space-y-4 text-sm">
              <h4 className="text-md font-semibold text-center text-gray-700">Summary</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
                  <span className="font-medium text-gray-700">Total Questions</span>
                  <span className="font-bold text-blue-600">{total}</span>
                </div>
                <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-sm">
                  <span className="font-medium text-gray-700">Answered</span>
                  <span className="font-bold text-green-600">{answered}</span>
                </div>
                <div className="flex justify-between items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 shadow-sm">
                  <span className="font-medium text-gray-700">Marked for Review</span>
                  <span className="font-bold text-yellow-600">{marked}</span>
                </div>
                <div className="flex justify-between items-center bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow-sm">
                  <span className="font-medium text-gray-700">Not Answered</span>
                  <span className="font-bold text-red-500">{notAnswered}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
