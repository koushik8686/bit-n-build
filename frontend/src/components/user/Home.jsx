import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import StartupDetails from './Startupdetails';
import EIRDetails from './EirDetails';
import GrantDetails from './GrantDetails';
import Messages from './Messages';
import MonthlyProgress from './Monthlyorogress';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StartupHomepage() {
  const [activeComponent, setActiveComponent] = useState('details');
  const [userData, setUserData] = useState(null);
  const [startupData, setStartupData] = useState(null);
  const [eirData, setEirData] = useState(null);
  const [grantSchemeData, setGrantSchemeData] = useState(null);
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
        console.log(response);
        setUserData(userResponse);
        setStartupData(startupResponse);
        setEirData( eirRecords ); // Assuming there might be multiple EIR records, take the first one.
        setGrantSchemeData( grantRecords); // Same for grant records.
        setMessages(startupResponse.messages ); // Assuming messages are part of the startup data.
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, [user, startup, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setActiveComponent={setActiveComponent} />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {activeComponent === 'details' && startupData && (
          <StartupDetails
            kyc={startupData.kyc}
            progress={startupData.progress}
          />
        )}
        {activeComponent === 'eir' && eirData && (
          <EIRDetails eir={eirData} />
        )}
        {activeComponent === 'grant' && grantSchemeData && (
          <GrantDetails grant={grantSchemeData} />
        )}
        {activeComponent === 'messages' && messages.length > 0 && (
          <Messages messages={messages} />
        )}
        {activeComponent === 'monthly' && startupData && (
          <MonthlyProgress progress={startupData.progress} />
        )}
      </main>

      <footer className="bg-gray-900 text-white py-4 text-center">
        © 2023 StartupHub. All rights reserved.
      </footer>
    </div>
  );
}
