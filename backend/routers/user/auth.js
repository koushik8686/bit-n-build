const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/usermodel');
const Startup = require("../../models/startupmodel")
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);
  try {
    // Hash the password
    const exists = await User.findOne({ email: email})
    if (exists) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });
    // Save the user to the database
    const savedUser = await newUser.save();
    // Store user ID in session
    res.status(200).json({ message: 'Registration successful!' , userId: savedUser._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/kyc', async (req, res) => {
    const {
      company_name, address, contact_person_name, contact_person_email,
      contact_person_phone, incorporation_date, industry, website , user
    } = req.body;
    try {
      // Create the startup (KYC) details
      const newKYC = new Startup({
        kyc:{
        company_name,
        address,
        contact_person: {
          name: contact_person_name,
          email: contact_person_email,
          phone: contact_person_phone
        },
        company_details: {
          incorporation_date,
          industry,
          website
        }},
        progress: [],
        reports: [],
        messages: [],
        grants: []
      });
  
      // Save the KYC details to the database
      const savedKYC = await newKYC.save();
      // Link the KYC to the logged-in user
      await User.findByIdAndUpdate(user, { startup: savedKYC._id });
      res.status(200).json({ message: 'KYC details submitted successfully' , startup : savedKYC._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit KYC details' });
    }
  });
// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid password' });

    res.status(200).json({ message: 'Login successful' , userId :user._id , startup : user.startup});
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
