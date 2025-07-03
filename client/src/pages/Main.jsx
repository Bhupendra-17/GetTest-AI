import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiSettings, FiCheckCircle } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Main = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleGenerateTest = async () => {
    if (!file) {
      alert('Please upload a PDF first.');
      return;
    }
    if (!numQuestions) {
      alert('Please enter the number of questions.');
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

      if (!response.ok) {
        throw new Error('Failed to generate test');
      }

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
    <div className='min-h-screen bg-gradient-to-br from-orange-100 to-yellow-200 flex flex-col overflow-x-hidden'>
      {/* Header Section */}
      <div className='flex items-center'>
        <Sidebar />
        <Header />
      </div>

      {/* Body */}
      <div className='flex flex-col items-center py-12'>
        <div className='w-full max-w-4xl bg-white shadow-xl rounded-3xl p-10 mt-8 hover:shadow-2xl transition duration-300'>
          <h2 className='text-4xl font-extrabold text-gray-800 mb-8 text-center'>Follow 3 Simple Steps</h2>
          <div className='space-y-8'>

            {/* Step 1: Upload File */}
            <div className='p-3 bg-white border border-orange-400 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center'>
              <FiUploadCloud size={40} className='text-orange-500 mb-4' />
              <h3 className='text-2xl font-bold text-orange-600 mb-3'>Step 1: Upload Your PDF</h3>
              <p className='text-gray-600 mb-4'>Select a file, and our AI will analyze the content.</p>
              <label className="cursor-pointer bg-orange-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition">
                Choose File
                <input type='file' accept='application/pdf' onChange={handleFileUpload} className='hidden' />
              </label>
              {file && <p className='text-green-600 font-semibold mt-3'>✅ {file.name} Uploaded</p>}
            </div>

            {/* Step 2: Set Preferences */}
            <div className='p-6 bg-white border border-orange-400 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center'>
              <FiSettings size={40} className='text-orange-500 mb-4' />
              <h3 className='text-2xl font-bold text-orange-600 mb-3'>Step 2: Set Your Preferences</h3>
              <p className='text-gray-600 mb-4'>Choose the number of questions.</p>
              <input
                type='number'
                placeholder='Number of Questions'
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className='border p-3 rounded-lg w-3/4 mb-3 text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>

            {/* Step 3: Generate Test */}
            <div className='p-6 bg-white border border-orange-400 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center'>
              <FiCheckCircle size={40} className='text-orange-500 mb-4' />
              <h3 className='text-2xl font-bold text-orange-600 mb-3'>Step 3: Generate & Practice</h3>
              <p className='text-gray-600 mb-4'>Receive your test instantly and start practicing!</p>
              <button
                onClick={handleGenerateTest}
                className='bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-10 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300'
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Test'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
