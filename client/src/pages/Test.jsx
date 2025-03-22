import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Test = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { numQuestions = 5, timeLimit = 10 } = location.state || {};

  const questions = [
    { id: 1, text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4' },
    { id: 2, text: 'Which planet is known as the Red Planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 'Mars' },
    { id: 3, text: 'What is the capital of France?', options: ['London', 'Berlin', 'Madrid', 'Paris'], answer: 'Paris' },
    { id: 4, text: 'Who wrote "Hamlet"?', options: ['Shakespeare', 'Tolstoy', 'Hemingway', 'Austen'], answer: 'Shakespeare' },
    { id: 5, text: 'What is the square root of 64?', options: ['6', '7', '8', '9'], answer: '8' }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    alert('Test submitted!');
    navigate('/');
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Mock Test</h2>
        <p className='text-gray-600 mb-4'>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        <div className='p-4 bg-gray-50 rounded-lg shadow-md'>
          <h3 className='text-xl font-semibold mb-4'>{questions[currentQuestion].text}</h3>
          <div className='flex flex-col space-y-2'>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded-lg shadow ${selectedAnswers[currentQuestion] === option ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className='flex justify-between mt-6'>
          <button onClick={handlePrev} className='bg-gray-300 px-4 py-2 rounded-lg shadow' disabled={currentQuestion === 0}>Previous</button>
          {currentQuestion === questions.length - 1 ? (
            <button onClick={handleSubmit} className='bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600'>Submit</button>
          ) : (
            <button onClick={handleNext} className='bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600'>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test; 