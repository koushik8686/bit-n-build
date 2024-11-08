import React from 'react';
import './Loader.css';

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen  fixed inset-0 z-50 backdrop-blur-sm">
      <div className="loader">
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__bar"></div>
        <div className="loader__ball"></div>
      </div>
    </div>
  );
}

//use loader while fetching data and waiting for response while sending requests