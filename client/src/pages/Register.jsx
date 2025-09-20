import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { supabase } from '../utils/supabaseClient';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [gender, setGender] = useState('');
  const [profilePic, setProfilePic] = useState(
    'https://cdn-icons-png.flaticon.com/512/236/236831.png'
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/register`, {
        name,
        email,
        password,
        gender,
        profilePic,
      });

      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id);

      navigate('/main');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || 'Registration failed');
    }
  };

  // 🔹 Google OAuth Signup (actually same as login in Supabase)
  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google/login`;
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))] px-2">
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Register</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email ID</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="email"
                placeholder="abc@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {message && (
              <div className="text-sm text-red-600 mb-2">
                {Array.isArray(message)
                  ? message.map((err, idx) => <div key={idx}>{err.msg || String(err)}</div>)
                  : String(message)}
              </div>
            )}

            <div className="flex items-baseline justify-between">
              <button
                onClick={handleSignup}
                className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
                type="button"
              >
                Register
              </button>
              <Link to="/login" className="underline text-gray-700 font-semibold mb-2">
                Login
              </Link>
            </div>
          </form>

          {/* 🔹 Google Register Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleGoogleSignup}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
