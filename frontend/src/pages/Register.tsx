import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    try {
      console.log(username);
      console.log(email);
      console.log(password);
      const response = await axios.post('http://localhost:8000/api/signup/', {
        username,
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      setError('');
      navigate('/index');
    } catch (err) {
      setError('Registration failed. Username or email may be taken.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#f8f7f6] overflow-hidden">
      <div className="relative bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 transform transition-all duration-500 hover:scale-105 animate-slide-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1f2937] tracking-tight">
          Create Account
        </h2>
        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-100/50 p-2 rounded-lg">
            {error}
          </p>
        )}
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
            placeholder="Choose a username"
          />
        </div>
        <div className="mb-5">
          <label
            className="block text-[#1f2937] mb-2 font-medium"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6cd4ff] transition-all duration-300 placeholder-gray-400 text-[#1f2937]"
            placeholder="Enter your email"
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
            placeholder="Choose a password"
          />
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-[#6cd4ff] to-[#4ba8ff] text-white p-3 rounded-lg hover:from-[#4ba8ff] hover:to-[#6cd4ff] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#6cd4ff] focus:ring-offset-2"
        >
          Sign Up
        </button>
        <p className="mt-5 text-center text-[#1f2937]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#6cd4ff] hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;