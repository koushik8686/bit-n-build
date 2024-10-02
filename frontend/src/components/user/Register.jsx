import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { 
  Container, TextField, Button, Typography, Box, Grid, Paper, Divider 
} from '@mui/material';
import Cookies from 'js-cookie'
import {  Link, useNavigate } from 'react-router-dom';

const AuthPage = () => {
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
    user:''
  });
  const navigate = useNavigate()
  const logout = async () => {
    Cookies.remove('user');
    navigate("/")
  };
  
  // Handle user registration or login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = !showKYCForm ? 'http://localhost:4000/auth/register' : 'http://localhost:4000/auth/kyc';
    try {
      const { data } = await axios.post(`/auth/register`, { username, password , email });
      alert(data.message);
      console.log(data);
      if (data.message==="Registration successful!") {
        Cookies.set('user', data.userId); // Store user details in cookies
        setKycDetails({ ...kycDetails, user : data.userId })
      }
    } catch (error) {
      alert('Error: ' + error.response.data.error);
    }
    setShowKYCForm(!showKYCForm); //
    return
  };

  // Handle Google Login
  const handleGoogleLogin = (credentialResponse) => {
    const token = credentialResponse.credential;
    axios.post('/api/google-login', { token })
      .then(res => alert('Google login successful'))
      .catch(err => alert('Google login failed: ' + err.message));
  };

  // Handle KYC form submission
  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/auth/kyc', kycDetails); // Send KYC details to server
      console.log(data);
      alert('KYC submitted successfully');
      Cookies.set('startup', data.startup);
      navigate("/home")
    } catch (error) {
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Show either Registration/Login form or KYC form based on the state */}
        {!showKYCForm ? (
          <>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              {isRegister ? 'Register' : 'Login'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                label="email"
                fullWidth
                margin="normal"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2, mb: 2 }}>
                {isRegister ? 'Register' : 'Login'}
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }}>OR</Divider>

            <Link to={'/login'}>Login</Link>
            
          </>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Complete KYC
            </Typography>
            <Box component="form" onSubmit={handleKYCSubmit}>
              <TextField
                label="Company Name"
                fullWidth
                margin="normal"
                value={kycDetails.company_name}
                onChange={(e) => setKycDetails({ ...kycDetails, company_name: e.target.value })}
                required
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={kycDetails.address}
                onChange={(e) => setKycDetails({ ...kycDetails, address: e.target.value })}
                required
              />
              <TextField
                label="Contact Person Name"
                fullWidth
                margin="normal"
                value={kycDetails.contact_person_name}
                onChange={(e) => setKycDetails({ ...kycDetails, contact_person_name: e.target.value })}
                required
              />
              <TextField
                label="Contact Person Email"
                fullWidth
                margin="normal"
                value={kycDetails.contact_person_email}
                onChange={(e) => setKycDetails({ ...kycDetails, contact_person_email: e.target.value })}
                required
              />
              <TextField
                label="Contact Person Phone"
                fullWidth
                margin="normal"
                value={kycDetails.contact_person_phone}
                onChange={(e) => setKycDetails({ ...kycDetails, contact_person_phone: e.target.value })}
                required
              />
              <TextField
                label="Incorporation Date"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={kycDetails.incorporation_date}
                onChange={(e) => setKycDetails({ ...kycDetails, incorporation_date: e.target.value })}
              />
              <TextField
                label="Industry"
                fullWidth
                margin="normal"
                value={kycDetails.industry}
                onChange={(e) => setKycDetails({ ...kycDetails, industry: e.target.value })}
              />
              <TextField
                label="Website"
                fullWidth
                margin="normal"
                value={kycDetails.website}
                onChange={(e) => setKycDetails({ ...kycDetails, website: e.target.value })}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}>
                Submit KYC
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage;