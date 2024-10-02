import React, { useState , useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material'; // Ensure to import Material-UI components
import image from '../../assets/StartX.png';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/login', { username, password });
            console.log(response);
            if (response.data.message === "Login successful") {
                Cookies.set('admin', "admin");
                navigate("/admin");
            } else {
                alert('Login failed: ' + response.data.message); // Added error handling
            }
        } catch (error) {
            console.error('Error during login:', error); // Log error for debugging
            alert('Login failed: ' + error.response?.data?.message || 'Unknown error occurred'); // Inform user of error
        }
    };
    useEffect(() => {
      const admin = Cookies.get("admin");
      if(admin ) {
        navigate("/admin");
      }
    }, [])
    return (
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            {/* Left side - Login Form */}
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', flex: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {/* Username Field */}
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        type='text '
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
                        sx={{ mt: 2 }}>
                        Login
                    </Button>
                </Box>
            </Paper>

            {/* Right side - Image */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, maxWidth: '50%', paddingLeft: 3 }}>
                <img 
                    src={image} // Ensure 'image' is defined and available in the component
                    alt="Auth Visual" 
                    style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }}
                />
            </Box>
        </Container>
    );
};

export default AdminLogin;
