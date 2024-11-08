'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Star, Check, X, Search } from 'lucide-react';
import Toast from '../Toast'; // Import Toast component
import Loader from '../Loader'; // Import Loader component
import { useParams } from 'react-router-dom';

export default function EIRReviewerSelection({ params }) {
  const [eirData, setEirData] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false); // New state for selection loading
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { id } = useParams();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);
  const fetchEirData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/admin/eir/${id}`);
      if (!response.ok) throw new Error('Failed to fetch EIR data');
      const data = await response.json();
      setEirData(data);
      setSelectedReviewers(data.reviews.map(r => r.reviewer_id));
      console.log(selectedReviewers);
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'error' });
    }
  };

  const fetchReviewers = async () => {
    try {
      const response = await fetch('http://localhost:4000/review/reviewers');
      if (!response.ok) throw new Error('Failed to fetch reviewers');
      const data = await response.json();
      setReviewers(data);
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const submitReviewerData = async (requestId) => {
    try {
      setLoading(true);
      const response = await fetch(`/admin/eir/selectreviewer/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedReviewers),
      }).then(()=>{
        setLoading(false);
      });
      if (!response.ok) throw new Error('Failed to select reviewer');
      setToast({ type: 'success', message: 'Reviewer selected successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'An unknown error occurred.' });
    }
  };

  useEffect(() => {
    fetchEirData();
    fetchReviewers();
  }, []);
   useEffect(() => {
    console.log(selectedReviewers ,"l");
   }, [selectedReviewers])
  
  const toggleReviewer = (reviewerId) => {
    setSelectedReviewers(() => {
      console.log(selectedReviewers);
      if (selectedReviewers.some((id) => id === reviewerId)) {
        return selectedReviewers.filter((id) => id !== reviewerId);
      } else {
        return [...selectedReviewers, reviewerId];
      }
    }); 
    };
  

  const toggleAllReviewers = () => {
    if (selectedReviewers.length === reviewers.length) {
      setSelectedReviewers([]);
    } else {
      setSelectedReviewers(reviewers.map((r) => r._id));
    }
  };
  
  const filteredReviewers = reviewers.filter((reviewer) =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reviewer.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reviewer.about.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    console.log(selectedReviewers);
  }, [selectedReviewers]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-indigo-600 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">EIR Reviewer Selection</h1>
        <a href="/admin" className="text-teal-200 hover:underline">Back to Admin</a>
      </nav>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-4">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* EIR Details - Left Column */}
            <div className="md:w-1/3 p-6 border-r border-gray-200">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-700">{eirData?.startup_name}</h2>
              {eirData && (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Entrepreneur:</p>
                    <p>{eirData.entrepreneur.name}</p>
                    <p className="text-indigo-600">{eirData.entrepreneur.email}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Background:</p>
                    <p>{eirData.entrepreneur.background}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Previous Ventures:</p>
                    <p>{eirData.entrepreneur.previous_ventures.join(", ")}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Industry Experience:</p>
                    <p>{eirData.entrepreneur.industry_experience}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status: <span className="text-indigo-600">{eirData.status.status}</span></p>
                    <p>Decision Date: {new Date(eirData.status.decision_date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reviewer Selection - Right Column */}
            <div className="md:w-2/3 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-2xl font-semibold text-indigo-700">Select Reviewers</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search reviewers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  <button
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                    onClick={toggleAllReviewers}
                  >
                    {selectedReviewers.length === reviewers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Selection Loader */}
              {isSelecting && <Loader />}

              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredReviewers.map((reviewer) => (
                  <div
                    key={reviewer._id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleReviewer(reviewer._id)} // Toggle selection on click
                  >
                    <div
                      className={`w-6 h-6 border-2 rounded-md ${
                        selectedReviewers.includes(reviewer._id) ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                      } flex items-center justify-center transition-colors duration-200`}
                    >
                      {selectedReviewers.includes(reviewer._id) && <Check className="text-white" size={16} />}
                    </div>
                    <label htmlFor={`reviewer-${reviewer._id}`} className="flex-grow cursor-pointer">
                      <h3 className="text-lg font-semibold">{reviewer.name}</h3>
                      <p className="text-sm text-gray-600">{reviewer.email}</p>
                      <p className="text-sm mt-1">
                        <Briefcase className="inline-block h-4 w-4 mr-1 text-purple-600" />
                        {reviewer.organization}
                      </p>
                      <p className="text-sm mt-1">{reviewer.about}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <motion.button
            className="w-full max-w-sm mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submitReviewerData}
          >
            Assign Selected Reviewers
          </motion.button>
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
