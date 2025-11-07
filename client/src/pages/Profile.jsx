import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import ProfileHistory from "../components/ProfileHistory";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", gender: "", profilePic: "" });
  const [testHistory, setTestHistory] = useState([]);
  const [bestScore, setBestScore] = useState(null);
  const [averageScore, setAverageScore] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchUserProfile();
    fetchTestHistory();
  }, []);

  const getProfilePicByGender = (gender) => {
    if (gender === "male") return "https://cdn-icons-png.flaticon.com/512/6997/6997671.png";
    if (gender === "female") return "https://cdn-icons-png.flaticon.com/512/6997/6997662.png";
    return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  };

  const fetchUserProfile = async () => {
    const id = localStorage.getItem("userId");
    if (!id) return;
    try {
      const { data } = await axios.get(`${backendUrl}/user/${id}`);
      setFormData({
        name: data.name,
        email: data.email,
        gender: data.gender || "",
        profilePic: data.profilePic || getProfilePicByGender(data.gender),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTestHistory = async () => {
    const id = localStorage.getItem("userId");
    if (!id) return;
    try {
      const { data } = await axios.get(`${backendUrl}/history/${id}`);
      setTestHistory(data.tests || []);
      calculateScores(data.tests || []);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateScores = (tests) => {
    if (!tests.length) return;
    const scores = tests.map((t) => t.score);
    setBestScore(Math.max(...scores));
    setAverageScore((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem("id") || localStorage.getItem("userId");
    if (!id) return;

    const profilePic = getProfilePicByGender(formData.gender);
    try {
      await axios.put(`${backendUrl}/user/${id}`, {
        name: formData.name,
        gender: formData.gender,
        profilePic,
      });
      setEditMode(false);
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-100 via-pink-100 to-blue-100">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
        <ProfileHeader
          {...{ formData, editMode, setEditMode, setFormData, handleSave, getProfilePicByGender, message }}
        />
        <ProfileStats {...{ testHistory, bestScore, averageScore }} />
        <ProfileHistory {...{ testHistory, navigate }} />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
