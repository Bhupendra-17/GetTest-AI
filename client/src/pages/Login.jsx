import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent form reload

    try {
      const response = await axios.post('http://localhost:8000/login', {
        email,
        password,
      });

      const { access_token,user } = response.data;

      // Save token in localStorage (or use cookies if preferred)
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id);

      // Redirect to home or test page
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(60deg,_rgb(247,_149,_51),_rgb(243,_112,_85),_rgb(239,_78,_123),_rgb(161,_102,_171),_rgb(80,_115,_184),_rgb(16,_152,_173),_rgb(7,_179,_155),_rgb(111,_186,_130))]  px-2">
      <Navbar />
      <div className="flex items-center justify-center py-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="email"
                type="email"
                placeholder="abc@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-baseline justify-between">
              <button
                className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Login
              </button>
              <Link to="/register" className="underline text-gray-700 font-semibold mb-2">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;