import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiSmile, FiClock, FiTarget, FiBookOpen } from "react-icons/fi";

const About = () => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] bg-[length:400%_400%]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      />

      <div className="relative z-10 text-white flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20 mb-12 px-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-orange-400">GetTest AI</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/90">
            From the late-night learners to the early-morning aspirants, we’re here to make
            exam preparation smarter, faster, and way less stressful.
          </p>
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white text-gray-800 rounded-2xl shadow-xl max-w-5xl mx-auto mb-12 p-10"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Born from Struggle, Built for Aspirants
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            Remember those endless nights of flipping through PDFs, making notes, and
            wondering — *“Where do I even start revising?”* Yeah, we’ve been there too.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            Most learners spend hours searching for the right mock tests — only to find ones
            that don’t match their syllabus, skill level, or time. That’s when the idea for
            <span className="font-semibold text-orange-600"> GetTest AI </span>
            was born — a tool that lets you turn your own materials into personalized tests
            in seconds.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Whether you’re preparing for a competitive exam, interview, or skill upgrade,
            our AI ensures your preparation adapts *to you*, not the other way around.
          </p>
        </motion.section>

        {/* Mission & Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-12 mb-16"
        >
          {[
            {
              icon: <FiBookOpen size={40} className="text-orange-500" />,
              title: "Our Mission",
              desc: "To make exam preparation accessible and AI-driven — transforming every study material into a smart test experience.",
            },
            {
              icon: <FiTarget size={40} className="text-orange-500" />,
              title: "Our Vision",
              desc: "To empower every learner, from small towns to big cities, with the confidence to test, learn, and improve effortlessly.",
            },
            {
              icon: <FiClock size={40} className="text-orange-500" />,
              title: "Our Promise",
              desc: "No more wasted time. No more outdated mocks. Just personalized learning that evolves with your journey.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-gradient-to-r from-yellow-50 to-orange-100 border-l-4 border-orange-400 rounded-2xl shadow-md hover:shadow-2xl transition"
            >
              <div className="mb-3 flex justify-center">{item.icon}</div>
              <h3 className="font-bold text-xl mb-2 text-center text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-center">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Fun Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="bg-white text-gray-800 rounded-2xl shadow-xl max-w-5xl mx-auto mb-12 p-10 text-center"
        >
          <FiSmile size={50} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-4">We Get It — Preparation Is Hard!</h2>
          <p className="text-gray-600 text-lg mb-4">
            You’ve got deadlines, distractions, and a syllabus that seems never-ending. But
            that’s exactly why we built this — to make every test feel like a win, not a
            headache.
          </p>
          <p className="text-gray-600 text-lg">
            GetTest AI helps you study smarter by creating mock tests that actually fit your
            learning style. So whether you’re stuck on a bus or burning the midnight oil,
            your next test is just a click away.
          </p>
        </motion.section>

        <Footer />
      </div>
    </div>
  );
};

export default About;
