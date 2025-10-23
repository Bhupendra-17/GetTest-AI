import { motion } from "framer-motion";
import {
  FiUploadCloud,
  FiSettings,
  FiBriefcase,
  FiBookOpen,
  FiCheckCircle,
} from "react-icons/fi";

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const TestCreationSteps = ({
  mode,
  file,
  numQuestions,
  role,
  subject,
  loading,
  handleFileUpload,
  handleGenerateTest,
  handleGenerateFromRole,
  setNumQuestions,
  setRole,
  setSubject,
}) => {
  return (
    <motion.div
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-l from-cyan-300 to-red-200 shadow-2xl rounded-3xl p-10 max-w-7xl mx-auto backdrop-blur-sm bg-opacity-80"
    >
      <motion.h2
        variants={itemVariant}
        className="text-4xl font-bold text-center text-gray-800 mb-8"
      >
        Create Your Mock Test in Simple Steps
      </motion.h2>

      {mode === "pdf" ? (
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Upload PDF */}
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 hover:shadow-2xl transition"
          >
            <FiUploadCloud size={50} className="text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-orange-600 mb-2">
              Upload PDF
            </h3>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="border p-2 rounded-lg w-3/4 text-black focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm mb-4"
            />
          </motion.div>

          {/* Question Count */}
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 hover:shadow-2xl transition"
          >
            <FiSettings size={50} className="text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-orange-600 mb-2">
              Set Question Count
            </h3>
            <input
              type="number"
              placeholder="Number of Questions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="border p-2 rounded-lg text-center text-black w-3/4 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
            />
          </motion.div>

          {/* Generate Button */}
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 hover:shadow-2xl transition"
          >
            <FiCheckCircle size={50} className="text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-orange-600 mb-2">
              Generate Test
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Click to generate from uploaded PDF
            </p>
            <button
              onClick={handleGenerateTest}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-6 rounded-xl shadow-lg transition-all duration-300"
            >
              {loading ? "Generating..." : "Generate PDF Test"}
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Role */}
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 hover:shadow-2xl transition"
          >
            <FiBriefcase size={50} className="text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Select Role
            </h3>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
            >
              <option value="">-- Choose Role --</option>
              <option value="Bank Clerk">Bank Clerk</option>
              <option value="Bank PO">Bank PO</option>
              <option value="UPSC">UPSC</option>
              <option value="SSC CGL">SSC CGL</option>
            </select>
          </motion.div>

          {/* Subject */}
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 hover:shadow-2xl transition"
          >
            <FiBookOpen size={50} className="text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Select Subject
            </h3>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border p-2 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
            >
              <option value="">-- Choose Subject --</option>
              <option value="Logical Reasoning">Logical Reasoning</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude</option>
              <option value="General Knowledge">General Knowledge</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </motion.div>

          {/* Count */}
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 hover:shadow-2xl transition"
          >
            <FiSettings size={50} className="text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Question Count
            </h3>
            <input
              type="number"
              placeholder="Enter number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="border p-2 rounded-lg text-black w-full text-center focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
            />
          </motion.div>

          {/* Generate */}
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col justify-center items-center text-center p-6 border border-orange-400 rounded-2xl shadow-lg bg-white/35 hover:shadow-2xl transition"
          >
            <FiCheckCircle size={50} className="text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Generate
            </h3>
            <button
              onClick={handleGenerateFromRole}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-6 rounded-xl shadow-lg transition-all duration-300 w-full"
            >
              {loading ? "Generating..." : "Generate Test"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TestCreationSteps;
