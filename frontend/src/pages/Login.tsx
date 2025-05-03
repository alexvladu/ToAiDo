import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); 
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      setError('');
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      window.location.href='/';
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#f8f7f6] overflow-hidden">
      <div className="relative bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all duration-500 hover:scale-105 animate-slide-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1f2937] tracking-tight">
          Welcome Back
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-100/50 p-2 rounded-lg">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin}> {/* Folosim onSubmit în loc de onClick */}
          <div className="mb-5">
            <label
              className="block text-[#1f2937] mb-2 font-medium"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6cd4ff] transition-all duration-300 placeholder-gray-400 text-[#1f2937]"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-7">
            <label
              className="block text-[#1f2937] mb-2 font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6cd4ff] transition-all duration-300 placeholder-gray-400 text-[#1f2937]"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit" // Schimbă butonul să fie de tip submit
            className="w-full bg-gradient-to-r from-[#6cd4ff] to-[#4ba8ff] text-white p-3 rounded-lg hover:from-[#4ba8ff] hover:to-[#6cd4ff] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#6cd4ff] focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        <p className="mt-5 text-center text-[#1f2937]">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-[#6cd4ff] hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
