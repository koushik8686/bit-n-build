import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import StartupDetails from './Startupdetails'; // Fixed capitalization here
import EIRDetails from './EirDetails';
import GrantDetails from './GrantDetails';
import Messages from './Messages';
import MonthlyProgress from './Monthlyorogress'; // Fixed capitalization here
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StartupHomepage() {
  const [activeComponent, setActiveComponent] = useState('details');
  const [userData, setUserData] = useState(null);
  const [startupData, setStartupData] = useState(null);
  const [eirData, setEirData] = useState([]);
  const [grantSchemeData, setGrantSchemeData] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const user = Cookies.get('user');
  const startup = Cookies.get('startup');

  useEffect(() => {
    if (!user || !startup) {
      return navigate('/');
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`/user/home/${user}/${startup}`);
        const { user: userResponse, startup: startupResponse, eirRecords, grantRecords } = response.data;
        
        console.log(response); // Log the entire response for better debugging
        setUserData(userResponse);
        setStartupData(startupResponse);
        setEirData(eirRecords ); // Default to an empty array if undefined
        setGrantSchemeData(grantRecords ); // Default to an empty array if undefined
        setMessages(startupResponse.messages ); // Default to an empty array if undefined
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
   console.log(activeComponent);
  }, [activeComponent])
  // if (!startupData || !startupData.length) {
  //   return <div>No data available</div>; // Handle the case where data is undefined or empty
  // }

  return (
    
    <div className="flex flex-col min-h-screen">
      <Navbar setActiveComponent={setActiveComponent} />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {activeComponent === 'details' && startupData && (
          <StartupDetails
            kyc={startupData.kyc}
            progress={startupData.progress} // Ensure progress is an array
          />
        )}
        {activeComponent === 'eir' && (
          <EIRDetails eirList={eirData} />
        )}
        {activeComponent === 'grant'  && (
          <GrantDetails grant={grantSchemeData} />
        )}
        {activeComponent === 'messages' && (
          <Messages />
        )}
        {activeComponent === 'monthly' && (
          <MonthlyProgress progress={startupData.progress || []} /> // Ensure progress is an array
        )}
      </main>

      <footer className="bg-gray-900 text-white py-4 text-center">
        © 2023 StartupHub. All rights reserved.
      </footer>
    </div>
  );
}
