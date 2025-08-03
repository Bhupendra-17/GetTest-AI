import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from '../assets/aptitude-test.png';

const Home = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))]" />

      {/* Main content */}
      <div className="relative z-10 text-white flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome, Aspirant!</h1>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">Generate Mock Tests from PDF</h2>
            <p className="text-lg mt-4">Generate Mock Tests Instantly from Any PDF!</p>
          </div>

          <div className="text-center mb-8">
            <Link
              to="/main"
              className="inline-block rounded-3xl py-3 px-6 shadow-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-gray-800 hover:to-gray-600 text-white text-lg font-semibold transition duration-300"
            >
              Get Started
            </Link>
          </div>

          {/* Why Choose section */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-around gap-8">
            <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose GetTest AI?</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>AI-Powered Question Generation</strong> – Smartly extracts key concepts.</li>
                <li><strong>Customizable Test Size</strong> – Set a limit on the number of questions.</li>
                <li><strong>Instant & Efficient</strong> – Generate tests in seconds.</li>
                <li><strong>Versatile</strong> – Works with study guides, textbooks, and research papers.</li>
              </ul>
            </div>
            <img
              src={Image}
              alt="Mock Test"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs"
            />
          </div>

          {/* Steps Section */}
          <div className="w-full bg-white shadow-lg rounded-2xl p-6 mt-10 hover:shadow-2xl transition duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Getting Started in 3 Simple Steps</h2>
            <div className="space-y-4">
              {[
                { step: 'Step 1: Upload Your PDF', desc: 'Select a file, and our AI will analyze the content.' },
                { step: 'Step 2: Set Your Preferences', desc: 'Choose the number of questions you want in your mock test.' },
                { step: 'Step 3: Generate & Practice', desc: 'Receive your test instantly and start practicing!' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-100 border-l-4 border-orange-400 rounded hover:bg-orange-200 transition duration-300"
                >
                  <h3 className="text-lg text-black font-medium">{item.step}</h3>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
