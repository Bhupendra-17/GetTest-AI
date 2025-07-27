import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const COLORS = ['#4ade80', '#f87171']; // Green for correct, Red for incorrect
import Footer from '../components/Footer';
const Score = () => {
  const location = useLocation();
  const { questions, answers, timeTaken } = location.state || {};

  const correctAnswers = questions.filter((q, idx) => {
    const selected = (answers[idx] || "").toString().trim();
    const selectedLetter = selected.slice(0, 1); // Extract "A" from "A) ..."
    return selectedLetter === q.answer;
  }).length;

  console.log(questions, answers);
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  align="center"
                  layout="horizontal"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
                const selected = (answers[idx] || "").toString().trim();
                const selectedLetter = selected.slice(0, 1);
                const currentOptionLetter = opt.trim().slice(0, 1);

                const isCorrect = currentOptionLetter === q.answer;
                const isSelected = selectedLetter === currentOptionLetter;

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
                Correct Answer: <strong>{q.answer}</strong>
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
