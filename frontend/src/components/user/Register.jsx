import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, TextField, Button, Typography, Box, Grid, Paper, Divider 
} from '@mui/material';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import image1 from '../../assets/registerwide.jpg';
import image2 from '../../assets/wideskyscape.jpg';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [showKYCForm, setShowKYCForm] = useState(false);
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

  // Animations for form transitions
  const pageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = !showKYCForm ? 'http://localhost:4000/auth/register' : 'http://localhost:4000/auth/kyc';
    try {
      const { data } = await axios.post(url, { username, password, email });
      alert(data.message);
      console.log(data);
      if (data.message === "Registration successful!") {
        Cookies.set('user', data.userId);
        setKycDetails({ ...kycDetails, user: data.userId });
      }
    } catch (error) {
      alert('Error: ' + error.response?.data?.error || 'Unknown error');
    }
    setShowKYCForm(!showKYCForm);
  };

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/auth/kyc', kycDetails);
      console.log(data);
      alert('KYC submitted successfully');
      Cookies.set('startup', data.startup);
      navigate("/home");
    } catch (error) {
      alert('Error: ' + error.response?.data?.error || 'Unknown error');
    }
  };
  const user = Cookies.get('user');
  const startup = Cookies.get('startup');

  useEffect(() => {
    if (user && startup) {
      return navigate('/home');
    }
})

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight:'100vh' }}>
      <Grid container spacing={2}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageVariants}
          >
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', flex: 1 }}>
              {!showKYCForm ? (
                <>
                  <Typography variant="h4" component="h1" gutterBottom align="center">
                    {isRegister ? 'Register' : 'Login'}
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {/* Username Field */}
                    <TextField
                      id="username"
                      label="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      fullWidth
                      required
                      margin="normal"
                    />
                    {/* Email Field */}
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      required
                      margin="normal"
                    />
                    {/* Password Field */}
                    <TextField
                      id="password"
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                      required
                      margin="normal"
                    />
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      sx={{ mt: 2.7, mb: 2 }}>
                      {isRegister ? 'Register' : 'Login'}
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3 }}>OR</Divider>
                  <Typography align="center">
                    Already have an account? <Link to="/login" style={{ color: '#6200ea' }}>Login</Link>
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="h4" component="h1" gutterBottom align="center">
                    Complete KYC
                  </Typography>
                  <Box component="form" onSubmit={handleKYCSubmit}>
                    <TextField
                      id="company_name"
                      label="Company Name"
                      value={kycDetails.company_name}
                      onChange={(e) => setKycDetails({ ...kycDetails, company_name: e.target.value })}
                      fullWidth
                      required
                      margin="normal"
                    />
                    <TextField
                      id="address"
                      label="Address"
                      value={kycDetails.address}
                      onChange={(e) => setKycDetails({ ...kycDetails, address: e.target.value })}
                      fullWidth
                      required
                      margin="normal"
                    />
                    {/* Additional Fields for KYC */}
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      sx={{ mt: 3.5, mb: 3.5 }}>
                      Submit KYC
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </motion.div>
        </Grid>

        {/* Image Section with animation */}
        <Grid item xs={12} md={6}>
          <motion.img
            src={showKYCForm ? image2 : image1}
            alt="Background"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={imageVariants}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuthPage;
