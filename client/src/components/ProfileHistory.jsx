// src/components/profile/ProfileHistory.jsx
import { motion } from "framer-motion";

const ProfileHistory = ({ testHistory, navigate }) => {
  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Test History</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-gray-700 bg-white">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-800 uppercase tracking-wide text-xs font-semibold">
            <tr>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Title</th>
              <th className="px-5 py-3 text-left">Score</th>
              <th className="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {testHistory.length ? (
              testHistory.map((test, i) => (
                <motion.tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="px-5 py-3">
                    {new Date(test.date).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-5 py-3 font-medium">{test.title || "Untitled Test"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                        test.score >= 80
                          ? "bg-green-500"
                          : test.score >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {test.score} / {test.total}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => navigate(`/score/${test.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-6">
                  No test history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProfileHistory;
