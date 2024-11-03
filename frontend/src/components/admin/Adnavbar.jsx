// NavBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ onSelect }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-100 shadow-md p-4 flex justify-between items-center">
      <button 
        onClick={() => navigate('/admin')}
        className="text-blue-600 font-semibold hover:underline"
      >
        Back
      </button>
      <button 
        onClick={() => onSelect('allAds')}
        className="text-green-600 font-semibold hover:underline"
      >
        All Ads Stats
      </button>
      <button 
        onClick={() => onSelect('singleAd')}
        className="text-purple-600 font-semibold hover:underline"
      >
        Single Ad Stats
      </button>
    </nav>
  );
};
export default NavBar;
