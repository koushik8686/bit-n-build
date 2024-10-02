import React, { useState } from 'react';
import { 
  Container, Button, Typography, Box, Grid, Paper 
} from '@mui/material';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../../assets/icon.jpg';
import Cookie from 'js-cookie';
import axios from 'axios';


const circleVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 0.4,
    scale: [0.8, 1.2, 1],
    transition: {
      repeat: Infinity,
      duration: 10,
      ease: 'easeInOut',
    },
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      if (data.message === 'Login successful') {
        Cookie.set('user', data.userId);
        Cookie.set('startup', data.startup);
        navigate('/home');
      }
    } catch (error) {
      alert('Error: ' + error.response.data.error);
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
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Circles */}
      <motion.div 
        className="circle" 
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(98, 0, 234, 0.4)',
        }}
        variants={circleVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div 
        className="circle" 
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(25, 118, 210, 0.4)',
        }}
        variants={circleVariants}
        initial="initial"
        animate="animate"
      />

      {/* Left side - Image */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, maxWidth: '50%', paddingRight: 3 }}>
        <motion.img
          src={image} 
          alt="Login Visual" 
          style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </Box>

      {/* Right side - Login Form */}
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', flex: 1, zIndex: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            style={{ marginTop: '16px' }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              type="submit"
              fullWidth
              sx={{ mt: 2, backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#115293' } }}
            >
              LOGIN
            </Button>
          </motion.div>
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
