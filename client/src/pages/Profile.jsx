import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', profilePic: '' });
  const [testHistory, setTestHistory] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // <--- new

  useEffect(() => {
    fetchUserProfile();
    fetchTestHistory();
  }, []);

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const { data } = await axios.get(`http://localhost:8000/user/${userId}`);
      setUser(data);
      setFormData({
        name: data.username,
        email: data.email,
        profilePic: data.profilePic || '',
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchTestHistory = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const { data } = await axios.get(`http://localhost:8000/user/${userId}/tests`);
      setTestHistory(data.tests || []);
      calculateScores(data.tests || []);
    } catch (err) {
      console.error("Failed to fetch test history", err);
    }
  };

  const calculateScores = (tests) => {
    if (!tests.length) return;
    const scores = tests.map((test) => test.score);
    const best = Math.max(...scores);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    setBestScore(best);
    setAverageScore(average.toFixed(2));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    let imageUrl = formData.profilePic;

    // Upload new profile pic if selected
    if (formData.newProfileFile) {
      const uploadData = new FormData();
      uploadData.append("file", formData.newProfileFile);

      try {
        const res = await fetch(`http://localhost:8000/user/${userId}/upload-profile-pic`, {
          method: 'POST',
          body: uploadData,
        });
        const data = await res.json();
        if (res.ok) {
          imageUrl = data.url;
        }
      } catch (err) {
        console.error("Image upload failed", err);
      }
    }

    // Update profile with new name and/or pic
    try {
      await axios.put(`http://localhost:8000/user/${userId}`, {
        name: formData.name,
        profilePic: imageUrl,
      });
      setEditMode(false);
      setPreviewImage(null);
      fetchUserProfile();
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Generate preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    // Temporarily store image to upload later
    const uploadData = new FormData();
    uploadData.append('file', file);

    // Store the file in formData (we’ll upload this only on Save)
    setFormData((prev) => ({
      ...prev,
      newProfileFile: file // keep original file
    }));
  };
  const handleCancelImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, newProfileFile: null }));
  };


  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-100 via-pink-100 to-blue-100">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 bg-white shadow-md">
              <img
                src={previewImage || formData.profilePic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {editMode && (
              <>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  ✏️
                </label>

                {previewImage && (
                  <button
                    type="button"
                    onClick={handleCancelImage}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>


          {/* Profile Details / Form */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-md w-full">
            {editMode ? (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Your Name"
                    required
                  />
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Action Buttons */}
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

        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Test History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 border rounded overflow-hidden">
              <thead className="bg-gray-100 text-left font-semibold">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.map((test, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{new Date(test.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{test.title}</td>
                    <td className="px-4 py-2">{test.score}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-600 hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
                {testHistory.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-400 py-4">
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
