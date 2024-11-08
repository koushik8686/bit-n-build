'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, X } from 'lucide-react';
import Loader from '../Loader'
import axios from 'axios';
// Mock axios for demonstration purposes

export default function Reviewers() {
  const [reviewers, setReviewers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newReviewer, setNewReviewer] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    about: ''
  });

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/review/reviewers');
        setReviewers(response.data);
      } catch (err) {
        console.error('Error fetching reviewers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReviewer((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/review/add-reviewer', newReviewer);
      setReviewers([...reviewers, response.data]);
      setNewReviewer({ name: '', email: '', password: '', organization: '', about: '' });
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error adding reviewer:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-500">Reviewers Management</h2>
      
      <motion.button 
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="mb-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full transition-colors flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isFormVisible ? <X size={24} className="mr-2" /> : <Plus size={24} className="mr-2" />}
        {isFormVisible ? 'Cancel' : 'Add Reviewer'}
      </motion.button>

      {isFormVisible && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-purple-100 p-6 rounded-lg shadow-lg text-black"
        >
          <h3 className="text-xl font-bold mb-4">Add New Reviewer</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                id="name"
                name="name"
                value={newReviewer.name}
                onChange={handleChange}
                required
                className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={newReviewer.email}
                onChange={handleChange}
                required
                className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={newReviewer.password}
                onChange={handleChange}
                required
                className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm font-medium mb-1">Organization</label>
              <input
                id="organization"
                name="organization"
                value={newReviewer.organization}
                onChange={handleChange}
                className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="about" className="block text-sm font-medium mb-1">About</label>
              <textarea
                id="about"
                name="about"
                value={newReviewer.about}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <motion.button 
              type="submit" 
              className="w-full p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Reviewer
            </motion.button>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center mt-6">
           <Loader/>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviewers.map((reviewer) => (
            <motion.div 
              key={reviewer._id}
              className="bg-purple-100 p-4 rounded-lg shadow-lg text-black"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <User size={24} className="mr-2 text-purple-500" />
                <h4 className="text-lg font-bold">{reviewer.name}</h4>
              </div>
              <p className="text-sm mb-1">{reviewer.email}</p>
              <p className="text-sm font-medium mb-2">{reviewer.organization}</p>
              <p className="text-sm text-gray-700">{reviewer.about}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
