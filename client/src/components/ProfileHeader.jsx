// src/components/profile/ProfileHeader.jsx
import { motion } from "framer-motion";

const ProfileHeader = ({
  formData,
  editMode,
  setEditMode,
  setFormData,
  handleSave,
  getProfilePicByGender,
  message,
}) => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-center gap-8 mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <motion.div
          className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 bg-white shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={formData.profilePic || getProfilePicByGender(formData.gender)}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>

        {editMode && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value,
                  profilePic: getProfilePicByGender(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </motion.div>
        )}
      </div>

      <motion.div
        className="flex-1 bg-white p-6 rounded-xl shadow-md w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {editMode ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {message && (
              <div className="text-sm text-red-600 mb-2">
                {Array.isArray(message)
                  ? message.map((m, i) => <div key={i}>{m.msg || String(m)}</div>)
                  : String(message)}
              </div>
            )}

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">{formData.name}</h1>
            <p className="text-gray-600">{formData.email}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setEditMode(true)}
              className="mt-3 text-sm text-blue-600 hover:underline font-medium"
            >
              Edit Profile
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProfileHeader;
