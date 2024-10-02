import React, { useState } from 'react';
import { 
  Container, Button, Typography, Box, Grid, Paper 
} from '@mui/material';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import image from '../../assets/icon.jpg';
import Cookie from 'js-cookie'
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      if (data.message === 'Login successful') {
        Cookie.set('user' , data.userId)
        Cookie.set('startup', data.startup)
        navigate('/home')
      }
    } catch (error) {
      alert('Error: ' + error.response.data.error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {/* Left side - Image */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, maxWidth: '50%', paddingRight: 3 }}>
        <img 
          src={image} 
          alt="Login Visual" 
          style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
        />
      </Box>

      {/* Right side - Login Form */}
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Username Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Username *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            fullWidth 
            sx={{ mt: 2, backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#115293' } }}
          >
            LOGIN
          </Button>
        </Box>

        {/* Redirect to Register */}
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Typography>
            Don't have an account? <Link to="/register" style={{ color: '#6200ea' }}>Register</Link>
          </Typography>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
