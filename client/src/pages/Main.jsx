import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiSettings, FiBriefcase, FiHash, FiPlayCircle, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
const Main = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [subject, setSubject] = useState('');
  const [mode, setMode] = useState('pdf'); // 'pdf' or 'role'
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
  };
  const handleGenerateFromRole = async () => {
    if (!role || !subject || !numQuestions) {
      alert('Please select role, subject and question count.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/generate_sectional/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, subject, num_questions: parseInt(numQuestions) }),
      });

      const data = await response.json();
      // Log the structured questions
      console.log('Generated Questions:', data.questions.map((q, index) => ({
        qNo: index + 1,
        question: q.text,
        options: q.options,
        correctAnswer: q.answer ?? q.options[0], // fallback to first option
      })));
      navigate('/test', { state: { questions: data.questions } });
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating sectional test.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTest = async () => {
    if (!file || !numQuestions) {
      alert('Please provide all inputs.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('num_questions', numQuestions);
    formData.append('role', role);
    formData.append('subject', subject);

    try {
      const response = await fetch(`${backendUrl}/generate-test/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      // Log the structured questions
      console.log('Generated Questions:', data.questions.map((q, index) => ({
        qNo: index + 1,
        question: q.text,
        options: q.options,
        correctAnswer: q.answer ?? q.options[0], // fallback to first option
      })));
      navigate('/test', { state: { questions: data.questions } });
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] z-0" />
      <div className="relative z-10 text-white">
        <div className="flex">
          <Navbar />
        </div>

        <div className="flex-grow p-8 md:px-10">
          <div className="mb-6 text-center">
            <button
              className={`hover:cursor-pointer px-4 py-2 rounded-l-lg ${mode === 'pdf' ? 'bg-orange-600 text-white' : 'bg-white text-orange-600'
                } border border-orange-400`}
              onClick={() => setMode('pdf')}
            >
              Generate from PDF
            </button>
            <button
              className={`hover:cursor-pointer px-4 py-2 rounded-r-lg ${mode === 'role' ? 'bg-orange-600 text-white' : 'bg-white text-orange-600'
                } border border-orange-400`}
              onClick={() => setMode('role')}
            >
              Generate from Role & Subject
            </button>
          </div>
          
          <div className="bg-gradient-to-l from-cyan-300 to-red-200 shadow-2xl rounded-3xl p-10 max-w-7xl mx-auto backdrop-blur-sm bg-opacity-80">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Create Your Test in 3 Simple Steps</h2>

            {mode === 'pdf' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PDF Upload Step */}
                <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                  <FiUploadCloud size={50} className="text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Upload PDF</h3>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="border p-2 rounded-lg w-3/4 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm mb-4"
                  />
                </div>

                {/* Question Count */}
                <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                  <FiSettings size={50} className="text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Set Question Count</h3>
                  <input
                    type="number"
                    placeholder="Number of Questions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="border p-2 rounded-lg text-center text-black w-3/4 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                  />
                </div>

                {/* Generate Button */}
                <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                  <FiCheckCircle size={50} className="text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Generate Test</h3>
                  <p className="text-gray-600 mb-4 text-sm">Click to generate from uploaded PDF</p>
                  <button
                    onClick={handleGenerateTest}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                  >
                    {loading ? 'Generating...' : 'Generate PDF Test'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Role & Subject Selection */}
                <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                  <FiBriefcase size={50} className="text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Select Role</h3>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border p-2 rounded-lg text-black w-3/4 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm mb-4"
                  >
                    <option value="">-- Choose Role --</option>
                    <option value="Bank Clerk">Bank Clerk</option>
                    <option value="Bank PO">Bank PO</option>
                    <option value="UPSC">UPSC</option>
                    <option value="SSC CGL">SSC CGL</option>
                  </select>

                  <FiBookOpen size={40} className="text-orange-500 mb-4 mt-2" />
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Select Subject</h3>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="border p-2 rounded-lg text-black w-3/4 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                  >
                    <option value="">-- Choose Subject --</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                    <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                {/* Question Count */}
                <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                  <FiSettings size={50} className="text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Set Question Count</h3>
                  <input
                    type="number"
                    placeholder="Number of Questions"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="border p-2 rounded-lg text-center text-black w-3/4 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                  />
                </div>

                {/* Generate Button */}
                <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                  <FiCheckCircle size={50} className="text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Generate Test</h3>
                  <p className="text-gray-600 mb-4 text-sm">Click to generate based on role and subject</p>
                  <button
                    onClick={handleGenerateFromRole}
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                  >
                    {loading ? 'Generating...' : 'Generate Sectional Test'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default Main;
