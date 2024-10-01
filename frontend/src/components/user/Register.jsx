import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/icon.jpg'; // Assuming you have an image

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle user registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/auth/register', { username, email, password });
      alert(data.message);
      if (data.message === "Registration successful!") {
        Cookies.set('user', data.userId); // Store user details in cookies
        navigate("/home");
      }
    } catch (error) {
      alert('Error: ' + error.response.data.error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {/* Left side - Register Form */}
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
          {/* Username Field */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            type='string'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type='email '
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}>
            REGISTER
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography>
            Already have an account? <a href="/login" style={{ color: '#6200ea' }}>Login</a>
          </Typography>
        </Box>
      </Paper>

      {/* Right side - Image */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, maxWidth: '50%', paddingLeft: 3 }}>
        <img 
          src={image} 
          alt="Auth Visual" 
          style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
        />
      </Box>
    </Container>
  );
};

export default RegisterPage;
