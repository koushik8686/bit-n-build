import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { Container, TextField, Button, Typography, Box, Paper, Divider, Grid } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/login', { username, password });
      alert(data.message);
    } catch (error) {
      alert('Error: ' + error.response.data.error);
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    const token = credentialResponse.credential;
    axios.post('/api/google-login', { token })
      .then(res => alert('Google login successful'))
      .catch(err => alert('Google login failed: ' + err.message));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2 }}>
            Login
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }}>OR</Divider>

        <Grid container justifyContent="center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log('Google login failed')}
          />
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
