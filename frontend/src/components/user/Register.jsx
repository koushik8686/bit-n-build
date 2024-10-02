import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, TextField, Button, Typography, Box, Grid, Paper, Divider 
} from '@mui/material';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import image1 from '../../assets/registerwide.jpg'; // Image for Registration Form
import image2 from '../../assets/wideskyscape.jpg';         // Image for KYC Form

const  AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true); // Switch between Login/Register
  const [showKYCForm, setShowKYCForm] = useState(false); // Show KYC form after registration
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [kycDetails, setKycDetails] = useState({
    company_name: '',
    address: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    incorporation_date: '',
    industry: '',
    website: '',
    user: ''
  });
  const navigate = useNavigate();
  
  // Handle user registration or login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = !showKYCForm ? 'http://localhost:4000/auth/register' : 'http://localhost:4000/auth/kyc';
    try {
      const { data } = await axios.post(url, { username, password, email }); // Corrected the URL for submission
      alert(data.message);
      console.log(data);
      if (data.message === "Registration successful!") {
        Cookies.set('user', data.userId); // Store user details in cookies
        setKycDetails({ ...kycDetails, user: data.userId });
      }
    } catch (error) {
      alert('Error: ' + error.response?.data?.error || 'Unknown error');
    }
    setShowKYCForm(!showKYCForm); // Show the KYC form after registration
  };

  // Handle KYC form submission
  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/auth/kyc', kycDetails); // Send KYC details to server
      console.log(data);
      alert('KYC submitted successfully');
      Cookies.set('startup', data.startup);
      navigate("/home");
    } catch (error) {
      alert('Error: ' + error.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight:'100vh' }}>
      <Grid container spacing={2}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', flex: 1 }}>
            {/* Show either Registration/Login form or KYC form based on the state */}
            {!showKYCForm ?(
              <>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                  {isRegister ? 'Register' : 'Login'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{mt : 2}}>
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username *
                    </label>
                    <input
                      id="username"
                      type="text"  // Changed "string" to "text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Password Field */}
                  <div style={{ marginTop: '16px' }}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2.7, mb:2, backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#115293' } }}>
                    {isRegister ? 'Register' : 'Login'}
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }}>OR</Divider>
                <Typography>
                  Already have an account? <Link to="/login" style={{ color: '#6200ea' }}>Login</Link>
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                  Complete KYC
                </Typography>
                <Box component="form" onSubmit={handleKYCSubmit}>
                  {/* Company Field */}
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                      Company Name *
                    </label>
                    <input
                      id="company_name"
                      type="text"
                      value={kycDetails.company_name}
                      onChange={(e) => setKycDetails({ ...kycDetails, company_name: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Address Field */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={kycDetails.address}
                      onChange={(e) => setKycDetails({ ...kycDetails, address: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Contact Person Name Field */}
                  <div>
                    <label htmlFor="contact_person_name" className="block text-sm font-medium text-gray-700">
                      Contact Person Name *
                    </label>
                    <input
                      id="contact_person_name"
                      type="text"
                      value={kycDetails.contact_person_name}
                      onChange={(e) => setKycDetails({ ...kycDetails, contact_person_name: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Contact Person Email Field */}
                  <div>
                    <label htmlFor="contact_person_email" className="block text-sm font-medium text-gray-700">
                      Contact Person Email *
                    </label>
                    <input
                      id="contact_person_email"
                      type="email"
                      value={kycDetails.contact_person_email}
                      onChange={(e) => setKycDetails({ ...kycDetails, contact_person_email: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Contact Person Phone Field */}
                  <div>
                    <label htmlFor="contact_person_phone" className="block text-sm font-medium text-gray-700">
                      Contact Person Phone *
                    </label>
                    <input
                      id="contact_person_phone"
                      type="text"
                      value={kycDetails.contact_person_phone}
                      onChange={(e) => setKycDetails({ ...kycDetails, contact_person_phone: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Incorporation Date Field */}
                  <div>
                    <label htmlFor="incorporation_date" className="block text-sm font-medium text-gray-700">
                      Incorporation Date *
                    </label>
                    <input
                      id="incorporation_date"
                      type="date"
                      value={kycDetails.incorporation_date}
                      onChange={(e) => setKycDetails({ ...kycDetails, incorporation_date: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Industry Field */}
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                      Industry *
                    </label>
                    <input
                      id="industry"
                      type="text"
                      value={kycDetails.industry}
                      onChange={(e) => setKycDetails({ ...kycDetails, industry: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Website Field */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website *
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={kycDetails.website}
                      onChange={(e) => setKycDetails({ ...kycDetails, website: e.target.value })}
                      required
                      className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3.5, mb:3.5, backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#115293' } }}>
                    Submit KYC
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <img
            src={showKYCForm ? image2 : image1}
            alt="Background"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Adjusted image properties
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthPage;