import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiSettings, FiCheckCircle } from 'react-icons/fi';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
const Main = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setFile(uploadedFile);
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

    try {
      const response = await fetch('http://localhost:8000/generate-test/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
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
          <div className="bg-gradient-to-l from-cyan-300 to-red-200 shadow-2xl rounded-3xl p-10 max-w-7xl mx-auto backdrop-blur-sm bg-opacity-80">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Create Your Test in 3 Simple Steps</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1: Upload */}
              <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                <FiUploadCloud size={50} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-orange-600 mb-2">Upload PDF</h3>
                <p className="text-gray-600 mb-4 text-sm">Upload the content you want to convert into questions.</p>
                <label className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-5 rounded-lg shadow-md cursor-pointer transition">
                  Choose File
                  <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" />
                </label>
                {file && <p className="text-green-600 font-semibold mt-2 text-sm">✅ {file.name}</p>}
              </div>

              {/* Step 2: Preferences */}
              <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                <FiSettings size={50} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-orange-600 mb-2">Set Preferences</h3>
                <p className="text-gray-600 mb-4 text-sm">Enter the number of questions you want to generate.</p>
                <input
                  type="number"
                  placeholder="Number of Questions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="border p-2 rounded-lg text-center text-black w-3/4 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                />
              </div>

              {/* Step 3: Generate */}
              <div className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 transition hover:shadow-2xl">
                <FiCheckCircle size={50} className="text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-orange-600 mb-2">Generate Test</h3>
                <p className="text-gray-600 mb-4 text-sm">Click the button to generate and start your test!</p>
                <button
                  onClick={handleGenerateTest}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
                >
                  {loading ? 'Generating...' : 'Generate Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default Main;
