import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Toast from '../Toast';
import axios from 'axios';
import Cookies from 'js-cookie'
import Loader from '../Loader';

export default function ReviewerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    about: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/review/register', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status !== 200) throw new Error('Registration failed');
      setToast({ 
        type: 'success', 
        message: response.data.message
      });
      if (response.status===200) {
        Cookies.set("reviewer" , response.data. reviewerId)
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || // Error message from server response
        err.message || // General error message
        'An unknown error occurred. Please try again.'; // Fallback error message

      setToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-100 flex items-center justify-center p-4">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
      {/* Rest of the form remains unchanged */}
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <a href="/" className="text-teal-600 hover:text-teal-700 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </a>
            <h2 className="text-2xl font-bold text-center text-gray-700">Reviewer Registration</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                id="organization"
                name="organization"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                id="about"
                name="about"
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                value={formData.about}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <a href="/reviewer/login" className="text-sm text-teal-600 hover:text-teal-700 transition-colors">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}