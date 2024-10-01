const express = require('express');
const router = express.Router();


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username , password);
    try {
      // Find user by username
      if (username == "admin" && password == "12345") {
       return res.status(200).send({ message: 'Login successful' });
      }
      res.status(200).send({ message: 'Wrong Credentials' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log in' });
    }
  });
  
module.exports = router