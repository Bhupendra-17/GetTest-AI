import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    profilePic: ''
  });
  const [testHistory, setTestHistory] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [message, setMessage] = useState(null); // Optional error handling
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchUserProfile();
    fetchTestHistory();
  }, []);

  const getProfilePicByGender = (gender) => {
    if (gender === 'male')
      return 'https://cdn-icons-png.flaticon.com/512/6997/6997671.png';
    if (gender === 'female')
      return 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png';
    return 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
  };

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const { data } = await axios.get(`${backendUrl}/user/${userId}`);
      setFormData({
        name: data.name,
        email: data.email,
        gender: data.gender || '',
        profilePic: data.profilePic || getProfilePicByGender(data.gender),
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchTestHistory = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const { data } = await axios.get(`${backendUrl}/history/${userId}`);
      setTestHistory(data.tests || []);
      calculateScores(data.tests || []);
    } catch (err) {
      console.error("Failed to fetch test history", err);
    }
  };

  const calculateScores = (tests) => {
    if (!tests.length) return;
    const scores = tests.map(test => test.score);
    setBestScore(Math.max(...scores));
    setAverageScore((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const profilePic = getProfilePicByGender(formData.gender);

    try {
      await axios.put(`${backendUrl}/user/${userId}`, {
        name: formData.name,
        gender: formData.gender,
        profilePic
      });

      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        name: formData.name,
        profilePic
      }));

      setEditMode(false);
      fetchUserProfile();
    } catch (err) {
      console.error("Error updating profile", err);
      setMessage(err.response?.data?.detail || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-100 via-pink-100 to-blue-100">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 bg-white shadow-md">
              <img
                src={formData.profilePic || getProfilePicByGender(formData.gender)}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {editMode && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
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
              </div>
            )}
          </div>

          <div className="flex-1 bg-white p-6 rounded-xl shadow-md w-full">
            {editMode ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-3 text-sm text-blue-600 hover:underline font-medium"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-10">
          <div className="bg-blue-50 p-5 rounded-lg shadow">
            <h4 className="text-blue-700 font-semibold">Tests Taken</h4>
            <p className="text-3xl font-bold">{testHistory.length}</p>
          </div>
          <div className="bg-green-50 p-5 rounded-lg shadow">
            <h4 className="text-green-700 font-semibold">Best Score</h4>
            <p className="text-3xl font-bold">{bestScore}</p>
          </div>
          <div className="bg-purple-50 p-5 rounded-lg shadow">
            <h4 className="text-purple-700 font-semibold">Avg. Score</h4>
            <p className="text-3xl font-bold">{averageScore}</p>
          </div>
        </div>

        {/* Test History Table */}
        {/* Test History Table */}
        <div className="mt-8">
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
                {testHistory.length ? testHistory.map((test, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      {new Date(test.date).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-5 py-3 font-medium">
                      {test.title || 'Untitled Test'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${test.score >= 80
                            ? 'bg-green-500'
                            : test.score >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
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
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-400 py-6">
                      No test history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Profile;
