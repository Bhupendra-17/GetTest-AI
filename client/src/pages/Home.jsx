import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Image from '../assets/aptitude-test.png';

const Home = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] bg-[length:400%_400%]"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
      />

      <div className="relative z-10 text-white flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <div className="flex-1 w-full px-6 md:px-10 py-16 text-center flex flex-col justify-center items-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Empower Your Preparation with <span className="text-yellow-300">GetTest AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl mb-8 max-w-2xl"
          >
            Upload your study materials or choose your role to generate personalized AI-powered mock tests instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Link
              to="/main"
              className="inline-block rounded-3xl py-3 px-8 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transform transition duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="flex flex-col-reverse lg:flex-row items-center justify-around gap-10 px-6 lg:px-16 py-10"
        >
          <img
            src={Image}
            alt="Mock Test"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs rounded-2xl shadow-xl"
          />
          <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose GetTest AI?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>AI-Powered Generation</strong> — Smartly extracts core concepts from your PDFs.</li>
              <li><strong>Customizable Question Sets</strong> — Define your question count or difficulty level.</li>
              <li><strong>Role-Based Tests</strong> — Choose your career path (Engineer, MBA, Govt Exam, etc.) for tailored tests.</li>
              <li><strong>Instant Results</strong> — Generate and practice within seconds.</li>
            </ul>
          </div>
        </motion.div>

        {/* Choose Your Mode Section */}
        <section className="bg-white py-14 px-6 lg:px-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Choose How You Want to Use GetTest AI</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {[
              {
                title: '📄 Upload PDF Mode',
                desc: 'Upload your notes, textbooks, or study materials — our AI extracts key concepts to build your mock test.',
                link: '/main',
                gradient: 'from-yellow-400 to-orange-500',
              },
              {
                title: '🎯 Role-Based Mode',
                desc: 'Select your exam or career role (like CAT, UPSC, GATE, or Tech Interviews) and generate targeted mock tests.',
                link: '/roles',
                gradient: 'from-pink-500 to-purple-500',
              },
            ].map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 cursor-pointer bg-gradient-to-r ${option.gradient} p-[2px] rounded-2xl shadow-lg`}
              >
                <div className="bg-white rounded-2xl p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h3>
                    <p className="text-gray-600 mb-4">{option.desc}</p>
                  </div>
                  <Link
                    to={option.link}
                    className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-5 rounded-full shadow hover:opacity-90 transition"
                  >
                    Try Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Learner Impact Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, staggerChildren: 0.3 },
            },
          }}
          className="w-full bg-white shadow-lg rounded-2xl p-8 mt-10 mb-10 mx-auto max-w-5xl"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Why Learners Love <span className="text-orange-500">GetTest AI</span>
          </h2>

          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Thousands of learners use GetTest AI daily to sharpen their knowledge and build exam confidence.
            Here’s what makes it the go-to tool for smart preparation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🧠',
                title: 'Personalized Learning',
                desc: 'Get tests uniquely aligned to your strengths, weaknesses, and learning goals.',
              },
              {
                icon: '⚡',
                title: 'Rapid Practice',
                desc: 'No waiting — generate and start your mock test instantly with one click.',
              },
              {
                icon: '📈',
                title: 'Track Your Progress',
                desc: 'Review your scores, identify weak areas, and improve strategically.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-100 rounded-2xl p-6 border-l-4 border-orange-400 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats Subsection */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {[
              { value: '10K+', label: 'Mock Tests Generated' },
              { value: '5K+', label: 'Active Learners' },
              { value: '98%', label: 'User Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg"
              >
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
