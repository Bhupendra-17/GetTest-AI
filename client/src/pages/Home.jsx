import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Image from '../assets/aptitude-test.png';

const Home = () => {
  return (
    <div className='min-h-screen bg-orange-100 flex flex-col'>
      {/* Header Section */}
      <div className='flex items-center'>
        <Sidebar />
        <Header />
      </div>

      {/* Body */}
      <div className='flex flex-col items-center py-10'>
        {/* Hero Section */}
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-bold'>Welcome, Aspirant!</h1>
          <h2 className='text-3xl font-bold'>Generate Mock Tests from PDF</h2>
          <p className='text-lg text-gray-700 mt-2'>Generate Mock Tests Instantly from Any PDF!</p>
        </div>

        {/* Get Started Button */}
        <Link to='/main' className='border border-gray-800 rounded-3xl py-2 px-6 shadow-2xl text-gray-800 text-xl font-bold transition duration-300 hover:bg-gray-800 hover:text-white'>
          Get Started
        </Link>

        <div className='flex justify-around items-center my-4 gap-12'>
          {/* Features Section */}
          <div className='flex flex-wrap justify-center items-center gap-10 mt-8'>
            <div className='w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Why Choose GetTest AI?</h2>
              <ul className='list-disc list-inside text-gray-700 space-y-2'>
                <li><strong>AI-Powered Question Generation</strong> – Smartly extracts key concepts.</li>
                <li><strong>Customizable Test Size</strong> – Set a limit on the number of questions.</li>
                <li><strong>Instant & Efficient</strong> – Generate tests in seconds.</li>
                <li><strong>Versatile</strong> – Works with study guides, textbooks, and research papers.</li>
              </ul>
            </div>

          </div>
          <img src={Image} alt='Mock Test' className='h-52' />
        </div>
        {/* Getting Started Section */}
        <div className='w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 mt-8 hover:shadow-2xl transition duration-300'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Getting Started in 3 Simple Steps</h2>
          <div className='space-y-4'>
            {[
              { step: 'Step 1: Upload Your PDF', desc: 'Select a file, and our AI will analyze the content.' },
              { step: 'Step 2: Set Your Preferences', desc: 'Choose the number of questions you want in your mock test.' },
              { step: 'Step 3: Generate & Practice', desc: 'Receive your test instantly and start practicing!' }
            ].map((item, index) => (
              <div key={index} className='p-2 bg-yellow-100 border-l-4 border-orange-400 rounded hover:bg-orange-200 transition duration-300'>
                <h3 className='text-lg font-medium'>{item.step}</h3>
                <p className='text-gray-700'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
