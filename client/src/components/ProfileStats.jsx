// src/components/profile/ProfileStats.jsx
import { motion } from "framer-motion";

const ProfileStats = ({ testHistory, bestScore, averageScore }) => {
  const stats = [
    { title: "Tests Taken", value: testHistory.length, color: "blue" },
    { title: "Best Score", value: bestScore, color: "green" },
    { title: "Avg. Score", value: averageScore, color: "purple" },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className={`bg-${stat.color}-50 p-5 rounded-lg shadow`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h4 className={`text-${stat.color}-700 font-semibold`}>{stat.title}</h4>
          <p className="text-3xl font-bold">{stat.value || 0}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProfileStats;
