import React from 'react';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';

export default function Navbar({ setActiveComponent }) {
  const navigate = useNavigate()
  const Logout = ()=>{
    Cookies.remove('user')
    Cookies.remove('startup')
    navigate("/")
  }
  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex  ">
          <h1 className="text-2xl font-bold">StartX</h1>
          <div className="space-x-4">
            <button className="hover:text-gray-300" onClick={() => setActiveComponent('details')}>Startup Details</button>
            <button className="hover:text-gray-300" onClick={() => setActiveComponent('eir')}>EIR Application</button>
            <button className="hover:text-gray-300" onClick={() => setActiveComponent('grant')}>Grant Scheme</button>
            <button className="hover:text-gray-300" onClick={() => setActiveComponent('messages')}>Messages</button>
            <button className="hover:text-gray-300" onClick={() => setActiveComponent('monthly')}>Monthly Progress</button>
            <button className="hover:text-gray-300" onClick={() => {Logout()}}>Log Out</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
