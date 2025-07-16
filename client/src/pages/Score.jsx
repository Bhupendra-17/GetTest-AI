import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Footer from '../components/Footer';
const Score = () => {
  const location = useLocation();
  const { questions, answers, timeTaken } = location.state || {};

  const correctAnswers = questions.filter((q, idx) => {
    const ans = q.answer || q.options[0]; // fallback
    return answers[idx] === ans;
  }).length;

  const data = [
    { name: 'Correct', value: correctAnswers },
    { name: 'Incorrect', value: questions.length - correctAnswers },
  ];

  return (
    <div className="bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] z-0" >
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Your Scorecard</h2>
        <div className="flex justify-center mb-6">
          <BarChart width={300} height={200} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex justify-between items-center w-full bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm">
            <span className="font-medium text-gray-700">Total Score</span>
            <span className="font-bold text-blue-600">
              {correctAnswers} / {questions.length}
            </span>
          </div>
          <div className="flex justify-between items-center w-full bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow-sm">
            <span className="font-medium text-gray-700">Time Taken</span>
            <span className="font-bold text-green-600">{timeTaken} seconds</span>
          </div>
        </div>

        <div className="space-y-6 mt-6">
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
                    className={`px-3 py-1 rounded ${isCorrect
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
      <Footer />
    </div >
  );
};

export default Score;
